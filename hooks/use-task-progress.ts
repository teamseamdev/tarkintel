"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "tarkintel-completed-tasks";

export function useTaskProgress() {
  const [completedTasks, setCompletedTasks] =
    useState<string[]>([]);

  // Load saved progress
  useEffect(() => {
    const saved =
      localStorage.getItem(STORAGE_KEY);

    if (saved) {
      setCompletedTasks(JSON.parse(saved));
    }
  }, []);

  // Save progress
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(completedTasks)
    );
  }, [completedTasks]);

  function toggleTask(taskId: string) {
    setCompletedTasks((prev) => {
      if (prev.includes(taskId)) {
        return prev.filter(
          (id) => id !== taskId
        );
      }

      return [...prev, taskId];
    });
  }

  function isTaskCompleted(taskId: string) {
    return completedTasks.includes(taskId);
  }

  return {
    completedTasks,
    toggleTask,
    isTaskCompleted,
  };
}