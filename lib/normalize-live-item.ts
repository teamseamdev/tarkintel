import {
  LiveItem,
} from "@/lib/live-item-source";

import {
  TarkovItem,
  HideoutRequirement,
} from "@/types/item";

function normalizeCategory(
  categories?: {
    name?: string;
  }[]
): TarkovItem["category"] {
  /*
    ALL CATEGORY NAMES
  */

  const categoryNames =
    (
      categories || []
    ).map((category) =>
      (
        category.name || ""
      ).toLowerCase()
    );

  /*
    WEAPONS
  */

  if (
    categoryNames.some(
      (name) =>
        name.includes(
          "weapon"
        ) ||
        name.includes(
          "assault rifle"
        ) ||
        name.includes(
          "marksman rifle"
        ) ||
        name.includes(
          "submachine gun"
        ) ||
        name.includes(
          "shotgun"
        ) ||
        name.includes(
          "sniper rifle"
        ) ||
        name.includes(
          "machine gun"
        ) ||
        name.includes(
          "pistol"
        )
    )
  ) {
    return "weapon";
  }

  /*
    AMMO
  */

  if (
    categoryNames.some(
      (name) =>
        name.includes(
          "ammo"
        )
    )
  ) {
    return "ammo";
  }

  /*
    ARMOR
  */

  if (
    categoryNames.some(
      (name) =>
        name.includes(
          "armor"
        ) ||
        name.includes(
          "helmet"
        ) ||
        name.includes(
          "rig"
        )
    )
  ) {
    return "armor";
  }

  /*
    MEDICAL
  */

  if (
    categoryNames.some(
      (name) =>
        name.includes(
          "medical"
        ) ||
        name.includes(
          "med"
        )
    )
  ) {
    return "medical";
  }

  /*
    FOOD / PROVISIONS
  */

  if (
    categoryNames.some(
      (name) =>
        name.includes(
          "food"
        ) ||
        name.includes(
          "drink"
        ) ||
        name.includes(
          "provision"
        )
    )
  ) {
    return "provision";
  }

  /*
    ELECTRONICS
  */

  if (
    categoryNames.some(
      (name) =>
        name.includes(
          "electronics"
        )
    )
  ) {
    return "electronics";
  }

  /*
    BUILDING
  */

  if (
    categoryNames.some(
      (name) =>
        name.includes(
          "building"
        ) ||
        name.includes(
          "material"
        )
    )
  ) {
    return "building";
  }

  /*
    KEYS
  */

  if (
    categoryNames.some(
      (name) =>
        name.includes(
          "key"
        )
    )
  ) {
    return "key";
  }

  /*
    BARTER
  */

  if (
    categoryNames.some(
      (name) =>
        name.includes(
          "barter"
        )
    )
  ) {
    return "barter";
  }

  return "other";
}

export function normalizeLiveItem(
  item: LiveItem,

 options?: {
  hideoutRequirements?: HideoutRequirement[];

  hideoutModules?: any[];
}
): TarkovItem {
  /*
    HIDEOUT INTELLIGENCE
  */

  const hideoutRequirements =
    options?.hideoutRequirements ??
    [];

    const hideoutModules =
  options?.hideoutModules ??
  [];

  const totalHideoutRequired =
    hideoutRequirements.reduce(
      (
        total,
        requirement
      ) =>
        total +
        requirement.count,
      0
    );

  const requiredForHideout =
    hideoutRequirements.length >
    0;

  return {
    /*
      CORE
    */

    id: item.id,

    name: item.name,

    shortName:
      item.shortName,

    description:
      item.description,

    /*
      CLASSIFICATION
    */

    category:
      normalizeCategory(
        item.categories
      ),

    /*
      ECONOMY
    */

    avgPrice:
      item.avg24hPrice,

    low24hPrice:
      item.low24hPrice,

    high24hPrice:
      item.high24hPrice,

    lastLowPrice:
      item.lastLowPrice,

    fleaBanned: false,

    /*
      DIMENSIONS
    */

    width: item.width,

    height: item.height,

    weight: item.weight,

    /*
      MEDIA
    */

    icon:
      item.iconLink,

    image:
      item.image8xLink,

    /*
      PROGRESSION
    */

    usedInTasks: [],

    handoverTasks: [],

    combatTasks: [],

    keyTasks: [],

    hideoutTasks: [],

    craftTasks: [],

    /*
      HIDEOUT INTELLIGENCE
    */

    requiredForHideout,

    hideoutRequirements,

    hideoutModules,

    totalHideoutRequired,

    usedInHideout: [],

    usedInCrafts: [],

    /*
      SELL FOR
    */

    sellFor:
      item.sellFor?.map(
        (entry) => ({
          vendor:
            entry.vendor
              ?.name ||
            "Unknown",

          price:
            entry.price ||
            0,
        })
      ) || [],
  };
}