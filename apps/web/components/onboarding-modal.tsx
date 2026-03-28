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
        className="max-h-[85vh] w-[95vw] max-w-3xl overflow-hidden rounded-xl bg-background p-0 sm:max-w-2xl"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Onboarding</DialogTitle>

        <div className="flex shrink-0 items-center justify-between border-border/50 border-b px-5 py-3">
          <div className="flex gap-5">
            {["about", "signup", "complete"].map((tab) => {
              const getTabLabel = () => {
                if (tab === "about") {
                  return "About";
                }
                if (tab === "signup") {
                  return initialMode === "signin" ? "Sign In" : "Sign Up";
                }
                return "Complete";
              };
              return (
                <button
                  className="group relative pb-1 outline-none"
                  key={tab}
                  onClick={() => setActiveTab(tab as typeof activeTab)}
                  type="button"
                >
                  <span
                    className={`font-mono text-xs uppercase tracking-wide transition-colors ${
                      activeTab === tab
                        ? "text-foreground"
                        : "text-muted-foreground/60 group-hover:text-muted-foreground"
                    }`}
                  >
                    {getTabLabel()}
                  </span>
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 w-full rounded-full transition-all duration-300 ${
                      activeTab === tab ? "bg-primary" : "bg-transparent"
                    }`}
                  />
                </button>
              );
            })}
          </div>
          <button
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground/60 transition-all duration-200 hover:bg-secondary hover:text-foreground"
            onClick={closeOnboarding}
            type="button"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        {activeTab === "about" && (
          <div className="flex max-h-[calc(85vh-52px)] flex-col overflow-hidden sm:flex-row">
            <div className="relative h-32 w-full shrink-0 bg-secondary/20 sm:hidden">
              <Image
                alt="Skill Exchange"
                className="object-cover"
                fill
                priority
                src="/intro.png"
              />
            </div>

            <div className="hidden w-2/5 shrink-0 bg-secondary/20 sm:block">
              <div className="relative h-full w-full">
                <Image
                  alt="Skill Exchange"
                  className="object-cover"
                  fill
                  priority
                  src="/intro.png"
                />
              </div>
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto">
              <div className="flex-1 p-5 sm:p-6">
                <div className="mx-auto max-w-sm space-y-4 sm:mx-0 sm:max-w-none">
                  <div className="space-y-1">
                    <h2 className="font-serif text-foreground text-xl sm:text-2xl">
                      Skill Exchange & Micro-Collaboration
                    </h2>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      Network for Informal and Local Workforce
                    </p>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        icon: Users,
                        title: "Empower Informal Work",
                        desc: "Connects plumbers, students, and helpers with households for specific tasks.",
                      },
                      {
                        icon: Briefcase,
                        title: "Task-Based Collaboration",
                        desc: 'Work exchanged as small units like "fix tap" rather than long-term contracts.',
                      },
                      {
                        icon: ShieldCheck,
                        title: "Transparent Trust",
                        desc: "Build a verifiable digital work history and reputation.",
                      },
                      {
                        icon: RefreshCw,
                        title: "Flexible Value Exchange",
                        desc: "Exchange tasks for money, time, or skill reciprocity.",
                      },
                    ].map((item) => (
                      <div className="flex items-start gap-3" key={item.title}>
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary">
                          <item.icon className="h-4 w-4 text-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground text-xs sm:text-sm">
                            {item.title}
                          </h3>
                          <p className="text-[10px] text-muted-foreground leading-relaxed sm:text-xs">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Button
                      className="h-10 w-full rounded-lg bg-primary font-medium text-primary-foreground"
                      onClick={() => setActiveTab("signup")}
                    >
                      Join the Network
                    </Button>
                    <Button
                      className="h-9 w-full rounded-lg text-muted-foreground text-xs hover:bg-secondary hover:text-foreground sm:text-sm"
                      onClick={() => setActiveTab("signup")}
                      variant="ghost"
                    >
                      Already have an account? Sign In
                    </Button>
                  </div>

                  <p className="text-center text-[10px] text-muted-foreground/60">
                    Promotes dignity of labor and fair access to opportunities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "signup" && (
          <div className="max-h-[calc(85vh-52px)] overflow-y-auto bg-background">
            <AuthForm initialMode={initialMode} />
          </div>
        )}

        {activeTab === "complete" && (
          <div className="flex max-h-[calc(85vh-52px)] flex-col overflow-hidden">
            <div className="relative h-28 w-full shrink-0 bg-secondary/20 sm:h-40">
              <Image
                alt="Onboarding Complete"
                className="object-cover"
                fill
                priority
                src="/onboarding-complete.png"
              />
            </div>
            <div className="flex flex-1 items-center justify-center p-5 sm:p-6">
              <div className="w-full max-w-xs space-y-4 text-center">
                <div className="space-y-1">
                  <h2 className="font-serif text-foreground text-xl sm:text-2xl">
                    You are all set!
                  </h2>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    We have created your account, you can now start exchanging
                    skills with ease!
                  </p>
                </div>

                <div className="flex items-center justify-center gap-4 text-xs">
                  {[
                    { label: "Profile verified" },
                    { label: "Skills listed" },
                    { label: "Ready to work" },
                  ].map((item) => (
                    <div
                      className="flex items-center gap-1.5 text-muted-foreground"
                      key={item.label}
                    >
                      <Check className="h-3.5 w-3.5 text-primary" />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>

                <Button className="h-10 w-full rounded-lg bg-primary font-medium text-primary-foreground">
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
