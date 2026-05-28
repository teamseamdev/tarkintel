import {
  getTasks,
} from "@/lib/task-provider";

import {
  getItems,
} from "@/lib/item-provider";

import {
  TarkovTask,
} from "@/types/task";

import {
  TarkovItem,
} from "@/types/item";

interface ItemUsage {
  task: TarkovTask;

  amount: number;

  foundInRaid?: boolean;
}

export async function getTasksByItem(
  itemName: string
) {
  const tasks =
    await getTasks();

  const matches: ItemUsage[] =
    [];

  for (const task of tasks) {
    const objectives =
      task.objectives || [];

    for (const objective of objectives) {
      /*
        DESCRIPTION
      */

      const description =
        (
          objective.description ||
          ""
        ).toLowerCase();

      /*
        IGNORE GENERIC
        ECONOMY TASKS
      */

      const isGenericSellTask =
        description.includes(
          "sell any"
        ) ||
        description.includes(
          "hand over any"
        ) ||
        description.includes(
          "turn in any"
        );

      if (
        isGenericSellTask
      ) {
        continue;
      }

      /*
        DIRECT ITEM

        Transitional support
        for legacy objective
        shapes.
      */

      const directItemMatch =
        (
          objective as any
        ).item?.name ===
        itemName;

      /*
        MULTI ITEM
      */

      const multiItemMatch =
  (
    objective as any
  ).items?.some(
         (
  objectiveItem: any
) =>
            objectiveItem.name ===
            itemName
        );

      /*
        ONLY USE
        STRUCTURED ITEM
        RELATIONSHIPS

        NO DESCRIPTION
        PARSING
      */

      if (
        directItemMatch ||
        multiItemMatch
      ) {
        matches.push({
          task,

          amount:
  (
    objective as any
  ).count || 1,

          foundInRaid:
  (
    objective as any
  ).foundInRaid,
        });

        break;
      }
    }
  }

  return matches;
}

export async function getItemPriority(
  itemName: string
) {
  const relatedTasks =
    await getTasksByItem(
      itemName
    );

  const kappaTasks =
    relatedTasks.filter(
      (entry) =>
        entry.task
          .kappaRequired
    );

  let score = 0;

  /*
    BASE TASK VALUE
  */

  score +=
    relatedTasks.length *
    2;

  /*
    KAPPA BONUS
  */

  score +=
    kappaTasks.length * 3;

  /*
    FIR BONUS
  */

  score +=
    relatedTasks.filter(
      (entry) =>
        entry.foundInRaid
    ).length * 2;

  if (score >= 12)
    return "EXTREMELY HIGH";

  if (score >= 7)
    return "HIGH";

  if (score >= 3)
    return "MEDIUM";

  return "LOW";
}

export async function getItemById(
  id: string
): Promise<
  TarkovItem | undefined
> {
  const items =
    await getItems();

  return items.find(
    (item) =>
      item.id === id
  );
}