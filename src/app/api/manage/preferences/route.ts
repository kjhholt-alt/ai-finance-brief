import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";
import { verifyManageToken } from "@/lib/manage-token";
import { resolveSubscriptions } from "@/lib/subscriptions";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    if (!email || !token) {
      return NextResponse.json({ error: "Missing email or token" }, { status: 400 });
    }

    if (!verifyManageToken(email, token)) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    const supabase = createServerSupabase();
    const { data } = await supabase
      .from("user_preferences")
      .select("preferences")
      .eq("user_id", email)
      .single();

    const prefs = (data?.preferences as Record<string, unknown>) || null;
    const emailOptIn = prefs?.emailOptIn !== false;
    const subscriptions = resolveSubscriptions(prefs);

    return NextResponse.json({ email, emailOptIn, subscriptions });
  } catch {
    return NextResponse.json({ error: "Failed to fetch preferences" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, token, emailOptIn, subscriptions } = body;

    if (!email || !token) {
      return NextResponse.json({ error: "Missing email or token" }, { status: 400 });
    }

    if (!verifyManageToken(email, token)) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    const supabase = createServerSupabase();

    // Check if user has existing preferences
    const { data: existing } = await supabase
      .from("user_preferences")
      .select("id, preferences")
      .eq("user_id", email)
      .single();

    if (existing) {
      const merged = { ...(existing.preferences as Record<string, unknown>) };
      if (emailOptIn !== undefined) merged.emailOptIn = emailOptIn;
      if (subscriptions !== undefined) merged.subscriptions = subscriptions;

      await supabase
        .from("user_preferences")
        .update({ preferences: merged, updated_at: new Date().toISOString() })
        .eq("id", existing.id);
    } else {
      // Create row for waitlist-only users who don't have preferences yet
      await supabase.from("user_preferences").insert({
        user_id: email,
        preferences: {
          emailOptIn: emailOptIn !== false,
          subscriptions: subscriptions || {},
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save preferences" }, { status: 500 });
  }
}
