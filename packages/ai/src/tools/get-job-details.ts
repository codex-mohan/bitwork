import { db, jobs, profiles } from "@bitwork/db";
import { eq } from "drizzle-orm";
import type { GetJobDetailsParams, JobDetailsResult } from "./types";

export async function getJobDetails(
  params: GetJobDetailsParams
): Promise<JobDetailsResult | null> {
  const { jobId } = params;

  const [jobData] = await db
    .select({
      job: jobs,
      provider: {
        id: profiles.id,
        fullName: profiles.fullName,
        avatarUrl: profiles.avatarUrl,
        location: profiles.location,
        phone: profiles.phone,
      },
    })
    .from(jobs)
    .leftJoin(profiles, eq(jobs.providerId, profiles.id))
    .where(eq(jobs.id, jobId));

  if (!jobData) {
    return null;
  }

  return {
    id: jobData.job.id,
    title: jobData.job.title,
    description: jobData.job.description,
    category: jobData.job.category,
    budget: jobData.job.budget,
    hourlyRate: jobData.job.hourlyRate,
    state: jobData.job.state,
    city: jobData.job.city,
    duration: jobData.job.duration,
    skills: jobData.job.skills,
    status: jobData.job.status,
    viewCount: jobData.job.viewCount,
    hasTimeline: jobData.job.hasTimeline ?? false,
    provider: jobData.provider
      ? {
          id: jobData.provider.id,
          fullName: jobData.provider.fullName,
          avatarUrl: jobData.provider.avatarUrl,
          location: jobData.provider.location,
          phone: jobData.provider.phone,
        }
      : null,
    createdAt: jobData.job.createdAt.toISOString(),
    updatedAt: jobData.job.updatedAt.toISOString(),
  };
}
