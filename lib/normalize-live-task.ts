import { TarkovTask } from "@/types/task";

export function normalizeLiveTask(
  task: any,
  allTasks: any[] = []
): TarkovTask {
  const minPlayerLevel =
    task.minPlayerLevel || 1;

  /*
    VALID TASK IDS
  */

  const validTaskIds =
    new Set(
      allTasks.map(
        (task) => task.id
      )
    );

  /*
    RAW REQUIREMENTS
  */

  const rawPrerequisites =
    (
      task.taskRequirements ||
      []
    )
      .filter(
        (requirement: any) =>
          requirement.__typename ===
            "TaskStatusRequirement" &&
          requirement.task?.id
      )
      .map(
        (requirement: any) =>
          requirement.task.id
      );

  /*
    REMOVE HIDDEN /
    INVALID TASK LINKS
  */

  const filteredPrerequisites =
    rawPrerequisites.filter(
      (id: string) =>
        validTaskIds.has(id)
    );

  /*
    STARTER TASKS
  */

  const starterTaskNames = [
    "First in Line",
    "Shooting Cans",
    "Burning Rubber",
    "Saving the Mole",
  ];

  /*
    STARTER TASKS
    SHOULD ALWAYS UNLOCK
  */

  const prerequisites =
    starterTaskNames.includes(
      task.name
    )
      ? []
      : filteredPrerequisites;

  return {
    id: task.id,

    name: task.name,

    trader:
      task.trader?.name ||
      null,

    wikiLink:
      task.wikiLink,

    experience:
      task.experience || 0,

    xp:
      task.experience || 0,

    objectives:
      task.objectives || [],

    prerequisites,

    maps: task.map
      ? [task.map.name]
      : [],

    levelRequired:
      minPlayerLevel,

    minPlayerLevel,

    kappaRequired:
      task.kappaRequired ||
      false,

    isEvent:
      task.name
        ?.toLowerCase()
        .includes("event") ||
      false,

    isLightkeeper:
      task.trader?.name ===
      "Lightkeeper",

    isAvailableFromStart:
      minPlayerLevel <= 1 &&
      prerequisites.length ===
        0,
  };
}