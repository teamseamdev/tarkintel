import { tarkovDevQuery } from "@/lib/tarkov-dev";

export async function getLiveTasks() {
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

  const data =
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