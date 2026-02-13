"use client";

import { Button } from "@bitwork/ui/components/button";
import { Bookmark, Briefcase } from "lucide-react";
import Link from "next/link";
import type { JobWithProvider } from "@/app/actions/jobs";
import {
  AnimatedCard,
  FadeInUp,
  PageTransition,
  StaggerContainer,
} from "./animations";
import { JobCard } from "./job-card";

interface SavedJobsViewProps {
  initialJobs: JobWithProvider[];
  userId: string;
}

export function SavedJobsView({ initialJobs, userId }: SavedJobsViewProps) {
  if (initialJobs.length === 0) {
    return (
      <PageTransition className="space-y-6">
        <FadeInUp>
          <div>
            <h1 className="font-bold text-3xl tracking-tight">Saved Jobs</h1>
            <p className="mt-1 text-muted-foreground">
              Jobs you've bookmarked for later
            </p>
          </div>
        </FadeInUp>
        <FadeInUp>
          <div className="flex flex-col items-center justify-center rounded-lg border bg-muted/30 py-16 text-center">
            <Bookmark className="mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="mb-2 font-semibold text-xl">No saved jobs</h3>
            <p className="mb-6 max-w-sm text-muted-foreground">
              Start saving jobs you're interested in to view them here later.
            </p>
            <Link href="/home/jobs">
              <Button>
                <Briefcase className="mr-2 h-4 w-4" />
                Browse Jobs
              </Button>
            </Link>
          </div>
        </FadeInUp>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="space-y-6">
      <FadeInUp>
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Saved Jobs</h1>
          <p className="mt-1 text-muted-foreground">
            Jobs you've bookmarked for later
          </p>
        </div>
      </FadeInUp>

      <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {initialJobs.map((job: JobWithProvider, index: number) => (
          <AnimatedCard index={index} key={job.id}>
            <JobCard job={job} userId={userId} />
          </AnimatedCard>
        ))}
      </StaggerContainer>
    </PageTransition>
  );
}
