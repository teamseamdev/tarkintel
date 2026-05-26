import { TarkovTask } from "@/types/task";

interface ProgressionState {
  active: TarkovTask[];

  locked: TarkovTask[];

  completed: TarkovTask[];

  availableTaskIds: Set<string>;

  completedTaskIds: Set<string>;
}

export function buildProgressionState(
  tasks: TarkovTask[],
  completedTaskIds: string[],
  effectivePlayerLevel: number
): ProgressionState {
  /*
    COMPLETED TASK SET
  */

  const completedSet =
    new Set(completedTaskIds);

  /*
    PROGRESSION BUCKETS
  */

  const active: TarkovTask[] =
    [];

  const locked: TarkovTask[] =
    [];

  const completed: TarkovTask[] =
    [];

  /*
    STARTER TASKS
    THESE MUST ALWAYS
    BE AVAILABLE
  */

  const starterTaskNames = [
    "First in Line",
    "Shooting Cans",
    "Burning Rubber",
    "Saving the Mole",
  ];

  /*
    TASK EVALUATION
  */

  for (const task of tasks) {
    /*
      EVENT TASKS
    */

    if (task.isEvent) {
      continue;
    }

    /*
      LIGHTKEEPER
    */

    if (task.isLightkeeper) {
      continue;
    }

    /*
      FENCE
      TEMPORARILY HIDDEN
      UNTIL SCAV PROGRESSION EXISTS
    */

    if (
      task.trader ===
      "Fence"
    ) {
      continue;
    }

    /*
      REQUIREMENTS
    */

    const prerequisites =
      task.prerequisites ||
      [];

    const missingRequirements =
      prerequisites.filter(
        (prerequisiteId) =>
          !completedSet.has(
            prerequisiteId
          )
      );

    /*
      COMPLETION
    */

    const isCompleted =
      completedSet.has(task.id);

    /*
      STARTER TASKS
    */

    const isStarterTask =
      starterTaskNames.includes(
        task.name
      );

    /*
      LEVEL GATING
    */

    const minimumLevel =
      task.minPlayerLevel ||
      task.levelRequired ||
      1;

    const levelEligible =
      minimumLevel <=
      effectivePlayerLevel;

   

    /*
      ENRICHED TASK
    */

    const enrichedTask = {
      ...task,

      missingRequirements,
    };

    /*
      COMPLETED
    */

    if (isCompleted) {
      completed.push(
        enrichedTask
      );

      continue;
    }

    /*
      ACTIVE
    */

    if (
      (
        missingRequirements.length ===
          0 ||
        isStarterTask
      ) &&
      levelEligible
    ) {
      active.push(
        enrichedTask
      );

      continue;
    }

    /*
      LOCKED
    */

    locked.push(
      enrichedTask
    );
  }

  return {
    active,

    locked,

    completed,

    availableTaskIds:
      new Set(
        active.map(
          (task) => task.id
        )
      ),

    completedTaskIds:
      completedSet,
  };
}