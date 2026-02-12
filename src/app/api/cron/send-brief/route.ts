import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getResend } from "@/lib/resend";
import { generateBriefEmailHtml } from "@/lib/email-template";

// This route is called by Vercel Cron at 7am ET on market days
// Configured in vercel.json

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Allow up to 60s for brief generation + email sends

const WAITLIST_PATH = path.join(process.cwd(), "data", "waitlist.json");
const BRIEF_CACHE_PATH = path.join(process.cwd(), "data", "brief-cache.json");

interface WaitlistEntry {
  email: string;
  joinedAt: string;
}

// Verify the request comes from Vercel Cron (or allow in dev)
function isAuthorized(request: Request): boolean {
  // In development, allow all requests
  if (process.env.NODE_ENV === "development") return true;

  // In production, verify the Vercel Cron secret
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) return false;
  return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(request: Request) {
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

    // Also save to cache
    const cacheDir = path.dirname(BRIEF_CACHE_PATH);
    await fs.mkdir(cacheDir, { recursive: true });
    await fs.writeFile(
      BRIEF_CACHE_PATH,
      JSON.stringify(
        { date: new Date().toISOString().split("T")[0], brief },
        null,
        2
      )
    );

    // 3. Get all subscribers
    let subscribers: WaitlistEntry[] = [];
    try {
      const data = await fs.readFile(WAITLIST_PATH, "utf-8");
      subscribers = JSON.parse(data);
    } catch {
      return NextResponse.json({
        message: "No subscribers found",
        sent: 0,
      });
    }

    if (subscribers.length === 0) {
      return NextResponse.json({
        message: "No subscribers to email",
        sent: 0,
      });
    }

    // 4. Generate email HTML
    const html = generateBriefEmailHtml(brief);
    const today = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });

    // 5. Send emails via Resend (batch up to 100 at a time)
    const resend = getResend();
    const batchSize = 100;
    let totalSent = 0;
    const errors: string[] = [];

    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);

      const emailPromises = batch.map((sub) =>
        resend.emails
          .send({
            from: "AI Finance Brief <brief@updates.aifinancebrief.com>",
            to: sub.email,
            subject: `📊 Your Market Brief — ${today}`,
            html,
          })
          .then(() => {
            totalSent++;
          })
          .catch((err) => {
            errors.push(`${sub.email}: ${err.message}`);
          })
      );

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
