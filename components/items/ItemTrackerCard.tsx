"use client";

import { useMemo } from "react";

import {
  useTrackedItems,
} from "@/hooks/useTrackedItems";

import {
  useHideoutProgress,
} from "@/hooks/useHideoutProgress";

import {
  useTaskProgress,
} from "@/hooks/use-task-progress";

import type {
  HideoutModuleReference,
  HideoutRequirement,
  RelatedTaskReference,
} from "@/types/item";

interface ItemTrackerCardProps {
  itemId: string;

  itemName: string;

  requiredAmount: number;

  requiredForHideout?: boolean;

  totalHideoutRequired?: number;

  totalTaskRequired?: number;

  firTaskRequired?: number;

  relatedTasks?: RelatedTaskReference[];

  hideoutModules?: HideoutModuleReference[];

  hideoutRequirements?: HideoutRequirement[];
}

export function ItemTrackerCard({
  itemId,
  itemName,

  requiredAmount,

  requiredForHideout,

  totalHideoutRequired,

  totalTaskRequired,

  firTaskRequired,

  relatedTasks = [],

  hideoutModules = [],

  hideoutRequirements = [],
}: ItemTrackerCardProps) {
  const {
    getTrackedQuantity,
    incrementItem,
    decrementItem,
    getItemAllocation,
  } = useTrackedItems();

  const {
    calculateHideoutAllocation,
    getCompletedLevel,
  } =
    useHideoutProgress();

  const { isTaskCompleted } =
    useTaskProgress();

  /*
    TRACKED
  */

  const tracked =
    getTrackedQuantity(itemId);

  /*
    HIDEOUT
    ALLOCATION
  */

  const hideoutAllocation =
    calculateHideoutAllocation(
      itemId,
      hideoutModules
    );

  /*
    INCOMPLETE TASKS
  */

  const incompleteTasks =
    relatedTasks.filter(
      (task) =>
        !isTaskCompleted(task.id)
    );

  /*
    TASK DEMAND
  */

  const taskDemand =
    incompleteTasks.length > 0
      ? totalTaskRequired || 0
      : 0;

  /*
    FIR DEMAND
  */

  const firDemand =
    incompleteTasks.length > 0
      ? firTaskRequired || 0
      : 0;

  /*
    REMAINING DEMAND
  */

  const remainingDemand =
    Math.max(
      hideoutAllocation.remaining +
        taskDemand,
      0
    );

  /*
    REMAINING NEEDED
  */

  const remainingNeeded =
    Math.max(
      remainingDemand -
        tracked,
      0
    );

  /*
    GLOBAL ALLOCATION
  */

  const allocation =
    getItemAllocation(itemId, {
      usedInHideout:
        hideoutAllocation.used,

      reservedForFuture:
        remainingDemand,
    });

  /*
    PROGRESS
  */

  const progress = useMemo(() => {
    if (
      remainingDemand <= 0
    ) {
      return 100;
    }

    return Math.min(
      100,
      Math.round(
        (tracked /
          remainingDemand) *
          100
      )
    );
  }, [
    tracked,
    remainingDemand,
  ]);

  /*
    COMPLETE
  */

  const completed =
    remainingNeeded <= 0;

  /*
    SELL SAFETY
  */

  const safeToSell =
    allocation.free > 0;

  /*
    REMAINING HIDEOUT
  */

  const remainingHideoutRequirements =
    hideoutRequirements.filter(
      (
        requirement
      ) => {
        const completedLevel =
          getCompletedLevel(
            requirement.stationName
          );

        return (
          completedLevel <
          requirement.stationLevel
        );
      }
    );

  return (
    <div className="glass-card rounded-[2rem] p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
            Progress Tracker
          </p>

          <h2 className="mt-2 text-2xl font-black">
            {allocation.owned} owned
          </h2>

          <p className="mt-2 text-sm text-zinc-400">
            Track how many{" "}
            {itemName} you have
            collected for future
            progression.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {requiredForHideout && (
              <div className="rounded-full bg-orange-500/15 px-3 py-1 text-xs font-semibold text-orange-300">
                HIDEOUT ITEM
              </div>
            )}

            {taskDemand > 0 && (
              <div className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-semibold text-blue-300">
                QUEST ITEM
              </div>
            )}

            {firDemand > 0 && (
              <div className="rounded-full bg-red-500/15 px-3 py-1 text-xs font-semibold text-red-300">
                FIR REQUIRED
              </div>
            )}

            {safeToSell ? (
              <div className="rounded-full bg-green-500/15 px-3 py-1 text-xs font-semibold text-green-300">
                SAFE TO SELL
              </div>
            ) : (
              <div className="rounded-full bg-yellow-500/15 px-3 py-1 text-xs font-semibold text-yellow-300">
                KEEP
              </div>
            )}
          </div>
        </div>

        {completed && (
          <div className="rounded-full bg-green-500/15 px-4 py-2 text-sm font-semibold text-green-400">
            COMPLETE
          </div>
        )}
      </div>

      {/* Needed For */}
      {remainingHideoutRequirements.length > 0 && (
        <div className="mt-6 rounded-[2rem] border border-orange-500/20 bg-orange-500/5 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-white">
                Needed For
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                Remaining hideout
                progression demand
              </p>
            </div>

            <div className="rounded-full bg-orange-500/15 px-4 py-2 text-sm font-semibold text-orange-300">
              {
                remainingDemand
              }{" "}
              Remaining
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3">
            {remainingHideoutRequirements.map(
              (
                requirement,
                index
              ) => (
                <div
                  key={`${requirement.stationName}-${requirement.stationLevel}-${index}`}
                  className="rounded-2xl border border-orange-500/10 bg-black/20 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-white">
                        {
                          requirement.stationName
                        }
                      </h3>

                      <p className="mt-1 text-sm text-zinc-400">
                        Level{" "}
                        {
                          requirement.stationLevel
                        }
                      </p>
                    </div>

                    <div className="rounded-full bg-orange-500/10 px-3 py-1 text-sm font-semibold text-orange-300">
                      x
                      {
                        requirement.count
                      }
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Progress */}
      <div className="mt-6">
        <div className="h-3 overflow-hidden rounded-full bg-white/[0.04]">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              completed
                ? "bg-green-400"
                : "bg-primary"
            }`}
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <div className="mt-2 flex items-center justify-between text-xs text-zinc-500">
          <span>
            {progress}% complete
          </span>

          <span>
            {remainingNeeded}{" "}
            remaining
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={() =>
            decrementItem(
              itemId
            )
          }
          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-xl font-bold text-white transition hover:bg-white/[0.06]"
        >
          −
        </button>

        <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.03] py-3 text-center text-lg font-bold">
          {tracked}
        </div>

        <button
          onClick={() =>
            incrementItem(
              itemId
            )
          }
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-black transition hover:scale-[1.03]"
        >
          +
        </button>
      </div>
    </div>
  );
}