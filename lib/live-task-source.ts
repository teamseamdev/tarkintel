import { tarkovDevQuery } from "@/lib/tarkov-dev";

export interface LiveTaskRequirement {
  __typename?: string;

  /*
    TASK REQUIREMENT
  */

  task?: {
    id?: string;

    name?: string;
  };
}

export interface LiveTaskObjective {
  id: string;

  description?: string;

  type?: string;

  /*
    ITEM OBJECTIVES
  */

  item?: {
    id?: string;

    name?: string;
  };

  items?: {
    id?: string;

    name?: string;
  }[];

  count?: number;

  foundInRaid?: boolean;
}

export interface LiveTask {
  id: string;

  name: string;

  wikiLink?: string;

  experience?: number;

  minPlayerLevel?: number;

  kappaRequired?: boolean;

  trader?: {
    name?: string;
  };

  objectives?: LiveTaskObjective[];

  map?: {
    name?: string;
  };

  /*
    TASK RELATIONSHIPS
  */

  taskRequirements?: LiveTaskRequirement[];

  /*
    KEY REQUIREMENTS
  */

  neededKeys?: {
    keys?: {
      id?: string;

      name?: string;
    }[];
  };
}

interface LiveTaskResponse {
  tasks?: LiveTask[];
}

export async function getLiveTasks(): Promise<
  LiveTask[]
> {
  const query = `
{
  tasks {
    id

    name

    wikiLink

    experience

    minPlayerLevel

    kappaRequired

    trader {
      name
    }

    objectives {
      id

      description

      type

      ... on TaskObjectiveItem {
        item {
          id
          name
        }

        items {
          id
          name
        }

        count

        foundInRaid
      }
    }

    neededKeys {
      keys {
        id
        name
      }
    }

    map {
      name
    }

    taskRequirements {
      __typename

      # TASK CHAIN

      ... on TaskStatusRequirement {
        task {
          id
          name
        }
      }
    }
  }
}
`;

  const data: LiveTaskResponse =
    await tarkovDevQuery(
      query
    );

  if (
    !data ||
    !Array.isArray(
      data.tasks
    )
  ) {
    console.error(
      "INVALID TASK RESPONSE:",
      data
    );

    return [];
  }

  return data.tasks;
}