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
import { getEffectivePlayerLevel } from "@/lib/effective-level";

import { TaskFilter } from "@/types/task-filter";

import { TarkovTask } from "@/types/task";

import { TaskOverview } from "@/components/tasks/TaskOverview";
import { TaskCard } from "@/components/tasks/TaskCard";


export default function TasksPage() {
const {
  completedTasks,
  toggleTask,
  isTaskCompleted,
  loaded,
  playerLevelOverride,
  setPlayerLevelOverride,
} = useTaskProgress();

 

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

const {
  inferredLevel,
  effectiveLevel,
} =
  getEffectivePlayerLevel(
    tasks,
    completedTasks,
    playerLevelOverride
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
    {/* Current Effective Level */}
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

    {/* Manual Override */}
    <div className="flex flex-col gap-3">
      <p className="text-sm text-zinc-500">
        Set Your PMC Level
      </p>

      <p className="text-xs text-zinc-500">
        Inferred Level:{" "}
        {inferredLevel}
      </p>

     <input
  type="number"
  min={inferredLevel}
  max={79}
  value={
    playerLevelOverride ??
    inferredLevel
  }
  onChange={(event) => {
    const rawValue =
      event.target.value;

    /*
      ALLOW EMPTY
      DURING EDITING
    */

    if (!rawValue) {
      return;
    }

    const parsedValue =
      Number(rawValue);

    if (
      Number.isNaN(
        parsedValue
      )
    ) {
      return;
    }

    /*
      CLAMP
    */

    const clampedLevel =
      Math.max(
        inferredLevel,
        Math.min(
          79,
          parsedValue
        )
      );

    setPlayerLevelOverride(
      clampedLevel
    );
  }}
  className="w-32 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-lg text-white outline-none transition-all duration-300 focus:border-primary"
/>

      <p className="text-xs text-zinc-600">
        Effective level always
        uses the higher of:
        inferred progression or
        manual override.
      </p>
    </div>
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
          key={filter.value}
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

{/* Scrollable Task Feed */}
<div className="glass-card rounded-[2rem] p-4">
  <div className="mb-4 flex items-center justify-between">
    <div>
      <h2 className="text-2xl font-black text-white">
        Tasks
      </h2>

      <p className="text-sm text-zinc-500">
        {sortedTasks.length} visible
      </p>
    </div>
  </div>

  <div className="flex max-h-[70vh] flex-col gap-5 overflow-y-auto pr-2">
    {sortedTasks.map(
      (task: any) => {
        const completed =
          isTaskCompleted(
            task.id
          );

        const locked =
          !!task
            .missingRequirements
            ?.length;

        return (
          <TaskCard
            key={task.id}
            task={task}
            completed={
              completed
            }
            locked={locked}
            onToggleComplete={() =>
              toggleTask(
                task.id
              )
            }
          />
        );
      }
    )}
  </div>
</div>
    
      </div>
    </div>
  );
}