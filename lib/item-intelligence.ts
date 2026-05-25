import { hideoutModules } from "@/data/hideout/modules";

import { items } from "@/data/items/items";

/*
  ITEM LOOKUPS
*/

export function getItemById(
  itemId: string
) {
  return items[itemId];
}

/*
  ITEM PRIORITY
  TEMPORARILY SIMPLIFIED
  UNTIL LIVE ITEM →
  TASK RELATIONSHIPS
  ARE IMPLEMENTED
*/

export function getItemPriority(
  itemId: string
) {
  /*
    HIDEOUT VALUE
  */

  const hideoutUsage =
    hideoutModules.filter(
      (module) =>
        module.requiredItems.some(
          (item) =>
            item.itemId === itemId
        )
    ).length;

  let score = 0;

  score += hideoutUsage * 2;

  if (score >= 10)
    return "EXTREMELY HIGH";

  if (score >= 6)
    return "HIGH";

  if (score >= 3)
    return "MEDIUM";

  return "LOW";
}

/*
  ITEM SEARCH
*/

export function getAllUniqueItems() {
  return Object.values(items).sort(
    (a, b) =>
      a.name.localeCompare(
        b.name
      )
  );
}

export function searchItems(
  searchTerm: string
) {
  const normalized =
    searchTerm.toLowerCase();

  return Object.values(items).filter(
    (item) =>
      item.name
        .toLowerCase()
        .includes(normalized) ||
      item.shortName
        ?.toLowerCase()
        .includes(normalized)
  );
}

/*
  LIVE KAPPA TASKS
*/

export function getKappaTasks(
  tasks: any[]
) {
  return tasks.filter(
    (task) =>
      task.kappaRequired
  );
}

/*
  REMAINING KAPPA TASKS
*/

export function getRemainingKappaTasks(
  tasks: any[],
  completedTaskIds: string[]
) {
  return getKappaTasks(
    tasks
  ).filter(
    (task) =>
      !completedTaskIds.includes(
        task.id
      )
  );
}

/*
  KAPPA PROGRESS
*/

export function getKappaProgress(
  tasks: any[],
  completedTaskIds: string[]
) {
  const kappaTasks =
    getKappaTasks(tasks);

  const completed =
    kappaTasks.filter((task) =>
      completedTaskIds.includes(
        task.id
      )
    ).length;

  const total =
    kappaTasks.length;

  const percentage =
    total > 0
      ? Math.round(
          (completed / total) *
            100
        )
      : 0;

  return {
    completed,

    total,

    percentage,
  };
}

/*
  LIVE TRADER PROGRESSION
*/

export function getTraderProgress(
  tasks: any[],
  completedTaskIds: string[]
) {
  const traderMap = new Map<
    string,
    {
      completed: number;

      total: number;
    }
  >();

  tasks.forEach((task) => {
    if (!task.trader) {
      return;
    }

    const existing =
      traderMap.get(
        task.trader
      );

    const completed =
      completedTaskIds.includes(
        task.id
      );

    if (existing) {
      existing.total += 1;

      if (completed) {
        existing.completed += 1;
      }
    } else {
      traderMap.set(
        task.trader,
        {
          completed:
            completed ? 1 : 0,

          total: 1,
        }
      );
    }
  });

  return Array.from(
    traderMap.entries()
  )
    .map(
      ([trader, stats]) => ({
        trader,

        completed:
          stats.completed,

        total: stats.total,

        percentage:
          stats.total > 0
            ? Math.round(
                (stats.completed /
                  stats.total) *
                  100
              )
            : 0,
      })
    )
    .sort(
      (a, b) =>
        b.completed -
        a.completed
    );
}

/*
  ITEM SLUGS
*/

export function createItemSlug(
  itemId: string
) {
  return itemId;
}

export function getItemBySlug(
  slug: string
) {
  return items[slug];
}

/*
  HIDEOUT
*/

export function getHideoutItems() {
  const itemMap = new Map<
    string,
    number
  >();

  hideoutModules.forEach(
    (module) => {
      module.requiredItems.forEach(
        (item) => {
          const current =
            itemMap.get(
              item.itemId
            ) || 0;

          itemMap.set(
            item.itemId,
            current +
              item.amount
          );
        }
      );
    }
  );

  return Array.from(
    itemMap.entries()
  )
    .map(([itemId, amount]) => ({
      item: items[itemId],

      amount,
    }))
    .filter(
      (entry) => entry.item
    )
    .sort(
      (a, b) =>
        b.amount - a.amount
    );
}

export function getModulesByItem(
  itemId: string
) {
  return hideoutModules.filter(
    (module) =>
      module.requiredItems.some(
        (item) =>
          item.itemId === itemId
      )
  );
}