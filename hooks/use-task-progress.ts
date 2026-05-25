"use client";

import {
  useEffect,
  useState,
} from "react";

import { useAuth } from "@/components/auth-provider";

import {
  loadTaskProgress,
  saveTaskProgress,
} from "@/lib/task-progress-sync";

const STORAGE_KEY =
  "tarkintel-completed-tasks";

const LEVEL_OVERRIDE_KEY =
  "tarkintel-level-override";

export function useTaskProgress() {
  const { profile } = useAuth();

  /*
    PLAYER LEVEL OVERRIDE
  */

  const [
    playerLevelOverride,
    setPlayerLevelOverride,
  ] = useState<number | null>(
    null
  );

  /*
    COMPLETED TASKS
  */

  const [
    completedTasks,
    setCompletedTasks,
  ] = useState<string[]>(
    []
  );

  /*
    LOAD STATE
  */

  const [loaded, setLoaded] =
    useState(false);

  /*
    INITIAL LOAD
  */

  useEffect(() => {
    async function loadProgress() {
      /*
        CLOUD LOAD
      */

      if (profile?.id) {
        const cloudProgress =
          await loadTaskProgress(
            profile.id
          );

        const completed =
          cloudProgress
            .filter(
              (
                task: any
              ) =>
                task.completed
            )
            .map(
              (task: any) =>
                task.task_id
            );

        setCompletedTasks(
          completed
        );
      }

      /*
        LOCAL TASK FALLBACK
      */

      const saved =
        localStorage.getItem(
          STORAGE_KEY
        );

      if (
        saved &&
        completedTasks.length ===
          0
      ) {
        setCompletedTasks(
          JSON.parse(saved)
        );
      }

      /*
        LEVEL OVERRIDE
      */

      const savedLevel =
        localStorage.getItem(
          LEVEL_OVERRIDE_KEY
        );

      if (savedLevel) {
        setPlayerLevelOverride(
          JSON.parse(savedLevel)
        );
      }

      setLoaded(true);
    }

    loadProgress();
  }, [profile]);

  /*
    LOCAL TASK SAVE
  */

  useEffect(() => {
    if (!loaded) return;

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
    LEVEL OVERRIDE SAVE
  */

  useEffect(() => {
    if (!loaded) return;

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
    TOGGLE TASK
  */

  async function toggleTask(
    taskId: string
  ) {
    const completed =
      !completedTasks.includes(
        taskId
      );

    setCompletedTasks(prev => {
      if (
        prev.includes(taskId)
      ) {
        return prev.filter(
          id =>
            id !== taskId
        );
      }

      return [
        ...prev,
        taskId,
      ];
    });

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

  /*
    TASK CHECK
  */

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

    isTaskCompleted,

    loaded,

    /*
      PLAYER STATE
    */

    playerLevelOverride,

    setPlayerLevelOverride,
  };
}