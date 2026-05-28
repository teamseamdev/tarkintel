import { cache } from "react";

import { tarkovDevQuery } from "@/lib/tarkov-dev";

export interface LiveHideoutRequirement {
  itemId: string;

  itemName: string;

  count: number;
}

export interface LiveStationRequirement {
  stationId: string;

  stationName: string;

  level: number;
}

export interface LiveHideoutLevel {
  level: number;

  /*
    Tarkov.dev no longer
    exposes this directly.
  */
  requiredPlayerLevel:
    | number
    | null;

  requiredItems:
    LiveHideoutRequirement[];

  stationRequirements:
    LiveStationRequirement[];
}

export interface LiveHideoutModule {
  id: string;

  name: string;

  levels: LiveHideoutLevel[];
}

const HIDEOUT_QUERY = `
{
  hideoutStations {
    id

    name

    levels {
      level

      itemRequirements {
        count

        item {
          id
          name
        }
      }

      stationLevelRequirements {
        station {
          id
          name
        }

        level
      }
    }
  }
}
`;

export const getLiveHideoutModules =
  cache(
    async (): Promise<
      LiveHideoutModule[]
    > => {
      const data =
        await tarkovDevQuery(
          HIDEOUT_QUERY
        );

      const stations =
        data?.hideoutStations ??
        [];

      return stations.map(
        (station: any) => ({
          id: station.id,

          name: station.name,

          levels:
            (
              station.levels ??
              []
            ).map(
              (
                level: any
              ) => ({
                level:
                  level.level,

                /*
                  Placeholder for
                  future semantic
                  requirement
                  derivation.
                */
                requiredPlayerLevel:
                  null,

                requiredItems:
                  (
                    level.itemRequirements ??
                    []
                  ).map(
                    (
                      requirement: any
                    ) => ({
                      itemId:
                        requirement.item
                          ?.id ??
                        "",

                      itemName:
                        requirement.item
                          ?.name ??
                        "Unknown Item",

                      count:
                        requirement.count ??
                        0,
                    })
                  ),

                stationRequirements:
                  (
                    level.stationLevelRequirements ??
                    []
                  ).map(
                    (
                      requirement: any
                    ) => ({
                      stationId:
                        requirement
                          .station
                          ?.id ?? "",

                      stationName:
                        requirement
                          .station
                          ?.name ??
                        "Unknown Station",

                      level:
                        requirement.level ??
                        0,
                    })
                  ),
              })
            ),
        })
      );
    }
  );