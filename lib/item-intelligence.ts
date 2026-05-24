import { allTasks } from "@/data/tasks";
import { hideoutModules } from "@/data/hideout/modules";

import { items } from "@/data/items/items";

export function getItemById(
  itemId: string
) {
  return items[itemId];
}

export function getTasksByItem(
  itemId: string
) {
  return allTasks.filter((task) =>
    task.requiredItems?.some(
      (item) =>
        item.itemId === itemId
    )
  );
}

export function getItemPriority(
  itemId: string
) {
  const relatedTasks =
    getTasksByItem(itemId);

  const kappaTasks =
    relatedTasks.filter(
      (task) => task.kappaRequired
    );

  const firTasks =
    relatedTasks.filter((task) =>
      task.requiredItems?.some(
        (item) =>
          item.itemId === itemId &&
          item.foundInRaid
      )
    );

  let score = 0;

  score += relatedTasks.length * 2;

  score += kappaTasks.length * 3;

  score += firTasks.length * 2;

  if (score >= 10)
    return "EXTREMELY HIGH";

  if (score >= 6)
    return "HIGH";

  if (score >= 3)
    return "MEDIUM";

  return "LOW";
}

export function getAllUniqueItems() {
  return Object.values(items).sort(
    (a, b) =>
      a.name.localeCompare(b.name)
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

export function getUpcomingItems(
  completedTaskIds: string[]
) {
  const remainingTasks =
    allTasks.filter(
      (task) =>
        !completedTaskIds.includes(
          task.id
        )
    );

  const itemMap = new Map<
    string,
    number
  >();

  remainingTasks.forEach((task) => {
    task.requiredItems?.forEach(
      (item) => {
        const current =
          itemMap.get(item.itemId) || 0;

        itemMap.set(
          item.itemId,
          current + item.amount
        );
      }
    );
  });

  return Array.from(itemMap.entries())
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
    )
    .slice(0, 8);
}

export function getKappaTasks() {
  return allTasks.filter(
    (task) => task.kappaRequired
  );
}

export function getRemainingKappaTasks(
  completedTaskIds: string[]
) {
  return getKappaTasks().filter(
    (task) =>
      !completedTaskIds.includes(
        task.id
      )
  );
}

export function getKappaProgress(
  completedTaskIds: string[]
) {
  const kappaTasks =
    getKappaTasks();

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

export function getTraderProgress(
  completedTaskIds: string[]
) {
  const traderMap = new Map<
    string,
    {
      completed: number;
      total: number;
    }
  >();

  allTasks.forEach((task) => {
    const existing =
      traderMap.get(task.trader);

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
  ).map(([trader, stats]) => ({
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
  }));
}

export function getRecommendedTasks(
  completedTaskIds: string[]
) {
  const incompleteTasks =
    allTasks.filter(
      (task) =>
        !completedTaskIds.includes(
          task.id
        )
    );

  return incompleteTasks
    .sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;

      if (a.kappaRequired)
        scoreA += 5;

      if (b.kappaRequired)
        scoreB += 5;

      if (
        a.requiredItems?.some(
          (item) =>
            item.foundInRaid
        )
      ) {
        scoreA += 2;
      }

      if (
        b.requiredItems?.some(
          (item) =>
            item.foundInRaid
        )
      ) {
        scoreB += 2;
      }

      scoreA +=
        10 -
        (a.levelRequired || 1);

      scoreB +=
        10 -
        (b.levelRequired || 1);

      return scoreB - scoreA;
    })
    .slice(0, 5);
}

export function getTaskById(
  id: string
) {
  return allTasks.find(
    (task) => task.id === id
  );
}

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