import { allTasks } from "@/data/tasks";

export function getTaskById(
  id: string
) {
  return allTasks.find(
    (task) => task.id === id
  );
}

export function getTasksByTrader(
  trader: string
) {
  return allTasks.filter(
    (task) =>
      task.trader === trader
  );
}

export function getKappaTasks() {
  return allTasks.filter(
    (task) => task.kappaRequired
  );
}

export function getTasksByLevel(
  level: number
) {
  return allTasks.filter(
    (task) =>
      (task.levelRequired || 1) <=
      level
  );
}