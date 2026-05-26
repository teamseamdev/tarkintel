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
    INITIALIZATION STATE
  */

  const [
    initializing,
    setInitializing,
  ] = useState(true);

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
          LEVEL OVERRIDE
          ALWAYS LOCAL
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
          AUTHENTICATED USER
          CLOUD = SOURCE OF TRUTH
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

          setCompletedTasks(
            completed
          );

          /*
            OPTIONAL CACHE
          */

          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(
              completed
            )
          );
        }

        /*
          GUEST USER
          LOCAL = SOURCE OF TRUTH
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
            setCompletedTasks(
              JSON.parse(saved)
            );
          }
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
          setInitializing(
            false
          );

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
    GUEST USERS ONLY
  */

  useEffect(() => {
    if (!loaded) return;

    if (profile?.id) {
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
    profile?.id,
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

    initializing,

    playerLevelOverride,

    setPlayerLevelOverride,
  };
}