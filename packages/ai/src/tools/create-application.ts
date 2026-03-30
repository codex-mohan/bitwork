import { applications, db, notifications } from "@bitwork/db";
import { eq } from "drizzle-orm";
import type { ActionResult, CreateApplicationParams } from "./types";

export async function createApplication(
  params: CreateApplicationParams
): Promise<ActionResult> {
  const { jobId, userId, coverLetter, proposedRate, availability } = params;

  try {
    const [existing] = await db
      .select()
      .from(applications)
      .where(eq(applications.jobId, jobId));

    if (existing) {
      return {
        success: false,
        message: "You have already applied to this job",
      };
    }

    await db.insert(applications).values({
      jobId,
      seekerId: userId,
      coverLetter,
      proposedRate,
      availability,
      status: "pending",
    });

    await db.insert(notifications).values({
      userId,
      type: "application",
      title: "Application Submitted",
      message: "Your job application has been submitted successfully",
      relatedJobId: jobId,
    });

    return {
      success: true,
      message: "Application submitted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to submit application",
    };
  }
}
