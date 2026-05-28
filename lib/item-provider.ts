import { cache } from "react";

import {
  getLiveItems,
} from "@/lib/live-item-source";

import {
  normalizeLiveItem,
} from "@/lib/normalize-live-item";

import {
  getTasks,
} from "@/lib/task-provider";

import {
  getHideoutModules,
} from "@/lib/hideout-provider";

import type {
  HideoutModuleReference,
  HideoutRequirement,
  RelatedTask,
  TaskObjective,
  TaskObjectiveItem,
  TarkovItem,
} from "@/types/item";

export const revalidate =
  3600;

export const getItems =
  cache(
    async (): Promise<
      TarkovItem[]
    > => {
      /*
        PARALLEL FETCH
      */

      const [
        liveItems,
        tasks,
        hideoutModules,
      ] =
        await Promise.all([
          getLiveItems(),

          getTasks(),

          getHideoutModules(),
        ]);

      /*
        MAPS
      */

      const hideoutRequirementsMap =
        new Map<
          string,
          HideoutRequirement[]
        >();

      const hideoutModulesMap =
        new Map<
          string,
          HideoutModuleReference[]
        >();

      const relatedTasksMap =
        new Map<
          string,
          {
            id: string;

            name: string;
          }[]
        >();

      /*
        BUILD HIDEOUT MAPS
      */

      for (const module of hideoutModules) {
        for (const level of module.levels) {
          for (const requirement of level.requirements) {
            /*
              REQUIREMENTS
            */

            const existingRequirements =
              hideoutRequirementsMap.get(
                requirement.itemId
              ) ?? [];

            existingRequirements.push(
              {
                itemId:
                  requirement.itemId,

                itemName:
                  requirement.itemName,

                stationName:
                  module.name,

                stationLevel:
                  level.level,

                count:
                  requirement.count,
              }
            );

            hideoutRequirementsMap.set(
              requirement.itemId,
              existingRequirements
            );

            /*
              MODULES
            */

            const existingModules =
              hideoutModulesMap.get(
                requirement.itemId
              ) ?? [];

            /*
              PREVENT DUPES
            */

            const alreadyExists =
              existingModules.some(
                (
                  existing
                ) =>
                  existing.id ===
                  module.id
              );

            if (
              !alreadyExists
            ) {
              existingModules.push(
                {
                  id:
                    module.id,

                  name:
                    module.name,

                  level:
                    level.level,
                }
              );

              hideoutModulesMap.set(
                requirement.itemId,
                existingModules
              );
            }
          }
        }
      }

      /*
        BUILD TASK MAP
      */

      for (const task of tasks as RelatedTask[]) {
        for (const objective of task.objectives ??
          []) {
          const description =
            (
              objective.description ||
              ""
            ).toLowerCase();

          /*
            IGNORE GENERIC
          */

          if (
            description.includes(
              "sell any"
            ) ||
            description.includes(
              "turn in any"
            ) ||
            description.includes(
              "hand over any"
            )
          ) {
            continue;
          }

          const itemNames =
            new Set<
              string
            >();

          /*
            DIRECT ITEM
          */

          if (
            objective.item
              ?.name
          ) {
            itemNames.add(
              objective.item
                .name
            );
          }

          /*
            MULTI ITEMS
          */

          for (const objectiveItem of objective.items ??
            []) {
            itemNames.add(
              objectiveItem.name
            );
          }

          /*
            MAP TASKS
          */

          for (const itemName of itemNames) {
            const existing =
              relatedTasksMap.get(
                itemName
              ) ?? [];

            existing.push({
              id:
                task.id,

              name:
                task.name,
            });

            relatedTasksMap.set(
              itemName,
              existing
            );
          }
        }
      }

      /*
        NORMALIZE ITEMS
      */

      const items: TarkovItem[] =
        liveItems.map(
          (item) => {
            const normalized =
              normalizeLiveItem(
                item,
                {
                  hideoutRequirements:
                    hideoutRequirementsMap.get(
                      item.id
                    ) ?? [],

                  hideoutModules:
                    hideoutModulesMap.get(
                      item.id
                    ) ?? [],
                }
              );

            /*
              TASKS
            */

            normalized.relatedTasks =
              relatedTasksMap.get(
                item.name
              ) ?? [];

            return normalized;
          }
        );

      return items;
    }
  );