import { getLiveTasks } from "@/lib/live-tasks";

import { normalizeLiveTask } from "@/lib/normalize-live-task";

export async function getNormalizedLiveTasks() {
  const tasks =
    await getLiveTasks();

  return tasks.map(
    (task: any) =>
      normalizeLiveTask(
        task,
        tasks
      )
  );
}