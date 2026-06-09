"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "@/components/auth-provider";

import {
  loadHideoutProgress,
  saveHideoutProgress,
} from "@/lib/hideout-progress-sync";

import {
  createDebouncedSync,
} from "@/lib/create-debounced-sync";

const STORAGE_KEY =
  "tarkintel-hideout-progress";

interface HideoutProgressState {
  [moduleId: string]: number;
}

interface HideoutProgressRecord {
  module_id: string;

  completed_level: number;
}

export function useHideoutProgress() {
  const { profile } =
    useAuth();

  /*
    STATE
  */

  const [
    completedLevels,
    setCompletedLevels,
  ] = useState<HideoutProgressState>(
    {}
  );

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
          moduleId,
          level,
        }: {
          moduleId: string;

          level: number;
        }) => {
          if (
            !profile?.id
          ) {
            return;
          }

          await saveHideoutProgress(
            profile.id,
            moduleId,
            level
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
        setCompletedLevels(
          JSON.parse(saved)
        );
      }
    } catch (error) {
      console.error(
        "LOCAL HIDEOUT HYDRATION ERROR:",
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
        const cloudProgress =
          await loadHideoutProgress(
            profile.id
          );

        if (
          cancelled
        ) {
          return;
        }

        const mapped =
          Object.fromEntries(
            cloudProgress.map(
              (
                entry: HideoutProgressRecord
              ) => [
                entry.module_id,
                entry.completed_level,
              ]
            )
          );

        /*
          UPDATE UI
        */

        setCompletedLevels(
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
          "HIDEOUT CLOUD SYNC ERROR:",
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
        completedLevels
      )
    );
  }, [
    completedLevels,
    loaded,
  ]);

  /*
    GET
  */

  function getCompletedLevel(
    moduleId: string
  ) {
    return (
      completedLevels[
        moduleId
      ] || 0
    );
  }

  /*
    SET
  */

  function setCompletedLevel(
    moduleId: string,
    level: number
  ) {
    const safeLevel =
      Math.max(
        0,
        level
      );

    /*
      INSTANT LOCAL
    */

    setCompletedLevels(
      (prev) => ({
        ...prev,

        [moduleId]:
          safeLevel,
      })
    );

    /*
      CLOUD
    */

    if (!profile?.id) {
      return;
    }

    debouncedSync({
      moduleId,

      level:
        safeLevel,
    });
  }

  /*
    COMPLETE
  */

  function completeLevel(
    moduleId: string,
    level: number
  ) {
    setCompletedLevel(
      moduleId,
      level
    );
  }

  /*
    RESET
  */

  function resetModule(
    moduleId: string
  ) {
    setCompletedLevel(
      moduleId,
      0
    );
  }

  /*
    CHECK
  */

  function isLevelCompleted(
    moduleId: string,
    level: number
  ) {
    return (
      getCompletedLevel(
        moduleId
      ) >= level
    );
  }

  /*
    NEXT
  */

  function getNextLevel(
    moduleId: string
  ) {
    return (
      getCompletedLevel(
        moduleId
      ) + 1
    );
  }

  /*
    ALLOCATION
  */

  function calculateHideoutAllocation(
    itemId: string,
    modules: any[]
  ) {
    let used = 0;

    let reserved = 0;

    let remaining = 0;

    for (const module of modules) {
      const completedLevel =
        getCompletedLevel(
          module.id
        );

      for (const level of module.levels) {
        const requirements =
          level.requirements ||
          [];

        for (const requirement of requirements) {
          if (
            requirement.itemId !==
            itemId
          ) {
            continue;
          }

          if (
            level.level <=
            completedLevel
          ) {
            used +=
              requirement.count;
          } else {
            remaining +=
              requirement.count;
          }

          if (
            level.level ===
            completedLevel +
              1
          ) {
            reserved +=
              requirement.count;
          }
        }
      }
    }

    return {
      used,

      reserved,

      remaining,
    };
  }

  return {
    completedLevels,

    getCompletedLevel,

    setCompletedLevel,

    completeLevel,

    resetModule,

    isLevelCompleted,

    getNextLevel,

    calculateHideoutAllocation,

    loaded,
  };
}