export interface TarkovObjective {
  id: string;

  description: string;
}

export interface TarkovTaskRequirement {
  item?: {
    id?: string;

    name?: string;
  };

  count?: number;

  foundInRaid?: boolean;
}

export interface TarkovTask {
  /*
    CORE TASK INFO
  */

  id: string;

  name: string;

  trader: string | null;

  wikiLink?: string;

  /*
    MAPS
  */

  map?: string;

  maps: string[];

  /*
    XP / REWARDS
  */

  experience: number;

  xp: number;

  /*
    LIVE OBJECTIVES
    NORMALIZED FROM TARKOV.DEV
  */

  objectives: TarkovObjective[];

  /*
    PROGRESSION
  */

  prerequisites: string[];

  missingRequirements?: string[];

  /*
    ITEM REQUIREMENTS
    (HANDOVER TASKS)
  */

  taskRequirements?: TarkovTaskRequirement[];

  /*
    TASK META
  */

  factionName?: string;

  kappaRequired: boolean;

  levelRequired: number;

  minPlayerLevel: number;

  /*
    SPECIAL TASK TYPES
  */

  isEvent: boolean;

  isLightkeeper: boolean;

  isAvailableFromStart: boolean;
}