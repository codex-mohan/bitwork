"use server";

import { applications, db, type Job, jobs } from "@bitwork/db";
import { and, count, desc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const jobSchema = z.object({
  userType: z.string(),
  state: z.string(),
  city: z.string(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  hourlyRate: z
    .string()
    .refine((val) => !Number.isNaN(Number.parseFloat(val)), {
      message: "Hourly rate must be a number",
    }),
  description: z.string().min(10, "Description must be at least 10 characters"),
  hasTimeline: z.boolean(),
  duration: z.string().optional(),
});

export async function createJob(data: z.infer<typeof jobSchema>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  const validation = jobSchema.safeParse(data);

  if (!validation.success) {
    return {
      error:
        "Invalid input: " +
        validation.error.issues.map((e) => e.message).join(", "),
    };
  }

  const { title, description, state, city, hourlyRate, hasTimeline, duration } =
    validation.data;

  try {
    await db.insert(jobs).values({
      providerId: user.id,
      title,
      description,
      state,
      city,
      hourlyRate: Number.parseInt(hourlyRate, 10), // Assuming logic for now; schema says integer
      hasTimeline,
      duration: hasTimeline ? duration : null,
      status: "open",
    });
  } catch (error) {
    console.error("Error creating job:", error);
    return {
      error: "Failed to create job. Please try again later.",
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/home");
  revalidatePath("/home/jobs");
  return { success: true };
}

export async function getProviderStats(userId: string) {
  const [activeJobs] = await db
    .select({ count: count() })
    .from(jobs)
    .where(and(eq(jobs.providerId, userId), eq(jobs.status, "open")));

  const [totalApplications] = await db
    .select({ count: count() })
    .from(applications)
    .innerJoin(jobs, eq(applications.jobId, jobs.id))
    .where(eq(jobs.providerId, userId));

  const [pendingApplications] = await db
    .select({ count: count() })
    .from(applications)
    .innerJoin(jobs, eq(applications.jobId, jobs.id))
    .where(
      and(eq(jobs.providerId, userId), eq(applications.status, "pending"))
    );

  const [totalViews] = await db
    .select({ count: sql<number>`sum(${jobs.viewCount})` })
    .from(jobs)
    .where(eq(jobs.providerId, userId));

  return {
    activeJobs: activeJobs?.count ?? 0,
    totalApplications: totalApplications?.count ?? 0,
    pendingApplications: pendingApplications?.count ?? 0,
    totalViews: Number(totalViews?.count ?? 0),
  };
}

export function getProviderJobs(userId: string, status?: Job["status"]) {
  const whereConditions = [eq(jobs.providerId, userId)];

  if (status) {
    whereConditions.push(eq(jobs.status, status));
  }

  return db
    .select()
    .from(jobs)
    .where(and(...whereConditions))
    .orderBy(desc(jobs.createdAt));
}

export interface JobFilters {
  category?: string;
  city?: string;
  state?: string;
  minBudget?: number;
  maxBudget?: number;
  status?: string;
  page?: number;
  limit?: number;
}

export interface JobWithProvider extends Job {
  provider: {
    fullName: string | null;
    avatarUrl: string | null;
    location: string | null;
  } | null;
  isSaved?: boolean;
}

export async function getJobs(
  filters: JobFilters = {},
  userId?: string
): Promise<{
  jobs: JobWithProvider[];
  total: number;
  hasMore: boolean;
}> {
  const {
    category,
    city,
    state,
    minBudget,
    maxBudget,
    status = "open",
    page = 1,
    limit = 12,
  } = filters;

  const offset = (page - 1) * limit;
  const { profiles, savedJobs } = await import("@bitwork/db");

  const whereConditions = [eq(jobs.status, status as Job["status"])];

  if (category) {
    whereConditions.push(eq(jobs.category, category));
  }

  if (city) {
    whereConditions.push(eq(jobs.city, city));
  }

  if (state) {
    whereConditions.push(eq(jobs.state, state));
  }

  if (minBudget !== undefined) {
    const { gte } = await import("drizzle-orm");
    whereConditions.push(gte(jobs.budget, minBudget));
  }

  if (maxBudget !== undefined) {
    const { lte } = await import("drizzle-orm");
    whereConditions.push(lte(jobs.budget, maxBudget));
  }

  const jobsData = await db
    .select({
      job: jobs,
      provider: {
        fullName: profiles.fullName,
        avatarUrl: profiles.avatarUrl,
        location: profiles.location,
      },
    })
    .from(jobs)
    .leftJoin(profiles, eq(jobs.providerId, profiles.id))
    .where(and(...whereConditions))
    .orderBy(desc(jobs.createdAt))
    .limit(limit)
    .offset(offset);

  const totalCount = await db
    .select({ count: count() })
    .from(jobs)
    .where(and(...whereConditions))
    .then((result) => result[0]?.count ?? 0);

  let savedJobIds = new Set<string>();
  if (userId) {
    const saved = await db
      .select({ jobId: savedJobs.jobId })
      .from(savedJobs)
      .where(eq(savedJobs.userId, userId));
    savedJobIds = new Set(saved.map((s) => s.jobId));
  }

  const formattedJobs: JobWithProvider[] = jobsData.map(
    (row: {
      job: Job;
      provider: {
        fullName: string | null;
        avatarUrl: string | null;
        location: string | null;
      } | null;
    }) => ({
      ...row.job,
      provider: row.provider,
      isSaved: savedJobIds.has(row.job.id),
    })
  );

  return {
    jobs: formattedJobs,
    total: totalCount,
    hasMore: offset + formattedJobs.length < totalCount,
  };
}

export async function getSavedJobs(userId: string): Promise<JobWithProvider[]> {
  const { profiles, savedJobs } = await import("@bitwork/db");

  const savedJobsData = await db
    .select({
      job: jobs,
      provider: {
        fullName: profiles.fullName,
        avatarUrl: profiles.avatarUrl,
        location: profiles.location,
      },
    })
    .from(savedJobs)
    .innerJoin(jobs, eq(savedJobs.jobId, jobs.id))
    .leftJoin(profiles, eq(jobs.providerId, profiles.id))
    .where(eq(savedJobs.userId, userId))
    .orderBy(desc(savedJobs.createdAt));

  return savedJobsData.map(
    (row: {
      job: Job;
      provider: {
        fullName: string | null;
        avatarUrl: string | null;
        location: string | null;
      } | null;
    }) => ({
      ...row.job,
      provider: row.provider,
      isSaved: true,
    })
  );
}

export async function toggleSaveJob(
  userId: string,
  jobId: string
): Promise<{ saved: boolean; error?: string }> {
  try {
    const { savedJobs } = await import("@bitwork/db");

    const [existing] = await db
      .select()
      .from(savedJobs)
      .where(and(eq(savedJobs.userId, userId), eq(savedJobs.jobId, jobId)));

    if (existing) {
      await db
        .delete(savedJobs)
        .where(and(eq(savedJobs.userId, userId), eq(savedJobs.jobId, jobId)));
      revalidatePath("/home/saved");
      return { saved: false };
    }

    await db.insert(savedJobs).values({ userId, jobId });
    revalidatePath("/home/saved");
    return { saved: true };
  } catch (error) {
    console.error("Error toggling save job:", error);
    return {
      saved: false,
      error: error instanceof Error ? error.message : "Failed to save job",
    };
  }
}
