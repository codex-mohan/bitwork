import { db, jobs, profiles } from "@bitwork/db";
import { and, count, desc, eq, like, or, sql } from "drizzle-orm";
import type { JobSearchResult, SearchJobsParams } from "./types";

export async function searchJobs(
  params: SearchJobsParams,
  _userId?: string
): Promise<{ jobs: JobSearchResult[]; total: number }> {
  const {
    query,
    category,
    city,
    state,
    maxBudget,
    minBudget,
    skills,
    status = "open",
    limit = 10,
    page = 1,
  } = params;

  const offset = (page - 1) * limit;

  const whereConditions: ReturnType<typeof eq>[] = [];

  whereConditions.push(
    eq(jobs.status, status as "open" | "closed" | "in_progress" | "completed")
  );

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
    whereConditions.push(sql`${jobs.budget} >= ${minBudget}`);
  }

  if (maxBudget !== undefined) {
    whereConditions.push(sql`${jobs.budget} <= ${maxBudget}`);
  }

  const queryCondition = query
    ? or(like(jobs.title, `%${query}%`), like(jobs.description, `%${query}%`))
    : undefined;

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
    .where(
      queryCondition
        ? and(...whereConditions, queryCondition)
        : and(...whereConditions)
    )
    .orderBy(desc(jobs.createdAt))
    .limit(limit)
    .offset(offset);

  const [totalCount] = await db
    .select({ count: count() })
    .from(jobs)
    .where(
      queryCondition
        ? and(...whereConditions, queryCondition)
        : and(...whereConditions)
    );

  const formattedJobs: JobSearchResult[] = jobsData.map((row) => ({
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

  return {
    jobs: formattedJobs,
    total: totalCount?.count ?? 0,
  };
}
