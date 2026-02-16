import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  // Simple API key auth for admin endpoints
  const authHeader = request.headers.get("authorization");
  const adminKey = process.env.ADMIN_API_KEY || "afb-admin-2026-kjh";

  if (authHeader !== `Bearer ${adminKey}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
