"use client";

import {
  Globe,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
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
      staggerChildren: 0.1,
    },
  },
};

function ContactPageContent() {
  const { isOpen } = useOnboarding();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSubmitted(true);
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
                Get in Touch
              </span>
              <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl md:text-6xl">
                We&apos;d love to
                <br />
                <span className="text-primary">hear from you</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Have questions about Bitwork? Want to partner with us? Or just
                want to say hello? We&apos;re here to help.
              </p>
            </motion.div>
          </div>

          {/* Decorative gradient */}
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-linear-to-b from-primary/10 via-primary/5 to-transparent blur-3xl" />
        </section>

        {/* Contact Info Cards */}
        <section className="py-8 sm:py-12">
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
                {
                  icon: Mail,
                  title: "Email Us",
                  value: "hello@bitwork.network",
                  description: "We respond within 24 hours",
                },
                {
                  icon: Phone,
                  title: "Call Us",
                  value: "+91 98765 43210",
                  description: "Mon - Fri, 9am - 6pm IST",
                },
                {
                  icon: MapPin,
                  title: "Visit Us",
                  value: "Bangalore, India",
                  description: "Remote-first team, always online",
                },
              ].map((contact) => (
                <motion.div
                  className="group rounded-2xl border border-border bg-card p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 sm:p-8"
                  key={contact.title}
                  variants={fadeUp}
                >
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary transition-colors duration-300 group-hover:bg-accent">
                    <contact.icon className="h-6 w-6 text-foreground transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <h3 className="font-semibold">{contact.title}</h3>
                  <p className="mt-1 font-mono text-primary text-sm">
                    {contact.value}
                  </p>
                  <p className="mt-2 text-muted-foreground text-xs">
                    {contact.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="bg-secondary/30 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Contact Info Text */}
              <motion.div
                initial="hidden"
                transition={{ duration: 0.7, ease: "easeOut" }}
                variants={fadeUp}
                viewport={{ once: true }}
                whileInView="visible"
              >
                <span className="font-mono text-muted-foreground text-xs uppercase tracking-wider">
                  Send us a message
                </span>
                <h2 className="mt-4 mb-6 font-serif text-3xl leading-tight sm:text-4xl">
                  Let&apos;s start a conversation
                </h2>
                <p className="mb-8 text-muted-foreground">
                  Whether you&apos;re a worker looking for opportunities, a
                  customer seeking services, or a potential partner, we&apos;d
                  love to hear from you. Fill out the form and we&apos;ll get
                  back to you as soon as possible.
                </p>

                <div className="space-y-6">
                  {[
                    {
                      icon: MessageSquare,
                      title: "For Workers",
                      description:
                        "Join thousands of workers finding fair opportunities on Bitwork.",
                    },
                    {
                      icon: Users,
                      title: "For Customers",
                      description:
                        "Find reliable local service providers for all your needs.",
                    },
                    {
                      icon: Globe,
                      title: "For Partners",
                      description:
                        "Partner with us to bring fair work opportunities to more communities.",
                    },
                  ].map((item) => (
                    <div
                      className="flex items-start gap-4 rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:shadow-md"
                      key={item.title}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary transition-colors duration-300">
                        <item.icon className="h-5 w-5 text-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-muted-foreground text-sm">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial="hidden"
                transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                variants={fadeUp}
                viewport={{ once: true }}
                whileInView="visible"
              >
                <div className="rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-8">
                  {submitted ? (
                    <motion.div
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center py-12 text-center"
                      initial={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <svg
                          aria-label="Success"
                          className="h-8 w-8 text-green-600"
                          fill="none"
                          role="img"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <title>Success Checkmark</title>
                          <path
                            d="M5 13l4 4L19 7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <h3 className="mb-2 font-serif text-2xl">
                        Message Sent!
                      </h3>
                      <p className="text-muted-foreground">
                        Thank you for reaching out. We&apos;ll get back to you
                        within 24 hours.
                      </p>
                      <button
                        className="mt-6 rounded-lg border border-border px-6 py-2 text-sm transition-colors hover:bg-secondary"
                        onClick={() => {
                          setSubmitted(false);
                          setFormData({
                            name: "",
                            email: "",
                            subject: "",
                            message: "",
                          });
                        }}
                        type="button"
                      >
                        Send another message
                      </button>
                    </motion.div>
                  ) : (
                    <form className="space-y-5" onSubmit={handleSubmit}>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label
                            className="font-mono text-muted-foreground text-xs uppercase tracking-wider"
                            htmlFor="name"
                          >
                            Your Name
                          </label>
                          <input
                            className="w-full rounded-lg border border-border bg-secondary/30 px-4 py-3 text-sm transition-all duration-300 focus:border-primary focus:bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            id="name"
                            name="name"
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                            type="text"
                            value={formData.name}
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            className="font-mono text-muted-foreground text-xs uppercase tracking-wider"
                            htmlFor="email"
                          >
                            Email Address
                          </label>
                          <input
                            className="w-full rounded-lg border border-border bg-secondary/30 px-4 py-3 text-sm transition-all duration-300 focus:border-primary focus:bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            id="email"
                            name="email"
                            onChange={handleChange}
                            placeholder="john@example.com"
                            required
                            type="email"
                            value={formData.email}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label
                          className="font-mono text-muted-foreground text-xs uppercase tracking-wider"
                          htmlFor="subject"
                        >
                          Subject
                        </label>
                        <select
                          className="w-full rounded-lg border border-border bg-secondary/30 px-4 py-3 text-sm transition-all duration-300 focus:border-primary focus:bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                          id="subject"
                          name="subject"
                          onChange={handleChange}
                          required
                          value={formData.subject}
                        >
                          <option value="">Select a topic</option>
                          <option value="general">General Inquiry</option>
                          <option value="worker">Worker Support</option>
                          <option value="customer">Customer Support</option>
                          <option value="partnership">Partnership</option>
                          <option value="feedback">Feedback</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label
                          className="font-mono text-muted-foreground text-xs uppercase tracking-wider"
                          htmlFor="message"
                        >
                          Message
                        </label>
                        <textarea
                          className="min-h-[140px] w-full resize-y rounded-lg border border-border bg-secondary/30 px-4 py-3 text-sm transition-all duration-300 focus:border-primary focus:bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                          id="message"
                          name="message"
                          onChange={handleChange}
                          placeholder="Tell us how we can help you..."
                          required
                          rows={6}
                          value={formData.message}
                        />
                      </div>

                      <button
                        className="group flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground text-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 active:translate-y-0 disabled:pointer-events-none disabled:opacity-50"
                        disabled={isSubmitting}
                        type="submit"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                            Send Message
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 sm:py-24">
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
                FAQ
              </span>
              <h2 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl">
                Frequently Asked Questions
              </h2>
            </motion.div>

            <motion.div
              className="mx-auto mt-12 max-w-3xl space-y-4"
              initial="hidden"
              transition={{ duration: 0.6, ease: "easeOut" }}
              variants={staggerContainer}
              viewport={{ once: true, margin: "-50px" }}
              whileInView="visible"
            >
              {[
                {
                  question: "How do I sign up as a worker?",
                  answer:
                    "Simply click 'Join Now' on the homepage, create an account, and start adding your skills and services. No formal registration required.",
                },
                {
                  question: "Is Bitwork free to use?",
                  answer:
                    "Yes! Bitwork is completely free for workers. We don't charge any commission on your earnings. Customers only pay for the services they book.",
                },
                {
                  question: "How do you ensure safety and trust?",
                  answer:
                    "We verify user identities, maintain transparent ratings and reviews, and offer secure payment processing. All transactions are tracked for accountability.",
                },
                {
                  question: "Can I use Bitwork without a smartphone?",
                  answer:
                    "Yes! Our voice booking feature allows users to interact hands-free. You can also access Bitwork via any web browser on a computer.",
                },
              ].map((faq) => (
                <motion.div
                  className="rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-md"
                  key={faq.question}
                  variants={fadeUp}
                >
                  <h3 className="font-semibold">{faq.question}</h3>
                  <p className="mt-2 text-muted-foreground text-sm">
                    {faq.answer}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <Footer />
      </main>
    </SmoothScroll>
  );
}

export default function ContactPage() {
  return (
    <OnboardingProvider>
      <ContactPageContent />
    </OnboardingProvider>
  );
}
