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
        className="max-h-[90vh] w-[95vw] max-w-4xl overflow-hidden rounded-2xl bg-background p-0 sm:max-w-2xl lg:max-w-4xl"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Onboarding</DialogTitle>

        <div className="flex items-center justify-between border-border/50 border-b px-5 py-3 lg:px-8 lg:py-4">
          <div className="flex gap-6">
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
          <div className="flex max-h-[calc(90vh-60px)] flex-col overflow-hidden lg:flex-row">
            <div className="relative h-48 w-full shrink-0 overflow-hidden bg-secondary/20 sm:h-64 lg:hidden">
              <Image
                alt="Skill Exchange"
                className="object-cover"
                fill
                priority
                src="/intro.png"
              />
            </div>

            <div className="hidden w-2/5 shrink-0 overflow-hidden bg-secondary/20 lg:block">
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
              <div className="flex-1 p-6 lg:p-10">
                <div className="mx-auto max-w-md space-y-6 lg:mx-0">
                  <div className="space-y-2">
                    <h2 className="font-serif text-2xl text-foreground lg:text-3xl">
                      Skill Exchange & Micro-Collaboration
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Network for Informal and Local Workforce
                    </p>
                  </div>

                  <div className="space-y-5">
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
                        className="flex items-start gap-4"
                        key={item.title}
                        style={{ animationDelay: `${i * 100}ms` }}
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
                          <item.icon className="h-4 w-4 text-foreground" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold text-foreground text-sm">
                            {item.title}
                          </h3>
                          <p className="text-muted-foreground text-xs leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 pt-2">
                    <Button
                      className="h-11 w-full rounded-lg bg-primary font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                      onClick={() => setActiveTab("signup")}
                    >
                      Join the Network
                    </Button>
                    <Button
                      className="h-10 w-full rounded-lg font-medium text-muted-foreground text-sm hover:bg-secondary hover:text-foreground"
                      onClick={() => setActiveTab("signup")}
                      variant="ghost"
                    >
                      Already have an account? Sign In
                    </Button>
                  </div>

                  <p className="text-center text-[10px] text-muted-foreground/60 leading-relaxed">
                    Promotes dignity of labor, fair access to opportunities, and
                    inclusion for unregistered workers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "signup" && (
          <div className="flex max-h-[calc(90vh-60px)] items-center justify-center overflow-y-auto bg-background">
            <AuthForm initialMode={initialMode} />
          </div>
        )}

        {activeTab === "complete" && (
          <div className="flex max-h-[calc(90vh-60px)] flex-col overflow-hidden">
            <div className="relative h-40 w-full shrink-0 overflow-hidden bg-secondary/20 sm:h-56 lg:h-64">
              <Image
                alt="Onboarding Complete"
                className="object-cover"
                fill
                priority
                src="/onboarding-complete.png"
              />
            </div>
            <div className="flex flex-1 flex-col items-center justify-center p-6 pb-10 lg:p-10">
              <div className="w-full max-w-sm space-y-6 text-center">
                <div className="space-y-2">
                  <h2 className="font-serif text-2xl text-foreground lg:text-3xl">
                    You are all set!
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    We have created your account, you can now start exchanging
                    skills with ease!
                  </p>
                </div>

                <div className="flex items-center justify-center gap-6 text-sm">
                  {[
                    { label: "Profile verified" },
                    { label: "Skills listed" },
                    { label: "Ready to work" },
                  ].map((item) => (
                    <div
                      className="flex items-center gap-2 text-muted-foreground"
                      key={item.label}
                    >
                      <Check className="h-4 w-4 text-primary" />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>

                <Button className="h-11 w-full rounded-lg bg-primary font-medium text-primary-foreground transition-colors hover:bg-primary/90">
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
