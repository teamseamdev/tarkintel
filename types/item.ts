export interface ItemReference {
  itemId: string;

  amount: number;

  foundInRaid?: boolean;
}

export interface TarkovItem {
  /*
    CORE
  */
  id: string;

  name: string;

  shortName?: string;

  description?: string;

  /*
    CLASSIFICATION
  */
  category:
    | "barter"
    | "provision"
    | "medical"
    | "ammo"
    | "weapon"
    | "armor"
    | "key"
    | "electronics"
    | "building"
    | "other";

  /*
    ECONOMY
  */
  avgPrice?: number;

  low24hPrice?: number;

  high24hPrice?: number;

  lastLowPrice?: number;

  fleaBanned: boolean;

  /*
    DIMENSIONS
  */
  width?: number;

  height?: number;

  weight?: number;

  /*
    MEDIA
  */
  icon?: string;

  image?: string;

  /*
    PROGRESSION INTELLIGENCE
  */
  usedInTasks: string[];

  usedInHideout: string[];

  usedInCrafts: string[];

  /*
    FUTURE INTELLIGENCE
  */
  traderValue?: number;

  sellFor?: {
    vendor: string;

    price: number;
  }[];
}