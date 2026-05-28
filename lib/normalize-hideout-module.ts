import {
  LiveHideoutModule,
} from "@/lib/live-hideout-source";

export interface NormalizedHideoutRequirement {
  itemId: string;

  itemName: string;

  count: number;

  stationName: string;

  stationLevel: number;
}

export interface NormalizedStationRequirement {
  stationId: string;

  stationName: string;

  level: number;
}

export interface NormalizedHideoutLevel {
  level: number;

  requirements:
    NormalizedHideoutRequirement[];

  stationRequirements:
    NormalizedStationRequirement[];
}

export interface NormalizedHideoutModule {
  id: string;

  name: string;

  levels:
    NormalizedHideoutLevel[];
}

export function normalizeHideoutModule(
  module: LiveHideoutModule
): NormalizedHideoutModule {
  return {
    id: module.id,

    name: module.name,

    levels:
      module.levels.map(
        (level) => ({
          level: level.level,

          requirements:
            (
              level.requiredItems ??
              []
            ).map(
              (
                requirement
              ) => ({
                itemId:
                  requirement.itemId,

                itemName:
                  requirement.itemName,

                count:
                  requirement.count,

                stationName:
                  module.name,

                stationLevel:
                  level.level,
              })
            ),

          stationRequirements:
            (
              level.stationRequirements ??
              []
            ).map(
              (
                requirement
              ) => ({
                stationId:
                  requirement.stationId,

                stationName:
                  requirement.stationName,

                level:
                  requirement.level,
              })
            ),
        })
      ),
  };
}