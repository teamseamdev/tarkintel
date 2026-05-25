import { TaskFilter } from "@/types/task-filter";

export function filterTasks(
  tasks: any[],
  filter: TaskFilter,
  completedTasks: string[]
) {
  switch (filter) {
    case "kappa":
      return tasks.filter(
        task =>
          task.kappaRequired
      );

    case "fir":
      return tasks.filter(
        task =>
          task.objectives?.some(
            (
              objective: string
            ) =>
              objective
                ?.toLowerCase()
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
        task =>
          task.trader
            ?.toLowerCase()
            .includes(filter)
      );

    default:
      return tasks;
  }
}