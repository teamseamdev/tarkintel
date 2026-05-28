import type {
  HideoutLevel,
  HideoutModule,
  HideoutRequirement,
  HideoutStationRequirement,
  ShoppingListEntry,
} from "@/types/hideout";

import type {
  TarkovItem,
} from "@/types/item";

interface BuildProgressionStateParams {
  modules: HideoutModule[];

  items: TarkovItem[];

  getCompletedLevel: (
    moduleId: string
  ) => number;

  getTrackedQuantity: (
    itemId: string
  ) => number;
}

export interface RequirementAllocation {
  owned: number;

  used: number;

  reserved: number;

  free: number;

  missing: number;
}

export interface ActionableUpgrade {
  module: HideoutModule;

  level: HideoutLevel;
}

export interface UpgradeReadiness {
  status:
    | "ready"
    | "missing-items"
    | "blocked"
    | "completed";

  missingItems: {
    itemId: string;

    itemName: string;

    missing: number;
  }[];

  blockedBy: HideoutStationRequirement[];
}

export function getBlockedBy(
  level: HideoutLevel,
  getCompletedLevel: (
    moduleId: string
  ) => number
) {
  return (
    level.stationRequirements ??
    []
  ).filter(
    (
      requirement: HideoutStationRequirement
    ) => {
      const requiredLevel =
        getCompletedLevel(
          requirement.stationId
        );

      return (
        requiredLevel <
        requirement.level
      );
    }
  );
}

export function isLevelActionable(
  module: HideoutModule,
  level: HideoutLevel,
  completedLevel: number,
  getCompletedLevel: (
    moduleId: string
  ) => number
) {
  const isNext =
    level.level ===
    completedLevel + 1;

  const blockedBy =
    getBlockedBy(
      level,
      getCompletedLevel
    );

  const isBlocked =
    blockedBy.length > 0;

  return (
    !isBlocked &&
    isNext
  );
}

export function buildShoppingList({
  modules,
  items,
  getCompletedLevel,
  getTrackedQuantity,
}: BuildProgressionStateParams): ShoppingListEntry[] {
  const totals =
    new Map<
      string,
      ShoppingListEntry
    >();

  for (const module of modules) {
    const completedLevel =
      getCompletedLevel(
        module.id
      );

    for (const level of module.levels) {
      if (
        level.level <=
        completedLevel
      ) {
        continue;
      }

      for (const requirement of level.requirements) {
        const item =
          items.find(
            (
              entry
            ) =>
              entry.id ===
              requirement.itemId
          );

        const existing =
          totals.get(
            requirement.itemId
          );

        if (existing) {
          existing.count +=
            requirement.count;
        } else {
          totals.set(
            requirement.itemId,
            {
              itemId:
                requirement.itemId,

              itemName:
                requirement.itemName,

              count:
                requirement.count,

              icon:
                item?.icon,
            }
          );
        }
      }
    }
  }

  return Array.from(
    totals.values()
  )
    .map((entry) => {
      const item =
        items.find(
          (
            candidate
          ) =>
            candidate.id ===
            entry.itemId
        );

      const owned =
        item
          ? getTrackedQuantity(
              item.id
            )
          : 0;

      return {
        ...entry,

        count:
          Math.max(
            0,
            entry.count -
              owned
          ),
      };
    })
    .filter(
      (entry) =>
        entry.count > 0
    )
    .sort(
      (
        a,
        b
      ) =>
        b.count - a.count
    );
}

export function getBestNextUpgrade(
  modules: HideoutModule[],
  getCompletedLevel: (
    moduleId: string
  ) => number
): ActionableUpgrade | null {
  for (const module of modules) {
    const completedLevel =
      getCompletedLevel(
        module.id
      );

    const nextLevel =
      completedLevel + 1;

    const level =
      module.levels.find(
        (
          level
        ) =>
          level.level ===
          nextLevel
      );

    if (!level) {
      continue;
    }

    const blockedBy =
      getBlockedBy(
        level,
        getCompletedLevel
      );

    const isBlocked =
      blockedBy.length > 0;

    if (!isBlocked) {
      return {
        module,
        level,
      };
    }
  }

  return null;
}

export function getRequirementAllocation({
  requirement,
  item,
  completed,
  isActionable,
  getTrackedQuantity,
}: {
  requirement: HideoutRequirement;

  item?: TarkovItem;

  completed: boolean;

  isActionable: boolean;

  getTrackedQuantity: (
    itemId: string
  ) => number;
}): RequirementAllocation {
  const owned =
    item
      ? getTrackedQuantity(
          item.id
        )
      : 0;

  const used =
    completed
      ? requirement.count
      : 0;

  const reserved =
    isActionable
      ? requirement.count
      : 0;

  const free =
    Math.max(
      0,
      owned -
        used -
        reserved
    );

  const missing =
    Math.max(
      0,
      requirement.count -
        owned
    );

  return {
    owned,
    used,
    reserved,
    free,
    missing,
  };
}

export function getUpgradeReadiness({
  module,
  level,
  completed,
  getCompletedLevel,
  getTrackedQuantity,
  items,
}: {
  module: HideoutModule;

  level: HideoutLevel;

  completed: boolean;

  getCompletedLevel: (
    moduleId: string
  ) => number;

  getTrackedQuantity: (
    itemId: string
  ) => number;

  items: TarkovItem[];
}): UpgradeReadiness {
  /*
    COMPLETE
  */

  if (completed) {
    return {
      status:
        "completed",

      missingItems: [],

      blockedBy: [],
    };
  }

  /*
    BLOCKED
  */

  const blockedBy =
    getBlockedBy(
      level,
      getCompletedLevel
    );

  if (
    blockedBy.length > 0
  ) {
    return {
      status:
        "blocked",

      missingItems: [],

      blockedBy,
    };
  }

  /*
    MATERIAL CHECK
  */

  const missingItems =
    level.requirements
      .map(
        (
          requirement
        ) => {
          const item =
            items.find(
              (
                entry
              ) =>
                entry.id ===
                requirement.itemId
            );

          const allocation =
            getRequirementAllocation(
              {
                requirement,

                item,

                completed:
                  false,

                isActionable:
                  true,

                getTrackedQuantity,
              }
            );

          return {
            itemId:
              requirement.itemId,

            itemName:
              requirement.itemName,

            missing:
              allocation.missing,
          };
        }
      )
      .filter(
        (
          entry
        ) =>
          entry.missing > 0
      );

  /*
    READY
  */

  if (
    missingItems.length ===
    0
  ) {
    return {
      status:
        "ready",

      missingItems: [],

      blockedBy: [],
    };
  }

  /*
    MISSING ITEMS
  */

  return {
    status:
      "missing-items",

    missingItems,

    blockedBy: [],
  };
}