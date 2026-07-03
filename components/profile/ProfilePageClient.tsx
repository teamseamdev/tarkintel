"use client";

import {
  useMemo,
} from "react";

import Link from "next/link";

import { ArrowRight, Sparkles } from "lucide-react";

import { useAuth } from "@/components/auth-provider";

import LoginButton from "@/components/login-button";

import { useTaskProgress } from "@/hooks/use-task-progress";

import {
  getKappaProgress,
  getTraderProgress,
  getRemainingKappaTasks,
} from "@/lib/profile-analytics";

import type {
  TarkovTask,
} from "@/types/task";

interface ProfilePageClientProps {
  tasks: TarkovTask[];
}

export function ProfilePageClient({
  tasks,
}: ProfilePageClientProps) {
  const {
    user,
    profile,
    loading:
      authLoading,
  } = useAuth();

  const {
    completedTasks,
    loaded,
  } = useTaskProgress();

  const safeCompletedTasks =
    completedTasks || [];

  const kappaProgress =
    useMemo(() => {
      return getKappaProgress(
        tasks,
        safeCompletedTasks
      );
    }, [
      tasks,
      safeCompletedTasks,
    ]);

  const traderProgress =
    useMemo(() => {
      return getTraderProgress(
        tasks,
        safeCompletedTasks
      );
    }, [
      tasks,
      safeCompletedTasks,
    ]);

  const remainingKappaTasks =
    useMemo(() => {
      return getRemainingKappaTasks(
        tasks,
        safeCompletedTasks
      );
    }, [
      tasks,
      safeCompletedTasks,
    ]);

  /*
    WAIT FOR BOTH AUTH
    AND PROGRESSION DATA
  */

  if (
    authLoading ||
    !loaded
  ) {
    return (
      <div className="min-h-screen p-4 pb-8 text-white">
        <div className="glass-card rounded-[2rem] p-6">
          <h1 className="text-2xl font-black">
            Loading Profile...
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            Syncing TarkIntel
            progression data.
          </p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen p-4 pb-8 text-white">
        <div className="glass-card rounded-[2rem] p-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-4xl">
            🔒
          </div>

          <h1 className="mt-6 text-4xl font-black">
            Login Required
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm text-zinc-400">
            Connect your Discord account
            to sync progression,
            track hideout upgrades,
            and access your TarkIntel
            profile across devices.
          </p>

          <div className="mt-8 flex justify-center">
            <LoginButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pb-8 text-white">
      <div className="flex flex-col gap-6">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-[2rem] glass-card p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-[#B8895A]/10 to-transparent" />

          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                <img
                  src={
                    user
                      .user_metadata
                      ?.avatar_url
                  }
                  alt="Avatar"
                  className="h-24 w-24 rounded-full border border-white/10 object-cover shadow-2xl"
                />

                <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-[#05070A] bg-green-400" />
              </div>

              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
                  Tactical Profile
                </p>

                <h1 className="text-gradient mt-2 text-4xl font-black tracking-tight">
                  {
                    user
                      .user_metadata
                      ?.full_name
                  }
                </h1>

                <p className="mt-2 text-sm text-zinc-400">
                  Persistent Tarkov
                  progression synced
                  across devices.
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <LoginButton />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-wide text-zinc-500">
                  Tasks
                </p>

                <h2 className="mt-2 text-3xl font-black text-primary">
                  {
                    safeCompletedTasks.length
                  }
                </h2>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-wide text-zinc-500">
                  Kappa
                </p>

                <h2 className="mt-2 text-3xl font-black text-yellow-400">
                  {
                    kappaProgress.percentage
                  }
                  %
                </h2>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-wide text-zinc-500">
                  Remaining
                </p>

                <h2 className="mt-2 text-3xl font-black text-blue-400">
                  {
                    remainingKappaTasks.length
                  }
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Catch-Up Setup */}
        <div className="glass-card rounded-[2rem] p-5">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <Sparkles className="size-6" />
              </div>

              <div>
                <h2 className="text-xl font-black sm:text-2xl">
                  New to TarkIntel but already mid-wipe?
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
                  Use Catch-Up Setup to quickly mark completed prerequisite
                  tasks based on quests you are currently working on.
                </p>
              </div>
            </div>

            <Link
              href="/profile/catch-up"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-black"
            >
              Start Catch-Up Setup
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        {/* Progression */}
        <div className="glass-card rounded-[2rem] p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black">
                Progression
                Overview
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Real-time progression
                analytics
              </p>
            </div>

            <div className="rounded-full bg-primary/15 px-4 py-2 text-xs font-semibold text-primary">
              LIVE SYNC
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-300">
                Kappa Progression
              </span>

              <span className="text-sm text-zinc-500">
                {
                  kappaProgress.completed
                }
                /
                {
                  kappaProgress.total
                }
              </span>
            </div>

            <div className="h-4 overflow-hidden rounded-full bg-black/40">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#B8895A] to-[#D4A574] transition-all duration-500"
                style={{
                  width: `${kappaProgress.percentage}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Scrollable Analytics */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* Trader Progress */}
          <div className="glass-card rounded-[2rem] p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black">
                  Trader Progress
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Progression analytics
                  by trader
                </p>
              </div>

              <div className="rounded-full bg-blue-500/15 px-4 py-2 text-xs font-semibold text-blue-400">
                {
                  traderProgress.length
                }{" "}
                TRADERS
              </div>
            </div>

            <div className="mt-6 max-h-[520px] overflow-y-auto pr-2 custom-scrollbar">
              <div className="flex flex-col gap-4">
                {traderProgress.map(
                  (trader) => (
                    <div
                      key={trader.trader}
                      className="rounded-2xl border border-white/5 bg-white/[0.03] p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold">
                            {
                              trader.trader
                            }
                          </h3>

                          <p className="mt-1 text-sm text-zinc-500">
                            {
                              trader.completed
                            }
                            /
                            {trader.total}{" "}
                            Tasks
                          </p>
                        </div>

                        <div className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-semibold text-blue-400">
                          {
                            trader.percentage
                          }
                          %
                        </div>
                      </div>

                      <div className="mt-4 h-3 overflow-hidden rounded-full bg-black/40">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-300 transition-all duration-500"
                          style={{
                            width: `${trader.percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Remaining Kappa */}
          <div className="glass-card rounded-[2rem] p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black">
                  Remaining Kappa
                  Tasks
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Endgame progression
                  objectives
                </p>
              </div>

              <div className="rounded-full bg-yellow-500/15 px-4 py-2 text-xs font-semibold text-yellow-400">
                {
                  remainingKappaTasks.length
                }{" "}
                LEFT
              </div>
            </div>

            <div className="mt-6 max-h-[520px] overflow-y-auto pr-2 custom-scrollbar">
              <div className="flex flex-col gap-3">
                {remainingKappaTasks.map(
                  (task) => (
                    <div
                      key={task.id}
                      className="glass-hover rounded-2xl border border-white/5 bg-white/[0.03] p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">
                            {task.name}
                          </h3>

                          <p className="mt-1 text-sm text-zinc-500">
                            {task.trader}
                          </p>
                        </div>

                        <div className="rounded-full bg-yellow-500/15 px-3 py-1 text-xs font-semibold text-yellow-400">
                          KAPPA
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
