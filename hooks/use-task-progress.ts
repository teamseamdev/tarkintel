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

export function useTaskProgress() {
  const { profile } = useAuth();

  const [completedTasks, setCompletedTasks] =
    useState<string[]>([]);

  const [loaded, setLoaded] =
    useState(false);

  // Initial Load
  useEffect(() => {
    async function loadProgress() {
      // CLOUD LOAD
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

        setLoaded(true);

        return;
      }

      // LOCAL FALLBACK
      const saved =
        localStorage.getItem(
          STORAGE_KEY
        );

      if (saved) {
        setCompletedTasks(
          JSON.parse(saved)
        );
      }

      setLoaded(true);
    }

    loadProgress();
  }, [profile]);

  // Local Backup Save
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

  async function toggleTask(
    taskId: string
  ) {
    const completed =
      !completedTasks.includes(
        taskId
      );

    setCompletedTasks((prev) => {
      if (
        prev.includes(taskId)
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
    });

    // CLOUD SAVE
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
  };
}