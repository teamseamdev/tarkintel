import { ReactNode } from "react";

import { DesktopSidebar } from "@/components/layout/DesktopSidebar";

import { MobileNav } from "@/components/mobile-nav";

import { FeedbackButton } from "@/components/feedback/FeedbackButton";

import { ChangelogButton } from "@/components/changelog/ChangelogButton";

import { BetaBanner } from "@/components/beta/BetaBanner";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({
  children,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-white">
      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />

        <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] gap-6 p-4 pt-[max(env(safe-area-inset-top),1rem)]">
        {/* Desktop Sidebar */}
        <div className="hidden w-[280px] shrink-0 lg:block">
          <DesktopSidebar />
        </div>

        {/* Main Content */}
        <main className="min-w-0 flex-1">
          {/* BETA BANNER */}
          <BetaBanner />

          {children}
        </main>
      </div>

      {/* GLOBAL CHANGELOG */}
      <ChangelogButton />

      {/* GLOBAL FEEDBACK */}
      <FeedbackButton />

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
}