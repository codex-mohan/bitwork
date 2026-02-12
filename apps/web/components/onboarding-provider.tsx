"use client";

import { createContext, type ReactNode, useContext, useState } from "react";
import { OnboardingModal } from "./onboarding-modal";

interface OnboardingContextType {
  isOpen: boolean;
  openOnboarding: () => void;
  closeOnboarding: () => void;
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

  const openOnboarding = () => setIsOpen(true);
  const closeOnboarding = () => setIsOpen(false);

  return (
    <OnboardingContext.Provider
      value={{ isOpen, openOnboarding, closeOnboarding }}
    >
      {children}
      {isOpen && <OnboardingModal />}
    </OnboardingContext.Provider>
  );
}
