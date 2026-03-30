export interface ToolContext {
  userId?: string;
  sessionId?: string;
}

export interface SearchJobsParams {
  query?: string;
  category?: string;
  location?: string;
  city?: string;
  state?: string;
  maxBudget?: number;
  minBudget?: number;
  skills?: string[];
  status?: string;
  limit?: number;
  page?: number;
}

export interface GetJobDetailsParams {
  jobId: string;
}

export interface GetNearbyJobsParams {
  city?: string;
  state?: string;
  radius?: number;
  category?: string;
  limit?: number;
}

export interface GetUserProfileParams {
  userId?: string;
}

export interface SaveJobParams {
  jobId: string;
  userId: string;
}

export interface CreateApplicationParams {
  jobId: string;
  userId: string;
  coverLetter?: string;
  proposedRate?: number;
  availability?: string;
}

export interface JobSearchResult {
  id: string;
  title: string;
  description: string;
  category: string | null;
  budget: number | null;
  hourlyRate: number | null;
  state: string | null;
  city: string | null;
  duration: string | null;
  skills: string[] | null;
  status: string;
  providerName: string | null;
  providerAvatar: string | null;
  createdAt: string;
}

export interface JobDetailsResult {
  id: string;
  title: string;
  description: string;
  category: string | null;
  budget: number | null;
  hourlyRate: number | null;
  state: string | null;
  city: string | null;
  duration: string | null;
  skills: string[] | null;
  status: string;
  viewCount: number;
  hasTimeline: boolean;
  provider: {
    id: string;
    fullName: string | null;
    avatarUrl: string | null;
    location: string | null;
    phone: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfileResult {
  id: string;
  fullName: string | null;
  role: string | null;
  location: string | null;
  avatarUrl: string | null;
  bio: string | null;
  skills: string[] | null;
  availability: string | null;
}

export interface ActionResult {
  success: boolean;
  message: string;
  data?: unknown;
}
