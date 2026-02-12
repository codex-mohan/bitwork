"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@bitwork/ui/components/avatar";
import { Badge } from "@bitwork/ui/components/badge";
import { Button } from "@bitwork/ui/components/button";
import { Card, CardContent, CardFooter } from "@bitwork/ui/components/card";
import { cn } from "@bitwork/ui/lib/utils";
import { Bookmark, Clock, IndianRupee, MapPin } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { JobWithProvider } from "@/app/actions/jobs";
import { toggleSaveJob } from "@/app/actions/jobs";

interface JobCardProps {
  job: JobWithProvider;
  userId?: string;
  showApplyButton?: boolean;
}

const categoryColors: Record<string, string> = {
  plumbing: "bg-blue-500/10 text-blue-600",
  electrical: "bg-yellow-500/10 text-yellow-600",
  moving: "bg-orange-500/10 text-orange-600",
  cleaning: "bg-green-500/10 text-green-600",
  tutoring: "bg-purple-500/10 text-purple-600",
  gardening: "bg-emerald-500/10 text-emerald-600",
  default: "bg-muted text-muted-foreground",
};

function formatBudget(job: JobWithProvider): string {
  if (job.budget) {
    return `₹${job.budget.toLocaleString()}`;
  }
  if (job.hourlyRate) {
    return `₹${job.hourlyRate}/hr`;
  }
  return "Negotiable";
}

function formatLocation(job: JobWithProvider): string {
  if (job.city && job.state) {
    return `${job.city}, ${job.state}`;
  }
  if (job.city || job.state) {
    return job.city || job.state || "Remote";
  }
  return "Remote";
}

export function JobCard({ job, userId, showApplyButton = true }: JobCardProps) {
  const [isSaved, setIsSaved] = useState(job.isSaved ?? false);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggleSave = async () => {
    if (!userId) {
      return;
    }

    setIsSaving(true);
    const result = await toggleSaveJob(userId, job.id);
    if (!result.error) {
      setIsSaved(result.saved);
    }
    setIsSaving(false);
  };

  const budget = formatBudget(job);
  const location = formatLocation(job);

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
              <AvatarImage src={job.provider?.avatarUrl ?? undefined} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {job.provider?.fullName?.charAt(0) ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <Link
                className="line-clamp-2 font-semibold text-lg leading-tight transition-colors hover:text-primary"
                href={`/home/jobs/${job.id}`}
              >
                {job.title}
              </Link>
              <p className="mt-0.5 text-muted-foreground text-sm">
                {job.provider?.fullName ?? "Anonymous"}
              </p>
            </div>
          </div>
          {userId && (
            <Button
              className="shrink-0"
              disabled={isSaving}
              onClick={handleToggleSave}
              size="icon"
              variant="ghost"
            >
              <Bookmark
                className={cn(
                  "h-5 w-5 transition-all",
                  isSaved
                    ? "fill-primary text-primary"
                    : "text-muted-foreground"
                )}
              />
            </Button>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge
            className={cn(
              "font-medium",
              categoryColors[job.category ?? "default"]
            )}
            variant="secondary"
          >
            {job.category
              ? job.category.charAt(0).toUpperCase() + job.category.slice(1)
              : "General"}
          </Badge>
          <Badge
            className="flex items-center gap-1 font-medium"
            variant="secondary"
          >
            <IndianRupee className="h-3 w-3" />
            {budget}
          </Badge>
          <Badge
            className="flex items-center gap-1 font-medium"
            variant="secondary"
          >
            <MapPin className="h-3 w-3" />
            {location}
          </Badge>
          {job.duration && (
            <Badge
              className="flex items-center gap-1 font-medium"
              variant="secondary"
            >
              <Clock className="h-3 w-3" />
              {job.duration}
            </Badge>
          )}
        </div>

        <p className="mt-4 line-clamp-3 text-muted-foreground text-sm">
          {job.description}
        </p>

        {job.skills && job.skills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {job.skills.slice(0, 4).map((skill) => (
              <Badge className="text-xs" key={skill} variant="outline">
                {skill}
              </Badge>
            ))}
            {job.skills.length > 4 && (
              <Badge className="text-xs" variant="outline">
                +{job.skills.length - 4}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      {showApplyButton && (
        <CardFooter className="flex items-center justify-between border-t bg-muted/30 px-6 py-4">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <span>{job.viewCount} views</span>
            <span>•</span>
            <span>{new Date(job.createdAt).toLocaleDateString()}</span>
          </div>
          <Link href={`/home/jobs/${job.id}`}>
            <Button
              className="transition-all duration-300 hover:shadow-md"
              size="sm"
            >
              View Details
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}
