import { Button } from "@bitwork/ui/components/button";
import { AlertCircle, ArrowLeft, Mail, RefreshCw } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Authentication Error | Bitwork",
  description: "There was an issue with your authentication",
};

export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6 text-center">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="font-bold font-serif text-2xl text-foreground sm:text-3xl">
            Authentication Error
          </h1>
          <p className="text-muted-foreground">
            We couldn&apos;t verify your email link. This can happen for a few
            reasons:
          </p>
        </div>

        {/* Common Causes */}
        <div className="rounded-xl border border-border bg-card p-6 text-left">
          <h2 className="mb-4 font-semibold text-sm">Common issues:</h2>
          <ul className="space-y-3 text-muted-foreground text-sm">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-xs">
                1
              </span>
              <span>The link has expired (valid for 24 hours)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-xs">
                2
              </span>
              <span>The link was already used</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-xs">
                3
              </span>
              <span>There was a network error</span>
            </li>
          </ul>
        </div>

        {/* Solutions */}
        <div className="space-y-3">
          <Link href="/">
            <Button className="h-11 w-full rounded-full bg-primary font-medium">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </Link>

          <Link href="/">
            <Button className="h-11 w-full rounded-full" variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Resend Verification Email
            </Button>
          </Link>

          <Link href="/">
            <Button className="h-11 w-full rounded-full" variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Help Text */}
        <p className="text-muted-foreground text-xs">
          Still having trouble?{" "}
          <Link
            className="text-primary hover:underline"
            href="mailto:support@bitwork.com"
          >
            Contact support
          </Link>
        </p>
      </div>
    </div>
  );
}
