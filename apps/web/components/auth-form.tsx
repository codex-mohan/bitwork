"use client";

import { Button } from "@bitwork/ui/components/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@bitwork/ui/components/input-group";
import { Label } from "@bitwork/ui/components/label";
import {
  Check,
  Inbox,
  Loader2,
  Lock,
  Mail,
  RefreshCw,
  User,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

type WizardStep = "credentials" | "profile" | "review";
type AuthMode = "signup" | "signin";
type VerificationState = "idle" | "waiting" | "verified" | "error";

const STEPS: { id: WizardStep; label: string; number: number }[] = [
  { id: "credentials", label: "Account", number: 1 },
  { id: "profile", label: "Profile", number: 2 },
  { id: "review", label: "Review", number: 3 },
];

interface FormData {
  email: string;
  password: string;
  fullName: string;
  role: string;
  location: string;
}

function useVerificationPolling(
  verificationState: VerificationState,
  setVerificationState: (state: VerificationState) => void
) {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (verificationState !== "waiting") {
      return;
    }

    const interval = setInterval(async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Error checking session:", error);
        return;
      }

      if (session) {
        setVerificationState("verified");
        toast.success("Email verified successfully!");
        setTimeout(() => {
          router.push("/home");
          router.refresh();
        }, 1500);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [verificationState, setVerificationState, router, supabase]);
}

function useCountdown(
  verificationState: VerificationState,
  countdown: number,
  setCountdown: (count: number) => void
) {
  useEffect(() => {
    if (verificationState !== "waiting" || countdown <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [verificationState, countdown, setCountdown]);
}

interface AuthFormProps {
  initialMode?: AuthMode;
}

interface AuthHandlers {
  handleAuth: () => Promise<void>;
  handleResendEmail: () => Promise<void>;
  handleGoogleAuth: () => Promise<void>;
}

function useAuthHandlers(
  authMode: AuthMode,
  formData: FormData,
  setIsLoading: (loading: boolean) => void,
  showWaitingScreen: (message: string) => void,
  handleSuccessfulAuth: () => void
): AuthHandlers {
  const supabase = createClient();

  const handleSignUpError = async (error: Error) => {
    if (!error.message?.includes("already registered")) {
      throw error;
    }

    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

    if (signInError) {
      throw new Error(
        "This email is already registered. Please sign in instead."
      );
    }

    if (signInData.user && !signInData.user.email_confirmed_at) {
      showWaitingScreen(
        "Please verify your email. A new verification link has been sent."
      );
      await supabase.auth.resend({ type: "signup", email: formData.email });
    } else {
      handleSuccessfulAuth();
    }
  };

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          role: formData.role,
          location: formData.location,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      await handleSignUpError(error);
    } else {
      showWaitingScreen("Verification email sent! Please check your inbox.");
    }
  };

  const handleSignIn = async () => {
    const { error, data } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      throw error;
    }

    if (data.user && !data.user.email_confirmed_at) {
      showWaitingScreen("Please verify your email before signing in.");
      await supabase.auth.resend({ type: "signup", email: formData.email });
    } else {
      handleSuccessfulAuth();
    }
  };

  const handleAuth = async () => {
    setIsLoading(true);
    try {
      if (authMode === "signup") {
        await handleSignUp();
      } else {
        await handleSignIn();
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : (error as { message?: string })?.message ||
            "An error occurred during authentication";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: formData.email,
      });

      if (error) {
        throw error;
      }

      toast.success("Verification email resent!");
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to resend verification email";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        throw error;
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : (error as { message?: string })?.message ||
            "Failed to sign in with Google";
      toast.error(message);
    }
  };

  return { handleAuth, handleResendEmail, handleGoogleAuth };
}

