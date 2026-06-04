import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { SearchHistory } from "@/lib/types";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("search_history")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ history: (data ?? []) as SearchHistory[] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
