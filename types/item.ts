export interface ItemReference {
  itemId: string;

  amount: number;

  foundInRaid?: boolean;
}

export interface Item {
  id: string;

  name: string;

  shortName?: string;

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

  fleaBanned: boolean;

  avgPrice?: number;

  usedInTasks: string[];

  usedInHideout: string[];

  usedInCrafts: string[];

  icon?: string;
}