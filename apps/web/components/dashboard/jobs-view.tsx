"use client";

import type { Job } from "@bitwork/db";
import { Button } from "@bitwork/ui/components/button";
import { Input } from "@bitwork/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@bitwork/ui/components/select";
import {
  Briefcase,
  Grid3X3,
  List,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { JobWithProvider } from "@/app/actions/jobs";
import {
  AnimatedCard,
  FadeInUp,
  PageTransition,
  StaggerContainer,
} from "./animations";
import { JobCard } from "./job-card";

interface JobsViewProps {
  initialJobs: Job[] | JobWithProvider[];
  userId: string;
  role?: string | null;
}

function _JobsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-10 w-64 animate-pulse rounded-lg bg-muted" />
        <div className="flex gap-2">
          <div className="h-10 w-32 animate-pulse rounded-lg bg-muted" />
          <div className="h-10 w-32 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            className="h-64 animate-pulse rounded-lg bg-muted"
            // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton elements don't reorder
            key={`skeleton-${i}`}
          />
        ))}
      </div>
    </div>
  );
}

function ProviderJobsList({ jobs }: { jobs: Job[] }) {
  const groupedJobs = {
    open: jobs.filter((j) => j.status === "open"),
    inProgress: jobs.filter((j) => j.status === "in_progress"),
    completed: jobs.filter((j) => j.status === "completed"),
    closed: jobs.filter((j) => j.status === "closed"),
  };

  return (
    <StaggerContainer className="space-y-8">
      {groupedJobs.open.length > 0 && (
        <FadeInUp>
          <div className="mb-4">
            <h2 className="flex items-center gap-2 font-semibold text-lg">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Active Jobs ({groupedJobs.open.length})
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {groupedJobs.open.map((job, index) => (
              <AnimatedCard index={index} key={job.id}>
                <JobCard
                  job={{ ...job, provider: null, isSaved: false }}
                  showApplyButton={false}
                  userId={job.providerId}
                />
              </AnimatedCard>
            ))}
          </div>
        </FadeInUp>
      )}

      {groupedJobs.inProgress.length > 0 && (
        <FadeInUp>
          <div className="mb-4">
            <h2 className="flex items-center gap-2 font-semibold text-lg">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              In Progress ({groupedJobs.inProgress.length})
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {groupedJobs.inProgress.map((job, index) => (
              <AnimatedCard index={index} key={job.id}>
                <JobCard
                  job={{ ...job, provider: null, isSaved: false }}
                  showApplyButton={false}
                  userId={job.providerId}
                />
              </AnimatedCard>
            ))}
          </div>
        </FadeInUp>
      )}

      {groupedJobs.completed.length > 0 && (
        <FadeInUp>
          <div className="mb-4">
            <h2 className="flex items-center gap-2 font-semibold text-lg">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Completed ({groupedJobs.completed.length})
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {groupedJobs.completed.map((job, index) => (
              <AnimatedCard index={index} key={job.id}>
                <JobCard
                  job={{ ...job, provider: null, isSaved: false }}
                  showApplyButton={false}
                  userId={job.providerId}
                />
              </AnimatedCard>
            ))}
          </div>
        </FadeInUp>
      )}

      {groupedJobs.closed.length > 0 && (
        <FadeInUp>
          <div className="mb-4">
            <h2 className="flex items-center gap-2 font-semibold text-lg">
              <span className="h-2 w-2 rounded-full bg-muted-foreground" />
              Closed ({groupedJobs.closed.length})
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {groupedJobs.closed.map((job, index) => (
              <AnimatedCard index={index} key={job.id}>
                <JobCard
                  job={{ ...job, provider: null, isSaved: false }}
                  showApplyButton={false}
                  userId={job.providerId}
                />
              </AnimatedCard>
            ))}
          </div>
        </FadeInUp>
      )}

      {jobs.length === 0 && (
        <FadeInUp>
          <div className="flex flex-col items-center justify-center rounded-lg border bg-muted/30 py-16 text-center">
            <Briefcase className="mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="mb-2 font-semibold text-xl">No jobs posted yet</h3>
            <p className="mb-6 max-w-sm text-muted-foreground">
              Start by posting your first job to find the right candidates.
            </p>
            <Link href="/post-job">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Post Your First Job
              </Button>
            </Link>
          </div>
        </FadeInUp>
      )}
    </StaggerContainer>
  );
}

function SeekerJobsList({
  jobs,
  userId,
}: {
  jobs: JobWithProvider[];
  userId: string;
}) {
  return (
    <StaggerContainer className="space-y-6">
      {jobs.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job, index) => (
            <AnimatedCard index={index} key={job.id}>
              <JobCard job={job} userId={userId} />
            </AnimatedCard>
          ))}
        </div>
      ) : (
        <FadeInUp>
          <div className="flex flex-col items-center justify-center rounded-lg border bg-muted/30 py-16 text-center">
            <Briefcase className="mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="mb-2 font-semibold text-xl">No jobs available</h3>
            <p className="max-w-sm text-muted-foreground">
              Check back later for new opportunities, or update your profile to
              get better matches.
            </p>
          </div>
        </FadeInUp>
      )}
    </StaggerContainer>
  );
}

export function JobsView({ initialJobs, userId, role }: JobsViewProps) {
  const isProvider = role === "provider";
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <PageTransition className="space-y-6">
      <FadeInUp>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-bold text-3xl tracking-tight">
              {isProvider ? "My Jobs" : "Browse Jobs"}
            </h1>
            <p className="mt-1 text-muted-foreground">
              {isProvider
                ? "Manage your job postings"
                : "Find opportunities that match your skills"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isProvider && (
              <Link href="/post-job">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Post Job
                </Button>
              </Link>
            )}
          </div>
        </div>
      </FadeInUp>

      <FadeInUp>
        <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder="Search jobs..."
              type="search"
            />
          </div>

          <div className="flex items-center gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="plumbing">Plumbing</SelectItem>
                <SelectItem value="electrical">Electrical</SelectItem>
                <SelectItem value="carpentry">Carpentry</SelectItem>
                <SelectItem value="cleaning">Cleaning</SelectItem>
                <SelectItem value="tutoring">Tutoring</SelectItem>
                <SelectItem value="design">Design</SelectItem>
              </SelectContent>
            </Select>

            <Button size="icon" variant="outline">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>

            <div className="hidden items-center gap-1 rounded-lg border p-1 sm:flex">
              <Button
                onClick={() => setViewMode("grid")}
                size="icon"
                variant={viewMode === "grid" ? "secondary" : "ghost"}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => setViewMode("list")}
                size="icon"
                variant={viewMode === "list" ? "secondary" : "ghost"}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </FadeInUp>

      {isProvider ? (
        <ProviderJobsList jobs={initialJobs as Job[]} />
      ) : (
        <SeekerJobsList
          jobs={initialJobs as JobWithProvider[]}
          userId={userId}
        />
      )}
    </PageTransition>
  );
}
