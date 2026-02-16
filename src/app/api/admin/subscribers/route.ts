import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = createServerSupabase();

    const { data: subscribers, error, count } = await supabase
      .from("waitlist")
      .select("email, created_at", { count: "exact" })
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      count: count ?? subscribers?.length ?? 0,
      subscribers: subscribers ?? [],
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
