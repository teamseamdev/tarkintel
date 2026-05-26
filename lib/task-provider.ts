import { cache } from "react";

import {
  getLiveTasks,
} from "@/lib/live-task-source";

import { normalizeLiveTask } from "@/lib/normalize-live-task";

import { TarkovTask } from "@/types/task";

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