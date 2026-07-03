"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Search,
  Sparkles,
  X,
} from "lucide-react";

import { useAuth } from "@/components/auth-provider";
import LoginButton from "@/components/login-button";
import { useTaskProgress } from "@/hooks/use-task-progress";
import {
  getBulkPrerequisiteIds,
  groupTasksByTrader,
} from "@/lib/task-catchup";
import type { TarkovTask } from "@/types/task";

interface ProgressCatchUpClientProps {
  tasks: TarkovTask[];
}

export function ProgressCatchUpClient({
  tasks,
}: ProgressCatchUpClientProps) {
  const { user, loading: authLoading } = useAuth();
  const {
    completedTasks,
    completeTasks,
    loaded,
    playerLevelOverride,
    setPlayerLevelOverride,
  } = useTaskProgress();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedCount, setSavedCount] = useState<number | null>(null);

  const selectedTaskIdSet = useMemo(
    () => new Set(selectedTaskIds),
    [selectedTaskIds]
  );
  const completedTaskIdSet = useMemo(
    () => new Set(completedTasks),
    [completedTasks]
  );
  const prerequisiteIds = useMemo(
    () => getBulkPrerequisiteIds(selectedTaskIds, tasks),
    [selectedTaskIds, tasks]
  );
  const prerequisiteTasks = useMemo(() => {
    const prerequisiteIdSet = new Set(prerequisiteIds);

    return tasks.filter((task) => prerequisiteIdSet.has(task.id));
  }, [prerequisiteIds, tasks]);
  const alreadyCompletedCount = useMemo(
    () =>
      prerequisiteIds.filter((taskId) => completedTaskIdSet.has(taskId))
        .length,
    [completedTaskIdSet, prerequisiteIds]
  );
  const newTaskIds = useMemo(
    () =>
      prerequisiteIds.filter((taskId) => !completedTaskIdSet.has(taskId)),
    [completedTaskIdSet, prerequisiteIds]
  );
  const groupedTasks = useMemo(
    () => groupTasksByTrader(prerequisiteTasks),
    [prerequisiteTasks]
  );
  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return [];
    }

    return tasks
      .filter(
        (task) =>
          !selectedTaskIdSet.has(task.id) &&
          (task.name.toLowerCase().includes(query) ||
            (task.trader ?? "").toLowerCase().includes(query))
      )
      .slice(0, 30);
  }, [searchQuery, selectedTaskIdSet, tasks]);
  const selectedTasks = useMemo(
    () => tasks.filter((task) => selectedTaskIdSet.has(task.id)),
    [selectedTaskIdSet, tasks]
  );

  function addTask(taskId: string) {
    setSelectedTaskIds((current) => [...current, taskId]);
    setSearchQuery("");
    setError(null);
  }

  function removeTask(taskId: string) {
    setSelectedTaskIds((current) => current.filter((id) => id !== taskId));
    setError(null);
  }

  async function confirmCatchUp() {
    if (selectedTaskIds.length === 0) {
      setError("Select at least one current task first.");
      return;
    }

    if (newTaskIds.length === 0) {
      setError("There are no new prerequisite tasks to save.");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await completeTasks(newTaskIds);
      setSavedCount(newTaskIds.length);
    } catch (saveError) {
      console.error("CATCH-UP SAVE ERROR:", saveError);
      setError("Catch-up progress could not be saved. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (authLoading || !loaded) {
    return (
      <main className="min-h-screen p-4 pb-8 text-white">
        <section className="glass-card rounded-[2rem] p-6">
          <h1 className="text-2xl font-black">Loading Catch-Up Setup...</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Syncing your TarkIntel progression.
          </p>
        </section>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen p-4 pb-8 text-white">
        <section className="glass-card rounded-[2rem] p-6 text-center">
          <Sparkles className="mx-auto size-10 text-primary" />
          <h1 className="mt-5 text-3xl font-black">Login Required</h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-zinc-400">
            Discord login is required to sync Catch-Up Setup progress across
            your devices.
          </p>
          <div className="mt-6 flex justify-center">
            <LoginButton />
          </div>
        </section>
      </main>
    );
  }

  if (savedCount !== null) {
    return (
      <main className="min-h-screen p-4 pb-8 text-white">
        <section className="glass-card rounded-[2rem] p-6 text-center sm:p-8">
          <CheckCircle2 className="mx-auto size-14 text-green-400" />
          <h1 className="mt-5 text-4xl font-black">Catch-Up Complete</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-zinc-400">
            TarkIntel marked {savedCount} {savedCount === 1 ? "task" : "tasks"}{" "}
            complete. You can still edit individual tasks anytime.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/profile"
              className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white"
            >
              Go to Profile
            </Link>
            <Link
              href="/tasks"
              className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-black"
            >
              Open Tasks
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 pb-8 text-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-5">
        <header className="glass-card rounded-[2rem] p-5 sm:p-6">
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Profile
          </Link>
          <p className="mt-6 text-sm font-semibold uppercase text-primary">
            Profile Setup
          </p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">
            Catch-Up Setup
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
            Choose quests you are currently working on. TarkIntel will suggest
            their prerequisite tasks for you to review before saving.
          </p>
        </header>

        <section className="glass-card rounded-[2rem] p-5">
          <label
            htmlFor="catch-up-level"
            className="text-sm font-semibold text-zinc-200"
          >
            Current PMC level (optional)
          </label>
          <select
            id="catch-up-level"
            value={playerLevelOverride ?? ""}
            onChange={(event) =>
              setPlayerLevelOverride(
                event.target.value ? Number(event.target.value) : null
              )
            }
            className="mt-3 w-full rounded-2xl border border-white/10 bg-[#111418] px-4 py-3 text-base text-white outline-none focus:border-primary sm:max-w-xs"
          >
            <option value="">Not set</option>
            {Array.from({ length: 79 }, (_, index) => index + 1).map(
              (level) => (
                <option key={level} value={level}>
                  Level {level}
                </option>
              )
            )}
          </select>
        </section>

        <section className="glass-card rounded-[2rem] p-5">
          <h2 className="text-xl font-black">Current task anchors</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Search by task or trader and select one or more quests.
          </p>

          {selectedTasks.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedTasks.map((task) => (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => removeTask(task.id)}
                  className="inline-flex max-w-full items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-2 text-left text-sm text-primary"
                >
                  <span className="truncate">{task.name}</span>
                  <X className="size-4 shrink-0" />
                </button>
              ))}
            </div>
          )}

          <div className="relative mt-4">
            <Search className="pointer-events-none absolute left-4 top-3.5 size-5 text-zinc-500" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search current tasks..."
              className="w-full rounded-2xl border border-white/10 bg-black/25 py-3 pl-12 pr-4 text-base text-white outline-none placeholder:text-zinc-600 focus:border-primary"
            />
          </div>

          {searchQuery.trim() && (
            <div className="mt-3 max-h-72 overflow-y-auto rounded-2xl border border-white/10 bg-black/25 p-2 custom-scrollbar">
              {searchResults.length > 0 ? (
                searchResults.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => addTask(task.id)}
                    className="flex w-full items-center justify-between gap-4 rounded-xl px-3 py-3 text-left hover:bg-white/[0.06]"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">
                        {task.name}
                      </span>
                      <span className="mt-1 block text-xs text-zinc-500">
                        {task.trader ?? "Unknown trader"}
                      </span>
                    </span>
                    <Check className="size-4 shrink-0 text-primary" />
                  </button>
                ))
              ) : (
                <p className="p-3 text-sm text-zinc-500">No tasks found.</p>
              )}
            </div>
          )}
        </section>

        <section className="glass-card rounded-[2rem] p-5">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              ["Found", prerequisiteIds.length],
              ["Complete", alreadyCompletedCount],
              ["New", newTaskIds.length],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:p-4"
              >
                <p className="text-xs text-zinc-500">{label}</p>
                <p className="mt-1 text-2xl font-black text-primary">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-black">Review prerequisites</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Only new tasks will be marked complete.
              </p>
            </div>
          </div>

          <div className="mt-4 max-h-[520px] overflow-y-auto pr-2 custom-scrollbar">
            {selectedTaskIds.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-white/10 p-5 text-sm text-zinc-500">
                Select a current task to build your catch-up list.
              </p>
            ) : groupedTasks.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-white/10 p-5 text-sm text-zinc-500">
                These tasks have no prerequisite tasks in the current data.
              </p>
            ) : (
              <div className="flex flex-col gap-5">
                {groupedTasks.map((group) => (
                  <div key={group.trader}>
                    <h3 className="text-sm font-bold uppercase text-zinc-400">
                      {group.trader}
                    </h3>
                    <div className="mt-2 flex flex-col gap-2">
                      {group.tasks.map((task) => {
                        const completed = completedTaskIdSet.has(task.id);

                        return (
                          <div
                            key={task.id}
                            className="flex items-center justify-between gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-3"
                          >
                            <span className="min-w-0 text-sm font-medium">
                              {task.name}
                            </span>
                            <span
                              className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                completed
                                  ? "bg-green-500/15 text-green-400"
                                  : "bg-primary/15 text-primary"
                              }`}
                            >
                              {completed ? "Completed" : "New"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <p className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={confirmCatchUp}
            disabled={saving || newTaskIds.length === 0}
            className="mt-5 w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-black transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saving ? "Saving..." : `Confirm and Save (${newTaskIds.length})`}
          </button>
        </section>
      </div>
    </main>
  );
}
