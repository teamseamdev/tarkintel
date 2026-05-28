import { cache } from "react";

import {
  getLiveHideoutModules,
} from "@/lib/live-hideout-source";

import {
  normalizeHideoutModule,
} from "@/lib/normalize-hideout-module";

import type {
  HideoutModule,
} from "@/types/hideout";

export const getHideoutModules =
  cache(
    async (): Promise<
      HideoutModule[]
    > => {
      /*
        LIVE MODULES
      */

      const liveModules =
        await getLiveHideoutModules();

      /*
        NORMALIZE
      */

      const modules =
        liveModules.map(
          (module) =>
            normalizeHideoutModule(
              module
            )
        );

      return modules;
    }
  );