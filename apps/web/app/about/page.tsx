"use client";

import {
  Award,
  Globe,
  Heart,
  Lightbulb,
  Shield,
  Target,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import {
  OnboardingProvider,
  useOnboarding,
} from "@/components/onboarding-provider";
import { SmoothScroll } from "@/components/smooth-scroll";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

function AboutPageContent() {
  const { isOpen } = useOnboarding();

  return (
    <SmoothScroll paused={isOpen}>
      <main className="min-h-screen bg-background">
        <Header />

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 sm:pt-20 sm:pb-28">
            <motion.div
              className="mx-auto max-w-3xl text-center"
              initial="hidden"
              transition={{ duration: 0.7, ease: "easeOut" }}
              variants={fadeUp}
              viewport={{ once: true }}
              whileInView="visible"
            >
              <span className="inline-block font-mono text-muted-foreground text-xs uppercase tracking-wider">
                Our Mission
              </span>
              <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl md:text-6xl">
                Bridging skills and
                <br />
                <span className="text-primary">opportunity</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Bitwork is building a fair, transparent marketplace where local
                skills meet local needs. We believe everyone deserves access to
                dignified work and reliable services.
              </p>
            </motion.div>
          </div>

          {/* Decorative gradient */}
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-linear-to-b from-primary/10 via-primary/5 to-transparent blur-3xl" />
        </section>

        {/* Stats Section */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <motion.div
              className="grid gap-6 sm:grid-cols-3"
              initial="hidden"
              transition={{ duration: 0.6, ease: "easeOut" }}
              variants={staggerContainer}
              viewport={{ once: true, margin: "-50px" }}
              whileInView="visible"
            >
              {[
                { value: "10K+", label: "Active Users" },
                { value: "50K+", label: "Jobs Completed" },
                { value: "4.9★", label: "Average Rating" },
              ].map((stat) => (
                <motion.div
                  className="group rounded-2xl border border-border bg-card p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5"
                  key={stat.label}
                  variants={fadeUp}
                >
                  <span className="block font-serif text-4xl text-primary sm:text-5xl">
                    {stat.value}
                  </span>
                  <span className="mt-2 block font-mono text-muted-foreground text-sm uppercase tracking-wider">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
        <section className="bg-secondary/30 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <motion.div
              className="mb-12 text-center sm:mb-16"
              initial="hidden"
              transition={{ duration: 0.6, ease: "easeOut" }}
              variants={fadeUp}
              viewport={{ once: true }}
              whileInView="visible"
            >
              <span className="font-mono text-muted-foreground text-xs uppercase tracking-wider">
                Our Values
              </span>
              <h2 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl">
                What we stand for
              </h2>
            </motion.div>

            <motion.div
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              initial="hidden"
              transition={{ duration: 0.6, ease: "easeOut" }}
              variants={staggerContainer}
              viewport={{ once: true, margin: "-50px" }}
              whileInView="visible"
            >
              {[
                {
                  icon: Heart,
                  title: "Dignity First",
                  description:
                    "Every worker deserves respect and fair compensation. We built Bitwork to ensure informal workers get the recognition they deserve.",
                },
                {
                  icon: Shield,
                  title: "Trust & Safety",
                  description:
                    "Verified profiles, transparent ratings, and secure transactions create a safe environment for everyone.",
                },
                {
                  icon: Globe,
                  title: "Local First",
                  description:
                    "We strengthen communities by connecting neighbors. Local work means less travel, lower costs, and stronger bonds.",
                },
                {
                  icon: Lightbulb,
                  title: "Innovation",
                  description:
                    "Voice booking, AI assistance, and multi-language support make our platform accessible to everyone.",
                },
                {
                  icon: Target,
                  title: "Zero Commission",
                  description:
                    "Workers keep 100% of their earnings. No hidden fees, no exploitation—just fair exchange.",
                },
                {
                  icon: Users,
                  title: "Inclusion",
                  description:
                    "No registration barriers. Anyone with skills can join, regardless of formal education or business status.",
                },
              ].map((value) => (
                <motion.div
                  className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 sm:p-8"
                  key={value.title}
                  variants={fadeUp}
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary transition-colors duration-300 group-hover:bg-accent">
                    <value.icon className="h-6 w-6 text-foreground transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <h3 className="mb-3 font-semibold text-lg">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <motion.div
                initial="hidden"
                transition={{ duration: 0.7, ease: "easeOut" }}
                variants={fadeIn}
                viewport={{ once: true }}
                whileInView="visible"
              >
                <div className="relative rounded-2xl border border-border bg-secondary/50 p-8 sm:p-12">
                  <div className="mb-4 flex justify-between font-mono text-[10px] text-muted-foreground uppercase">
                    <span>Our Story</span>
                    <span>Est. 2024</span>
                  </div>
                  <blockquote className="font-serif text-2xl italic leading-relaxed sm:text-3xl">
                    &ldquo;We started Bitwork because we saw talented workers
                    struggling to find fair opportunities, and communities
                    desperate for reliable local services.&rdquo;
                  </blockquote>
                  <div className="mt-6 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent" />
                    <div>
                      <p className="font-medium">Founding Team</p>
                      <p className="text-muted-foreground text-sm">
                        Bitwork Network
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial="hidden"
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                variants={fadeUp}
                viewport={{ once: true }}
                whileInView="visible"
              >
                <span className="font-mono text-muted-foreground text-xs uppercase tracking-wider">
                  The Journey
                </span>
                <h2 className="mt-4 mb-6 font-serif text-3xl leading-tight sm:text-4xl">
                  From idea to impact
                </h2>
                <div className="space-y-6">
                  {[
                    {
                      year: "2024",
                      title: "The Beginning",
                      description:
                        "Bitwork was founded with a simple mission: make local skill exchange fair and accessible.",
                    },
                    {
                      year: "2025",
                      title: "Growing Community",
                      description:
                        "Thousands of workers and customers joined, completing tens of thousands of jobs across communities.",
                    },
                    {
                      year: "Future",
                      title: "Scaling Impact",
                      description:
                        "We're expanding to more cities, adding new features, and reaching more underserved communities.",
                    },
                  ].map((milestone, index) => (
                    <div className="flex gap-4" key={milestone.year}>
                      <div className="flex shrink-0 flex-col items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-mono text-primary-foreground text-xs">
                          {index + 1}
                        </div>
                        {index < 2 && (
                          <div className="mt-2 h-full w-px bg-border" />
                        )}
                      </div>
                      <div className="pb-6">
                        <span className="font-mono text-muted-foreground text-xs">
                          {milestone.year}
                        </span>
                        <h3 className="mt-1 font-semibold text-lg">
                          {milestone.title}
                        </h3>
                        <p className="mt-1 text-muted-foreground text-sm">
                          {milestone.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Team/Recognition Section */}
        <section className="bg-secondary/30 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <motion.div
              className="text-center"
              initial="hidden"
              transition={{ duration: 0.6, ease: "easeOut" }}
              variants={fadeUp}
              viewport={{ once: true }}
              whileInView="visible"
            >
              <span className="font-mono text-muted-foreground text-xs uppercase tracking-wider">
                Recognition
              </span>
              <h2 className="mt-4 mb-12 font-serif text-3xl leading-tight sm:mb-16 sm:text-4xl">
                Trusted by the community
              </h2>

              <motion.div
                className="grid gap-6 sm:grid-cols-3"
                initial="hidden"
                transition={{ duration: 0.6, ease: "easeOut" }}
                variants={staggerContainer}
                viewport={{ once: true, margin: "-50px" }}
                whileInView="visible"
              >
                {[
                  {
                    icon: Award,
                    title: "Best Social Impact",
                    subtitle: "Startup Awards 2024",
                  },
                  {
                    icon: Users,
                    title: "10,000+ Workers",
                    subtitle: "Earning Dignified Income",
                  },
                  {
                    icon: Shield,
                    title: "99.8% Safety",
                    subtitle: "Verified Transactions",
                  },
                ].map((item) => (
                  <motion.div
                    className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5"
                    key={item.title}
                    variants={fadeUp}
                  >
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary transition-colors duration-300 group-hover:bg-accent">
                      <item.icon className="h-6 w-6 text-foreground" />
                    </div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="mt-1 text-muted-foreground text-sm">
                      {item.subtitle}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </main>
    </SmoothScroll>
  );
}

export default function AboutPage() {
  return (
    <OnboardingProvider>
      <AboutPageContent />
    </OnboardingProvider>
  );
}
