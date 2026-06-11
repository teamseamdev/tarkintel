"use client";

import Link from "next/link";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  useEffect,
  useState,
} from "react";

import {
  Menu,
  X,
} from "lucide-react";

import {
  navigationItems,
} from "@/lib/navigation";

export function MobileNav() {
  const pathname =
    usePathname();

  const router =
    useRouter();

  const [
    open,
    setOpen,
  ] = useState(false);

  useEffect(() => {
    for (const item of navigationItems) {
      router.prefetch(
        item.href
      );
    }
  }, [router]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="sticky top-0 z-50 border-b border-white/5 bg-[#0B0E12]/95 backdrop-blur-xl supports-[backdrop-filter]:bg-[#0B0E12]/80 lg:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={() =>
            setOpen(
              (prev) =>
                !prev
            )
          }
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-white"
          aria-label="Toggle menu"
        >
          {open ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
          )}
        </button>

        <Link
          href="/"
          className="text-lg font-black tracking-tight text-white"
        >
          TarkIntel
        </Link>

        <div className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
          Beta
        </div>
      </div>

      {open && (
        <div className="border-t border-white/5 px-4 pb-4">
          <div className="mt-3 grid gap-2">
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
                    className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                      isActive
                        ? "border-primary/30 bg-primary/10 text-primary"
                        : "border-white/5 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    <Icon size={20} />

                    <span>
                      {item.label}
                    </span>
                  </Link>
                );
              }
            )}
          </div>

          <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400" />

              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">
                Public Beta
              </p>
            </div>

            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">
              v0.1.2
            </p>
          </div>
        </div>
      )}
    </div>
  );
}