"use client";

import Link from "next/link";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  useEffect,
} from "react";

import {
  navigationItems,
} from "@/lib/navigation";

export function MobileNav() {
  const pathname =
    usePathname();

  const router =
    useRouter();

  /*
    PREFETCH
    IMPORTANT ROUTES
  */

  useEffect(() => {
    for (const item of navigationItems) {
      router.prefetch(
        item.href
      );
    }
  }, [router]);

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/5 bg-[#0B0E12]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl supports-[backdrop-filter]:bg-[#0B0E12]/80 lg:hidden">
      {/* Beta Bar */}
      <div className="border-b border-white/5 px-4 py-2">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400" />

            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">
              TarkIntel Public Beta
            </p>
          </div>

          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">
            v0.1.2
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-3">
        {navigationItems.map(
          (item) => {
            const Icon =
              item.icon;

            const isActive =
              pathname ===
              item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                className={`relative flex min-w-[64px] flex-col items-center gap-1 rounded-2xl px-3 py-2 transition-all duration-300 ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-zinc-500 hover:bg-white/[0.03] hover:text-white"
                }`}
              >
                {/* Active Glow */}
                {isActive && (
                  <div className="absolute inset-0 rounded-2xl border border-primary/20" />
                )}

                <Icon
                  size={22}
                  className="relative z-10"
                />

                <span className="relative z-10 text-[11px] font-semibold">
                  {item.label}
                </span>
              </Link>
            );
          }
        )}
      </div>
    </div>
  );
}