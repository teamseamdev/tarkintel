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

  const [loaded, setLoaded] =
    useState(false);

  /*
    DEBOUNCED SYNC
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
    INITIAL LOAD
  */

  useEffect(() => {
    let cancelled = false;

    async function loadItems() {
      try {
        /*
          AUTH USER
        */

        if (profile?.id) {
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

          setTrackedItems(
            mapped
          );

          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(
              mapped
            )
          );
        }

        /*
          GUEST USER
        */

        else {
          const saved =
            localStorage.getItem(
              STORAGE_KEY
            );

          if (
            saved &&
            !cancelled
          ) {
            setTrackedItems(
              JSON.parse(saved)
            );
          }
        }
      } catch (error) {
        console.error(
          "TRACKED ITEM LOAD ERROR:",
          error
        );
      } finally {
        if (
          !cancelled
        ) {
          setLoaded(true);
        }
      }
    }

    loadItems();

    return () => {
      cancelled = true;
    };
  }, [profile?.id]);

  /*
    LOCAL SAVE
    GUEST ONLY
  */

  useEffect(() => {
    if (!loaded) {
      return;
    }

    if (profile?.id) {
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
    profile?.id,
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
      GUEST SAVE
    */

    if (!profile?.id) {
      return;
    }

    /*
      DEBOUNCED CLOUD
    */

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
    ALLOCATION
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