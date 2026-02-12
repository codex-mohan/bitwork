"use client";

import { ArrowRight, FileText, Mail, Send, Users, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useOnboarding } from "@/components/onboarding-provider";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

export function CTASection() {
  const { openOnboarding } = useOnboarding();

  const floatingIcons = [
    { Icon: Mail, label: "Email", delay: "0s" },
    { Icon: Zap, label: "Fast", delay: "1s" },
    { Icon: FileText, label: "Tasks", delay: "2s" },
    { Icon: Users, label: "People", delay: "0.5s" },
    { Icon: Send, label: "Connect", delay: "1.5s" },
  ];

  return (
    <section className="bg-secondary/30 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial="hidden"
          transition={{ duration: 0.7, ease: "easeOut" }}
          variants={fadeUp}
          viewport={{ once: true, margin: "-50px" }}
          whileInView="visible"
        >
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 sm:rounded-3xl sm:p-12 md:p-16">
            {/* Floating icons — hidden on small screens, visible on md+ */}
            <div className="pointer-events-none hidden md:block">
              {floatingIcons.map(({ Icon, label, delay }) => (
                <div
                  className="absolute flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card/80 backdrop-blur-sm transition-transform duration-500 hover:scale-110"
                  key={label}
                  style={{
                    animationDelay: delay,
                    ...(label === "Email" ? { top: "2rem", left: "2rem" } : {}),
                    ...(label === "Fast" ? { top: "2rem", right: "2rem" } : {}),
                    ...(label === "Tasks"
                      ? { bottom: "2rem", left: "2rem" }
                      : {}),
                    ...(label === "People"
                      ? { right: "2rem", bottom: "2rem" }
                      : {}),
                    ...(label === "Connect"
                      ? {
                          top: "50%",
                          right: "4rem",
                          transform: "translateY(-50%)",
                        }
                      : {}),
                  }}
                >
                  <Icon
                    className="h-4 w-4 animate-[float_4s_ease-in-out_infinite] text-muted-foreground"
                    style={{ animationDelay: delay }}
                  />
                </div>
              ))}
              <div
                className="absolute flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card/80 backdrop-blur-sm"
                style={{ bottom: "33%", left: "4rem" }}
              >
                <span
                  className="animate-[float_4s_ease-in-out_infinite] text-lg text-muted-foreground"
                  style={{ animationDelay: "2.5s" }}
                >
                  +
                </span>
              </div>
            </div>

            {/* Mobile icon strip — visible on small screens only */}
            <div className="mb-6 flex items-center justify-center gap-3 md:hidden">
              {floatingIcons.map(({ Icon, label }) => (
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary/50"
                  key={label}
                >
                  <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              ))}
            </div>

            <div className="relative z-10 mx-auto max-w-2xl text-center">
              <h2 className="mb-4 font-serif text-3xl leading-tight sm:text-4xl md:text-5xl">
                Your skills,
                <br />
                your economy.
              </h2>
              <p className="mb-6 text-muted-foreground text-sm sm:mb-8 sm:text-base">
                Join thousands of informal workers, students, and communities
                building fair, local skill exchanges.
              </p>
              <button
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground text-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 active:translate-y-0"
                onClick={() => openOnboarding("signup")}
                type="button"
              >
                Join Bitwork
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
