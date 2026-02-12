"use client";

import { CTASection } from "@/components/landing/cta-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { HeroSection } from "@/components/landing/hero-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { WorkflowSection } from "@/components/landing/workflow-section";
import { OnboardingProvider } from "@/components/onboarding-provider";
import { SmoothScroll } from "@/components/smooth-scroll";

export default function Home() {
  return (
    <OnboardingProvider>
      <SmoothScroll>
        <main className="min-h-screen bg-background">
          <Header />
          <HeroSection />
          <WorkflowSection />
          <FeaturesSection />
          <TestimonialsSection />
          <CTASection />
          <Footer />
        </main>
      </SmoothScroll>
    </OnboardingProvider>
  );
}
