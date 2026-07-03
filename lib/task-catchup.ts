import type { TarkovTask } from "@/types/task";

export interface TraderTaskGroup {
  trader: string;
  tasks: TarkovTask[];
}

export function getTaskPrerequisiteIds(
  taskId: string,
  tasks: TarkovTask[]
): string[] {
  if (!taskId || !Array.isArray(tasks)) {
    return [];
  }

  const taskMap = new Map(
    tasks
      .filter((task) => task?.id)
      .map((task) => [task.id, task])
  );
  const prerequisiteIds = new Set<string>();
  const visited = new Set<string>();

  function visit(currentTaskId: string) {
    if (visited.has(currentTaskId)) {
      return;
    }

    visited.add(currentTaskId);

    const task = taskMap.get(currentTaskId);
    const prerequisites = Array.isArray(task?.prerequisites)
      ? task.prerequisites
      : [];

    for (const prerequisiteId of prerequisites) {
      if (
        !prerequisiteId ||
        prerequisiteId === taskId ||
        !taskMap.has(prerequisiteId)
      ) {
        continue;
      }

      prerequisiteIds.add(prerequisiteId);
      visit(prerequisiteId);
    }
  }

  visit(taskId);

  return tasks
    .map((task) => task.id)
    .filter((id) => prerequisiteIds.has(id));
}

export function getBulkPrerequisiteIds(
  taskIds: string[],
  tasks: TarkovTask[]
): string[] {
  if (!Array.isArray(taskIds) || !Array.isArray(tasks)) {
    return [];
  }

  const prerequisiteIds = new Set<string>();

  for (const taskId of taskIds) {
    for (const prerequisiteId of getTaskPrerequisiteIds(taskId, tasks)) {
      prerequisiteIds.add(prerequisiteId);
    }
  }

  return tasks
    .map((task) => task.id)
    .filter((id) => prerequisiteIds.has(id));
}

export function groupTasksByTrader(
  tasks: TarkovTask[]
): TraderTaskGroup[] {
  const groups = new Map<string, TarkovTask[]>();

  for (const task of Array.isArray(tasks) ? tasks : []) {
    if (!task?.id) {
      continue;
    }

    const trader = task.trader?.trim() || "Other";
    const traderTasks = groups.get(trader) ?? [];

    traderTasks.push(task);
    groups.set(trader, traderTasks);
  }

  return Array.from(groups, ([trader, traderTasks]) => ({
    trader,
    tasks: traderTasks,
  })).sort((a, b) => a.trader.localeCompare(b.trader));
}
