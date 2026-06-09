import {
  memo,
  useMemo,
} from "react";

import {
  HideoutLevelCard,
} from "@/components/hideout/HideoutLevelCard";

import {
  isLevelActionable,
} from "@/lib/progression-engine";

import type {
  HideoutLevel,
  HideoutModule,
} from "@/types/hideout";

import type {
  TarkovItem,
} from "@/types/item";

interface HideoutModuleCardProps {
  module: HideoutModule;

  items: TarkovItem[];

  itemMap: Map<
    string,
    TarkovItem
  >;

  collapsed: boolean;

  hideCompletedRequirements: boolean;

  toggleCollapse: () => void;

  resetModule: (
    moduleId: string
  ) => void;

  completeLevel: (
    moduleId: string,
    level: number
  ) => void;

  getCompletedLevel: (
    moduleId: string
  ) => number;

  isLevelCompleted: (
    moduleId: string,
    level: number
  ) => boolean;

  getTrackedQuantity: (
    itemId: string
  ) => number;
}

export const HideoutModuleCard =
  memo(function HideoutModuleCard({
    module,
    items,
    itemMap,
    collapsed,
    hideCompletedRequirements,
    toggleCollapse,
    resetModule,
    completeLevel,
    getCompletedLevel,
    isLevelCompleted,
    getTrackedQuantity,
  }: HideoutModuleCardProps) {
    const completedLevel =
      getCompletedLevel(
        module.id
      );

    /*
      MEMOIZED LEVEL FILTER
    */

    const visibleLevels =
      useMemo(() => {
        return module.levels.filter(
          (
            level: HideoutLevel
          ) => {
            const completed =
              isLevelCompleted(
                module.id,
                level.level
              );

            const isActionable =
              isLevelActionable(
                module,
                level,
                completedLevel,
                getCompletedLevel
              );

            return (
              completed ||
              isActionable
            );
          }
        );
      }, [
        module,
        completedLevel,
        getCompletedLevel,
        isLevelCompleted,
      ]);

    if (
      visibleLevels.length ===
      0
    ) {
      return null;
    }

    return (
      <div className="glass-card rounded-[2rem] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black">
                {module.name}
              </h2>

              <div className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                LV{" "}
                {
                  completedLevel
                }
              </div>
            </div>

            <p className="mt-2 text-sm text-zinc-500">
              Next upgrade:
              {" "}
              Level{" "}
              {
                completedLevel +
                1
              }
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={
                toggleCollapse
              }
              className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:bg-white/[0.06]"
            >
              {collapsed
                ? "EXPAND"
                : "COLLAPSE"}
            </button>

            <button
              onClick={() =>
                resetModule(
                  module.id
                )
              }
              className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/20"
            >
              RESET
            </button>
          </div>
        </div>

        {!collapsed && (
          <div className="mt-6 flex max-h-[700px] flex-col gap-4 overflow-y-auto pr-2">
            {visibleLevels.map(
              (
                level: HideoutLevel
              ) => (
                <HideoutLevelCard
                  key={`${module.id}-${level.level}`}
                  module={
                    module
                  }
                  level={
                    level
                  }
                  items={
                    items
                  }
                  itemMap={
                    itemMap
                  }
                  completedLevel={
                    completedLevel
                  }
                  completed={isLevelCompleted(
                    module.id,
                    level.level
                  )}
                  hideCompletedRequirements={
                    hideCompletedRequirements
                  }
                  getCompletedLevel={
                    getCompletedLevel
                  }
                  getTrackedQuantity={
                    getTrackedQuantity
                  }
                  completeLevel={
                    completeLevel
                  }
                />
              )
            )}
          </div>
        )}
      </div>
    );
  });