import { NextResponse } from "next/server";
import { getSearchHistory } from "@/lib/db/search-history";

export async function GET() {
  try {
    const history = await getSearchHistory();
    return NextResponse.json({ history });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
