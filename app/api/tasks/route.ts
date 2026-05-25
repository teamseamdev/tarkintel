import { NextResponse } from "next/server";

import { getTasks } from "@/lib/task-provider";

export async function GET() {
  try {
    /*
      ALREADY NORMALIZED
    */

    const tasks =
      await getTasks();

    return NextResponse.json(
      tasks
    );
  } catch (error) {
    console.error(
      "TASK API ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load tasks",
      },

      {
        status: 500,
      }
    );
  }
}