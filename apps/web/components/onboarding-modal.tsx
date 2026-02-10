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

export function OnboardingModal() {
  const [activeTab, setActiveTab] = useState<"about" | "signup" | "complete">(
    "about"
  );

  return (
    <Dialog defaultOpen>
      <DialogContent
        className="flex h-200 max-h-[90vh] w-full max-w-5xl flex-col gap-0 overflow-hidden rounded-2xl bg-white p-0 sm:max-w-5xl"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Onboarding</DialogTitle>

        <div className="flex flex-none items-center justify-between border-gray-100 border-b px-6 py-4 md:px-10">
          <div className="flex gap-6">
            <button
              className="group flex flex-col outline-none"
              onClick={() => setActiveTab("about")}
              type="button"
            >
              <span
                className={`pb-1 font-semibold text-sm transition-colors ${
                  activeTab === "about"
                    ? "text-gray-900"
                    : "text-gray-400 group-hover:text-gray-600"
                }`}
              >
                About Bitwork
              </span>
              <div
                className={`h-0.5 w-full rounded-full transition-colors ${
                  activeTab === "about" ? "bg-black" : "bg-transparent"
                }`}
              />
            </button>
            <button
              className="group flex flex-col outline-none"
              onClick={() => setActiveTab("signup")}
              type="button"
            >
              <span
                className={`pb-1 font-semibold text-sm transition-colors ${
                  activeTab === "signup"
                    ? "text-gray-900"
                    : "text-gray-400 group-hover:text-gray-600"
                }`}
              >
                Sign up
              </span>
              <div
                className={`h-0.5 w-full rounded-full transition-colors ${
                  activeTab === "signup" ? "bg-black" : "bg-transparent"
                }`}
              />
            </button>
            <button
              className="group flex flex-col outline-none"
              onClick={() => setActiveTab("complete")}
              type="button"
            >
              <span
                className={`pb-1 font-semibold text-sm transition-colors ${
                  activeTab === "complete"
                    ? "text-gray-900"
                    : "text-gray-400 group-hover:text-gray-600"
                }`}
              >
                Complete
              </span>
              <div
                className={`h-0.5 w-full rounded-full transition-colors ${
                  activeTab === "complete" ? "bg-black" : "bg-transparent"
                }`}
              />
            </button>
          </div>
          <button
            aria-label="Close"
            className="text-gray-400 transition-colors hover:text-gray-600"
            type="button"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {activeTab === "about" && (
          <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
            <div className="relative hidden w-full items-center justify-center bg-white p-1.5 md:flex md:w-1/2">
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
            <div className="relative flex h-64 w-full items-center justify-center bg-white p-1.5 md:hidden">
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

            <div className="flex w-full flex-col overflow-y-auto bg-white md:w-1/2">
              <div className="flex-1 p-6 md:p-10">
                <div className="space-y-6">
                  <div>
                    <h2 className="mb-2 font-bold font-heading text-2xl text-gray-900 md:text-3xl">
                      Skill Exchange & Micro-Collaboration
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Network for Informal and Local Workforce
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-900">
                        <Users className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <h3 className="mb-1 font-semibold text-gray-900 text-sm">
                          Empower Informal Work
                        </h3>
                        <p className="text-gray-500 text-xs leading-relaxed">
                          Connects plumbers, students, and helpers with
                          households for specific tasks without needing a
                          physical shop.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-900">
                        <Briefcase className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <h3 className="mb-1 font-semibold text-gray-900 text-sm">
                          Task-Based Collaboration
                        </h3>
                        <p className="text-gray-500 text-xs leading-relaxed">
                          Work is exchanged as small, well-defined units like
                          "fix tap" or "design poster" rather than long-term
                          contracts.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-900">
                        <ShieldCheck className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <h3 className="mb-1 font-semibold text-gray-900 text-sm">
                          Transparent Trust
                        </h3>
                        <p className="text-gray-500 text-xs leading-relaxed">
                          Build a verifiable digital work history and reputation
                          based on completed contributions.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 pt-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-900">
                        <RefreshCw className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <h3 className="mb-1 font-bold text-gray-900 text-sm">
                          Flexible Value Exchange
                        </h3>
                        <p className="text-gray-500 text-xs leading-relaxed">
                          Exchange tasks for money, time, or skill reciprocity
                          depending on context.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <Button
                      className="h-12 w-full rounded-lg bg-gray-900 font-semibold text-base text-white shadow-gray-200 shadow-lg hover:bg-gray-800"
                      onClick={() => setActiveTab("signup")}
                    >
                      Join the Network
                    </Button>
                    <Button
                      className="h-10 w-full rounded-lg font-medium text-gray-500 hover:bg-gray-50"
                      variant="ghost"
                    >
                      Explore first
                    </Button>
                  </div>

                  <p className="text-center text-[10px] text-gray-400 leading-tight">
                    Promotes dignity of labor, fair access to opportunities, and
                    inclusion for unregistered workers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "signup" && (
          <div className="flex flex-1 items-center justify-center overflow-y-auto">
            <AuthForm />
          </div>
        )}

        {activeTab === "complete" && (
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="relative h-100 w-full shrink-0 bg-white p-1.5">
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
            <div className="flex flex-1 flex-col items-center justify-center bg-white pb-8 md:pb-12">
              <div className="w-full max-w-lg space-y-8 text-center">
                <div className="space-y-3">
                  <h2 className="font-bold text-2xl text-gray-900 md:text-3xl">
                    You are all set!
                  </h2>
                  <p className="text-gray-500">
                    We have created your account, you can now start exchanging
                    skills with ease!
                  </p>
                </div>

                <div className="flex items-center justify-center gap-8 font-medium text-gray-500 text-sm">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    <span>Profile verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    <span>Skills listed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    <span>Ready to work</span>
                  </div>
                </div>

                <Button className="h-12 w-full rounded-xl bg-gray-100 font-semibold text-base text-gray-900 hover:bg-gray-100">
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
