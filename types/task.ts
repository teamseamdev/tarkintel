export interface TarkovObjective {
  id?: string;

  description?: string;
}

export interface TarkovTask {
  id: string;

  name: string;

  trader?: string | null;

  map?: string;

  maps?: string[];

  wikiLink?: string;

  experience?: number;

  xp?: number;

  /*
    LIVE OBJECTIVES
    FROM TARKOV.DEV
  */
  objectives?: TarkovObjective[];

  /*
    PROGRESSION
  */
  prerequisites?: string[];

  missingRequirements?: string[];

  /*
    TASK META
  */
  factionName?: string;

  kappaRequired?: boolean;

  levelRequired?: number;

  minPlayerLevel?: number;

  /*
    SPECIAL TASK TYPES
  */
  isEvent?: boolean;

  isLightkeeper?: boolean;

  isAvailableFromStart?: boolean;
}