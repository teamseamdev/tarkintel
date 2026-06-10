const API_URL =
  "https://api.tarkov.dev/graphql";

const REQUEST_TIMEOUT =
  12000;

export async function tarkovDevQuery(
  query: string
) {
  /*
    ABORT / TIMEOUT
  */

  const controller =
    new AbortController();

  const timeout =
    setTimeout(() => {
      controller.abort();
    }, REQUEST_TIMEOUT);

  try {
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

        signal:
          controller.signal,
      });

    /*
      RESPONSE STATUS
    */

    if (!response.ok) {
      const errorText =
        await response.text();

      throw new Error(
        `Tarkov.dev request failed (${response.status}): ${errorText}`
      );
    }

    /*
      SAFE TEXT PARSE
      Prevents crashes from:
      - HTML responses
      - timeout strings
      - Cloudflare errors
      - malformed JSON
    */

    const text =
      await response.text();

    let json;

    try {
      json =
        JSON.parse(text);
    } catch (parseError) {
      console.error(
        "INVALID TARKOV.DEV JSON:",
        text
      );

      throw new Error(
        "Invalid JSON response from Tarkov.dev"
      );
    }

    /*
      GRAPHQL ERRORS
    */

    if (json.errors) {
      console.error(
        "TARKOV.DEV GRAPHQL ERRORS:",
        json.errors
      );
    }

    return (
      json.data || {}
    );
  } catch (error: any) {
    /*
      TIMEOUTS
    */

    if (
      error?.name ===
      "AbortError"
    ) {
      console.error(
        "TARKOV.DEV REQUEST TIMEOUT"
      );

      throw new Error(
        "Tarkov.dev request timed out"
      );
    }

    /*
      ALL OTHER FAILURES
    */

    console.error(
      "TARKOV.DEV FETCH ERROR:",
      error
    );

    throw error;
  } finally {
    clearTimeout(
      timeout
    );
  }
}