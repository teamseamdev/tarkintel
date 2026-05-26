"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import {
  navigationItems,
} from "@/lib/navigation";

export function DesktopSidebar() {
  const pathname =
    usePathname();

  return (
    <div className="glass-card sticky top-4 flex h-[calc(100vh-2rem)] flex-col rounded-[2rem] p-5">
      {/* Logo */}
      <div>
        <h1 className="text-3xl font-black text-white">
          TarkIntel
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          Tarkov Progression
          Intelligence
        </p>
      </div>

      {/* Navigation */}
      <div className="mt-10 flex flex-col gap-2">
        {navigationItems.map(
          (item) => {
            const Icon =
              item.icon;

            const active =
              pathname ===
              item.href;

            return (
              <Link
                key={
                  item.href
                }
                href={
                  item.href
                }
                className={`flex items-center gap-3 rounded-2xl px-4 py-4 transition-all duration-300 ${
                  active
                    ? "bg-gradient-to-r from-[#B8895A] to-[#D4A574] text-black"
                    : "text-zinc-400 hover:bg-white/[0.03] hover:text-white"
                }`}
              >
                <Icon
                  size={20}
                />

                <span className="font-medium">
                  {
                    item.label
                  }
                </span>
              </Link>
            );
          }
        )}
      </div>

      {/* Footer */}
      <div className="mt-auto rounded-2xl border border-white/5 bg-white/[0.03] p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
          LIVE STATUS
        </p>

        <div className="mt-3 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-400" />

          <p className="text-sm text-zinc-300">
            Tarkov.dev Connected
          </p>
        </div>
      </div>
    </div>
  );
}