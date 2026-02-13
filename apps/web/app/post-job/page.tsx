"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PostJobForm } from "../../components/post-job-form";
import { createJob } from "../actions/jobs";

export default function PostJobPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <PostJobForm
        onClose={() => {
          router.back();
        }}
        onSubmit={async (data) => {
          try {
            const result = await createJob(data);

            if (result?.error) {
              toast.error(result.error);
            } else if (result?.success) {
              toast.success("Job posted successfully!");
              router.push("/dashboard");
              router.refresh();
            }
          } catch (error) {
            console.error("Submission error:", error);
            toast.error("An unexpected error occurred.");
          }
        }}
      />
    </div>
  );
}
