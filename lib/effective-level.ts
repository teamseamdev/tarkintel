import { TarkovTask } from "@/types/task";

import { getLevelFromXP } from "@/lib/player-level";

export function getEffectivePlayerLevel(
  tasks: TarkovTask[],
  completedTaskIds: string[],
  manualLevel?: number | null
) {
  /*
    INFERRED XP
  */

  const inferredXP =
    completedTaskIds.reduce(
      (
        total,
        taskId
      ) => {
        const task =
          tasks.find(
            (t) =>
              t.id === taskId
          );

        return (
          total +
          (task?.xp || 0)
        );
      },
      0
    );

  /*
    INFERRED LEVEL
  */

  const inferredLevel =
    getLevelFromXP(
      inferredXP
    );

  /*
    EFFECTIVE LEVEL
  */

  const effectiveLevel =
    Math.max(
      inferredLevel,
      manualLevel || 1
    );

  return {
    inferredXP,

    inferredLevel,

    effectiveLevel,
  };
}