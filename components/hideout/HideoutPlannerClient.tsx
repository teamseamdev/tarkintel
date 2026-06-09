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
  >({});

  /*
    HIDE COMPLETED
    REQUIREMENTS
  */

  const [
    hideCompletedRequirements,
    setHideCompletedRequirements,
  ] = useState(false);

  /*
    PERSIST
  */

  useEffect(() => {
    const stored =
      localStorage.getItem(
        "hide-completed-requirements"
      );

    if (stored) {
      setHideCompletedRequirements(
        stored === "true"
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "hide-completed-requirements",
      String(
        hideCompletedRequirements
      )
    );
  }, [
    hideCompletedRequirements,
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
            setHideCompletedRequirements(
              (prev) =>
                !prev
            )
          }
          className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
            hideCompletedRequirements
              ? "border-primary/30 bg-primary/10 text-primary"
              : "border-white/10 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.06]"
          }`}
        >
          {hideCompletedRequirements
            ? "SHOW COMPLETED REQUIREMENTS"
            : "HIDE COMPLETED REQUIREMENTS"}
        </button>
      </div>

      {/* Modules */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {sortedModules.map(
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
                hideCompletedRequirements
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