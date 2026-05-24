"use client";

import { useTaskProgress } from "@/hooks/use-task-progress";

import {
  getUpcomingItems,
  getKappaProgress,
  getRemainingKappaTasks,
  getTraderProgress,
  getRecommendedTasks,
} from "@/lib/item-intelligence";

export default function HomePage() {
  const { completedTasks } =
    useTaskProgress();

  const upcomingItems =
    getUpcomingItems(completedTasks);

  const kappaProgress =
    getKappaProgress(completedTasks);

  const remainingKappaTasks =
    getRemainingKappaTasks(
      completedTasks
    ).slice(0, 5);

  const traderProgress =
    getTraderProgress(
      completedTasks
    );

  const recommendedTasks =
    getRecommendedTasks(
      completedTasks
    );

  return (
    <div className="min-h-screen bg-background p-4 pb-28 text-white">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <p className="text-sm text-zinc-500">
            Escape From Tarkov Companion
          </p>

          <h1 className="text-3xl font-bold tracking-tight">
            TarkIntel
          </h1>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-sm text-zinc-500">
              Tasks Completed
            </p>

            <h2 className="mt-2 text-2xl font-bold text-green-400">
              {completedTasks.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-sm text-zinc-500">
              Kappa Progress
            </p>

            <h2 className="mt-2 text-2xl font-bold text-yellow-400">
              {kappaProgress.percentage}%
            </h2>
          </div>
        </div>

        {/* Upcoming Needed Items */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Needed Soon
            </h2>

            <span className="text-sm text-zinc-500">
              Progression Forecast
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {upcomingItems.map(
              ([item, amount], index) => (
                <div
                  key={`${item}-${amount}-${index}`}
                  className="flex items-center justify-between rounded-xl bg-zinc-900/50 p-3"
                >
                  <div>
                    <h3 className="font-medium">
                      {typeof item === "string"
                        ? item
                        : item?.name}
                    </h3>

                    <p className="text-sm text-zinc-500">
                      Needed for future quests
                    </p>
                  </div>

                  <div className="rounded-full bg-green-500/15 px-3 py-1 text-xs font-medium text-green-400">
                    x{amount}
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Remaining Kappa Tasks */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Remaining Kappa Tasks
            </h2>

            <span className="text-sm text-zinc-500">
              Endgame Progression
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {remainingKappaTasks.map(
              (task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-xl bg-zinc-900/50 p-3"
                >
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
              )
            )}
          </div>
        </div>

        {/* Trader Progress */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Trader Progress
            </h2>

            <span className="text-sm text-zinc-500">
              Progression Breakdown
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {traderProgress.map((trader) => (
              <div
                key={trader.trader}
                className="rounded-xl bg-zinc-900/50 p-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">
                      {trader.trader}
                    </h3>

                    <p className="text-sm text-zinc-500">
                      {trader.completed} /{" "}
                      {trader.total} Tasks
                    </p>
                  </div>

                  <div className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-medium text-blue-400">
                    {trader.percentage}%
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-blue-400 transition-all"
                    style={{
                      width: `${trader.percentage}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Next Tasks */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Recommended Next Tasks
            </h2>

            <span className="text-sm text-zinc-500">
              Smart Progression
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {recommendedTasks.map((task) => (
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

                  <div className="flex gap-2">
                    {task.kappaRequired && (
                      <div className="rounded-full bg-yellow-500/15 px-3 py-1 text-xs font-medium text-yellow-400">
                        KAPPA
                      </div>
                    )}

                    {task.requiredItems?.some(
                      (item) => item.foundInRaid
                    ) && (
                      <div className="rounded-full bg-green-500/15 px-3 py-1 text-xs font-medium text-green-400">
                        FIR
                      </div>
                    )}
                  </div>
                </div>

                {/* Objectives Preview */}
                <div className="mt-3 flex flex-col gap-2">
                  {task.objectives
                    .slice(0, 2)
                    .map((objective) => (
                      <div
                        key={objective}
                        className="rounded-lg bg-black/20 px-3 py-2 text-sm text-zinc-400"
                      >
                        {objective}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Raid Mode */}
        <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-green-400">
                Raid Mode
              </h2>

              <p className="text-sm text-zinc-400">
                Fast item lookup during raids
              </p>
            </div>

            <button className="rounded-xl bg-green-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-green-400">
              Launch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}