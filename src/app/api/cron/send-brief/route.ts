import { NextResponse } from "next/server";
import { getResend } from "@/lib/resend";
import { generateBriefEmailHtml } from "@/lib/email-template";
import { createServerSupabase } from "@/lib/supabase";
import { resolveSubscriptions } from "@/lib/subscriptions";
import { getManageUrl } from "@/lib/manage-token";

// This route is called by Vercel Cron at 7am ET on market days
// Configured in vercel.json

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Allow up to 60s for brief generation + email sends

// Verify the request comes from Vercel Cron (or allow if no secret set)
function isAuthorized(request: Request): boolean {
  if (process.env.NODE_ENV === "development") return true;

  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // If no secret is set, allow but log so it's obvious in prod.
  if (!cronSecret) {
    console.warn("CRON_SECRET is not set; allowing cron request without auth.");
    return true;
  }

  return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(request: Request) {
  return handleCron(request);
}

export async function POST(request: Request) {
  return handleCron(request);
}

async function handleCron(request: Request) {
  // Auth check
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Check if today is a market day (Mon-Fri)
    const now = new Date();
    const day = now.getDay();
    if (day === 0 || day === 6) {
      return NextResponse.json({
        message: "Weekend — no brief generated",
        sent: 0,
      });
    }

    // 2. Generate today's brief via the brief API
    const briefUrl = new URL("/api/brief?force=true", request.url);
    const briefResponse = await fetch(briefUrl, { method: "POST" });

    if (!briefResponse.ok) {
      throw new Error("Failed to generate brief");
    }

    const brief = await briefResponse.json();

    // 3. Get all subscribers from Supabase (opt-in users + legacy waitlist)
    const supabase = createServerSupabase();
    const { data: preferenceRows, error: prefError } = await supabase
      .from("user_preferences")
      .select("user_id, preferences");
    const { data: waitlistRows, error: waitlistError } = await supabase
      .from("waitlist")
      .select("email");

    if ((prefError && waitlistError) || (!preferenceRows && !waitlistRows)) {
      return NextResponse.json(
        { message: "Failed to load subscribers", sent: 0 },
        { status: 500 }
      );
    }

    // Build recipient list, filtering by emailOptIn AND daily_market_brief subscription
    const recipients = new Map<string, { email: string; manageUrl: string }>();

    if (preferenceRows) {
      for (const row of preferenceRows) {
        const prefs = row.preferences as Record<string, unknown> | null;
        const optedIn = prefs?.emailOptIn !== false;
        if (!optedIn || typeof row.user_id !== "string" || !row.user_id) continue;

        // Check daily_market_brief subscription (default true if missing)
        const subs = resolveSubscriptions(prefs);
        if (subs.daily_market_brief === false) continue;

        const email = row.user_id.toLowerCase();
        const manageUrl = getManageUrl(email);
        recipients.set(email, { email, manageUrl });
      }
    }

    // Waitlist users get emails too (they don't have preferences, so all defaults apply)
    if (waitlistRows) {
      for (const row of waitlistRows) {
        if (row.email) {
          const email = row.email.toLowerCase();
          if (!recipients.has(email)) {
            const manageUrl = getManageUrl(email);
            recipients.set(email, { email, manageUrl });
          }
        }
      }
    }

    const subscribers = Array.from(recipients.values());
    if (subscribers.length === 0) {
      return NextResponse.json({
        message: "No subscribers found",
        sent: 0,
      });
    }

    // 4. Send per-user emails with personalized manage link
    const today = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });

    const resendFrom =
      process.env.RESEND_FROM || "AI Finance Brief <brief@mail.buildkit.store>";
    const resend = getResend();
    const batchSize = 100;
    let totalSent = 0;
    const errors: string[] = [];

    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);

      const emailPromises = batch.map((sub) => {
        const html = generateBriefEmailHtml(brief, sub.manageUrl);
        return resend.emails
          .send({
            from: resendFrom,
            to: sub.email,
            subject: `Your Market Brief - ${today}`,
            html,
          })
          .then(() => {
            totalSent++;
          })
          .catch((err) => {
            errors.push(`${sub.email}: ${err.message}`);
          });
      });

      await Promise.all(emailPromises);
    }

    return NextResponse.json({
      message: "Daily brief sent",
      sent: totalSent,
      failed: errors.length,
      errors: errors.length > 0 ? errors : undefined,
      briefDate: brief.date,
    });
  } catch (error) {
    console.error("Cron send-brief error:", error);
    return NextResponse.json(
      { error: "Failed to send daily brief" },
      { status: 500 }
    );
  }
}
