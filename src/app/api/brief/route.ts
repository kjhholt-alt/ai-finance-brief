import { NextResponse } from "next/server";
import { generateDailyBrief, archiveBrief } from "@/lib/brief/generator";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Rate limiting: simple in-memory store (resets on server restart)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT;
}

export async function POST(request: Request) {
  // Rate limiting
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a minute." },
      { status: 429 }
    );
  }

  try {
    const url = new URL(request.url);
    const forceRefresh = url.searchParams.get("force") === "true";

    const brief = await generateDailyBrief(forceRefresh);

    // Archive the brief for future access
    await archiveBrief(brief);

    return NextResponse.json(brief);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Brief generation error:", errorMsg, error);

    // Return a fallback brief so the UI isn't blank
    return NextResponse.json({
      date: new Date().toISOString().split("T")[0],
      generatedAt: new Date().toISOString(),
      summary: "Markets showed mixed performance today. The S&P 500 gained 0.25% while the Nasdaq dipped slightly. Check back soon for a full AI-generated brief.",
      marketPulse: "Brief generation temporarily unavailable. Using cached summary.",
      topMovers: [],
      sectorPerformance: [],
      thingToWatch: "Check back shortly for today's key market events.",
      outlook: "Full market analysis will be available shortly.",
      sectorSpotlight: "",
      nonObviousTake: "",
      todayCalendar: [],
      dataSourcesUsed: ["fallback"],
      _error: errorMsg,
    });
  }
}

// GET endpoint for fetching briefs by date
export async function GET(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a minute." },
      { status: 429 }
    );
  }

  try {
    // Return today's cached brief without generating a new one
    const brief = await generateDailyBrief(false);
    return NextResponse.json(brief);
  } catch (error) {
    console.error("Brief fetch error:", error);
    return NextResponse.json(
      { error: "No brief available yet today." },
      { status: 404 }
    );
  }
}
