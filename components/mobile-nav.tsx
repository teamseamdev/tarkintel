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
  Bell,
  Menu,
  MessageSquare,
  X,
} from "lucide-react";

import {
  navigationItems,
} from "@/lib/navigation";

import {
  ChangelogModal,
} from "@/components/changelog/ChangelogButton";

import {
  FeedbackModal,
} from "@/components/feedback/FeedbackButton";

export function MobileNav() {
  const pathname =
    usePathname();

  const router =
    useRouter();

  const [
    open,
    setOpen,
  ] = useState(false);

  const [
    changelogOpen,
    setChangelogOpen,
  ] = useState(false);

  const [
    feedbackOpen,
    setFeedbackOpen,
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
    <>
      <div className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#0B0E12]/95 pt-[env(safe-area-inset-top)] backdrop-blur-xl supports-[backdrop-filter]:bg-[#0B0E12]/80 lg:hidden">
        <div className="mx-auto max-w-[1600px] px-4">
          <div className="flex items-center justify-between py-3">
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
              BETA
            </div>
          </div>

          {open && (
            <div className="border-t border-white/5 pb-4">
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

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setChangelogOpen(true);
                  }}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-blue-500/20 bg-blue-500/10 px-4 py-3 text-sm font-semibold text-blue-300 transition hover:bg-blue-500/15"
                >
                  <Bell size={18} />

                  <span>
                    Updates
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setFeedbackOpen(true);
                  }}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm font-semibold text-primary transition hover:bg-primary/15"
                >
                  <MessageSquare size={18} />

                  <span>
                    Feedback
                  </span>
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400" />

                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">
                    Public Beta
                  </p>
                </div>

                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                  v0.1.4
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="h-[72px] lg:hidden" />

      <ChangelogModal
        open={
          changelogOpen
        }
        onClose={() =>
          setChangelogOpen(
            false
          )
        }
      />

      <FeedbackModal
        open={
          feedbackOpen
        }
        onClose={() =>
          setFeedbackOpen(
            false
          )
        }
      />
    </>
  );
}