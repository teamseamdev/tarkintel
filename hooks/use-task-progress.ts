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

  const [loaded, setLoaded] =
    useState(false);

  /*
    INITIAL LOAD
  */

  useEffect(() => {
    let cancelled = false;

    async function loadProgress() {
      try {
        /*
          LOCAL TASKS
        */

        const saved =
          localStorage.getItem(
            STORAGE_KEY
          );

        if (
          saved &&
          !cancelled
        ) {
          setCompletedTasks(
            JSON.parse(saved)
          );
        }

        /*
          LEVEL
        */

        const savedLevel =
          localStorage.getItem(
            LEVEL_OVERRIDE_KEY
          );

        if (
          savedLevel &&
          !cancelled
        ) {
          setPlayerLevelOverride(
            JSON.parse(
              savedLevel
            )
          );
        }

        /*
          CLOUD LOAD
        */

        if (profile?.id) {
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
                  task: any
                ) =>
                  task.completed
              )
              .map(
                (
                  task: any
                ) =>
                  task.task_id
              );

          setCompletedTasks(
            completed
          );
        }
      } catch (error) {
        console.error(
          "LOAD PROGRESS ERROR:",
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

    loadProgress();

    return () => {
      cancelled = true;
    };
  }, [profile?.id]);

  /*
    LOCAL SAVE
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
    LEVEL SAVE
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
    TOGGLE
  */

  async function toggleTask(
    taskId: string
  ) {
    const completed =
      !completedTasks.includes(
        taskId
      );

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

    playerLevelOverride,

    setPlayerLevelOverride,
  };
}