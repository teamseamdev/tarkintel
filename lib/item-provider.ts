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

export const revalidate = 3600;

export const getItems =
  cache(async (): Promise<
    TarkovItem[]
  > => {
      /*
        LIVE ITEMS
      */

      const liveItems =
        await getLiveItems();

      /*
        LIVE TASKS
      */

      const tasks =
        (await getTasks()) as RelatedTask[];

      /*
        LIVE HIDEOUT
      */

      const hideoutModules =
        await getHideoutModules();

      /*
        REQUIREMENT MAP
      */

      const hideoutRequirementsMap =
        new Map<
          string,
          HideoutRequirement[]
        >();

      for (const module of hideoutModules) {
        for (const level of module.levels) {
          for (const requirement of level.requirements) {
            const existing =
              hideoutRequirementsMap.get(
                requirement.itemId
              ) ?? [];

            existing.push({
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
            });

            hideoutRequirementsMap.set(
              requirement.itemId,
              existing
            );
          }
        }
      }

      /*
        NORMALIZED ITEMS
      */

      const items: TarkovItem[] =
        liveItems.map(
          (item) => {
            /*
              RELATED MODULES
            */

            const relatedModules: HideoutModuleReference[] =
              hideoutModules
                .filter(
                  (module) =>
                    module.levels.some(
                      (level) =>
                        level.requirements.some(
                          (
                            requirement
                          ) =>
                            requirement.itemId ===
                            item.id
                        )
                    )
                )
                .map(
                  (module) => ({
                    id:
                      module.id,

                    name:
                      module.name,

                    level:
                      module.levels.length,
                  })
                );

            return normalizeLiveItem(
              item,
              {
                hideoutRequirements:
                  hideoutRequirementsMap.get(
                    item.id
                  ) ?? [],

                hideoutModules:
                  relatedModules,
              }
            );
          }
        );

      /*
        TASK ENRICHMENT
      */

      for (const item of items) {
        const relatedTasks =
          tasks.filter(
            (task) =>
              task.objectives?.some(
                (
                  objective: TaskObjective
                ) => {
                  const description =
                    (
                      objective.description ||
                      ""
                    ).toLowerCase();

                  const directMatch =
                    objective.item
                      ?.name ===
                    item.name;

                  const multiMatch =
                    objective.items?.some(
                      (
                        objectiveItem: TaskObjectiveItem
                      ) =>
                        objectiveItem.name ===
                        item.name
                    );

                  if (
                    !directMatch &&
                    !multiMatch
                  ) {
                    return false;
                  }

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
                    return false;
                  }

                  return true;
                }
              )
          );

        item.relatedTasks =
          relatedTasks.map(
            (task) => ({
              id:
                task.id,

              name:
                task.name,
            })
          );
      }

      return items;
    }
  );