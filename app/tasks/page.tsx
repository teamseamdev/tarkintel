"use client";

import Link from "next/link";

import { allTasks } from "@/data/tasks";

import { useTaskProgress } from "@/hooks/use-task-progress";

import { sortTasksByPriority } from "@/lib/task-priority";

export default function TasksPage() {
  const {
    toggleTask,
    isTaskCompleted,
    completedTasks,
    loaded,
  } = useTaskProgress();

  const completedCount =
    completedTasks.length;

  if (!loaded) {
    return (
      <div className="min-h-screen bg-background p-4 text-white">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h1 className="text-2xl font-bold">
            Syncing Progress...
          </h1>

          <p className="mt-2 text-zinc-400">
            Loading cloud progression.
          </p>
        </div>
      </div>
    );
  }

  const sortedTasks =
    sortTasksByPriority(
      allTasks,
      completedTasks
    );

  return (
    <div className="min-h-screen bg-background p-4 pb-28 text-white">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <p className="text-sm text-zinc-500">
            Progression Tracker
          </p>

          <h1 className="text-3xl font-bold tracking-tight">
            Tasks
          </h1>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-sm text-zinc-500">
              Completed
            </p>

            <h2 className="mt-2 text-2xl font-bold text-green-400">
              {completedCount}
            </h2>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-sm text-zinc-500">
              Remaining
            </p>

            <h2 className="mt-2 text-2xl font-bold text-yellow-400">
              {
                allTasks.filter(
                  (task) =>
                    !isTaskCompleted(
                      task.id
                    )
                ).length
              }
            </h2>
          </div>
        </div>

        {/* Smart Sorting Banner */}
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4">
          <h2 className="text-lg font-semibold text-blue-400">
            Smart Task Priority
          </h2>

          <p className="mt-2 text-sm text-zinc-400">
            Tasks are prioritized
            automatically by:
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <div className="rounded-full bg-green-500/15 px-3 py-1 text-xs font-medium text-green-400">
              Incomplete First
            </div>

            <div className="rounded-full bg-yellow-500/15 px-3 py-1 text-xs font-medium text-yellow-400">
              Kappa Priority
            </div>

            <div className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-medium text-blue-400">
              Early Progression
            </div>
          </div>
        </div>

        {/* Task Cards */}
        <div className="flex flex-col gap-4">
          {sortedTasks.map(
            (task) => {
              const completed =
                isTaskCompleted(
                  task.id
                );

              return (
                <Link
                  href={`/tasks/${task.id}`}
                  key={task.id}
                >
                  <div
                    className={`rounded-2xl border p-4 transition hover:border-green-500/30 hover:bg-zinc-900/50 ${
                      completed
                        ? "border-green-500/30 bg-green-500/5 opacity-70"
                        : "border-border bg-card"
                    }`}
                  >
                    {/* Top */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2
                            className={`text-lg font-semibold ${
                              completed
                                ? "text-green-400 line-through"
                                : ""
                            }`}
                          >
                            {task.name}
                          </h2>

                          {!completed && (
                            <div className="rounded-full bg-blue-500/15 px-2 py-1 text-[10px] font-bold text-blue-400">
                              PRIORITY
                            </div>
                          )}
                        </div>

                        <p className="text-sm text-zinc-500">
                          {
                            task.trader
                          }
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {task.kappaRequired && (
                          <div className="rounded-full bg-yellow-500/15 px-3 py-1 text-xs font-medium text-yellow-400">
                            KAPPA
                          </div>
                        )}

                        <div
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            completed
                              ? "bg-green-500/15 text-green-400"
                              : "bg-yellow-500/15 text-yellow-400"
                          }`}
                        >
                          {completed
                            ? "COMPLETED"
                            : "ACTIVE"}
                        </div>
                      </div>
                    </div>

                    {/* Objectives */}
                    <div className="mt-4">
                      <p className="mb-2 text-sm font-medium text-zinc-400">
                        Objectives
                      </p>

                      <div className="flex flex-col gap-2">
                        {task.objectives
                          .slice(0, 2)
                          .map(
                            (
                              objective
                            ) => (
                              <div
                                key={
                                  objective
                                }
                                className="rounded-lg bg-zinc-900/50 px-3 py-2 text-sm text-zinc-300"
                              >
                                {
                                  objective
                                }
                              </div>
                            )
                          )}
                      </div>
                    </div>

                    {/* Task Metadata */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {task.levelRequired && (
                        <div className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
                          LV{" "}
                          {
                            task.levelRequired
                          }
                        </div>
                      )}

                      {task.maps?.map(
                        (map) => (
                          <div
                            key={map}
                            className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300"
                          >
                            {map}
                          </div>
                        )
                      )}

                      {task.requiredItems?.some(
                        (item) =>
                          item.foundInRaid
                      ) && (
                        <div className="rounded-full bg-green-500/15 px-3 py-1 text-xs font-medium text-green-400">
                          FIR
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <button
                      onClick={(
                        e
                      ) => {
                        e.preventDefault();

                        toggleTask(
                          task.id
                        );
                      }}
                      className={`mt-5 w-full rounded-xl py-3 font-medium transition ${
                        completed
                          ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                          : "bg-green-500 text-black hover:bg-green-400"
                      }`}
                    >
                      {completed
                        ? "Mark Incomplete"
                        : "Mark Complete"}
                    </button>
                  </div>
                </Link>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}