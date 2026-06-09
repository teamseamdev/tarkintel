import { NextResponse } from "next/server";

import {
  getItems,
} from "@/lib/item-provider";

export async function GET() {
  try {
    const items =
      await getItems();

    return NextResponse.json(
      items
    );
  } catch (error) {
    console.error(
      "ITEMS API ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load items",
      },
      {
        status: 500,
      }
    );
  }
}