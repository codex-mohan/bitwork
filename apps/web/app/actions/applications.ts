"use server";

import {
  type Application,
  applications,
  db,
  type Job,
  jobs,
  notifications,
  profiles,
} from "@bitwork/db";
import { and, count, desc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export interface ApplicationWithDetails extends Application {
  job: Job | null;
  seeker: {
    fullName: string | null;
    avatarUrl: string | null;
    location: string | null;
  } | null;
}

export async function getApplications(
  userId: string,
  role: "provider" | "seeker"
): Promise<ApplicationWithDetails[]> {
  if (role === "seeker") {
    const appsData = await db
      .select({
        application: applications,
        job: jobs,
      })
      .from(applications)
      .innerJoin(jobs, eq(applications.jobId, jobs.id))
      .where(eq(applications.seekerId, userId))
      .orderBy(desc(applications.createdAt));

    return appsData.map((row: { application: Application; job: Job }) => ({
      ...row.application,
      job: row.job,
      seeker: null,
    }));
  }

  const appsData = await db
    .select({
      application: applications,
      job: jobs,
      seeker: {
        fullName: profiles.fullName,
        avatarUrl: profiles.avatarUrl,
        location: profiles.location,
      },
    })
    .from(applications)
    .innerJoin(jobs, eq(applications.jobId, jobs.id))
    .leftJoin(profiles, eq(applications.seekerId, profiles.id))
    .where(eq(jobs.providerId, userId))
    .orderBy(
      sql`CASE 
        WHEN ${applications.status} = 'pending' THEN 1
        WHEN ${applications.status} = 'accepted' THEN 2
        WHEN ${applications.status} = 'rejected' THEN 3
        ELSE 4
      END`,
      desc(applications.createdAt)
    );

  return appsData.map(
    (row: {
      application: Application;
      job: Job;
      seeker: {
        fullName: string | null;
        avatarUrl: string | null;
        location: string | null;
      } | null;
    }) => ({
      ...row.application,
      job: row.job,
      seeker: row.seeker,
    })
  );
}

export async function getApplicationById(
  applicationId: string,
  userId: string,
  role: "provider" | "seeker"
): Promise<ApplicationWithDetails | null> {
  const [result] = await db
    .select({
      application: applications,
      job: jobs,
      seeker: {
        fullName: profiles.fullName,
        avatarUrl: profiles.avatarUrl,
        location: profiles.location,
      },
    })
    .from(applications)
    .innerJoin(jobs, eq(applications.jobId, jobs.id))
    .leftJoin(profiles, eq(applications.seekerId, profiles.id))
    .where(eq(applications.id, applicationId));

  if (!result) {
    return null;
  }

  if (role === "seeker" && result.application.seekerId !== userId) {
    return null;
  }

  if (role === "provider" && result.job.providerId !== userId) {
    return null;
  }

  return {
    ...result.application,
    job: result.job,
    seeker: result.seeker,
  };
}

export interface CreateApplicationInput {
  jobId: string;
  seekerId: string;
  coverLetter?: string;
  proposedRate?: number;
  availability?: string;
}

export async function createApplication(
  data: CreateApplicationInput
): Promise<{ success: boolean; application?: Application; error?: string }> {
  try {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, data.jobId));

    if (!job) {
      return { success: false, error: "Job not found" };
    }

    if (job.status !== "open") {
      return {
        success: false,
        error: "This job is no longer accepting applications",
      };
    }

    if (job.providerId === data.seekerId) {
      return { success: false, error: "Cannot apply to your own job" };
    }

    const [existing] = await db
      .select()
      .from(applications)
      .where(
        and(
          eq(applications.jobId, data.jobId),
          eq(applications.seekerId, data.seekerId)
        )
      );

    if (existing) {
      return { success: false, error: "You have already applied to this job" };
    }

    const [newApplication] = await db
      .insert(applications)
      .values({
        ...data,
        status: "pending",
      })
      .returning();

    if (!newApplication) {
      return { success: false, error: "Failed to create application" };
    }

    await db.insert(notifications).values({
      userId: job.providerId,
      type: "application",
      title: "New Application",
      message: `Someone has applied to your job "${job.title}"`,
      relatedJobId: job.id,
      relatedApplicationId: newApplication.id,
    });

    revalidatePath("/home/applications");
    revalidatePath("/home/jobs");

    return { success: true, application: newApplication };
  } catch (error) {
    console.error("Error creating application:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to submit application",
    };
  }
}

