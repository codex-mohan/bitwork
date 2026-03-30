import { db, savedJobs } from "@bitwork/db";
import { and, eq } from "drizzle-orm";
import type { ActionResult, SaveJobParams } from "./types";

export async function saveJob(params: SaveJobParams): Promise<ActionResult> {
  const { jobId, userId } = params;

  try {
    const [existing] = await db
      .select()
      .from(savedJobs)
      .where(and(eq(savedJobs.userId, userId), eq(savedJobs.jobId, jobId)));

    if (existing) {
      await db
        .delete(savedJobs)
        .where(and(eq(savedJobs.userId, userId), eq(savedJobs.jobId, jobId)));

      return {
        success: true,
        message: "Job removed from saved jobs",
      };
    }

    await db.insert(savedJobs).values({ userId, jobId });

    return {
      success: true,
      message: "Job saved successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to save job",
    };
  }
}
