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
      try {
        const data =
          await tarkovDevQuery(
            HIDEOUT_QUERY
          );

        /*
          HARDEN AGAINST
          INVALID API DATA
        */

        if (
          !data ||
          typeof data !==
            "object"
        ) {
          console.error(
            "INVALID HIDEOUT DATA:",
            data
          );

          return [];
        }

        const stations =
          Array.isArray(
            data?.hideoutStations
          )
            ? data.hideoutStations
            : [];

        return stations
          .filter(
            (
              station: any
            ) =>
              station &&
              typeof station ===
                "object"
          )
          .map(
            (
              station: any
            ) => ({
              id:
                station.id ??
                crypto.randomUUID(),

              name:
                station.name ??
                "Unknown Station",

              levels:
                Array.isArray(
                  station.levels
                )
                  ? station.levels
                      .filter(
                        (
                          level: any
                        ) =>
                          level &&
                          typeof level ===
                            "object"
                      )
                      .map(
                        (
                          level: any
                        ) => ({
                          level:
                            typeof level.level ===
                            "number"
                              ? level.level
                              : 0,

                          /*
                            Placeholder for
                            future semantic
                            requirement
                            derivation.
                          */
                          requiredPlayerLevel:
                            null,

                          requiredItems:
                            Array.isArray(
                              level.itemRequirements
                            )
                              ? level.itemRequirements.map(
                                  (
                                    requirement: any
                                  ) => ({
                                    itemId:
                                      requirement
                                        ?.item
                                        ?.id ??
                                      "",

                                    itemName:
                                      requirement
                                        ?.item
                                        ?.name ??
                                      "Unknown Item",

                                    count:
                                      typeof requirement?.count ===
                                      "number"
                                        ? requirement.count
                                        : 0,
                                  })
                                )
                              : [],

                          stationRequirements:
                            Array.isArray(
                              level.stationLevelRequirements
                            )
                              ? level.stationLevelRequirements.map(
                                  (
                                    requirement: any
                                  ) => ({
                                    stationId:
                                      requirement
                                        ?.station
                                        ?.id ??
                                      "",

                                    stationName:
                                      requirement
                                        ?.station
                                        ?.name ??
                                      "Unknown Station",

                                    level:
                                      typeof requirement?.level ===
                                      "number"
                                        ? requirement.level
                                        : 0,
                                  })
                                )
                              : [],
                        })
                      )
                  : [],
            })
          );
      } catch (error) {
        /*
          PRODUCTION HARDENING

          Tarkov.dev can:
          - timeout
          - return invalid JSON
          - partially fail
          - return malformed data

          NEVER crash app render.
        */

        console.error(
          "HIDEOUT FETCH ERROR:",
          error
        );

        /*
          FAIL GRACEFULLY
        */

        return [];
      }
    }
  );