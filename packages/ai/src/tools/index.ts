import { tool } from "ai";
import { createApplication } from "./create-application";
import { getJobDetails } from "./get-job-details";
import { getNearbyJobs } from "./get-nearby-jobs";
import { getUserProfile } from "./get-user-profile";
import { saveJob } from "./save-job";
import { searchJobs } from "./search-jobs";

export const tools = {
  searchJobs: tool({
    description:
      "Search for jobs based on query, skills, category, location, or budget. Use this when the user wants to find available jobs.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "Natural language search query" },
        category: {
          type: "string",
          description:
            "Job category (plumbing, electrical, moving, cleaning, tutoring, etc.)",
        },
        location: { type: "string", description: "General location search" },
        city: { type: "string", description: "Specific city name" },
        state: { type: "string", description: "State name" },
        maxBudget: { type: "number", description: "Maximum budget in INR" },
        minBudget: { type: "number", description: "Minimum budget in INR" },
        skills: {
          type: "array",
          items: { type: "string" },
          description: "List of skills to match",
        },
        status: {
          type: "string",
          description: "Job status, defaults to 'open'",
        },
        limit: {
          type: "number",
          description: "Number of results to return, defaults to 10",
        },
        page: { type: "number", description: "Page number for pagination" },
      },
    },
    execute: async (params) => {
      return await searchJobs(params, params.userId as string | undefined);
    },
  }),

  getJobDetails: tool({
    description:
      "Get detailed information about a specific job by its ID. Use this when the user asks for more information about a specific job.",
    parameters: {
      type: "object",
      properties: {
        jobId: { type: "string", description: "The unique job identifier" },
      },
      required: ["jobId"],
    },
    execute: async (params) => {
      return await getJobDetails(params);
    },
  }),

  getNearbyJobs: tool({
    description:
      "Find jobs near a specific location. Use this when the user asks about jobs in their area or nearby locations.",
    parameters: {
      type: "object",
      properties: {
        city: { type: "string", description: "City name" },
        state: { type: "string", description: "State name" },
        radius: {
          type: "number",
          description: "Search radius in km, defaults to 10",
        },
        category: { type: "string", description: "Job category filter" },
        limit: {
          type: "number",
          description: "Number of results to return, defaults to 10",
        },
      },
    },
    execute: async (params) => {
      return await getNearbyJobs(params);
    },
  }),

  getUserProfile: tool({
    description:
      "Get the current user's profile information. Use this to personalize recommendations based on the user's skills and preferences.",
    parameters: {
      type: "object",
      properties: {
        userId: {
          type: "string",
          description: "User ID (optional if authenticated)",
        },
      },
    },
    execute: async (params, context) => {
      return await getUserProfile(params, context.userId);
    },
  }),

  saveJob: tool({
    description:
      "Save or bookmark a job for later viewing. Use this when the user wants to save a job they're interested in.",
    parameters: {
      type: "object",
      properties: {
        jobId: { type: "string", description: "The job ID to save" },
        userId: { type: "string", description: "The user ID" },
      },
      required: ["jobId", "userId"],
    },
    execute: async (params) => {
      return await saveJob(params);
    },
  }),

  createApplication: tool({
    description:
      "Submit a job application on behalf of the user. Use this when the user wants to apply for a job.",
    parameters: {
      type: "object",
      properties: {
        jobId: { type: "string", description: "The job ID to apply for" },
        userId: { type: "string", description: "The applicant user ID" },
        coverLetter: { type: "string", description: "Optional cover message" },
        proposedRate: {
          type: "number",
          description: "Optional proposed hourly rate",
        },
        availability: {
          type: "string",
          description: "User's availability for the job",
        },
      },
      required: ["jobId", "userId"],
    },
    execute: async (params) => {
      return await createApplication(params);
    },
  }),
};

export type Tools = typeof tools;

export {
  searchJobs,
  getJobDetails,
  getNearbyJobs,
  getUserProfile,
  saveJob,
  createApplication,
};

export type {
  ActionResult,
  CreateApplicationParams,
  GetJobDetailsParams,
  GetNearbyJobsParams,
  GetUserProfileParams,
  JobDetailsResult,
  JobSearchResult,
  SaveJobParams,
  SearchJobsParams,
  ToolContext,
  UserProfileResult,
} from "./types";
