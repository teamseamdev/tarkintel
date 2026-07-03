"use client";

import {
  useEffect,
  useState,
} from "react";

import { useAuth } from "@/components/auth-provider";

import {
  loadTaskProgress,
  saveTaskProgress,
  saveTaskProgressBulk,
} from "@/lib/task-progress-sync";

const STORAGE_KEY =
  "tarkintel-completed-tasks";

const LEVEL_OVERRIDE_KEY =
  "tarkintel-level-override";

interface TaskProgressRecord {
  task_id: string;

  completed: boolean;
}

export function useTaskProgress() {
  const { profile } =
    useAuth();

  /*
    STATE
  */

  const [
    playerLevelOverride,
    setPlayerLevelOverride,
  ] = useState<number | null>(
    null
  );

  const [
    completedTasks,
    setCompletedTasks,
  ] = useState<string[]>(
    []
  );

  /*
    IMPORTANT:
    LOCAL READY
    IMMEDIATELY
  */

  const [loaded, setLoaded] =
    useState(false);

  /*
    LOCAL HYDRATION
    FIRST
  */

  useEffect(() => {
    try {
      /*
        TASKS
      */

      const savedTasks =
        localStorage.getItem(
          STORAGE_KEY
        );

      if (savedTasks) {
        setCompletedTasks(
          JSON.parse(
            savedTasks
          )
        );
      }

      /*
        LEVEL
      */

      const savedLevel =
        localStorage.getItem(
          LEVEL_OVERRIDE_KEY
        );

      if (savedLevel) {
        setPlayerLevelOverride(
          JSON.parse(
            savedLevel
          )
        );
      }
    } catch (error) {
      console.error(
        "LOCAL TASK HYDRATION ERROR:",
        error
      );
    } finally {
      /*
        CRITICAL:
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
          await loadTaskProgress(
            profile.id
          );

        if (
          cancelled
        ) {
          return;
        }

        const completed =
          cloudProgress
            .filter(
              (
                task: TaskProgressRecord
              ) =>
                task.completed
            )
            .map(
              (
                task: TaskProgressRecord
              ) =>
                task.task_id
            );

        /*
          UPDATE UI
        */

        setCompletedTasks(
          completed
        );

        /*
          UPDATE CACHE
        */

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(
            completed
          )
        );
      } catch (error) {
        console.error(
          "TASK CLOUD SYNC ERROR:",
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
        completedTasks
      )
    );
  }, [
    completedTasks,
    loaded,
  ]);

  /*
    LEVEL SAVE
  */

  useEffect(() => {
    if (!loaded) {
      return;
    }

    localStorage.setItem(
      LEVEL_OVERRIDE_KEY,
      JSON.stringify(
        playerLevelOverride
      )
    );
  }, [
    playerLevelOverride,
    loaded,
  ]);

  /*
    TOGGLE
  */

  async function toggleTask(
    taskId: string
  ) {
    const completed =
      !completedTasks.includes(
        taskId
      );

    /*
      INSTANT LOCAL
    */

    setCompletedTasks(
      (prev) => {
        if (
          prev.includes(
            taskId
          )
        ) {
          return prev.filter(
            (id) =>
              id !== taskId
          );
        }

        return [
          ...prev,
          taskId,
        ];
      }
    );

    /*
      CLOUD SAVE
    */

    if (profile?.id) {
      await saveTaskProgress(
        profile.id,
        taskId,
        completed
      );
    }
  }

  async function completeTasks(
    taskIds: string[]
  ): Promise<void> {
    const uniqueTaskIds = Array.from(
      new Set(taskIds.filter(Boolean))
    );
    const newTaskIds = uniqueTaskIds.filter(
      (taskId) => !completedTasks.includes(taskId)
    );

    if (newTaskIds.length === 0) {
      return;
    }

    if (profile?.id) {
      await saveTaskProgressBulk(
        profile.id,
        newTaskIds
      );
    }

    setCompletedTasks((previousTasks) =>
      Array.from(
        new Set([
          ...previousTasks,
          ...newTaskIds,
        ])
      )
    );
  }

  function isTaskCompleted(
    taskId: string
  ) {
    return completedTasks.includes(
      taskId
    );
  }

  return {
    completedTasks,

    toggleTask,

    completeTasks,

    isTaskCompleted,

    loaded,

    playerLevelOverride,

    setPlayerLevelOverride,
  };
}