export async function updateApplicationStatus(
  applicationId: string,
  providerId: string,
  status: Application["status"]
): Promise<{ success: boolean; error?: string }> {
  try {
    const [existingApplication] = await db
      .select()
      .from(applications)
      .where(eq(applications.id, applicationId));

    if (!existingApplication) {
      return { success: false, error: "Application not found" };
    }

    const [job] = await db
      .select()
      .from(jobs)
      .where(eq(jobs.id, existingApplication.jobId));

    if (!job || job.providerId !== providerId) {
      return { success: false, error: "Unauthorized" };
    }

    await db
      .update(applications)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(applications.id, applicationId));

    const statusMessage =
      status === "accepted"
        ? `Your application for "${job.title}" has been accepted!`
        : `Your application for "${job.title}" was not selected.`;

    await db.insert(notifications).values({
      userId: existingApplication.seekerId,
      type: "application",
      title:
        status === "accepted" ? "Application Accepted" : "Application Update",
      message: statusMessage,
      relatedJobId: job.id,
      relatedApplicationId: existingApplication.id,
    });

    revalidatePath("/home/applications");

    return { success: true };
  } catch (error) {
    console.error("Error updating application:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update application",
    };
  }
}

export async function withdrawApplication(
  applicationId: string,
  seekerId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const [application] = await db
      .select()
      .from(applications)
      .where(eq(applications.id, applicationId));

    if (!application) {
      return { success: false, error: "Application not found" };
    }

    if (application.seekerId !== seekerId) {
      return { success: false, error: "Unauthorized" };
    }

    await db
      .update(applications)
      .set({
        status: "withdrawn",
        updatedAt: new Date(),
      })
      .where(eq(applications.id, applicationId));

    revalidatePath("/home/applications");

    return { success: true };
  } catch (error) {
    console.error("Error withdrawing application:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to withdraw application",
    };
  }
}

export async function getSeekerStats(seekerId: string): Promise<{
  totalApplications: number;
  pendingApplications: number;
  acceptedApplications: number;
  rejectedApplications: number;
}> {
  const [totalResult, pendingResult, acceptedResult, rejectedResult] =
    await Promise.all([
      db
        .select({ count: count() })
        .from(applications)
        .where(eq(applications.seekerId, seekerId)),
      db
        .select({ count: count() })
        .from(applications)
        .where(
          and(
            eq(applications.seekerId, seekerId),
            eq(applications.status, "pending")
          )
        ),
      db
        .select({ count: count() })
        .from(applications)
        .where(
          and(
            eq(applications.seekerId, seekerId),
            eq(applications.status, "accepted")
          )
        ),
      db
        .select({ count: count() })
        .from(applications)
        .where(
          and(
            eq(applications.seekerId, seekerId),
            eq(applications.status, "rejected")
          )
        ),
    ]);

  return {
    totalApplications: totalResult[0]?.count ?? 0,
    pendingApplications: pendingResult[0]?.count ?? 0,
    acceptedApplications: acceptedResult[0]?.count ?? 0,
    rejectedApplications: rejectedResult[0]?.count ?? 0,
  };
}

export async function hasApplied(
  seekerId: string,
  jobId: string
): Promise<boolean> {
  const [application] = await db
    .select()
    .from(applications)
    .where(
      and(eq(applications.seekerId, seekerId), eq(applications.jobId, jobId))
    );

  return !!application;
}
