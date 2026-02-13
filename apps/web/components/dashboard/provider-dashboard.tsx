import { Badge } from "@bitwork/ui/components/badge";
import { Button } from "@bitwork/ui/components/button";
import {
  Briefcase,
  CheckCircle,
  Clock,
  Clock3,
  Eye,
  Plus,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import type { ApplicationWithDetails } from "@/app/actions/applications";
import { getApplications } from "@/app/actions/applications";
import { getProviderJobs, getProviderStats } from "@/app/actions/jobs";
import { JobCard } from "./job-card";
import { StatsCard } from "./stats-card";

interface ProviderDashboardProps {
  userId: string;
}

async function DashboardContent({ userId }: ProviderDashboardProps) {
  const [stats, jobs, applications] = await Promise.all([
    getProviderStats(userId),
    getProviderJobs(userId, "open"),
    getApplications(userId, "provider"),
  ]);

  const recentApplications = applications.slice(0, 5);

  const getStatusBadge = (status: ApplicationWithDetails["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="flex items-center gap-1" variant="secondary">
            <Clock3 className="h-3 w-3" /> Pending
          </Badge>
        );
      case "accepted":
        return (
          <Badge className="flex items-center gap-1 bg-green-500">
            <CheckCircle className="h-3 w-3" /> Accepted
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="flex items-center gap-1" variant="destructive">
            <XCircle className="h-3 w-3" /> Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          color="primary"
          icon={<Briefcase className="h-6 w-6" />}
          title="Active Jobs"
          value={stats.activeJobs}
        />
        <StatsCard
          color="info"
          icon={<Users className="h-6 w-6" />}
          title="Total Applications"
          trend={{ value: "+12%", direction: "up" }}
          value={stats.totalApplications}
        />
        <StatsCard
          color="warning"
          icon={<Clock className="h-6 w-6" />}
          title="Pending Review"
          value={stats.pendingApplications}
        />
        <StatsCard
          color="success"
          icon={<Eye className="h-6 w-6" />}
          title="Total Views"
          value={stats.totalViews.toLocaleString()}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-2xl tracking-tight">
                Active Job Postings
              </h2>
              <p className="text-muted-foreground">
                Manage your current job listings
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/home/jobs">
                <Button variant="outline">View All</Button>
              </Link>
              <Link href="/post-job">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Post Job
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {jobs.map((job) => (
              <JobCard
                job={{ ...job, provider: null }}
                key={job.id}
                showApplyButton={false}
                userId={userId}
              />
            ))}
          </div>

          {jobs.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-lg border bg-muted/30 py-12 text-center">
              <Briefcase className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 font-semibold text-lg">No active jobs</h3>
              <p className="mb-4 max-w-sm text-muted-foreground">
                Post your first job to start receiving applications from
                qualified candidates.
              </p>
              <Link href="/post-job">
                <Button>Post a Job</Button>
              </Link>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Recent Applications</h3>
              <Link href="/home/applications">
                <Button size="sm" variant="ghost">
                  View All
                </Button>
              </Link>
            </div>

            {recentApplications.length > 0 ? (
              <div className="space-y-4">
                {recentApplications.map((app) => (
                  <div
                    className="flex items-start justify-between gap-3 rounded-lg bg-muted/50 p-3"
                    key={app.id}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-sm">
                        {app.seeker?.fullName ?? "Anonymous"}
                      </p>
                      <p className="truncate text-muted-foreground text-xs">
                        {app.job?.title}
                      </p>
                      <p className="mt-1 text-muted-foreground text-xs">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {getStatusBadge(app.status)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center">
                <Users className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground text-sm">
                  No applications yet
                </p>
              </div>
            )}
          </div>

          <div className="rounded-lg border bg-gradient-to-br from-primary/5 to-primary/10 p-6">
            <div className="mb-2 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Performance Tip</h3>
            </div>
            <p className="mb-4 text-muted-foreground text-sm">
              Jobs with detailed descriptions receive 3x more applications. Add
              skills and requirements.
            </p>
            <Link href="/home/analytics">
              <Button className="w-full" size="sm" variant="outline">
                View Analytics
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
          <div className="h-64 animate-pulse rounded-lg bg-muted" />
          <div className="h-40 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    </div>
  );
}

export function ProviderDashboard({ userId }: ProviderDashboardProps) {
  return (
    <div className="animate-[fadeInUp_0.5s_ease-out]">
      <div className="mb-8">
        <h1 className="font-bold text-3xl tracking-tight">
          Provider Dashboard
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage your job postings and applications
        </p>
      </div>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent userId={userId} />
      </Suspense>
    </div>
  );
}
