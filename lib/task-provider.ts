import { cache } from "react";

import {
  getLiveTasks,
} from "@/lib/live-task-source";

import {
  normalizeLiveTask,
} from "@/lib/normalize-live-task";

import {
  TarkovTask,
} from "@/types/task";

export const getTasks =
  cache(
    async (): Promise<
      TarkovTask[]
    > => {
      const liveTasks =
        await getLiveTasks();

      return liveTasks.map(
        (task) =>
          normalizeLiveTask(
            task,
            liveTasks
          )
      );
    }
  );

/*
  GLOBAL
  TASK
  ITEM DEMAND
*/

export function calculateTaskItemDemand(
  tasks: TarkovTask[],
  itemId: string
) {
  let totalDemand = 0;

  let firDemand = 0;

  const relatedTasks:
    TarkovTask[] = [];

  for (const task of tasks) {
    const requirements =
      task.taskRequirements ||
      [];

    for (const requirement of requirements) {
      if (
        requirement.item
          ?.id !== itemId
      ) {
        continue;
      }

      totalDemand +=
        requirement.count ||
        0;

      if (
        requirement.foundInRaid
      ) {
        firDemand +=
          requirement.count ||
          0;
      }

      relatedTasks.push(task);
    }
  }

  return {
    totalDemand,

    firDemand,

    relatedTasks,
  };
}