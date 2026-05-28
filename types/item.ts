export interface ItemReference {
  itemId: string;

  amount: number;

  foundInRaid?: boolean;
}

/*
  HIDEOUT REQUIREMENTS
*/

export interface HideoutRequirement {
  itemId: string;

  itemName: string;

  stationName: string;

  stationLevel: number;

  count: number;

  completed?: boolean;
}

/*
  HIDEOUT MODULE REFERENCES
*/

export interface HideoutModuleReference {
  id: string;

  name: string;

  level: number;

  itemRequirements?: {
    itemId: string;

    count: number;
  }[];
}

/*
  RELATED TASKS
*/

export interface RelatedTaskReference {
  id: string;

  name: string;
}

/*
  SELL VALUE
*/

export interface VendorSellPrice {
  vendor: string;

  price: number;
}

/*
  CORE ITEM
*/

/*
  TASK OBJECTIVES
*/

export interface TaskObjectiveItem {
  name: string;
}

export interface TaskObjective {
  description?: string;

  item?: TaskObjectiveItem;

  items?: TaskObjectiveItem[];
}

/*
  RELATED TASK
*/

export interface RelatedTask {
  id: string;

  name: string;

  objectives?: TaskObjective[];
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
    TASK INTELLIGENCE
  */

  usedInTasks: string[];

  handoverTasks: string[];

  combatTasks: string[];

  keyTasks: string[];

  hideoutTasks: string[];

  craftTasks: string[];

  /*
    RELATED TASKS
    (NEW PROGRESSION INTELLIGENCE)
  */

  relatedTasks?: RelatedTaskReference[];

  /*
    HIDEOUT INTELLIGENCE
  */

  requiredForHideout?: boolean;

  hideoutRequirements?: HideoutRequirement[];

  hideoutModules?: HideoutModuleReference[];

  totalHideoutRequired?: number;

  usedInHideout: string[];

  usedInCrafts: string[];

  /*
    FUTURE PROGRESSION INTELLIGENCE
  */

  totalTaskRequired?: number;

  firTaskRequired?: number;

  /*
    ECONOMY / SELL INTELLIGENCE
  */

  traderValue?: number;

  sellFor?: VendorSellPrice[];
}