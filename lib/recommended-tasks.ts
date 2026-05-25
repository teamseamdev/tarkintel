import { allTasks } from "@/data/tasks";

export function getRecommendedTasks(
  completedTasks: string[]
) {
  return allTasks
    .filter(
      (task) =>
        !completedTasks.includes(
          task.id
        )
    )
    .sort((a, b) => {
      let scoreA = 0;

      let scoreB = 0;

      // Kappa priority
      if (a.kappaRequired)
        scoreA += 100;

      if (b.kappaRequired)
        scoreB += 100;

      // Early progression
      scoreA +=
        50 -
        (a.levelRequired || 0);

      scoreB +=
        50 -
        (b.levelRequired || 0);

      // XP value
      scoreA += a.xp || 0;

      scoreB += b.xp || 0;

      // FIR tasks matter
      if (
        a.requiredItems?.some(
          (item) =>
            item.foundInRaid
        )
      ) {
        scoreA += 25;
      }

      if (
        b.requiredItems?.some(
          (item) =>
            item.foundInRaid
        )
      ) {
        scoreB += 25;
      }

      return scoreB - scoreA;
    })
    .slice(0, 5);
}