import { NextResponse } from "next/server";

import { getTasks } from "@/lib/task-provider";

export async function GET() {
  try {
    /*
      FETCH TASKS
    */

    const tasks =
      await Promise.race([
        getTasks(),

        /*
          TIMEOUT
        */

        new Promise(
          (
            _,
            reject
          ) =>
            setTimeout(() => {
              reject(
                new Error(
                  "Tasks API timeout"
                )
              );
            }, 10000)
        ),
      ]);

    /*
      VALIDATION
    */

    if (
      !Array.isArray(tasks)
    ) {
      throw new Error(
        "Invalid tasks response"
      );
    }

    /*
      SUCCESS
    */

    return NextResponse.json(
      tasks,

      {
        status: 200,

        headers: {
          "Cache-Control":
            "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error(
      "TASK API ERROR:",
      error
    );

    /*
      SAFE RESPONSE
    */

    return NextResponse.json(
      {
        success: false,

        error:
          "Failed to load tasks.",

        fallback: [],
      },

      {
        status: 500,
      }
    );
  }
}