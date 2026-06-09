import { NextResponse } from "next/server";

import {
  getHideoutModules,
} from "@/lib/hideout-provider";

export async function GET() {
  try {
    const hideout =
      await getHideoutModules();

    return NextResponse.json(
      hideout
    );
  } catch (error) {
    console.error(
      "HIDEOUT API ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load hideout",
      },
      {
        status: 500,
      }
    );
  }
}