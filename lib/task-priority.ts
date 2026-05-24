import { TarkovTask } from "@/types/task";

export function sortTasksByPriority(
  tasks: TarkovTask[],

  completedTasks: string[]
) {
  return [...tasks].sort(
    (a, b) => {
      const aCompleted =
        completedTasks.includes(
          a.id
        );

      const bCompleted =
        completedTasks.includes(
          b.id
        );

      // Incomplete first
      if (
        aCompleted !==
        bCompleted
      ) {
        return aCompleted
          ? 1
          : -1;
      }

      // Kappa priority
      if (
        a.kappaRequired !==
        b.kappaRequired
      ) {
        return a.kappaRequired
          ? -1
          : 1;
      }

      // Lower level first
      return (
        (a.levelRequired ||
          0) -
        (b.levelRequired ||
          0)
      );
    }
  );
}