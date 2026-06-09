"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "@/components/auth-provider";

import {
  loadTrackedItems,
  saveTrackedItem,
} from "@/lib/tracked-item-sync";

import {
  createDebouncedSync,
} from "@/lib/create-debounced-sync";

const STORAGE_KEY =
  "tarkintel-tracked-items";

interface TrackedItemRecord {
  item_id: string;

  quantity: number;
}

export function useTrackedItems() {
  const { profile } =
    useAuth();

  /*
    STATE
  */

  const [
    trackedItems,
    setTrackedItems,
  ] = useState<
    Record<string, number>
  >({});

  /*
    LOCAL READY
    IMMEDIATELY
  */

  const [loaded, setLoaded] =
    useState(false);

  /*
    DEBOUNCED CLOUD
  */

  const debouncedSync =
    useMemo(() => {
      return createDebouncedSync(
        async ({
          itemId,
          quantity,
        }: {
          itemId: string;

          quantity: number;
        }) => {
          if (
            !profile?.id
          ) {
            return;
          }

          await saveTrackedItem(
            profile.id,
            itemId,
            quantity
          );
        },
        800
      );
    }, [profile?.id]);

  /*
    LOCAL HYDRATION
    FIRST
  */

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(
          STORAGE_KEY
        );

      if (saved) {
        setTrackedItems(
          JSON.parse(saved)
        );
      }
    } catch (error) {
      console.error(
        "LOCAL TRACKED ITEMS ERROR:",
        error
      );
    } finally {
      /*
        APP READY
        IMMEDIATELY
      */

      setLoaded(true);
    }
  }, []);

  /*
    CLOUD SYNC
    BACKGROUND ONLY
  */

  useEffect(() => {
    let cancelled = false;

    async function syncCloud() {
      if (!profile?.id) {
        return;
      }

      try {
        const cloudItems =
          await loadTrackedItems(
            profile.id
          );

        if (
          cancelled
        ) {
          return;
        }

        const mapped =
          Object.fromEntries(
            cloudItems.map(
              (
                item: TrackedItemRecord
              ) => [
                item.item_id,
                item.quantity,
              ]
            )
          );

        /*
          UPDATE UI
        */

        setTrackedItems(
          mapped
        );

        /*
          UPDATE CACHE
        */

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(
            mapped
          )
        );
      } catch (error) {
        console.error(
          "TRACKED ITEM CLOUD SYNC ERROR:",
          error
        );
      }
    }

    syncCloud();

    return () => {
      cancelled = true;
    };
  }, [profile?.id]);

  /*
    LOCAL SAVE
  */

  useEffect(() => {
    if (!loaded) {
      return;
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        trackedItems
      )
    );
  }, [
    trackedItems,
    loaded,
  ]);

  /*
    GET
  */

  function getTrackedQuantity(
    itemId: string
  ) {
    return (
      trackedItems[
        itemId
      ] || 0
    );
  }

  /*
    SET
  */

  function setTrackedQuantity(
    itemId: string,
    quantity: number
  ) {
    const safeQuantity =
      Math.max(
        0,
        quantity
      );

    /*
      INSTANT LOCAL
    */

    setTrackedItems(
      (prev) => ({
        ...prev,

        [itemId]:
          safeQuantity,
      })
    );

    /*
      CLOUD
    */

    if (!profile?.id) {
      return;
    }

    debouncedSync({
      itemId,

      quantity:
        safeQuantity,
    });
  }

  /*
    INCREMENT
  */

  function incrementItem(
    itemId: string
  ) {
    setTrackedQuantity(
      itemId,
      getTrackedQuantity(
        itemId
      ) + 1
    );
  }

  /*
    DECREMENT
  */

  function decrementItem(
    itemId: string
  ) {
    setTrackedQuantity(
      itemId,
      Math.max(
        0,
        getTrackedQuantity(
          itemId
        ) - 1
      )
    );
  }

  /*
    INVENTORY
  */

  function getItemAllocation(
    itemId: string,
    options?: {
      usedInHideout?: number;

      reservedForFuture?: number;
    }
  ) {
    const owned =
      getTrackedQuantity(
        itemId
      );

    const used =
      options
        ?.usedInHideout || 0;

    const reserved =
      options
        ?.reservedForFuture ||
      0;

    const free = Math.max(
      0,
      owned -
        used -
        reserved
    );

    return {
      owned,

      used,

      reserved,

      free,
    };
  }

  return {
    trackedItems,

    getTrackedQuantity,

    setTrackedQuantity,

    incrementItem,

    decrementItem,

    getItemAllocation,

    loaded,
  };
}