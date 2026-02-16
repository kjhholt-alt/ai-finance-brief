import { createServerSupabase } from "@/lib/supabase";

export type UserTier = "free" | "pro";

/**
 * Get the current subscription tier for a user.
 * Checks subscriptions table for an active subscription.
 */
export async function getUserTier(userId: string): Promise<UserTier> {
  if (!userId) return "free";

  try {
    const supabase = createServerSupabase();
    const { data, error } = await supabase
      .from("subscriptions")
      .select("status, current_period_end")
      .eq("user_id", userId)
      .eq("status", "active")
      .single();

    if (error || !data) return "free";

    // Check if subscription is still within its period
    if (data.current_period_end) {
      const endDate = new Date(data.current_period_end);
      if (endDate < new Date()) return "free";
    }

    return "pro";
  } catch {
    return "free";
  }
}

/**
 * Upsert a subscription record from a LemonSqueezy webhook event.
 */
export async function upsertSubscription({
  userId,
  providerId,
  status,
  plan,
  currentPeriodEnd,
}: {
  userId: string;
  providerId: string;
  status: string;
  plan: string;
  currentPeriodEnd: string | null;
}) {
  const supabase = createServerSupabase();

  // Check if subscription already exists for this provider ID
  const { data: existing } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("provider_id", providerId)
    .single();

  if (existing) {
    await supabase
      .from("subscriptions")
      .update({
        status,
        plan,
        current_period_end: currentPeriodEnd,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
  } else {
    await supabase.from("subscriptions").insert({
      user_id: userId,
      provider: "lemonsqueezy",
      provider_id: providerId,
      status,
      plan,
      current_period_end: currentPeriodEnd,
    });
  }

  // Also update the profile tier
  await supabase
    .from("profiles")
    .upsert(
      {
        user_id: userId,
        tier: status === "active" ? "pro" : "free",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );
}
