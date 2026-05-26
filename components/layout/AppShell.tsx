import { ReactNode } from "react";

import { DesktopSidebar } from "@/components/layout/DesktopSidebar";

import { MobileNav } from "@/components/mobile-nav";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({
  children,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-white">
      <div className="mx-auto flex w-full max-w-[1600px] gap-6 p-4">
        {/* Desktop Sidebar */}
        <div className="hidden w-[280px] shrink-0 lg:block">
          <DesktopSidebar />
        </div>

        {/* Main Content */}
        <main className="min-w-0 flex-1">
          {children}
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
}