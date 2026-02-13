"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@bitwork/ui/components/avatar";
import { Badge } from "@bitwork/ui/components/badge";
import { Button } from "@bitwork/ui/components/button";
import { Card } from "@bitwork/ui/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@bitwork/ui/components/tabs";
import { CheckCircle, Clock, FileText, XCircle } from "lucide-react";
import type { ApplicationWithDetails } from "@/app/actions/applications";
import { updateApplicationStatus } from "@/app/actions/applications";
import {
  AnimatedCard,
  FadeInUp,
  PageTransition,
  StaggerContainer,
} from "./animations";

interface ApplicationsViewProps {
  initialApplications: ApplicationWithDetails[];
  userId: string;
  role?: string | null;
}

const getStatusBadge = (status: ApplicationWithDetails["status"]) => {
  switch (status) {
    case "pending":
      return (
        <Badge className="flex items-center gap-1 bg-amber-100 text-amber-800 hover:bg-amber-100">
          <Clock className="h-3 w-3" /> Pending
        </Badge>
      );
    case "accepted":
      return (
        <Badge className="flex items-center gap-1 bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="h-3 w-3" /> Accepted
        </Badge>
      );
    case "rejected":
      return (
        <Badge className="flex items-center gap-1 bg-red-100 text-red-800 hover:bg-red-100">
          <XCircle className="h-3 w-3" /> Rejected
        </Badge>
      );
    case "withdrawn":
      return (
        <Badge className="flex items-center gap-1 bg-gray-100 text-gray-800 hover:bg-gray-100">
          <XCircle className="h-3 w-3" /> Withdrawn
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

function ApplicationsList({
  applications,
  userId,
  isProvider = false,
}: {
  applications: ApplicationWithDetails[];
  userId: string;
  isProvider?: boolean;
}) {
  if (applications.length === 0) {
    return (
      <FadeInUp>
        <div className="flex flex-col items-center justify-center rounded-lg border bg-muted/30 py-16 text-center">
          <FileText className="mb-4 h-16 w-16 text-muted-foreground" />
          <h3 className="mb-2 font-semibold text-xl">No applications</h3>
          <p className="max-w-sm text-muted-foreground">
            {isProvider
              ? "Applications for your jobs will appear here."
              : "Your job applications will appear here."}
          </p>
        </div>
      </FadeInUp>
    );
  }

  return (
    <StaggerContainer className="space-y-4">
      {applications.map((app, index) => (
        <AnimatedCard index={index} key={app.id}>
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
            <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                {isProvider && app.seeker && (
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={app.seeker.avatarUrl ?? undefined} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {app.seeker.fullName?.charAt(0) ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {isProvider ? (
                      <h3 className="truncate font-medium">
                        {app.seeker?.fullName ?? "Anonymous"}
                      </h3>
                    ) : (
                      <h3 className="truncate font-medium">
                        {app.job?.title ?? "Unknown Job"}
                      </h3>
                    )}
                  </div>
                  <div className="mt-1 text-muted-foreground text-sm">
                    {isProvider && app.job && <span>{app.job.title}</span>}
                    {!isProvider && app.job && (
                      <span>
                        {app.job.city}, {app.job.state}
                      </span>
                    )}
                    <span className="ml-2">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:ml-auto">
                {getStatusBadge(app.status)}

                {isProvider && app.status === "pending" && (
                  <div className="flex gap-2">
                    <form
                      action={async () => {
                        "use server";
                        await updateApplicationStatus(
                          app.id,
                          userId,
                          "accepted"
                        );
                      }}
                    >
                      <Button
                        className="bg-green-600 hover:bg-green-700"
                        size="sm"
                        type="submit"
                      >
                        Accept
                      </Button>
                    </form>
                    <form
                      action={async () => {
                        "use server";
                        await updateApplicationStatus(
                          app.id,
                          userId,
                          "rejected"
                        );
                      }}
                    >
                      <Button size="sm" type="submit" variant="destructive">
                        Reject
                      </Button>
                    </form>
                  </div>
                )}
              </div>
            </div>

            {app.coverLetter && (
              <div className="border-t bg-muted/30 p-4">
                <p className="text-muted-foreground text-sm">
                  <span className="font-medium text-foreground">
                    Cover Letter:{" "}
                  </span>
                  {app.coverLetter}
                </p>
              </div>
            )}
          </Card>
        </AnimatedCard>
      ))}
    </StaggerContainer>
  );
}

export function ApplicationsView({
  initialApplications,
  userId,
  role,
}: ApplicationsViewProps) {
  const isProvider = role === "provider";

  const groupedApps = {
    pending: initialApplications.filter((a) => a.status === "pending"),
    accepted: initialApplications.filter((a) => a.status === "accepted"),
    rejected: initialApplications.filter((a) => a.status === "rejected"),
    withdrawn: initialApplications.filter((a) => a.status === "withdrawn"),
  };

  return (
    <PageTransition className="space-y-6">
      <FadeInUp>
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            {isProvider ? "Applications" : "My Applications"}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {isProvider
              ? "Review and manage applications for your jobs"
              : "Track the status of your job applications"}
          </p>
        </div>
      </FadeInUp>

      <Tabs className="space-y-6" defaultValue={isProvider ? "pending" : "all"}>
        <FadeInUp>
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger
              className="gap-2"
              value={isProvider ? "pending" : "all"}
            >
              {isProvider ? (
                <>
                  <Clock className="h-4 w-4" />
                  Pending
                  {groupedApps.pending.length > 0 && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-800 text-xs">
                      {groupedApps.pending.length}
                    </span>
                  )}
                </>
              ) : (
                "All"
              )}
            </TabsTrigger>
            <TabsTrigger
              className="gap-2"
              value={isProvider ? "accepted" : "pending"}
            >
              {isProvider ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Accepted
                </>
              ) : (
                <>
                  <Clock className="h-4 w-4" />
                  Pending
                </>
              )}
            </TabsTrigger>
            <TabsTrigger
              className="gap-2"
              value={isProvider ? "rejected" : "accepted"}
            >
              {isProvider ? (
                <>
                  <XCircle className="h-4 w-4" />
                  Rejected
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Accepted
                </>
              )}
            </TabsTrigger>
            <TabsTrigger
              className="gap-2"
              value={isProvider ? "all" : "rejected"}
            >
              {isProvider ? (
                "All"
              ) : (
                <>
                  <XCircle className="h-4 w-4" />
                  Rejected
                </>
              )}
            </TabsTrigger>
          </TabsList>
        </FadeInUp>

        {isProvider ? (
          <>
            <TabsContent value="pending">
              <ApplicationsList
                applications={groupedApps.pending}
                isProvider
                userId={userId}
              />
            </TabsContent>
            <TabsContent value="accepted">
              <ApplicationsList
                applications={groupedApps.accepted}
                isProvider
                userId={userId}
              />
            </TabsContent>
            <TabsContent value="rejected">
              <ApplicationsList
                applications={groupedApps.rejected}
                isProvider
                userId={userId}
              />
            </TabsContent>
            <TabsContent value="all">
              <ApplicationsList
                applications={initialApplications}
                isProvider
                userId={userId}
              />
            </TabsContent>
          </>
        ) : (
          <>
            <TabsContent value="all">
              <ApplicationsList
                applications={initialApplications}
                userId={userId}
              />
            </TabsContent>
            <TabsContent value="pending">
              <ApplicationsList
                applications={groupedApps.pending}
                userId={userId}
              />
            </TabsContent>
            <TabsContent value="accepted">
              <ApplicationsList
                applications={groupedApps.accepted}
                userId={userId}
              />
            </TabsContent>
            <TabsContent value="rejected">
              <ApplicationsList
                applications={groupedApps.rejected}
                userId={userId}
              />
            </TabsContent>
          </>
        )}
      </Tabs>
    </PageTransition>
  );
}
