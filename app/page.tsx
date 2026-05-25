"use client";

import Link from "next/link";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useTaskProgress } from "@/hooks/use-task-progress";

import { buildProgressionState } from "@/lib/build-progression-state";
import LoginButton from "@/components/login-button";
import { getLevelFromXP } from "@/lib/player-level";

export default function HomePage() {
  const {
  completedTasks,
  loaded,
  playerLevelOverride,
} = useTaskProgress();

  const [tasks, setTasks] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadTasks() {
      const response =
        await fetch(
          "/api/tasks"
        );

      const data =
        await response.json();

      setTasks(data);

      setLoading(false);
    }

    loadTasks();
  }, []);

const inferredXP =
  completedTasks.reduce(
    (
      total,
      taskId
    ) => {
      const task =
        tasks.find(
          (t) =>
            t.id === taskId
        );

      return (
        total +
        (task?.xp || 0)
      );
    },
    0
  );

const inferredLevel =
  getLevelFromXP(
    inferredXP
  );

const effectiveLevel =
  Math.max(
    inferredLevel,
    playerLevelOverride ||
      1
  );

/*
  PROGRESSION
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

  if (!loaded || loading) {
    return (
      <div className="min-h-screen p-6 text-white">
        <div className="glass-card rounded-3xl p-6">
          Loading TarkIntel...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 pb-28 text-white">
      <div className="flex flex-col gap-6">
        {/* HERO */}
        <div className="glass-card relative overflow-hidden rounded-[2rem] p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-[#B8895A]/10 to-transparent" />

          <div className="relative z-10">
  <div className="flex justify-end">
    <LoginButton />
  </div>
            
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
              TarkIntel
            </p>

            <h1 className="mt-3 text-5xl font-black tracking-tight">
              Escape From Tarkov
              Progression
              Intelligence
            </h1>

            <p className="mt-4 max-w-xl text-zinc-400">
              Real-time task
              progression tracking
              powered by live
              Tarkov.dev data.
            </p>
          </div>
        </div>


      {/* PROGRESSION OVERVIEW */}
<div className="grid grid-cols-2 gap-4">
  {/* Overall Completion */}
  <div className="glass-card rounded-[2rem] p-5">
    <p className="text-sm text-zinc-500">
      Overall Progress
    </p>

    <div className="mt-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-zinc-400">
          Task Completion
        </span>

        <span className="font-semibold text-primary">
          {Math.round(
            (progression.completed
              .length /
              tasks.length) *
              100
          )}
          %
        </span>
      </div>

      <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#B8895A] to-[#D4A574]"
          style={{
            width: `${
              (progression
                .completed
                .length /
                tasks.length) *
              100
            }%`,
          }}
        />
      </div>
    </div>
  </div>

  {/* Kappa */}
  <div className="glass-card rounded-[2rem] p-5">
    <p className="text-sm text-zinc-500">
      Kappa Progress
    </p>

    {(() => {
      const kappaTasks =
        tasks.filter(
          task =>
            task.kappaRequired
        );

      const completedKappa =
        kappaTasks.filter(
          task =>
            completedTasks.includes(
              task.id
            )
        );

      const progress =
        kappaTasks.length > 0
          ? (completedKappa.length /
              kappaTasks.length) *
            100
          : 0;

      return (
        <>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-zinc-400">
              Collector Path
            </span>

            <span className="font-semibold text-yellow-400">
              {Math.round(
                progress
              )}
              %
            </span>
          </div>

          <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-amber-300"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <div className="mt-3 text-xs text-zinc-500">
            {
              completedKappa.length
            }{" "}
            /{" "}
            {
              kappaTasks.length
            }{" "}
            Kappa tasks
            completed
          </div>
        </>
      );
    })()}
  </div>

  {/* Active */}
  <div className="glass-card rounded-[2rem] p-5">
    <p className="text-sm text-zinc-500">
      Active Tasks
    </p>

    <h2 className="mt-3 text-4xl font-black text-blue-400">
      {
        progression.active
          .length
      }
    </h2>

    <p className="mt-2 text-sm text-zinc-500">
      Currently available
    </p>
  </div>

  {/* Locked */}
  <div className="glass-card rounded-[2rem] p-5">
    <p className="text-sm text-zinc-500">
      Locked Tasks
    </p>

    <h2 className="mt-3 text-4xl font-black text-red-400">
      {
        progression.locked
          .length
      }
    </h2>

    <p className="mt-2 text-sm text-zinc-500">
      Awaiting unlocks
    </p>
  </div>
</div>

        {/* ACTIVE TASKS */}
        <div className="glass-card rounded-[2rem] p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                Current Active
                Tasks
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Tasks currently
                available based on
                your progression.
              </p>
            </div>

            <Link
              href="/tasks"
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-black"
            >
              Open Tasks
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            {progression.active
              .slice(0, 5)
              .map(task => (
                <div
                  key={task.id}
                  className="rounded-2xl border border-white/5 bg-white/[0.03] p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">
                        {
                          task.name
                        }
                      </h3>

                      <p className="mt-1 text-sm text-zinc-500">
                        {
                          task.trader
                        }
                      </p>
                    </div>

                    <div className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-semibold text-blue-400">
                      ACTIVE
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