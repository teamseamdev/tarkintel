import { TarkovTask } from "@/types/task";

import {
  LiveTask,
} from "@/lib/live-task-source";

export function normalizeLiveTask(
  task: LiveTask,
  allTasks: LiveTask[] = []
): TarkovTask {
  const minPlayerLevel =
    task.minPlayerLevel ?? 1;

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
    RAW TASK
    PREREQUISITES
  */

  const rawPrerequisites =
    (
      task.taskRequirements ||
      []
    )
      .filter(
        (
          requirement
        ) =>
          requirement.__typename ===
            "TaskStatusRequirement" &&
          (
            requirement as any
          ).task?.id
      )
      .map(
        (
          requirement
        ) =>
          (
            requirement as any
          ).task.id
      );

  /*
    REMOVE HIDDEN /
    INVALID TASK LINKS
  */

  const filteredPrerequisites =
    rawPrerequisites.filter(
      (id) =>
        validTaskIds.has(id)
    );

  /*
    ITEM REQUIREMENTS
    (HANDOVER TASKS)
  */

  const itemRequirements =
    (
      task.taskRequirements ||
      []
    )
      .filter(
        (
          requirement
        ) =>
          requirement.__typename ===
            "TaskHandoverRequirement" &&
          (
            requirement as any
          ).item?.name
      )
      .map(
        (
          requirement
        ) => ({
          item: {
            id:
              (
                requirement as any
              ).item?.id,

            name:
              (
                requirement as any
              ).item?.name,
          },

          count:
            (
              requirement as any
            ).count ?? 0,

          foundInRaid:
            (
              requirement as any
            ).foundInRaid ??
            false,
        })
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
      task.experience ?? 0,

    xp:
      task.experience ?? 0,

    objectives:
      (
        task.objectives ||
        []
      ) as any,

    prerequisites,

    /*
      NORMALIZED
      ITEM REQUIREMENTS
    */

    taskRequirements:
      itemRequirements,

    maps: task.map?.name
      ? [task.map.name]
      : [],

    levelRequired:
      minPlayerLevel,

    minPlayerLevel,

    kappaRequired:
      task.kappaRequired ??
      false,

    isEvent:
      task.name
        ?.toLowerCase()
        .includes("event") ??
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