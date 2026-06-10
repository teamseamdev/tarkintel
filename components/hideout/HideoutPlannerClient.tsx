"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useHideoutProgress,
} from "@/hooks/useHideoutProgress";

import {
  useTrackedItems,
} from "@/hooks/useTrackedItems";

import {
  ShoppingListCard,
} from "@/components/hideout/ShoppingListCard";

import {
  HideoutModuleCard,
} from "@/components/hideout/HideoutModuleCard";

import {
  RecommendedUpgradeCard,
} from "@/components/hideout/RecommendedUpgradeCard";

import {
  buildShoppingList,
  getBestNextUpgrade,
} from "@/lib/progression-engine";

import type {
  HideoutModule,
} from "@/types/hideout";

import type {
  TarkovItem,
} from "@/types/item";

interface HideoutPlannerClientProps {
  modules: HideoutModule[];

  items: TarkovItem[];
}

export function HideoutPlannerClient({
  modules,
  items,
}: HideoutPlannerClientProps) {
  const {
    completeLevel,
    getCompletedLevel,
    isLevelCompleted,
    resetModule,
  } =
    useHideoutProgress();

  const {
    getTrackedQuantity,
  } =
    useTrackedItems();

  /*
    COLLAPSE STATE
  */

  const [
    collapsedModules,
    setCollapsedModules,
  ] = useState<
    Record<string, boolean>
  >(() => {
    /*
      COLLAPSED BY DEFAULT
    */

    return Object.fromEntries(
      modules.map(
        (
          module
        ) => [
          module.id,
          true,
        ]
      )
    );
  });

  /*
    HIDE COMPLETED
    MODULES
  */

  const [
    hideCompletedModules,
    setHideCompletedModules,
  ] = useState(true);

  /*
    PERSIST
  */

  useEffect(() => {
    const stored =
      localStorage.getItem(
        "hide-completed-modules"
      );

    if (stored) {
      setHideCompletedModules(
        stored === "true"
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "hide-completed-modules",
      String(
        hideCompletedModules
      )
    );
  }, [
    hideCompletedModules,
  ]);

  /*
    SORTED MODULES
  */

  const sortedModules =
    useMemo(() => {
      return [...modules].sort(
        (a, b) =>
          a.name.localeCompare(
            b.name
          )
      );
    }, [modules]);

  /*
    FILTERED MODULES
  */

  const filteredModules =
    useMemo(() => {
      return sortedModules.filter(
        (
          module
        ) => {
          if (
            !hideCompletedModules
          ) {
            return true;
          }

          const completedLevel =
            getCompletedLevel(
              module.id
            );

          const maxLevel =
            Math.max(
              ...module.levels.map(
                (
                  level
                ) =>
                  level.level
              )
            );

          return (
            completedLevel <
            maxLevel
          );
        }
      );
    }, [
      sortedModules,
      hideCompletedModules,
      getCompletedLevel,
    ]);

  /*
    ITEM MAP
    MASSIVE PERFORMANCE
    OPTIMIZATION
  */

  const itemMap =
    useMemo(() => {
      return new Map(
        items.map((item) => [
          item.id,
          item,
        ])
      );
    }, [items]);

  /*
    SHOPPING LIST
  */

  const shoppingList =
    useMemo(() => {
      return buildShoppingList({
        modules:
          sortedModules,

        items,

        getCompletedLevel,

        getTrackedQuantity,
      });
    }, [
      sortedModules,
      items,
      getCompletedLevel,
      getTrackedQuantity,
    ]);

  /*
    BEST NEXT UPGRADE
  */

  const bestNextUpgrade =
    useMemo(() => {
      return getBestNextUpgrade(
        sortedModules,
        getCompletedLevel
      );
    }, [
      sortedModules,
      getCompletedLevel,
    ]);

  return (
    <div className="flex flex-col gap-6">
      <ShoppingListCard
        items={shoppingList}
      />

      <RecommendedUpgradeCard
        upgrade={
          bestNextUpgrade
        }
      />

      {/* Controls */}
      <div className="flex items-center justify-end">
        <button
          onClick={() =>
            setHideCompletedModules(
              (prev) =>
                !prev
            )
          }
          className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
            hideCompletedModules
              ? "border-primary/30 bg-primary/10 text-primary"
              : "border-white/10 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.06]"
          }`}
        >
          {hideCompletedModules
            ? "SHOW COMPLETED MODULES"
            : "HIDE COMPLETED MODULES"}
        </button>
      </div>

      {/* Modules */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {filteredModules.map(
          (
            module: HideoutModule
          ) => (
            <HideoutModuleCard
              key={module.id}
              module={
                module
              }
              items={
                items
              }
              itemMap={
                itemMap
              }
              collapsed={
                collapsedModules[
                  module.id
                ]
              }
              hideCompletedRequirements={
                false
              }
              toggleCollapse={() =>
                setCollapsedModules(
                  (prev) => ({
                    ...prev,

                    [module.id]:
                      !prev[
                        module.id
                      ],
                  })
                )
              }
              resetModule={
                resetModule
              }
              completeLevel={
                completeLevel
              }
              getCompletedLevel={
                getCompletedLevel
              }
              isLevelCompleted={
                isLevelCompleted
              }
              getTrackedQuantity={
                getTrackedQuantity
              }
            />
          )
        )}
      </div>
    </div>
  );
}