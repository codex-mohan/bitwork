import { Button } from "@bitwork/ui/components/button";
import { Briefcase, CheckCircle, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { getSeekerStats } from "@/app/actions/applications";
import { getJobs } from "@/app/actions/jobs";
import { JobCard } from "./job-card";
import { StatsCard } from "./stats-card";

interface SeekerDashboardProps {
  userId: string;
}

async function DashboardContent({ userId }: SeekerDashboardProps) {
  const [{ jobs }, stats] = await Promise.all([
    getJobs({ status: "open", limit: 6 }, userId),
    getSeekerStats(userId),
  ]);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          color="primary"
          icon={<Briefcase className="h-6 w-6" />}
          title="Total Applications"
          value={stats.totalApplications}
        />
        <StatsCard
          color="warning"
          icon={<Clock className="h-6 w-6" />}
          title="Pending"
          value={stats.pendingApplications}
        />
        <StatsCard
          color="success"
          icon={<CheckCircle className="h-6 w-6" />}
          title="Accepted"
          value={stats.acceptedApplications}
        />
        <StatsCard
          color="info"
          icon={<TrendingUp className="h-6 w-6" />}
          title="Response Rate"
          value={`${stats.totalApplications > 0 ? Math.round(((stats.acceptedApplications + stats.rejectedApplications) / stats.totalApplications) * 100) : 0}%`}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-2xl tracking-tight">
                Recommended Jobs
              </h2>
              <p className="text-muted-foreground">
                Based on your profile and preferences
              </p>
            </div>
            <Link href="/home/jobs">
              <Button variant="outline">View All</Button>
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {jobs.map((job) => (
              <JobCard job={job} key={job.id} userId={userId} />
            ))}
          </div>

          {jobs.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-lg border bg-muted/30 py-12 text-center">
              <Briefcase className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 font-semibold text-lg">No jobs available</h3>
              <p className="max-w-sm text-muted-foreground">
                Check back later for new opportunities, or update your profile
                to get better matches.
              </p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-4 font-semibold">Quick Actions</h3>
            <div className="space-y-3">
              <Link className="block" href="/home/jobs">
                <Button className="w-full justify-start" variant="outline">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Browse Jobs
                </Button>
              </Link>
              <Link className="block" href="/home/applications">
                <Button className="w-full justify-start" variant="outline">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  View Applications
                </Button>
              </Link>
              <Link className="block" href="/home/profile">
                <Button className="w-full justify-start" variant="outline">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Update Profile
                </Button>
              </Link>
            </div>
          </div>

          <div className="rounded-lg border bg-gradient-to-br from-primary/5 to-primary/10 p-6">
            <h3 className="mb-2 font-semibold">Complete Your Profile</h3>
            <p className="mb-4 text-muted-foreground text-sm">
              Add your skills and experience to get matched with better
              opportunities.
            </p>
            <Link href="/home/profile">
              <Button className="w-full" size="sm">
                Update Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  const skeletonStats = ["stat-1", "stat-2", "stat-3", "stat-4"];
  const skeletonJobs = ["job-1", "job-2", "job-3", "job-4"];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {skeletonStats.map((key) => (
          <div className="h-32 animate-pulse rounded-lg bg-muted" key={key} />
        ))}
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="grid gap-4 md:grid-cols-2">
            {skeletonJobs.map((key) => (
              <div
                className="h-64 animate-pulse rounded-lg bg-muted"
                key={key}
              />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-48 animate-pulse rounded-lg bg-muted" />
          <div className="h-40 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    </div>
  );
}

export function SeekerDashboard({ userId }: SeekerDashboardProps) {
  return (
    <div className="animate-[fadeInUp_0.5s_ease-out]">
      <div className="mb-8">
        <h1 className="font-bold text-3xl tracking-tight">Welcome back!</h1>
        <p className="mt-2 text-muted-foreground">
          Here's what's happening with your job search
        </p>
      </div>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent userId={userId} />
      </Suspense>
    </div>
  );
}
