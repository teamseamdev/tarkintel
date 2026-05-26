import {
  TarkovObjective,
  TarkovTask,
} from "@/types/task";

import { TaskFilter } from "@/types/task-filter";

export function filterTasks(
  tasks: TarkovTask[],
  filter: TaskFilter,
  completedTasks: string[]
): TarkovTask[] {
  switch (filter) {
    case "kappa":
      return tasks.filter(
        (task) =>
          task.kappaRequired
      );

    case "fir":
      return tasks.filter(
        (task) =>
          task.objectives.some(
            (
              objective: TarkovObjective
            ) =>
              objective.description
                .toLowerCase()
                .includes(
                  "found in raid"
                )
          )
      );

    case "prapor":
    case "therapist":
    case "skier":
    case "peacekeeper":
    case "mechanic":
    case "ragman":
    case "jaeger":
      return tasks.filter(
        (task) =>
          task.trader
            ?.toLowerCase()
            .includes(filter)
      );

    default:
      return tasks;
  }
}