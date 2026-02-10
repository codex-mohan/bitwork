import { Button } from "@bitwork/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@bitwork/ui/components/dialog";
import { Briefcase, RefreshCw, ShieldCheck, Users, XIcon } from "lucide-react";
import Image from "next/image";

export function OnboardingModal() {
  return (
    <Dialog defaultOpen>
      <DialogContent
        className="flex max-h-[90vh] w-full max-w-5xl flex-col gap-0 overflow-hidden rounded-2xl bg-white p-0 sm:max-w-5xl"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Onboarding</DialogTitle>

        <div className="flex flex-none items-center justify-between border-gray-100 border-b px-6 py-4 md:px-10">
          <div className="flex flex-col">
            <span className="pb-1 font-semibold text-gray-900 text-sm">
              About Bitwork
            </span>
            <div className="h-0.5 w-full rounded-full bg-black" />
          </div>
          <button
            aria-label="Close"
            className="text-gray-400 transition-colors hover:text-gray-600"
            type="button"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
          <div className="relative hidden w-full items-center justify-center bg-gray-100 p-1.5 md:flex md:w-1/2">
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
          <div className="relative flex h-64 w-full items-center justify-center bg-gray-100 p-1.5 md:hidden">
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
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-700">
                      <Users className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h3 className="mb-1 font-semibold text-amber-700 text-sm">
                        Empower Informal Work
                      </h3>
                      <p className="text-gray-500 text-xs leading-relaxed">
                        Connects plumbers, students, and helpers with households
                        for specific tasks without needing a physical shop.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-700">
                      <Briefcase className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h3 className="mb-1 font-semibold text-amber-700 text-sm">
                        Task-Based Collaboration
                      </h3>
                      <p className="text-gray-500 text-xs leading-relaxed">
                        Work is exchanged as small, well-defined units like "fix
                        tap" or "design poster" rather than long-term contracts.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-700">
                      <ShieldCheck className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h3 className="mb-1 font-semibold text-amber-700 text-sm">
                        Transparent Trust
                      </h3>
                      <p className="text-gray-500 text-xs leading-relaxed">
                        Build a verifiable digital work history and reputation
                        based on completed contributions.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 pt-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-700">
                      <RefreshCw className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h3 className="mb-1 font-bold text-amber-700 text-sm">
                        Flexible Value Exchange
                      </h3>
                      <p className="text-gray-500 text-xs leading-relaxed">
                        Exchange tasks for money, time, or skill reciprocity
                        depending on context.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-6">
                  <Button className="h-12 w-full rounded-lg bg-amber-700 font-semibold text-base text-white shadow-amber-900/20 shadow-lg hover:bg-amber-800">
                    Join the Network
                  </Button>
                  <Button
                    className="h-10 w-full rounded-lg font-medium text-gray-500 hover:bg-gray-50"
                    variant="ghost"
                  >
                    Explore first
                  </Button>
                </div>

                <p className="pt-2 text-center text-[10px] text-gray-400 leading-tight">
                  Promotes dignity of labor, fair access to opportunities, and
                  inclusion for unregistered workers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
