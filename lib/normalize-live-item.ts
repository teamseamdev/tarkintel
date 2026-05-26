import {
  LiveItem,
} from "@/lib/live-item-source";

import {
  TarkovItem,
} from "@/types/item";

function normalizeCategory(
  category?: string
): TarkovItem["category"] {
  const normalized =
    category
      ?.toLowerCase()
      .trim();

  if (
    normalized?.includes(
      "ammo"
    )
  ) {
    return "ammo";
  }

  if (
    normalized?.includes(
      "weapon"
    )
  ) {
    return "weapon";
  }

  if (
    normalized?.includes(
      "armor"
    )
  ) {
    return "armor";
  }

  if (
    normalized?.includes(
      "medical"
    )
  ) {
    return "medical";
  }

  if (
    normalized?.includes(
      "food"
    ) ||
    normalized?.includes(
      "drink"
    ) ||
    normalized?.includes(
      "provision"
    )
  ) {
    return "provision";
  }

  if (
    normalized?.includes(
      "electronics"
    )
  ) {
    return "electronics";
  }

  if (
    normalized?.includes(
      "building"
    )
  ) {
    return "building";
  }

  if (
    normalized?.includes(
      "key"
    )
  ) {
    return "key";
  }

  if (
    normalized?.includes(
      "barter"
    )
  ) {
    return "barter";
  }

  return "other";
}

export function normalizeLiveItem(
  item: LiveItem
): TarkovItem {
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
        item.categories?.[0]
          ?.name
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
      (FILLED LATER)
    */
    usedInTasks: [],

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