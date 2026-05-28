const API_URL =
  "https://api.tarkov.dev/graphql";

export async function tarkovDevQuery(
  query: string
) {
  const response =
    await fetch(API_URL, {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        query,
      }),

      /*
        DISABLE NEXT CACHE

        Full Tarkov item dataset
        exceeds Next.js 2MB cache
        limit.
      */

      cache: "no-store",
    });

  const json =
    await response.json();

  /*
    GRAPHQL ERRORS
  */

  if (json.errors) {
    console.error(
      "TARKOV.DEV GRAPHQL ERRORS:",
      json.errors
    );
  }

  return json.data;
}