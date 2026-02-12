"use client";

import { Button } from "@bitwork/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@bitwork/ui/components/dialog";
import {
  Briefcase,
  Check,
  RefreshCw,
  ShieldCheck,
  Users,
  XIcon,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { AuthForm } from "./auth-form";
import { useOnboarding } from "./onboarding-provider";

interface OnboardingModalProps {
  initialMode?: "signup" | "signin";
}

export function OnboardingModal({
  initialMode = "signup",
}: OnboardingModalProps) {
  const { isOpen, closeOnboarding } = useOnboarding();
  const [activeTab, setActiveTab] = useState<"about" | "signup" | "complete">(
    initialMode === "signin" ? "signup" : "about"
  );

  return (
    <Dialog onOpenChange={(open) => !open && closeOnboarding()} open={isOpen}>
      <DialogContent
        className="flex h-[90vh] max-h-[780px] w-[95vw] max-w-5xl flex-col gap-0 overflow-hidden rounded-xl bg-background p-0 sm:max-w-5xl sm:rounded-2xl"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Onboarding</DialogTitle>

        <div className="flex flex-none items-center justify-between border-border border-b px-4 py-3 sm:px-6 sm:py-4 md:px-10">
          <div className="flex gap-4 sm:gap-6">
            <button
              className="group flex flex-col outline-none"
              onClick={() => setActiveTab("about")}
              type="button"
            >
              <span
                className={`font-mono text-[10px] uppercase tracking-wider transition-colors sm:text-xs ${
                  activeTab === "about"
                    ? "text-foreground"
                    : "text-muted-foreground group-hover:text-foreground"
                }`}
              >
                About Bitwork
              </span>
              <div
                className={`mt-1 h-0.5 w-full rounded-full transition-all duration-300 ${
                  activeTab === "about"
                    ? "scale-x-100 bg-primary"
                    : "scale-x-0 bg-transparent"
                }`}
              />
            </button>
            <button
              className="group flex flex-col outline-none"
              onClick={() => setActiveTab("signup")}
              type="button"
            >
              <span
                className={`font-mono text-[10px] uppercase tracking-wider transition-colors sm:text-xs ${
                  activeTab === "signup"
                    ? "text-foreground"
                    : "text-muted-foreground group-hover:text-foreground"
                }`}
              >
                {initialMode === "signin" ? "Sign In" : "Sign Up"}
              </span>
              <div
                className={`mt-1 h-0.5 w-full rounded-full transition-all duration-300 ${
                  activeTab === "signup"
                    ? "scale-x-100 bg-primary"
                    : "scale-x-0 bg-transparent"
                }`}
              />
            </button>
            <button
              className="group flex flex-col outline-none"
              onClick={() => setActiveTab("complete")}
              type="button"
            >
              <span
                className={`font-mono text-[10px] uppercase tracking-wider transition-colors sm:text-xs ${
                  activeTab === "complete"
                    ? "text-foreground"
                    : "text-muted-foreground group-hover:text-foreground"
                }`}
              >
                Complete
              </span>
              <div
                className={`mt-1 h-0.5 w-full rounded-full transition-all duration-300 ${
                  activeTab === "complete"
                    ? "scale-x-100 bg-primary"
                    : "scale-x-0 bg-transparent"
                }`}
              />
            </button>
          </div>
          <button
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground"
            onClick={closeOnboarding}
            type="button"
          >
            <XIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        {activeTab === "about" && (
          <div className="flex flex-1 animate-[fadeInUp_0.5s_ease-out_both] flex-col overflow-hidden md:flex-row">
            <div className="relative hidden w-full items-center justify-center bg-secondary/30 p-1.5 md:flex md:w-1/2">
              <div className="relative h-full w-full overflow-hidden rounded-xl">
                <Image
                  alt="Skill Exchange Intro"
                  className="object-cover"
                  fill
                  priority
                  src="/intro.png"
                />
              </div>
            </div>
            <div className="relative flex h-48 w-full items-center justify-center bg-secondary/30 p-1.5 sm:h-64 md:hidden">
              <div className="relative h-full w-full overflow-hidden rounded-xl">
                <Image
                  alt="Skill Exchange Intro"
                  className="object-cover"
                  fill
                  priority
                  src="/intro.png"
                />
              </div>
            </div>

            <div className="flex w-full flex-col overflow-y-auto bg-background md:w-1/2">
              <div className="flex-1 p-4 sm:p-6 md:p-10">
                <div className="space-y-5 sm:space-y-6">
                  <div>
                    <h2 className="mb-2 font-serif text-foreground text-xl sm:text-2xl md:text-3xl">
                      Skill Exchange & Micro-Collaboration
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Network for Informal and Local Workforce
                    </p>
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    {[
                      {
                        icon: Users,
                        title: "Empower Informal Work",
                        desc: "Connects plumbers, students, and helpers with households for specific tasks without needing a physical shop.",
                      },
                      {
                        icon: Briefcase,
                        title: "Task-Based Collaboration",
                        desc: 'Work is exchanged as small, well-defined units like "fix tap" or "design poster" rather than long-term contracts.',
                      },
                      {
                        icon: ShieldCheck,
                        title: "Transparent Trust",
                        desc: "Build a verifiable digital work history and reputation based on completed contributions.",
                      },
                      {
                        icon: RefreshCw,
                        title: "Flexible Value Exchange",
                        desc: "Exchange tasks for money, time, or skill reciprocity depending on context.",
                      },
                    ].map((item, i) => (
                      <div
                        className="flex animate-[fadeInUp_0.4s_ease-out_both] items-start gap-3 sm:gap-4"
                        key={item.title}
                        style={{ animationDelay: `${i * 100 + 200}ms` }}
                      >
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-foreground sm:h-8 sm:w-8">
                          <item.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </div>
                        <div>
                          <h3 className="mb-0.5 font-semibold text-foreground text-sm sm:mb-1">
                            {item.title}
                          </h3>
                          <p className="text-muted-foreground text-xs leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 pt-1 sm:pt-2">
                    <Button
                      className="h-11 w-full rounded-full bg-primary font-medium text-primary-foreground text-sm transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 sm:h-12 sm:text-base"
                      onClick={() => setActiveTab("signup")}
                    >
                      Join the Network
                    </Button>
                    <Button
                      className="h-9 w-full rounded-full font-medium text-muted-foreground text-sm hover:bg-secondary sm:h-10"
                      onClick={() => setActiveTab("signup")}
                      variant="ghost"
                    >
                      Already have an account? Sign In
                    </Button>
                  </div>

                  <p className="text-center font-mono text-[9px] text-muted-foreground/60 leading-tight sm:text-[10px]">
                    Promotes dignity of labor, fair access to opportunities, and
                    inclusion for unregistered workers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "signup" && (
          <div className="flex flex-1 animate-[fadeInUp_0.5s_ease-out_both] items-center justify-center overflow-y-auto bg-background">
            <AuthForm initialMode={initialMode} />
          </div>
        )}

        {activeTab === "complete" && (
          <div className="flex flex-1 animate-[fadeInUp_0.5s_ease-out_both] flex-col overflow-hidden">
            <div className="relative h-40 w-full shrink-0 bg-secondary/30 p-1.5 sm:h-64 md:h-100">
              <div className="relative h-full w-full overflow-hidden rounded-xl">
                <Image
                  alt="Onboarding Complete"
                  className="object-cover"
                  fill
                  priority
                  src="/onboarding-complete.png"
                />
              </div>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center bg-background p-4 pb-6 sm:p-6 sm:pb-8 md:pb-12">
              <div className="w-full max-w-lg space-y-5 text-center sm:space-y-8">
                <div className="space-y-2 sm:space-y-3">
                  <h2 className="animate-[fadeInUp_0.5s_ease-out_0.2s_both] font-serif text-foreground text-xl sm:text-2xl md:text-3xl">
                    You are all set!
                  </h2>
                  <p className="animate-[fadeInUp_0.5s_ease-out_0.3s_both] text-muted-foreground text-sm">
                    We have created your account, you can now start exchanging
                    skills with ease!
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4 font-medium text-muted-foreground text-xs sm:gap-8 sm:text-sm">
                  {[
                    { label: "Profile verified", delay: "0.4s" },
                    { label: "Skills listed", delay: "0.5s" },
                    { label: "Ready to work", delay: "0.6s" },
                  ].map((item) => (
                    <div
                      className="flex animate-[fadeInUp_0.5s_ease-out_both] items-center gap-1.5 sm:gap-2"
                      key={item.label}
                      style={{ animationDelay: item.delay }}
                    >
                      <Check className="h-3.5 w-3.5 text-primary sm:h-4 sm:w-4" />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>

                <Button className="h-11 w-full animate-[fadeInUp_0.5s_ease-out_0.7s_both] rounded-full bg-primary font-medium text-primary-foreground text-sm transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 sm:h-12 sm:text-base">
                  Continue
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
