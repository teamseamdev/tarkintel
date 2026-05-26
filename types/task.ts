export interface TarkovObjective {
  id: string;

  description: string;
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