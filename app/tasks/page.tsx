"use client";

import Link from "next/link";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useTaskProgress } from "@/hooks/use-task-progress";

import { sortTasksByPriority } from "@/lib/task-priority";

import { filterTasks } from "@/lib/filter-tasks";

import { buildProgressionState } from "@/lib/build-progression-state";

import { getLevelFromXP } from "@/lib/player-level";

import { TaskFilter } from "@/types/task-filter";

import { TarkovTask } from "@/types/task";

import { TaskOverview } from "@/components/tasks/TaskOverview";

export default function TasksPage() {
  const {
    toggleTask,
    isTaskCompleted,
    completedTasks,
    loaded,
  } = useTaskProgress();

  /*
    PLAYER LEVEL
  */

  const [
    playerLevel,
    setPlayerLevel,
  ] = useState<number>(() => {
    if (
      typeof window !==
      "undefined"
    ) {
      const saved =
        localStorage.getItem(
          "tarkintel-pmc-level"
        );

      if (saved) {
        return Number(saved);
      }
    }

    return 1;
  });

  useEffect(() => {
    localStorage.setItem(
      "tarkintel-pmc-level",
      String(playerLevel)
    );
  }, [playerLevel]);

  /*
    TASK STATE
  */

  const [tasks, setTasks] =
    useState<TarkovTask[]>([]);

  const [
    loadingTasks,
    setLoadingTasks,
  ] = useState(true);

  const [
    activeFilter,
    setActiveFilter,
  ] = useState<TaskFilter>(
    "active"
  );

  const [searchQuery, setSearchQuery] =
    useState("");

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
    INFERRED XP
  */

  const inferredXP =
    completedTasks.reduce(
      (total, taskId) => {
        const task =
          tasks.find(
            (task) =>
              task.id === taskId
          );

        return (
          total +
          (task?.xp || 0)
        );
      },
      0
    );

  /*
    INFERRED LEVEL
  */

  const inferredLevel =
    getLevelFromXP(
      inferredXP
    );

  /*
    EFFECTIVE LEVEL
  */

  const effectiveLevel =
    Math.max(
      inferredLevel,
      playerLevel
    );

  /*
    PROGRESSION ENGINE
  */

  const progression =
    useMemo(() => {
      return buildProgressionState(
        tasks,
        completedTasks,
        effectiveLevel
      );
    }, [
      tasks,
      completedTasks,
      effectiveLevel,
    ]);

  /*
    FILTERED TASKS
  */

  const filteredTasks =
    useMemo(() => {
      let baseTasks:
        | TarkovTask[]
        | any[] =
        progression.active;

      /*
        VIEW MODES
      */

      if (
        activeFilter ===
        "locked"
      ) {
        baseTasks =
          progression.locked;
      }

      if (
        activeFilter ===
        "completed"
      ) {
        baseTasks =
          progression.completed;
      }

      /*
        SECONDARY FILTERS
      */

      let filtered =
        filterTasks(
          baseTasks,
          activeFilter,
          completedTasks
        );

      /*
        SEARCH
      */

      if (
        searchQuery.trim()
      ) {
        const query =
          searchQuery.toLowerCase();

        filtered =
          filtered.filter(
            (task: any) => {
              const taskName =
                task.name?.toLowerCase() ||
                "";

              const trader =
                task.trader?.toLowerCase() ||
                "";

              const objectives =
                task.objectives
                  ?.map(
                    (
                      objective: any
                    ) =>
                      objective.description ||
                      ""
                  )
                  .join(" ")
                  .toLowerCase() || "";

              const maps =
                task.maps
                  ?.join(" ")
                  ?.toLowerCase() ||
                "";

              return (
                taskName.includes(
                  query
                ) ||
                trader.includes(
                  query
                ) ||
                objectives.includes(
                  query
                ) ||
                maps.includes(
                  query
                )
              );
            }
          );
      }

      return filtered;
    }, [
      progression,
      activeFilter,
      completedTasks,
      searchQuery,
    ]);

  /*
    PRIORITY SORTING
  */

  const sortedTasks =
    useMemo(() => {
      return sortTasksByPriority(
        filteredTasks,
        completedTasks
      );
    }, [
      filteredTasks,
      completedTasks,
    ]);

  /*
    LOADING STATE
  */

  if (!loaded || loadingTasks) {
    return (
      <div className="min-h-screen p-4 text-white">
        <div className="glass-card rounded-3xl p-6">
          <h1 className="text-2xl font-bold">
            Syncing Progress...
          </h1>

          <p className="mt-2 text-zinc-400">
            Loading live Tarkov
            progression data.
          </p>
        </div>
      </div>
    );
  }

  /*
    OVERVIEW
  */

  const completedCount =
    progression.completed.length;

  return (
    <div className="min-h-screen p-4 pb-28 text-white">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-[2rem] glass-card p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-[#B8895A]/10 to-transparent" />

          <div className="relative z-10">
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
              Live Tarkov Platform
            </p>

            <h1 className="text-gradient mt-3 text-5xl font-black tracking-tight">
              Tasks
            </h1>

            <p className="mt-3 max-w-sm text-sm text-zinc-400">
              Intelligent live
              Tarkov progression
              engine powered by
              TarkIntel.
            </p>
          </div>
        </div>

<TaskOverview
  completedCount={completedCount}
  visibleCount={sortedTasks.length}
/>

        {/* Player State */}
        <div className="glass-card rounded-[2rem] p-5">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-zinc-500">
                PMC Level
              </p>

              <h2 className="mt-2 text-5xl font-black text-primary">
                {effectiveLevel}
              </h2>

              <p className="mt-2 text-sm text-zinc-500">
                Used for progression
                intelligence and
                level-gated tasks.
              </p>
            </div>

            <form
              onSubmit={(
                event
              ) => {
                event.preventDefault();

                const clampedLevel =
                  Math.max(
                    inferredLevel,
                    Math.min(
                      79,
                      Number(
                        playerLevel
                      ) || 1
                    )
                  );

                setPlayerLevel(
                  clampedLevel
                );
              }}
              className="flex flex-col gap-3"
            >
              <p className="text-sm text-zinc-500">
                Set Your PMC Level
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Inferred Level:{" "}
                {inferredLevel}
              </p>

              <input
                type="number"
                min={1}
                max={79}
                value={playerLevel}
                onChange={(
                  event
                ) =>
                  setPlayerLevel(
                    Number(
                      event.target.value
                    ) || 1
                  )
                }
                className="w-32 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-lg text-white outline-none transition-all duration-300 focus:border-primary"
              />
            </form>
          </div>
        </div>

        {/* Search */}
        <div className="glass-card rounded-[2rem] p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tasks, traders, objectives, maps..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white outline-none transition-all duration-300 placeholder:text-zinc-500 focus:border-primary/40 focus:bg-white/[0.05]"
            />

            {searchQuery && (
              <button
                onClick={() =>
                  setSearchQuery("")
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-zinc-500 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card rounded-[2rem] p-4">
          <div className="flex gap-3 overflow-x-auto pb-1">
            {[
              {
                label: "Active",
                value: "active",
              },
              {
                label: "Locked",
                value: "locked",
              },
              {
                label: "Completed",
                value: "completed",
              },
              {
                label: "Kappa",
                value: "kappa",
              },
              {
                label: "FIR",
                value: "fir",
              },
              {
                label: "Prapor",
                value: "prapor",
              },
              {
                label: "Therapist",
                value: "therapist",
              },
              {
                label: "Skier",
                value: "skier",
              },
              {
                label: "Peacekeeper",
                value: "peacekeeper",
              },
              {
                label: "Mechanic",
                value: "mechanic",
              },
              {
                label: "Ragman",
                value: "ragman",
              },
              {
                label: "Jaeger",
                value: "jaeger",
              },
            ].map((filter) => {
              const active =
                activeFilter ===
                filter.value;

              return (
                <button
                  key={
                    filter.value
                  }
                  onClick={() =>
                    setActiveFilter(
                      filter.value as TaskFilter
                    )
                  }
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    active
                      ? "bg-gradient-to-r from-[#B8895A] to-[#D4A574] text-black shadow-lg"
                      : "border border-white/10 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Task Cards */}
        <div className="flex flex-col gap-5">
          {sortedTasks.map(
            (task: any) => {
              const completed =
                isTaskCompleted(
                  task.id
                );

              const locked =
                task
                  .missingRequirements
                  ?.length > 0;

              return (
                <Link
                  href={`/tasks/${task.id}`}
                  key={task.id}
                >
                  <div
                    className={`glass-hover relative overflow-hidden rounded-[2rem] border p-5 transition-all duration-300 ${
                      completed
                        ? "border-primary/20 bg-primary/5 opacity-70"
                        : locked
                        ? "border-red-500/20 bg-red-500/5"
                        : "glass-card"
                    }`}
                  >
                    {!completed && (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#B8895A]/5 to-transparent" />
                    )}

                    <div className="relative z-10">
                      {/* Top */}
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h2
                              className={`text-xl font-bold ${
                                completed
                                  ? "text-primary line-through"
                                  : ""
                              }`}
                            >
                              {task.name}
                            </h2>

                            {!completed &&
                              !locked && (
                                <div className="rounded-full bg-primary/15 px-2 py-1 text-[10px] font-bold text-primary">
                                  ACTIVE
                                </div>
                              )}

                            {locked && (
                              <div className="rounded-full bg-red-500/15 px-2 py-1 text-[10px] font-bold text-red-400">
                                LOCKED
                              </div>
                            )}
                          </div>

                          <p className="mt-2 text-sm text-zinc-500">
                            {task.trader}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-end gap-2">
                          {task.kappaRequired && (
                            <div className="rounded-full bg-yellow-500/15 px-3 py-1 text-xs font-semibold text-yellow-400">
                              KAPPA
                            </div>
                          )}

                          <div
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              completed
                                ? "bg-primary/15 text-primary"
                                : locked
                                ? "bg-red-500/15 text-red-400"
                                : "bg-blue-500/15 text-blue-400"
                            }`}
                          >
                            {completed
                              ? "COMPLETED"
                              : locked
                              ? "LOCKED"
                              : "ACTIVE"}
                          </div>
                        </div>
                      </div>

                      {/* Lock Reason */}
                      {locked && (
                        <div className="mt-4 rounded-2xl border border-red-500/10 bg-red-500/5 px-4 py-3 text-sm text-red-300">
                          Locked by{" "}
                          {
                            task
                              .missingRequirements
                              ?.length
                          }{" "}
                          prerequisite
                          task(s)
                        </div>
                      )}

                      {/* Objectives */}
                      <div className="mt-5">
                        <p className="mb-3 text-sm font-medium text-zinc-400">
                          Objectives
                        </p>

                        <div className="flex flex-col gap-2">
                          {task.objectives
                            ?.length ? (
                            task.objectives
                              .slice(0, 3)
                              .map(
                                (
                                  objective: any,
                                  index: number
                                ) => (
                                  <div
                                    key={`${task.id}-objective-${index}`}
                                    className="rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300"
                                  >
                                    •{" "}
                                    {objective.description ||
                                      "Objective"}
                                  </div>
                                )
                              )
                          ) : (
                            <div className="rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3 text-sm text-zinc-500">
                              No objectives
                              available
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="mt-5 flex flex-wrap gap-2">
                        {task.levelRequired && (
                          <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-zinc-300">
                            LV{" "}
                            {
                              task.levelRequired
                            }
                          </div>
                        )}

                        {task.maps?.map(
                          (
                            map: string
                          ) => (
                            <div
                              key={map}
                              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-zinc-300"
                            >
                              {map}
                            </div>
                          )
                        )}

                        <div className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                          {task.xp?.toLocaleString()}{" "}
                          XP
                        </div>
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
                        className={`mt-6 w-full rounded-2xl py-4 font-semibold transition-all duration-300 ${
                          completed
                            ? "border border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06]"
                            : "bg-gradient-to-r from-[#B8895A] to-[#D4A574] text-black hover:scale-[1.01]"
                        }`}
                      >
                        {completed
                          ? "Mark Incomplete"
                          : "Mark Complete"}
                      </button>
                    </div>
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