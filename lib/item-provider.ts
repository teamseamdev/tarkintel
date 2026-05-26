import { cache } from "react";

import {
  getLiveItems,
} from "@/lib/live-item-source";

import {
  normalizeLiveItem,
} from "@/lib/normalize-live-item";

import {
  TarkovItem,
} from "@/types/item";

export const getItems =
  cache(
    async (): Promise<
      TarkovItem[]
    > => {
      const liveItems =
        await getLiveItems();

      return liveItems.map(
        (item) =>
          normalizeLiveItem(
            item
          )
      );
    }
  );