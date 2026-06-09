import {
  memo,
  useMemo,
} from "react";

import {
  HideoutRequirementRow,
} from "@/components/hideout/HideoutRequirementRow";

import {
  getBlockedBy,
  getUpgradeReadiness,
  isLevelActionable,
} from "@/lib/progression-engine";

import type {
  HideoutLevel,
  HideoutModule,
  HideoutRequirement,
} from "@/types/hideout";

import type {
  TarkovItem,
} from "@/types/item";

interface HideoutLevelCardProps {
  module: HideoutModule;

  level: HideoutLevel;

  items: TarkovItem[];

  itemMap: Map<
    string,
    TarkovItem
  >;

  completedLevel: number;

  completed: boolean;

  hideCompletedRequirements: boolean;

  getCompletedLevel: (
    moduleId: string
  ) => number;

  getTrackedQuantity: (
    itemId: string
  ) => number;

  completeLevel: (
    moduleId: string,
    level: number
  ) => void;
}

export const HideoutLevelCard =
  memo(function HideoutLevelCard({
    module,
    level,
    items,
    itemMap,
    completedLevel,
    completed,
    hideCompletedRequirements,
    getCompletedLevel,
    getTrackedQuantity,
    completeLevel,
  }: HideoutLevelCardProps) {
    /*
      BLOCKED STATE
    */

    const blockedBy =
      useMemo(() => {
        return getBlockedBy(
          level,
          getCompletedLevel
        );
      }, [
        level,
        getCompletedLevel,
      ]);

    const isBlocked =
      blockedBy.length > 0;

    /*
      ACTIONABLE
    */

    const isActionable =
      useMemo(() => {
        return isLevelActionable(
          module,
          level,
          completedLevel,
          getCompletedLevel
        );
      }, [
        module,
        level,
        completedLevel,
        getCompletedLevel,
      ]);

    /*
      READINESS
    */

    const readiness =
      useMemo(() => {
        return getUpgradeReadiness({
          module,

          level,

          completed,

          getCompletedLevel,

          getTrackedQuantity,

          items,
        });
      }, [
        module,
        level,
        completed,
        getCompletedLevel,
        getTrackedQuantity,
        items,
      ]);

    /*
      REQUIREMENTS
    */

    const visibleRequirements =
      useMemo(() => {
        return hideCompletedRequirements &&
          completed
          ? []
          : level.requirements;
      }, [
        hideCompletedRequirements,
        completed,
        level.requirements,
      ]);

    return (
      <div
        className={`rounded-2xl border p-4 transition-all ${
          completed
            ? "border-green-500/20 bg-green-500/5 opacity-60"
            : isActionable
            ? "border-primary/40 bg-primary/10"
            : isBlocked
            ? "border-red-500/20 bg-red-500/5 opacity-70"
            : "border-white/5 bg-white/[0.03]"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold">
                Level{" "}
                {
                  level.level
                }
              </h3>

              {completed && (
                <div className="rounded-full bg-green-500/15 px-2 py-1 text-[10px] font-bold text-green-400">
                  COMPLETE
                </div>
              )}

              {isActionable && (
                <div className="rounded-full bg-primary/15 px-2 py-1 text-[10px] font-bold text-primary">
                  NEXT
                </div>
              )}

              {isBlocked && (
                <div className="rounded-full bg-red-500/15 px-2 py-1 text-[10px] font-bold text-red-400">
                  BLOCKED
                </div>
              )}

              {readiness.status ===
                "ready" && (
                <div className="rounded-full bg-emerald-500/15 px-2 py-1 text-[10px] font-bold text-emerald-400">
                  READY
                </div>
              )}

              {readiness.status ===
                "missing-items" && (
                <div className="rounded-full bg-yellow-500/15 px-2 py-1 text-[10px] font-bold text-yellow-400">
                  MISSING{" "}
                  {
                    readiness
                      .missingItems
                      .length
                  }
                </div>
              )}
            </div>

            <p className="mt-2 text-sm text-zinc-500">
              {
                level
                  .requirements
                  ?.length ?? 0
              }{" "}
              required
              items
            </p>

            {readiness.status ===
              "missing-items" && (
              <div className="mt-3 flex flex-wrap gap-2">
                {readiness.missingItems.map(
                  (
                    item
                  ) => (
                    <div
                      key={
                        item.itemId
                      }
                      className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-400"
                    >
                      {
                        item.missing
                      }{" "}
                      {
                        item.itemName
                      }
                    </div>
                  )
                )}
              </div>
            )}

            {isBlocked && (
              <div className="mt-3 flex flex-wrap gap-2">
                {blockedBy.map(
                  (
                    requirement
                  ) => (
                    <div
                      key={`${requirement.stationId}-${requirement.level}`}
                      className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400"
                    >
                      Requires{" "}
                      {
                        requirement.stationName
                      }{" "}
                      LV{" "}
                      {
                        requirement.level
                      }
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {!completed &&
            !isBlocked && (
              <button
                onClick={() =>
                  completeLevel(
                    module.id,
                    level.level
                  )
                }
                className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-black transition hover:scale-[1.02]"
              >
                MARK COMPLETE
              </button>
            )}
        </div>

        {visibleRequirements.length >
          0 && (
          <div className="mt-5 flex flex-col gap-3">
            {visibleRequirements.map(
              (
                requirement: HideoutRequirement,
                index: number
              ) => {
                const item =
                  itemMap.get(
                    requirement.itemId
                  );

                return (
                  <HideoutRequirementRow
                    key={`${requirement.itemId}-${index}`}
                    requirement={
                      requirement
                    }
                    item={
                      item
                    }
                    completed={
                      completed
                    }
                    isActionable={
                      isActionable
                    }
                    getTrackedQuantity={
                      getTrackedQuantity
                    }
                  />
                );
              }
            )}
          </div>
        )}
      </div>
    );
  });