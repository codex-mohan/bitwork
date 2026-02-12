"use server";

import {
  applications,
  db,
  type Job,
  jobs,
  profiles,
  savedJobs,
} from "@bitwork/db";
import { and, count, desc, eq, gte, lte, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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
    whereConditions.push(gte(jobs.budget, minBudget));
  }

  if (maxBudget !== undefined) {
    whereConditions.push(lte(jobs.budget, maxBudget));
  }

  const [jobsData, totalCount] = await Promise.all([
    db
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
      .offset(offset),
    db
      .select({ count: count() })
      .from(jobs)
      .where(and(...whereConditions))
      .then((result) => result[0]?.count ?? 0),
  ]);

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

export async function getJobById(
  jobId: string,
  userId?: string
): Promise<JobWithProvider | null> {
  const [result] = await db
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
    .where(eq(jobs.id, jobId));

  if (!result) {
    return null;
  }

  let isSaved = false;
  if (userId) {
    const [saved] = await db
      .select()
      .from(savedJobs)
      .where(and(eq(savedJobs.userId, userId), eq(savedJobs.jobId, jobId)));
    isSaved = !!saved;
  }

  await db
    .update(jobs)
    .set({ viewCount: sql`${jobs.viewCount} + 1` })
    .where(eq(jobs.id, jobId));

  return {
    ...result.job,
    provider: result.provider,
    isSaved,
  };
}

export interface CreateJobInput {
  title: string;
  description: string;
  category?: string;
  budget?: number;
  hourlyRate?: number;
  state?: string;
  city?: string;
  duration?: string;
  hasTimeline?: boolean;
  skills?: string[];
  providerId: string;
}

export async function createJob(
  data: CreateJobInput
): Promise<{ success: boolean; job?: Job; error?: string }> {
  try {
    const [job] = await db
      .insert(jobs)
      .values({
        ...data,
        status: "open",
        viewCount: 0,
      })
      .returning();

    revalidatePath("/home/jobs");
    revalidatePath("/home");

    return { success: true, job };
  } catch (error) {
    console.error("Error creating job:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create job",
    };
  }
}

export async function updateJob(
  jobId: string,
  providerId: string,
  data: Partial<CreateJobInput>
): Promise<{ success: boolean; error?: string }> {
  try {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, jobId));

    if (!job) {
      return { success: false, error: "Job not found" };
    }

    if (job.providerId !== providerId) {
      return { success: false, error: "Unauthorized" };
    }

    await db
      .update(jobs)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(jobs.id, jobId));

    revalidatePath("/home/jobs");
    revalidatePath(`/home/jobs/${jobId}`);

    return { success: true };
  } catch (error) {
    console.error("Error updating job:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update job",
    };
  }
}

export async function deleteJob(
  jobId: string,
  providerId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, jobId));

    if (!job) {
      return { success: false, error: "Job not found" };
    }

    if (job.providerId !== providerId) {
      return { success: false, error: "Unauthorized" };
    }

    await db.delete(jobs).where(eq(jobs.id, jobId));

    revalidatePath("/home/jobs");
    revalidatePath("/home");

    return { success: true };
  } catch (error) {
    console.error("Error deleting job:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete job",
    };
  }
}

export function getProviderJobs(
  providerId: string,
  status?: Job["status"]
): Promise<Job[]> {
  const whereConditions = [eq(jobs.providerId, providerId)];

  if (status) {
    whereConditions.push(eq(jobs.status, status));
  }

  return db
    .select()
    .from(jobs)
    .where(and(...whereConditions))
    .orderBy(desc(jobs.createdAt));
}

export async function getProviderStats(providerId: string): Promise<{
  activeJobs: number;
  totalApplications: number;
  pendingApplications: number;
  totalViews: number;
}> {
  const [activeJobsResult, totalAppsResult, pendingAppsResult, viewsResult] =
    await Promise.all([
      db
        .select({ count: count() })
        .from(jobs)
        .where(and(eq(jobs.providerId, providerId), eq(jobs.status, "open"))),
      db
        .select({ count: count() })
        .from(applications)
        .innerJoin(jobs, eq(applications.jobId, jobs.id))
        .where(eq(jobs.providerId, providerId)),
      db
        .select({ count: count() })
        .from(applications)
        .innerJoin(jobs, eq(applications.jobId, jobs.id))
        .where(
          and(
            eq(jobs.providerId, providerId),
            eq(applications.status, "pending")
          )
        ),
      db
        .select({ total: sql<number>`sum(${jobs.viewCount})` })
        .from(jobs)
        .where(eq(jobs.providerId, providerId)),
    ]);

  return {
    activeJobs: activeJobsResult[0]?.count ?? 0,
    totalApplications: totalAppsResult[0]?.count ?? 0,
    pendingApplications: pendingAppsResult[0]?.count ?? 0,
    totalViews: viewsResult[0]?.total ?? 0,
  };
}

export async function toggleSaveJob(
  userId: string,
  jobId: string
): Promise<{ saved: boolean; error?: string }> {
  try {
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

export async function getSavedJobs(userId: string): Promise<JobWithProvider[]> {
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
