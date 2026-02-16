import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createServerSupabase();
    const { data, error } = await supabase
      .from("briefs")
      .select("date, content")
      .order("date", { ascending: false });

    if (error) {
      console.error("Archive fetch error:", error);
      return NextResponse.json({ briefs: [] });
    }

    const briefs = (data || []).map((row) => row.content);
    return NextResponse.json({ briefs });
  } catch {
    return NextResponse.json({ briefs: [] });
  }
}
