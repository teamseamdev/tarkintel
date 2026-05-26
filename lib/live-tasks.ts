import { tarkovDevQuery } from "@/lib/tarkov-dev";

export interface LiveTaskRequirement {
  __typename?: string;

  task?: {
    id?: string;

    name?: string;
  };
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

  objectives?: {
    id: string;

    description: string;
  }[];

  map?: {
    name?: string;
  };

  taskRequirements?: LiveTaskRequirement[];
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
    }

    map {
      name
    }

    taskRequirements {
      __typename

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