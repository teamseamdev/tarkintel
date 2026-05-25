"use client";

import Link from "next/link";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useParams } from "next/navigation";

import { useTaskProgress } from "@/hooks/use-task-progress";

import { buildProgressionState } from "@/lib/build-progression-state";

import { TarkovTask } from "@/types/task";

export default function TaskPage() {
  const params = useParams();

  const taskId =
    params.id as string;

  const {
    completedTasks,
    toggleTask,
    isTaskCompleted,
    loaded,
  } = useTaskProgress();

  const [tasks, setTasks] =
    useState<TarkovTask[]>(
      []
    );

  const [loading, setLoading] =
    useState(true);

  /*
    LOAD TASKS
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
        setLoading(false);
      }
    }

    loadTasks();
  }, []);

  /*
    PROGRESSION ENGINE
  */

  const progression =
    useMemo(() => {
      return buildProgressionState(
        tasks,
        completedTasks
      );
    }, [
      tasks,
      completedTasks,
    ]);

  /*
    FIND TASK
  */

  const allTasks = [
    ...progression.active,
    ...progression.locked,
    ...progression.completed,
  ];

  const task =
    allTasks.find(
      (task) =>
        task.id === taskId
    );

  const completed =
    task
      ? isTaskCompleted(
          task.id
        )
      : false;

  /*
    LOADING
  */

  if (!loaded || loading) {
    return (
      <div className="min-h-screen p-6 text-white">
        <div className="glass-card rounded-3xl p-6">
          Loading task...
        </div>
      </div>
    );
  }

  /*
    NOT FOUND
  */

  if (!task) {
    return (
      <div className="min-h-screen p-6 text-white">
        <div className="glass-card rounded-[2rem] p-8">
          <h1 className="text-3xl font-black">
            Task Not Found
          </h1>

          <p className="mt-3 text-zinc-400">
            This task could
            not be found in
            the live Tarkov
            dataset.
          </p>

          <Link
            href="/tasks"
            className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 font-semibold text-black"
          >
            Return to Tasks
          </Link>
        </div>
      </div>
    );
  }

  /*
    LOCK STATE
  */

  const locked =
    !!task
      .missingRequirements
      ?.length;

  return (
    <div className="min-h-screen p-4 pb-28 text-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        {/* HERO */}
        <div className="glass-card relative overflow-hidden rounded-[2rem] p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-[#B8895A]/10 to-transparent" />

          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-3">
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

            <h1 className="mt-5 text-5xl font-black tracking-tight">
              {task.name}
            </h1>

            <p className="mt-3 text-zinc-400">
              {
                task.trader
              }
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {task.levelRequired && (
                <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-zinc-300">
                  Level{" "}
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
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-zinc-300"
                  >
                    {map}
                  </div>
                )
              )}

              <div className="rounded-full bg-primary/15 px-3 py-2 text-sm font-semibold text-primary">
                {task.xp?.toLocaleString()}{" "}
                XP
              </div>
            </div>
          </div>
        </div>

        {/* LOCKED STATE */}
        {locked && (
          <div className="rounded-[2rem] border border-red-500/20 bg-red-500/5 p-6">
            <h2 className="text-xl font-bold text-red-400">
              Locked Task
            </h2>

            <p className="mt-2 text-sm text-red-200">
              This task is
              currently locked
              by unfinished
              prerequisite
              tasks.
            </p>

            <div className="mt-5 flex flex-col gap-3">
              {task.missingRequirements?.map(
                (
                  requirement: string
                ) => (
                  <div
                    key={
                      requirement
                    }
                    className="rounded-2xl border border-red-500/10 bg-black/20 px-4 py-3 text-sm text-red-200"
                  >
                    Missing
                    prerequisite:{" "}
                    {
                      requirement
                    }
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* OBJECTIVES */}
        <div className="glass-card rounded-[2rem] p-6">
          <h2 className="text-2xl font-bold">
            Objectives
          </h2>

          <div className="mt-5 flex flex-col gap-3">
            {task.objectives
              ?.length ? (
              task.objectives.map(
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

        {/* ACTIONS */}
        <div className="glass-card rounded-[2rem] p-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <button
              onClick={() =>
                toggleTask(
                  task.id
                )
              }
              className={`flex-1 rounded-2xl py-4 font-semibold transition-all duration-300 ${
                completed
                  ? "border border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06]"
                  : "bg-gradient-to-r from-[#B8895A] to-[#D4A574] text-black hover:scale-[1.01]"
              }`}
            >
              {completed
                ? "Mark Incomplete"
                : "Mark Complete"}
            </button>

            {task.wikiLink && (
              <a
                href={
                  task.wikiLink
                }
                target="_blank"
                rel="noreferrer"
                className="flex-1 rounded-2xl border border-white/10 bg-white/[0.03] py-4 text-center font-semibold text-white transition-all duration-300 hover:bg-white/[0.06]"
              >
                Open Wiki
              </a>
            )}
          </div>
        </div>

        {/* BACK */}
        <Link
          href="/tasks"
          className="text-center text-sm text-zinc-500 hover:text-white"
        >
          ← Back to Tasks
        </Link>
      </div>
    </div>
  );
}