function getStepButtonClass(isCompleted: boolean, isActive: boolean) {
  if (isCompleted) {
    return "scale-100 border-primary bg-primary text-primary-foreground";
  }
  if (isActive) {
    return "scale-110 border-primary bg-background text-primary shadow-lg shadow-primary/20 ring-4 ring-primary/5";
  }
  return "border-border bg-background text-muted-foreground";
}

function getSlideClass(
  currentStep: WizardStep,
  stepName: WizardStep,
  direction: "forward" | "backward"
) {
  if (currentStep === stepName) {
    return "relative translate-x-0 opacity-100";
  }
  if (direction === "forward") {
    return "absolute inset-0 translate-x-full opacity-0";
  }
  return "absolute inset-0 -translate-x-full opacity-0";
}

function getRoleLabel(role: string) {
  if (role === "provider") {
    return "Skill Provider";
  }
  if (role === "seeker") {
    return "Service Seeker";
  }
  return "Not selected";
}

function validateStep(step: WizardStep, formData: FormData): string | null {
  if (step === "credentials") {
    if (!(formData.email && formData.password)) {
      return "Please fill in all fields";
    }
    if (formData.password.length < 6) {
      return "Password must be at least 6 characters";
    }
  }
  if (step === "profile" && !(formData.fullName && formData.role)) {
    return "Please provide your name and select a role";
  }
  return null;
}

interface VerificationWaitingScreenProps {
  countdown: number;
  email: string;
  isLoading: boolean;
  onChangeEmail: () => void;
  onResendEmail: () => void;
  onSwitchToSignIn: () => void;
}

function VerificationWaitingScreen({
  countdown,
  email,
  isLoading,
  onChangeEmail,
  onResendEmail,
  onSwitchToSignIn,
}: VerificationWaitingScreenProps) {
  return (
    <div className="flex w-full max-w-md flex-col items-center justify-center p-6 text-center">
      <div className="mb-6 flex h-20 w-20 animate-pulse items-center justify-center rounded-full bg-primary/10">
        <Inbox className="h-10 w-10 text-primary" />
      </div>

      <h2 className="mb-2 font-serif text-foreground text-xl sm:text-2xl">
        Verify Your Email
      </h2>

      <p className="mb-6 text-muted-foreground text-sm">
        We&apos;ve sent a verification link to <strong>{email}</strong>. Please
        check your inbox and click the link to continue.
      </p>

      <div className="mb-6 w-full rounded-xl border border-border bg-secondary/30 p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/10">
            <RefreshCw className="h-5 w-5 animate-spin text-yellow-600" />
          </div>
          <div className="text-left">
            <p className="font-medium text-sm">Waiting for verification</p>
            <p className="text-muted-foreground text-xs">
              Please check your email and click the verification link
            </p>
          </div>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full w-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </div>
      </div>

      <div className="w-full space-y-3">
        <Button
          className="h-11 w-full rounded-full bg-primary font-medium text-primary-foreground text-sm"
          disabled={countdown > 0 || isLoading}
          onClick={onResendEmail}
        >
          {(() => {
            if (isLoading) {
              return <Loader2 className="mr-2 h-4 w-4 animate-spin" />;
            }
            if (countdown > 0) {
              return `Resend email in ${countdown}s`;
            }
            return "Resend Verification Email";
          })()}
        </Button>

        <Button
          className="h-11 w-full rounded-full font-medium text-sm"
          onClick={onChangeEmail}
          variant="outline"
        >
          Use Different Email
        </Button>

        <Button
          className="h-11 w-full rounded-full font-medium text-sm"
          onClick={onSwitchToSignIn}
          variant="ghost"
        >
          Back to Sign In
        </Button>
      </div>

      <div className="mt-6 space-y-2 text-muted-foreground text-xs">
        <p>
          Didn&apos;t receive the email? Check your spam folder or try
          resending.
        </p>
        <p className="text-[10px] opacity-70">
          Already clicked the link? Keep this page open - we&apos;ll detect it
          automatically.
        </p>
      </div>
    </div>
  );
}

