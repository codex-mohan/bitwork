"use client";

import { createContext, type ReactNode, useContext, useState } from "react";
import { OnboardingModal } from "./onboarding-modal";

interface OnboardingContextType {
  isOpen: boolean;
  openOnboarding: (mode?: "signup" | "signin") => void;
  closeOnboarding: () => void;
  initialMode: "signup" | "signin";
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return context;
}

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialMode, setInitialMode] = useState<"signup" | "signin">("signup");

  const openOnboarding = (mode: "signup" | "signin" = "signup") => {
    setInitialMode(mode);
    setIsOpen(true);
  };

  const closeOnboarding = () => setIsOpen(false);

  return (
    <OnboardingContext.Provider
      value={{ isOpen, openOnboarding, closeOnboarding, initialMode }}
    >
      {children}
      {isOpen && <OnboardingModal initialMode={initialMode} />}
    </OnboardingContext.Provider>
  );
}
