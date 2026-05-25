"use client";

import {
  useEffect,
  useState,
} from "react";

import { useAuth } from "@/components/auth-provider";

import { useTaskProgress } from "@/hooks/use-task-progress";

import {
  getKappaProgress,
  getTraderProgress,
  getRemainingKappaTasks,
} from "@/lib/item-intelligence";

import { TarkovTask } from "@/types/task";

export default function ProfilePage() {
  const { user, profile } =
    useAuth();

  const {
    completedTasks,
    loaded,
  } = useTaskProgress();

  /*
    LIVE TASKS
  */

  const [tasks, setTasks] =
    useState<TarkovTask[]>(
      []
    );

  const [loadingTasks, setLoadingTasks] =
    useState(true);

  /*
    LOAD LIVE TASKS
  */

  useEffect(() => {
    async function loadTasks() {
      try {
        const response =
          await fetch(
            "/api/tasks"
          );

        const data =
          await response.json();

        setTasks(data);
      } catch (error) {
        console.error(
          "FAILED TO LOAD TASKS:",
          error
        );
      } finally {
        setLoadingTasks(false);
      }
    }

    loadTasks();
  }, []);

  /*
    LOADING
  */

  if (
    !loaded ||
    loadingTasks
  ) {
    return (
      <div className="min-h-screen p-4 text-white">
        <div className="glass-card rounded-3xl p-6">
          <h1 className="text-2xl font-bold">
            Syncing Profile...
          </h1>

          <p className="mt-2 text-zinc-400">
            Loading progression
            data.
          </p>
        </div>
      </div>
    );
  }

  /*
    AUTH
  */

  if (!user || !profile) {
    return (
      <div className="min-h-screen p-4 text-white">
        <div className="glass-card rounded-[2rem] p-6">
          <h1 className="text-3xl font-black">
            Not Logged In
          </h1>

          <p className="mt-3 text-zinc-400">
            Login with Discord to
            access your TarkIntel
            profile and cloud
            progression.
          </p>
        </div>
      </div>
    );
  }

  /*
    LIVE ANALYTICS
  */

  const kappaProgress =
    getKappaProgress(
      tasks,
      completedTasks
    );

  const traderProgress =
    getTraderProgress(
      tasks,
      completedTasks
    );

  const remainingKappaTasks =
    getRemainingKappaTasks(
      tasks,
      completedTasks
    );

  return (
    <div className="min-h-screen p-4 pb-28 text-white">
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

            {/* Profile Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-wide text-zinc-500">
                  Tasks
                </p>

                <h2 className="mt-2 text-3xl font-black text-primary">
                  {
                    completedTasks.length
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

        {/* Progression Overview */}
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

          {/* Kappa Bar */}
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
          </div>

          <div className="mt-6 flex flex-col gap-4">
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

        {/* Remaining Kappa Tasks */}
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
              ENDGAME
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            {remainingKappaTasks
              .slice(0, 10)
              .map((task) => (
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
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}