function VerificationSuccessScreen() {
  return (
    <div className="flex w-full max-w-md flex-col items-center justify-center p-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
        <Check className="h-10 w-10 text-green-600" />
      </div>

      <h2 className="mb-2 font-serif text-foreground text-xl sm:text-2xl">
        Email Verified!
      </h2>

      <p className="mb-6 text-muted-foreground text-sm">
        Your email has been verified successfully. Redirecting you to the
        dashboard...
      </p>

      <div className="h-2 w-48 overflow-hidden rounded-full bg-muted">
        <div className="h-full w-full animate-[shimmer_1s_infinite] bg-gradient-to-r from-transparent via-primary to-transparent" />
      </div>
    </div>
  );
}

function StepIndicator({
  steps,
  currentStep,
  onStepClick,
}: {
  steps: typeof STEPS;
  currentStep: WizardStep;
  onStepClick: (id: WizardStep) => void;
}) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="relative flex items-center justify-between overflow-x-hidden">
      {steps.map((step, i) => {
        const isCompleted = i < currentIndex;
        const isActive = step.id === currentStep;

        return (
          <div
            className="relative z-10 flex flex-col items-center"
            key={step.id}
          >
            <button
              className={`flex h-9 w-9 items-center justify-center rounded-full border-2 font-mono text-xs transition-all duration-500 sm:h-10 sm:w-10 ${getStepButtonClass(
                isCompleted,
                isActive
              )}`}
              onClick={() => {
                if (isCompleted || isActive) {
                  onStepClick(step.id);
                }
              }}
              type="button"
            >
              {isCompleted ? (
                <Check className="h-4 w-4 animate-[scaleIn_0.3s_ease-out_both]" />
              ) : (
                step.number
              )}
            </button>
            <span
              className={`mt-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors duration-300 sm:mt-2 sm:text-xs ${
                isActive ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
      {/* Connecting line */}
      <div className="absolute top-4 right-12 left-12 h-0.5 bg-border sm:top-5 sm:right-14 sm:left-14">
        <div
          className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
          style={{
            width: `${(currentIndex / (steps.length - 1)) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}

function SignInForm({
  isLoading,
  formData,
  updateField,
  handleAuth,
  handleGoogleAuth,
}: {
  isLoading: boolean;
  formData: FormData;
  updateField: (field: keyof FormData, value: string) => void;
  handleAuth: () => void;
  handleGoogleAuth: () => void;
}) {
  return (
    <div className="fade-in slide-in-from-bottom-2 animate-in space-y-4 duration-500">
      <Button
        className="h-11 w-full gap-3 rounded-full border-border font-medium text-sm sm:h-12 sm:text-base"
        disabled={isLoading}
        onClick={handleGoogleAuth}
        variant="outline"
      >
        <svg className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24">
          <title>Google</title>
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Continue with Google
      </Button>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-border border-t" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase">
          <span className="bg-background px-2 font-mono text-muted-foreground">
            Or
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-5">
        <div className="grid gap-1.5 sm:gap-2">
          <Label
            className="font-medium text-foreground text-sm"
            htmlFor="email"
          >
            Email
          </Label>
          <InputGroup className="h-11 rounded-xl border-border sm:h-12">
            <InputGroupAddon>
              <Mail className="size-4 text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput
              disabled={isLoading}
              id="email"
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="you@example.com"
              type="email"
              value={formData.email}
            />
          </InputGroup>
        </div>
        <div className="grid gap-1.5 sm:gap-2">
          <Label
            className="font-medium text-foreground text-sm"
            htmlFor="password"
          >
            Password
          </Label>
          <InputGroup className="h-11 rounded-xl border-border sm:h-12">
            <InputGroupAddon>
              <Lock className="size-4 text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput
              disabled={isLoading}
              id="password"
              onChange={(e) => updateField("password", e.target.value)}
              placeholder="Enter your password"
              type="password"
              value={formData.password}
            />
          </InputGroup>
        </div>
      </div>
      <Button
        className="h-11 w-full rounded-full bg-primary font-medium text-primary-foreground text-sm transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 sm:h-12 sm:text-base"
        disabled={isLoading}
        onClick={handleAuth}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          "Sign In"
        )}
      </Button>
    </div>
  );
}

function SignUpWizard({
  currentStep,
  direction,
  isLoading,
  formData,
  updateField,
  handleGoogleAuth,
  steps,
  currentIndex,
  goBack,
  goNext,
  handleAuth,
}: {
  currentStep: WizardStep;
  direction: "forward" | "backward";
  isLoading: boolean;
  formData: FormData;
  updateField: (field: keyof FormData, value: string) => void;
  handleGoogleAuth: () => void;
  steps: typeof STEPS;
  currentIndex: number;
  goBack: () => void;
  goNext: () => void;
  handleAuth: () => void;
}) {
  return (
    <div className="overflow-hidden">
      {/* Step 1: Credentials */}
      <div
        className={`transition-all duration-500 ease-out ${getSlideClass(
          currentStep,
          "credentials",
          direction
        )}`}
      >
        <Button
          className="h-11 w-full gap-3 rounded-full border-border font-medium text-sm sm:h-12 sm:text-base"
          disabled={isLoading}
          onClick={handleGoogleAuth}
          variant="outline"
        >
          <svg className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24">
            <title>Google</title>
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </Button>

        <div className="relative my-5 sm:my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-border border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 font-mono text-muted-foreground">
              Or
            </span>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-5">
          <div className="grid gap-1.5 sm:gap-2">
            <Label
              className="font-medium text-foreground text-sm"
              htmlFor="reg-email"
            >
              Email
            </Label>
            <InputGroup className="h-11 rounded-xl border-border sm:h-12">
              <InputGroupAddon>
                <Mail className="size-4 text-muted-foreground" />
              </InputGroupAddon>
              <InputGroupInput
                disabled={isLoading}
                id="reg-email"
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="you@example.com"
                type="email"
                value={formData.email}
              />
            </InputGroup>
          </div>
          <div className="grid gap-1.5 sm:gap-2">
            <Label
              className="font-medium text-foreground text-sm"
              htmlFor="reg-password"
            >
              Password
            </Label>
            <InputGroup className="h-11 rounded-xl border-border sm:h-12">
              <InputGroupAddon>
                <Lock className="size-4 text-muted-foreground" />
              </InputGroupAddon>
              <InputGroupInput
                disabled={isLoading}
                id="reg-password"
                onChange={(e) => updateField("password", e.target.value)}
                placeholder="Create a password"
                type="password"
                value={formData.password}
              />
            </InputGroup>
          </div>
        </div>
      </div>

      {/* Step 2: Profile */}
      <div
        className={`transition-all duration-500 ease-out ${getSlideClass(
          currentStep,
          "profile",
          direction
        )}`}
      >
        <div className="grid gap-4 sm:gap-5">
          <div className="grid gap-1.5 sm:gap-2">
            <Label
              className="font-medium text-foreground text-sm"
              htmlFor="fullName"
            >
              Full Name
            </Label>
            <InputGroup className="h-11 rounded-xl border-border sm:h-12">
              <InputGroupAddon>
                <User className="size-4 text-muted-foreground" />
              </InputGroupAddon>
              <InputGroupInput
                disabled={isLoading}
                id="fullName"
                onChange={(e) => updateField("fullName", e.target.value)}
                placeholder="Your full name"
                type="text"
                value={formData.fullName}
              />
            </InputGroup>
          </div>

          <div className="grid gap-1.5 sm:gap-2">
            <Label className="font-medium text-foreground text-sm">
              I want to
            </Label>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {[
                {
                  value: "provider",
                  label: "Offer Skills",
                  desc: "I provide services",
                },
                {
                  value: "seeker",
                  label: "Find Help",
                  desc: "I need services",
                },
              ].map((option) => (
                <button
                  className={`rounded-xl border p-3 text-left transition-all duration-300 sm:p-4 ${
                    formData.role === option.value
                      ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                      : "border-border hover:border-primary/30 hover:bg-secondary/50"
                  }`}
                  disabled={isLoading}
                  key={option.value}
                  onClick={() => updateField("role", option.value)}
                  type="button"
                >
                  <p className="font-medium text-sm">{option.label}</p>
                  <p className="mt-0.5 text-muted-foreground text-xs">
                    {option.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-1.5 sm:gap-2">
            <Label
              className="font-medium text-foreground text-sm"
              htmlFor="location"
            >
              Location (optional)
            </Label>
            <InputGroup className="h-11 rounded-xl border-border sm:h-12">
              <InputGroupAddon>
                <span className="text-muted-foreground text-sm">📍</span>
              </InputGroupAddon>
              <InputGroupInput
                disabled={isLoading}
                id="location"
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="Your city or area"
                type="text"
                value={formData.location}
              />
            </InputGroup>
          </div>
        </div>
      </div>

      {/* Step 3: Review */}
      <div
        className={`transition-all duration-500 ease-out ${getSlideClass(
          currentStep,
          "review",
          direction
        )}`}
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="rounded-xl border border-border bg-secondary/30 p-3 sm:p-4">
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider sm:text-xs">
              Account
            </span>
            <p className="mt-1 font-medium text-sm">
              {formData.email || "Not provided"}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-secondary/30 p-3 sm:p-4">
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider sm:text-xs">
              Name
            </span>
            <p className="mt-1 font-medium text-sm">
              {formData.fullName || "Not provided"}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-secondary/30 p-3 sm:p-4">
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider sm:text-xs">
                Role
              </span>
              <p className="mt-1 font-medium text-sm capitalize">
                {getRoleLabel(formData.role)}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-secondary/30 p-3 sm:p-4">
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider sm:text-xs">
                Location
              </span>
              <p className="mt-1 font-medium text-sm">
                {formData.location || "Not set"}
              </p>
            </div>
          </div>
          <p className="text-center text-muted-foreground text-xs">
            By creating an account, you agree to our terms of service and
            privacy policy.
          </p>
        </div>
      </div>

      {/* Navigation buttons for Signup */}
      <div className="mt-8 flex gap-3">
        {currentIndex > 0 && (
          <Button
            className="h-11 flex-1 rounded-full font-medium text-sm hover:bg-secondary sm:h-12 sm:text-base"
            disabled={isLoading}
            onClick={goBack}
            variant="ghost"
          >
            Back
          </Button>
        )}
        {currentIndex < steps.length - 1 ? (
          <Button
            className="h-11 flex-1 rounded-full bg-primary font-medium text-primary-foreground text-sm transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 sm:h-12 sm:text-base"
            disabled={isLoading}
            onClick={goNext}
          >
            Continue
          </Button>
        ) : (
          <Button
            className="h-11 flex-1 rounded-full bg-primary font-medium text-primary-foreground text-sm transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 sm:h-12 sm:text-base"
            disabled={isLoading}
            onClick={handleAuth}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Create Account"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

export function AuthForm({ initialMode = "signup" }: AuthFormProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>("credentials");
  const [authMode, setAuthMode] = useState<AuthMode>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationState, setVerificationState] =
    useState<VerificationState>("idle");
  const [countdown, setCountdown] = useState(60);
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    fullName: "",
    role: "",
    location: "",
  });
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  useVerificationPolling(verificationState, setVerificationState);
  useCountdown(verificationState, countdown, setCountdown);

  const showWaitingScreen = (message: string) => {
    setVerificationState("waiting");
    setCountdown(60);
    toast.info(message);
  };

  const handleSuccessfulAuth = () => {
    toast.success("Welcome back!");
    router.push("/home");
    router.refresh();
  };

  const { handleAuth, handleResendEmail, handleGoogleAuth } = useAuthHandlers(
    authMode,
    formData,
    setIsLoading,
    showWaitingScreen,
    handleSuccessfulAuth
  );

  const goTo = (step: WizardStep) => {
    const nextIndex = STEPS.findIndex((s) => s.id === step);
    setDirection(nextIndex > currentIndex ? "forward" : "backward");
    setCurrentStep(step);
  };

  const goNext = () => {
    const error = validateStep(currentStep, formData);
    if (error) {
      toast.error(error);
      return;
    }
    const nextStep = STEPS[currentIndex + 1];
    if (nextStep) {
      goTo(nextStep.id);
    }
  };

  const goBack = () => {
    const prevStep = STEPS[currentIndex - 1];
    if (prevStep) {
      goTo(prevStep.id);
    }
  };

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Show email verification waiting screen
  if (verificationState === "waiting") {
    return (
      <VerificationWaitingScreen
        countdown={countdown}
        email={formData.email}
        isLoading={isLoading}
        onChangeEmail={() => setVerificationState("idle")}
        onResendEmail={handleResendEmail}
        onSwitchToSignIn={() => {
          setVerificationState("idle");
          setAuthMode("signin");
        }}
      />
    );
  }

  // Show verified success screen
  if (verificationState === "verified") {
    return <VerificationSuccessScreen />;
  }

  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md space-y-4 sm:space-y-5">
        {/* Header */}
        <div className="flex flex-col items-start space-y-2 text-left sm:space-y-3">
          <Image
            alt="Bitwork"
            className="h-7 w-7 sm:h-8 sm:w-8"
            height={32}
            priority
            src="/bitwork.svg"
            width={32}
          />
          <div className="space-y-1 sm:space-y-2">
            <h2 className="font-serif text-foreground text-xl sm:text-2xl">
              {authMode === "signup"
                ? "Create your Bitwork account"
                : "Welcome back to Bitwork"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {authMode === "signup" ? (
                <>
                  {currentStep === "credentials" &&
                    "Start by setting up your login credentials."}
                  {currentStep === "profile" &&
                    "Tell us a bit about yourself and your skills."}
                  {currentStep === "review" &&
                    "Review your information before creating your account."}
                </>
              ) : (
                "Sign in to your account to continue."
              )}
            </p>
          </div>
        </div>

        {authMode === "signup" && (
          <StepIndicator
            currentStep={currentStep}
            onStepClick={goTo}
            steps={STEPS}
          />
        )}

        {/* Auth Content */}
        <div className="relative">
          {authMode === "signin" ? (
            <SignInForm
              formData={formData}
              handleAuth={handleAuth}
              handleGoogleAuth={handleGoogleAuth}
              isLoading={isLoading}
              updateField={updateField}
            />
          ) : (
            <SignUpWizard
              currentIndex={currentIndex}
              currentStep={currentStep}
              direction={direction}
              formData={formData}
              goBack={goBack}
              goNext={goNext}
              handleAuth={handleAuth}
              handleGoogleAuth={handleGoogleAuth}
              isLoading={isLoading}
              steps={STEPS}
              updateField={updateField}
            />
          )}
        </div>

        {/* Toggle between Signup/Signin */}
        <div className="pt-4 text-center">
          <p className="text-muted-foreground text-sm">
            {authMode === "signup"
              ? "Already have an account?"
              : "Don't have an account?"}{" "}
            <button
              className="font-medium text-primary hover:underline"
              disabled={isLoading}
              onClick={() => {
                setAuthMode(authMode === "signup" ? "signin" : "signup");
                setCurrentStep("credentials");
              }}
              type="button"
            >
              {authMode === "signup" ? "Sign in" : "Create one"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
