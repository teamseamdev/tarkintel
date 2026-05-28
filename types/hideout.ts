export interface HideoutStationRequirement {
  stationId: string;

  stationName: string;

  level: number;
}

export interface HideoutRequirement {
  itemId: string;

  itemName: string;

  /*
    REQUIRED COUNT
  */

  count: number;

  /*
    OPTIONAL
    LEGACY SUPPORT

    Existing item-provider
    enrichment still expects
    these during transition.
  */

  stationName?: string;

  stationLevel?: number;
}

export interface HideoutLevel {
  level: number;

  requirements: HideoutRequirement[];

  stationRequirements?: HideoutStationRequirement[];
}

export interface HideoutModule {
  id: string;

  name: string;

  levels: HideoutLevel[];
}

export interface ShoppingListEntry {
  itemId: string;

  itemName: string;

  count: number;

  icon?: string;
}