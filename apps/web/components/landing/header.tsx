"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useOnboarding } from "@/components/onboarding-provider";

export function Header() {
  const { openOnboarding } = useOnboarding();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 animate-[fadeInDown_0.5s_ease-out_both] border-border/40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
          href="/"
        >
          <Image
            alt="Bitwork"
            className="h-7 w-7"
            height={24}
            priority
            src="/bitwork.svg"
            width={24}
          />
          <span className="font-serif text-lg tracking-tight">Bitwork</span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            className="font-mono text-muted-foreground text-xs uppercase tracking-wider transition-colors hover:text-foreground"
            href="#features"
          >
            Features
          </Link>
          <Link
            className="font-mono text-muted-foreground text-xs uppercase tracking-wider transition-colors hover:text-foreground"
            href="#workflow"
          >
            How It Works
          </Link>
          <Link
            className="font-mono text-muted-foreground text-xs uppercase tracking-wider transition-colors hover:text-foreground"
            href="#testimonials"
          >
            Stories
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button
            className="hidden rounded-full px-4 py-2 font-medium text-sm transition-all duration-300 hover:bg-secondary sm:block"
            onClick={() => openOnboarding("signin")}
            type="button"
          >
            Sign In
          </button>
          <button
            className="rounded-full bg-primary px-4 py-2 font-medium text-primary-foreground text-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 active:translate-y-0"
            onClick={() => openOnboarding("signup")}
            type="button"
          >
            Join Now
          </button>

          {/* Mobile menu toggle */}
          <button
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? "max-h-48 border-border/40 border-t" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col gap-1 px-4 py-3 sm:px-6">
          <Link
            className="rounded-lg px-3 py-2 font-mono text-muted-foreground text-xs uppercase tracking-wider transition-colors hover:bg-secondary hover:text-foreground"
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
          >
            Features
          </Link>
          <Link
            className="rounded-lg px-3 py-2 font-mono text-muted-foreground text-xs uppercase tracking-wider transition-colors hover:bg-secondary hover:text-foreground"
            href="#workflow"
            onClick={() => setMobileMenuOpen(false)}
          >
            How It Works
          </Link>
          <Link
            className="rounded-lg px-3 py-2 font-mono text-muted-foreground text-xs uppercase tracking-wider transition-colors hover:bg-secondary hover:text-foreground"
            href="#testimonials"
            onClick={() => setMobileMenuOpen(false)}
          >
            Stories
          </Link>
        </nav>
      </div>
    </header>
  );
}
