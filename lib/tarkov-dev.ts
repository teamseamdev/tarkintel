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

      next: {
        revalidate: 3600,
      },
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

  /*
    DEBUG RESPONSE
  */

  console.log(
    "TARKOV.DEV RESPONSE:",
    json
  );

  return json.data;
}