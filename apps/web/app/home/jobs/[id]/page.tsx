import { applications, db, jobs, profiles } from "@bitwork/db";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@bitwork/ui/components/avatar";
import { Badge } from "@bitwork/ui/components/badge";
import { Button } from "@bitwork/ui/components/button";
import { Card, CardContent } from "@bitwork/ui/components/card";
import { and, eq } from "drizzle-orm";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Clock,
  IndianRupee,
  MapPin,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { JobReader } from "@/components/ai/job-reader";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Job Details | Bitwork",
  description: "View job details and apply",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getJob(jobId: string) {
  const [jobData] = await db
    .select({
      job: jobs,
      provider: {
        id: profiles.id,
        fullName: profiles.fullName,
        avatarUrl: profiles.avatarUrl,
        location: profiles.location,
        phone: profiles.phone,
      },
    })
    .from(jobs)
    .leftJoin(profiles, eq(jobs.providerId, profiles.id))
    .where(eq(jobs.id, jobId));

  if (!jobData) {
    return null;
  }

  return {
    ...jobData.job,
    provider: jobData.provider,
  };
}

async function getApplicationStatus(jobId: string, userId: string) {
  const [application] = await db
    .select()
    .from(applications)
    .where(
      and(eq(applications.jobId, jobId), eq(applications.seekerId, userId))
    );
  return application?.status || null;
}

export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const job = await getJob(id);
  if (!job) {
    notFound();
  }

  const applicationStatus = await getApplicationStatus(id, user.id);
  const isOwner = job.providerId === user.id;

  const formatBudget = () => {
    if (job.budget) {
      return `₹${job.budget.toLocaleString()}`;
    }
    if (job.hourlyRate) {
      return `₹${job.hourlyRate}/hr`;
    }
    return "Negotiable";
  };

  const formatLocation = () => {
    if (job.city && job.state) {
      return `${job.city}, ${job.state}`;
    }
    if (job.city || job.state) {
      return job.city || job.state || "Remote";
    }
    return "Remote";
  };

  const getStatusBadge = (status: string | null) => {
    const statusConfig: Record<string, { label: string; class: string }> = {
      open: { label: "Open", class: "bg-green-500/10 text-green-600" },
      closed: { label: "Closed", class: "bg-muted text-muted-foreground" },
      in_progress: {
        label: "In Progress",
        class: "bg-blue-500/10 text-blue-600",
      },
      completed: { label: "Completed", class: "bg-primary/10 text-primary" },
    };
    const defaultConfig = {
      label: "Open",
      class: "bg-green-500/10 text-green-600",
    };
    const config = statusConfig[status || "open"] ?? defaultConfig;
    return (
      <Badge className={config.class} variant="secondary">
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-6">
        <Link
          className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          href="/home/jobs"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-14 w-14 border-2 border-background shadow-sm">
                    <AvatarImage src={job.provider?.avatarUrl ?? undefined} />
                    <AvatarFallback className="bg-primary text-lg text-primary-foreground">
                      {job.provider?.fullName?.charAt(0) ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="font-bold text-2xl tracking-tight">
                      {job.title}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                      {job.provider?.fullName ?? "Anonymous"}
                    </p>
                  </div>
                </div>
                {getStatusBadge(job.status)}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Badge
                  className="flex items-center gap-1.5 px-3 py-1.5"
                  variant="secondary"
                >
                  <IndianRupee className="h-3.5 w-3.5" />
                  {formatBudget()}
                </Badge>
                <Badge
                  className="flex items-center gap-1.5 px-3 py-1.5"
                  variant="secondary"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  {formatLocation()}
                </Badge>
                {job.duration && (
                  <Badge
                    className="flex items-center gap-1.5 px-3 py-1.5"
                    variant="secondary"
                  >
                    <Clock className="h-3.5 w-3.5" />
                    {job.duration}
                  </Badge>
                )}
                {job.category && (
                  <Badge
                    className="flex items-center gap-1.5 px-3 py-1.5"
                    variant="secondary"
                  >
                    <Briefcase className="h-3.5 w-3.5" />
                    {job.category.charAt(0).toUpperCase() +
                      job.category.slice(1)}
                  </Badge>
                )}
              </div>

              <JobReader
                budget={formatBudget()}
                className="mt-6"
                description={job.description}
                location={formatLocation()}
                skills={job.skills ?? undefined}
                title={job.title}
              />

              <div className="mt-6">
                <h2 className="mb-3 font-semibold text-lg">Description</h2>
                <p className="whitespace-pre-wrap text-muted-foreground">
                  {job.description}
                </p>
              </div>

              {job.skills && job.skills.length > 0 && (
                <div className="mt-6">
                  <h2 className="mb-3 font-semibold text-lg">
                    Required Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 font-semibold">About the Employer</h3>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={job.provider?.avatarUrl ?? undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {job.provider?.fullName?.charAt(0) ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {job.provider?.fullName ?? "Anonymous"}
                  </p>
                  {job.provider?.location && (
                    <p className="flex items-center gap-1 text-muted-foreground text-sm">
                      <MapPin className="h-3 w-3" />
                      {job.provider.location}
                    </p>
                  )}
                </div>
              </div>

              {job.provider?.phone && (
                <Button className="mt-4 w-full" variant="outline">
                  <Phone className="mr-2 h-4 w-4" />
                  Contact Employer
                </Button>
              )}
            </CardContent>
          </Card>

          {!isOwner && (
            <Card>
              <CardContent className="p-6">
                {applicationStatus ? (
                  <div className="text-center">
                    <Badge
                      className={
                        applicationStatus === "pending"
                          ? "bg-yellow-500/10 text-yellow-600"
                          : applicationStatus === "accepted"
                            ? "bg-green-500/10 text-green-600"
                            : "bg-muted text-muted-foreground"
                      }
                    >
                      Application {applicationStatus}
                    </Badge>
                    <p className="mt-2 text-muted-foreground text-sm">
                      You have already applied to this job
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="font-semibold">Interested?</h3>
                    <p className="text-muted-foreground text-sm">
                      Apply now to express your interest in this job.
                    </p>
                    <Link href={`/apply-job?jobId=${job.id}`}>
                      <Button className="w-full">Apply Now</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between text-muted-foreground text-sm">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </span>
                <span>{job.viewCount} views</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
