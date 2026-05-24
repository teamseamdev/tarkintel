"use client";

import { useAuth } from "@/components/auth-provider";

import { useTaskProgress } from "@/hooks/use-task-progress";

import {
  getKappaProgress,
  getTraderProgress,
  getRemainingKappaTasks,
} from "@/lib/item-intelligence";

export default function ProfilePage() {
  const { user, profile } =
    useAuth();

  const { completedTasks } =
    useTaskProgress();

  if (!user || !profile) {
    return (
      <div className="min-h-screen p-4 text-white">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h1 className="text-2xl font-bold">
            Not Logged In
          </h1>

          <p className="mt-2 text-zinc-400">
            Login with Discord to
            access your profile.
          </p>
        </div>
      </div>
    );
  }

  const kappaProgress =
    getKappaProgress(
      completedTasks
    );

  const traderProgress =
    getTraderProgress(
      completedTasks
    );

  const remainingKappaTasks =
    getRemainingKappaTasks(
      completedTasks
    );

  return (
    <div className="min-h-screen p-4 pb-28 text-white">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-4">
            <img
              src={
                user.user_metadata
                  ?.avatar_url
              }
              alt="Avatar"
              className="h-20 w-20 rounded-full border border-zinc-700"
            />

            <div>
              <h1 className="text-3xl font-bold">
                {
                  user
                    .user_metadata
                    ?.full_name
                }
              </h1>

              <p className="mt-1 text-zinc-400">
                TarkIntel Profile
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-sm text-zinc-500">
              Tasks Completed
            </p>

            <h2 className="mt-2 text-3xl font-bold text-green-400">
              {completedTasks.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-sm text-zinc-500">
              Kappa Progress
            </p>

            <h2 className="mt-2 text-3xl font-bold text-yellow-400">
              {
                kappaProgress.percentage
              }
              %
            </h2>
          </div>
        </div>

        {/* Trader Progress */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Trader Progress
            </h2>

            <span className="text-sm text-zinc-500">
              Overall Progression
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-4">
            {traderProgress.map(
              (trader) => (
                <div
                  key={trader.trader}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium">
                      {
                        trader.trader
                      }
                    </span>

                    <span className="text-sm text-zinc-400">
                      {
                        trader.completed
                      }
                      /
                      {trader.total}
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-blue-400"
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

        {/* Remaining Kappa */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Remaining Kappa Tasks
            </h2>

            <span className="text-sm text-zinc-500">
              {
                remainingKappaTasks.length
              }{" "}
              Remaining
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {remainingKappaTasks
              .slice(0, 10)
              .map((task) => (
                <div
                  key={task.id}
                  className="rounded-xl bg-zinc-900/50 p-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">
                        {task.name}
                      </h3>

                      <p className="text-sm text-zinc-500">
                        {task.trader}
                      </p>
                    </div>

                    <div className="rounded-full bg-yellow-500/15 px-3 py-1 text-xs font-medium text-yellow-400">
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