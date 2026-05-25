import { getTasks } from "@/lib/task-provider";

import { TarkovTask } from "@/types/task";

interface ItemUsage {
  task: TarkovTask;

  amount: number;

  foundInRaid?: boolean;
}

export async function getTasksByItem(
  itemName: string
) {
  const tasks =
    await getTasks();

  const matches: ItemUsage[] =
    [];

  for (const task of tasks) {
    const objectives =
      task.objectives || [];

    for (const objective of objectives) {
      const description =
        (
          objective.description ||
          ""
        ).toLowerCase();

      if (
        description.includes(
          itemName.toLowerCase()
        )
      ) {
        matches.push({
          task,

          amount: 1,
        });

        break;
      }
    }
  }

  return matches;
}

export async function getItemPriority(
  itemName: string
) {
  const relatedTasks =
    await getTasksByItem(
      itemName
    );

  const kappaTasks =
    relatedTasks.filter(
      (entry) =>
        entry.task
          .kappaRequired
    );

  let score = 0;

  score +=
    relatedTasks.length *
    2;

  score +=
    kappaTasks.length * 3;

  if (score >= 10)
    return "EXTREMELY HIGH";

  if (score >= 6)
    return "HIGH";

  if (score >= 3)
    return "MEDIUM";

  return "LOW";
}