import { TarkovTask } from "@/types/task";

export function getKappaProgress(
  tasks: TarkovTask[],
  completedTaskIds: string[]
) {
  const kappaTasks =
    tasks.filter(
      (task) =>
        task.kappaRequired
    );

  const completed =
    kappaTasks.filter(
      (task) =>
        completedTaskIds.includes(
          task.id
        )
    );

  return {
    total:
      kappaTasks.length,

    completed:
      completed.length,

    percentage:
      kappaTasks.length > 0
        ? Math.round(
            (completed.length /
              kappaTasks.length) *
              100
          )
        : 0,
  };
}

export function getRemainingKappaTasks(
  tasks: TarkovTask[],
  completedTaskIds: string[]
) {
  return tasks.filter(
    (task) =>
      task.kappaRequired &&
      !completedTaskIds.includes(
        task.id
      )
  );
}

export function getTraderProgress(
  tasks: TarkovTask[],
  completedTaskIds: string[]
) {
  const traderMap =
    new Map<
      string,
      {
        total: number;

        completed: number;
      }
    >();

  for (const task of tasks) {
    const trader =
      task.trader ||
      "Unknown";

    if (
      !traderMap.has(
        trader
      )
    ) {
      traderMap.set(
        trader,
        {
          total: 0,
          completed: 0,
        }
      );
    }

    const traderData =
      traderMap.get(
        trader
      )!;

    traderData.total += 1;

    if (
      completedTaskIds.includes(
        task.id
      )
    ) {
      traderData.completed += 1;
    }
  }

  return Array.from(
    traderMap.entries()
  ).map(
    ([
      trader,
      data,
    ]) => ({
      trader,

      total: data.total,

      completed:
        data.completed,

      percentage:
        data.total > 0
          ? Math.round(
              (data.completed /
                data.total) *
                100
            )
          : 0,
    })
  );
}