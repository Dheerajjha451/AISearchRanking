import { NextResponse } from "next/server";
import { getSearchHistory } from "@/lib/db/search-history";

export async function GET() {
  try {
    const history = await getSearchHistory();
    return NextResponse.json({ history });
  } catch (error) {
    console.error('[History API] Request failed:', error);
    return NextResponse.json({ error: 'Failed to load history. Please try again.' }, { status: 500 });
  }
}
