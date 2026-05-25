import { cache } from "react";

import { getNormalizedLiveTasks } from "@/lib/live-task-source";

import { TarkovTask } from "@/types/task";

export const getTasks =
  cache(async (): Promise<
    TarkovTask[]
  > => {
    return await getNormalizedLiveTasks();
  });

export const getTaskById =
  cache(
    async (
      id: string
    ): Promise<
      TarkovTask | undefined
    > => {
      const tasks =
        await getTasks();

      return tasks.find(
        (
          task: TarkovTask
        ) =>
          task.id === id
      );
    }
  );