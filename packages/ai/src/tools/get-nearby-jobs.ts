import { db, jobs, profiles } from "@bitwork/db";
import { and, desc, eq } from "drizzle-orm";
import type { GetNearbyJobsParams, JobSearchResult } from "./types";

export async function getNearbyJobs(
  params: GetNearbyJobsParams
): Promise<JobSearchResult[]> {
  const { city, state, limit = 10 } = params;

  if (!(city || state)) {
    return [];
  }

  const whereConditions: ReturnType<typeof eq>[] = [];
  whereConditions.push(eq(jobs.status, "open"));

  if (city) {
    whereConditions.push(eq(jobs.city, city));
  }

  if (state) {
    whereConditions.push(eq(jobs.state, state));
  }

  const jobsData = await db
    .select({
      job: jobs,
      provider: {
        fullName: profiles.fullName,
        avatarUrl: profiles.avatarUrl,
      },
    })
    .from(jobs)
    .leftJoin(profiles, eq(jobs.providerId, profiles.id))
    .where(and(...whereConditions))
    .orderBy(desc(jobs.createdAt))
    .limit(limit);

  return jobsData.map((row) => ({
    id: row.job.id,
    title: row.job.title,
    description: row.job.description,
    category: row.job.category,
    budget: row.job.budget,
    hourlyRate: row.job.hourlyRate,
    state: row.job.state,
    city: row.job.city,
    duration: row.job.duration,
    skills: row.job.skills,
    status: row.job.status,
    providerName: row.provider?.fullName ?? null,
    providerAvatar: row.provider?.avatarUrl ?? null,
    createdAt: row.job.createdAt.toISOString(),
  }));
}
