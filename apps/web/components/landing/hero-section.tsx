"use client";

import { ArrowRight, MapPin, Star } from "lucide-react";
import { useOnboarding } from "@/components/onboarding-provider";

export function HeroSection() {
  const { openOnboarding } = useOnboarding();

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 pt-12 pb-16 sm:px-6 sm:pt-16 sm:pb-24">
        <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-2">
          <div className="animate-[fadeInUp_0.8s_ease-out_both] space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 font-mono text-muted-foreground text-xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              <span>Skill Exchange Network</span>
            </div>

            <h1 className="text-balance font-serif text-4xl leading-[1.1] sm:text-5xl md:text-6xl lg:text-7xl">
              Skills meet
              <br />
              work. Locally.
            </h1>

            <p className="max-w-md text-base text-muted-foreground sm:text-lg">
              Connect with nearby service providers and workers. Exchange
              skills, build trust, get work done.
            </p>

            <button
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground text-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 active:translate-y-0"
              onClick={() => openOnboarding("signup")}
              type="button"
            >
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>

          {/* Desktop: showcase with floating cards */}
          <div className="relative hidden animate-[fadeInUp_0.8s_ease-out_0.2s_both] lg:block">
            <div className="relative rounded-3xl border border-border/50 bg-secondary/50 p-8">
              <div className="mb-4 flex justify-between font-mono text-[10px] text-muted-foreground">
                <span>No. 01 — Bitwork Marketplace</span>
                <span>Verified · Active</span>
              </div>

              {/* Floating task note */}
              <div className="absolute top-20 -left-4 w-36 -rotate-3 animate-[float_6s_ease-in-out_infinite] rounded-xl border border-amber-200/60 bg-[#fffef0] p-3 shadow-md transition-transform duration-500 hover:rotate-0 hover:scale-105">
                <p className="font-mono text-[10px] text-foreground/60 uppercase tracking-wider">
                  Posted Task
                </p>
                <p className="mt-1 font-serif text-sm italic">
                  "Need plumbing help — 2 hrs"
                </p>
              </div>

              {/* Provider card */}
              <div className="mx-auto my-6 max-w-sm rounded-2xl bg-[#4a5d52] p-6">
                <div className="mb-2 flex justify-between px-2 font-mono text-[8px] text-white/70">
                  <span>Available Providers</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-2.5 w-2.5" />
                    Radius: 2 km
                  </span>
                </div>
                <div className="mb-4 px-2 font-mono text-[10px] text-white/80">
                  <p>Electrician · Plumber · Tutor</p>
                  <p>Mechanic · Designer · Helper</p>
                </div>
                <div className="rounded-xl bg-[#3a4a42] p-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] text-white/80">
                        Rajesh K. — Plumbing
                      </span>
                      <span className="flex items-center gap-0.5 text-[8px] text-green-400">
                        <Star className="h-2 w-2 fill-green-400" />
                        5.0
                      </span>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-[#2a3a32]">
                      <div className="h-full w-4/5 animate-[expandWidth_1.5s_ease-out_0.5s_both] rounded-full bg-green-400" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] text-white/80">
                        Priya S. — Design
                      </span>
                      <span className="flex items-center gap-0.5 text-[8px] text-green-400">
                        <Star className="h-2 w-2 fill-green-400" />
                        4.8
                      </span>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-[#2a3a32]">
                      <div className="h-full w-3/5 animate-[expandWidth_1.5s_ease-out_0.7s_both] rounded-full bg-green-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating response cards */}
              <div className="absolute top-32 -right-2 animate-[float_6s_ease-in-out_1s_infinite] space-y-2">
                <div className="max-w-44 rounded-xl border border-border bg-card p-3 shadow-md transition-transform duration-300 hover:scale-105">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary/30 to-accent" />
                    <span className="font-medium text-xs">Ramesh P.</span>
                    <span className="rounded-full bg-green-100 px-1.5 py-0.5 font-medium text-[8px] text-green-700">
                      Verified
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    I can fix your tap!
                  </p>
                </div>

                <div className="max-w-48 rounded-xl border border-border bg-card p-3 shadow-md transition-transform duration-300 hover:scale-105">
                  <p className="text-muted-foreground text-xs">
                    30 mins, ₹300 · Rating: 4.9/5 from 27 jobs
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile: stacked showcase cards */}
          <div className="block animate-[fadeInUp_0.8s_ease-out_0.3s_both] lg:hidden">
            <div className="rounded-2xl border border-border/50 bg-secondary/50 p-4 sm:p-6">
              <div className="mb-3 flex justify-between font-mono text-[10px] text-muted-foreground">
                <span>No. 01 — Bitwork Marketplace</span>
                <span>Verified · Active</span>
              </div>

              {/* Task note inline */}
              <div className="mb-4 rounded-xl border border-amber-200/60 bg-[#fffef0] p-3 shadow-sm">
                <p className="font-mono text-[10px] text-foreground/60 uppercase tracking-wider">
                  Posted Task
                </p>
                <p className="mt-1 font-serif text-sm italic">
                  "Need plumbing help — 2 hrs"
                </p>
              </div>

              {/* Provider card */}
              <div className="rounded-2xl bg-[#4a5d52] p-4 sm:p-6">
                <div className="mb-2 flex justify-between font-mono text-[8px] text-white/70">
                  <span>Available Providers</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-2.5 w-2.5" />
                    Radius: 2 km
                  </span>
                </div>
                <div className="mb-3 font-mono text-[10px] text-white/80">
                  <p>Electrician · Plumber · Tutor · Designer</p>
                </div>
                <div className="rounded-xl bg-[#3a4a42] p-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-white/80">
                        Rajesh K. — Plumbing
                      </span>
                      <span className="flex items-center gap-0.5 text-[8px] text-green-400">
                        <Star className="h-2 w-2 fill-green-400" />
                        5.0
                      </span>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-[#2a3a32]">
                      <div className="h-full w-4/5 rounded-full bg-green-400" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-white/80">
                        Priya S. — Design
                      </span>
                      <span className="flex items-center gap-0.5 text-[8px] text-green-400">
                        <Star className="h-2 w-2 fill-green-400" />
                        4.8
                      </span>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-[#2a3a32]">
                      <div className="h-full w-3/5 rounded-full bg-green-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Response cards inline */}
              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-card p-3 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary/30 to-accent" />
                    <span className="font-medium text-xs">Ramesh P.</span>
                    <span className="rounded-full bg-green-100 px-1.5 py-0.5 font-medium text-[8px] text-green-700">
                      Verified
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    I can fix your tap!
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-3 shadow-sm">
                  <p className="text-muted-foreground text-xs">
                    30 mins, ₹300 · Rating: 4.9/5 from 27 jobs
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
