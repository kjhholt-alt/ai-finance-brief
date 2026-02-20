import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, userType, sectors, onboardingCompleted, emailOptIn, timezone, watchlist, subscriptions } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const supabase = createServerSupabase();

    const preferences: Record<string, unknown> = {
      userType: userType || "",
      sectors: sectors || [],
      onboardingCompleted: onboardingCompleted || false,
      emailOptIn: emailOptIn !== false,
      timezone: timezone || "America/New_York",
      watchlist: watchlist || [],
    };

    // Include subscriptions if provided
    if (subscriptions !== undefined) {
      preferences.subscriptions = subscriptions;
    }

    // Upsert user preferences
    const { data: existing } = await supabase
      .from("user_preferences")
      .select("id, preferences")
      .eq("user_id", email)
      .single();

    if (existing) {
      // Merge with existing preferences
      const merged = { ...(existing.preferences as Record<string, unknown>), ...preferences };
      // Only update fields that were actually provided
      if (userType !== undefined) merged.userType = userType;
      if (sectors !== undefined) merged.sectors = sectors;
      if (onboardingCompleted !== undefined) merged.onboardingCompleted = onboardingCompleted;
      if (emailOptIn !== undefined) merged.emailOptIn = emailOptIn;
      if (timezone !== undefined) merged.timezone = timezone;
      if (watchlist !== undefined) merged.watchlist = watchlist;
      if (subscriptions !== undefined) merged.subscriptions = subscriptions;

      await supabase
        .from("user_preferences")
        .update({ preferences: merged, updated_at: new Date().toISOString() })
        .eq("id", existing.id);
    } else {
      await supabase.from("user_preferences").insert({
        user_id: email,
        preferences,
      });
    }

    // Also upsert profile
    await supabase
      .from("profiles")
      .upsert(
        { user_id: email, email, updated_at: new Date().toISOString() },
        { onConflict: "user_id" }
      );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save preferences" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    const supabase = createServerSupabase();

    // If email provided, return that user's preferences
    if (email) {
      const { data } = await supabase
        .from("user_preferences")
        .select("preferences")
        .eq("user_id", email)
        .single();

      return NextResponse.json({
        preferences: data?.preferences || null,
      });
    }

    // Otherwise return count only (existing behavior)
    const { count } = await supabase
      .from("user_preferences")
      .select("*", { count: "exact", head: true });

    return NextResponse.json({ count: count || 0 });
  } catch {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
