/**
 * Daily brief generation pipeline
 * Fetches market data -> sends to Claude API -> returns structured brief
 */

import { getAnthropic } from "@/lib/anthropic";
import { getAllMarketData } from "@/lib/data/market";
import { createServerSupabase } from "@/lib/supabase";

export interface TopMover {
  ticker: string;
  name: string;
  change: string;
  analysis: string;
}

export interface SectorData {
  sector: string;
  performance: string;
  insight: string;
}

export interface WatchEvent {
  time: string;
  event: string;
  why: string;
}

export interface BriefData {
  date: string;
  generatedAt: string;
  marketPulse: string;
  topMovers: TopMover[];
  sectorSpotlight: string;
  nonObviousTake: string;
  thingToWatch: string;
  todayCalendar: WatchEvent[];
  sectorPerformance: SectorData[];
  outlook: string;
  dataSourcesUsed: string[];
  // Legacy fields for backward compat with existing dashboard
  summary: string;
}

async function getCachedBrief(): Promise<{ date: string; brief: BriefData } | null> {
  try {
    const supabase = createServerSupabase();
    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("briefs")
      .select("date, content")
      .eq("date", today)
      .single();

    if (error || !data) return null;
    return { date: data.date, brief: data.content as BriefData };
  } catch {
    return null;
  }
}

async function saveBriefCache(brief: BriefData): Promise<void> {
  try {
    const supabase = createServerSupabase();
    const today = new Date().toISOString().split("T")[0];
    await supabase
      .from("briefs")
      .upsert({ date: today, content: brief }, { onConflict: "date" });
  } catch (err) {
    console.error("Failed to cache brief in Supabase:", err);
  }
}

export async function generateDailyBrief(forceRefresh = false): Promise<BriefData> {
  // Check cache first (one brief per day)
  if (!forceRefresh) {
    const cached = await getCachedBrief();
    if (cached) return cached.brief;
  }

  // Step 1: Fetch all market data in parallel
  const marketData = await getAllMarketData();
  const dataSourcesUsed: string[] = [];

  // Track which data sources returned real data
  if (marketData.overview.indices.length > 0) dataSourcesUsed.push("alpha_vantage_quotes");
  if (marketData.movers.gainers.length > 0) dataSourcesUsed.push("alpha_vantage_movers");
  dataSourcesUsed.push("mock_premarket"); // Always mock for now

  // Step 2: Build the prompt with real data
  const prompt = `You are the chief market strategist at a top-tier investment bank, writing a morning brief for your firm's trading desk and portfolio managers. This brief is known for being the most concise, insightful, and actionable morning read on Wall Street.

MARKET DATA (use this as your primary source):
${JSON.stringify(marketData, null, 2)}

STRUCTURE (follow exactly — output as JSON):

{
  "marketPulse": "One paragraph, 3-4 sentences. What happened and where markets stand. Include S&P, Nasdaq, Dow with exact numbers. Treasury yields. Be specific with numbers.",

  "topMovers": [
    {
      "ticker": "SYMBOL",
      "name": "Company Name",
      "change": "+X.XX%",
      "analysis": "One sentence: WHY it moved (earnings, news, analyst action) and whether this is actionable"
    }
  ],

  "sectorSpotlight": "The ONE sector worth paying attention to today. Include the ETF ticker (XLK, XLF, XLE, etc.) and what's driving the move. 2-3 sentences max.",

  "nonObviousTake": "One insight most morning briefs won't have. A correlation, contrarian read, or under-the-radar data point. This should make the reader want to forward the brief. 2-3 sentences.",

  "thingToWatch": "The single most important thing to watch today. Be specific — include time if applicable.",

  "todayCalendar": [
    {
      "time": "8:30am ET",
      "event": "Event name",
      "why": "What consensus is and what deviation would mean"
    }
  ],

  "sectorPerformance": [
    {
      "sector": "Sector Name",
      "performance": "+X.XX%",
      "insight": "One sentence on what's driving it"
    }
  ],

  "outlook": "Forward-looking paragraph. What to position for this week. 2-3 sentences max."
}

RULES:
- Use ONLY the data provided. Don't invent numbers.
- Be concise — entire brief should be a 2-minute read (~400 words)
- Lead with what matters most
- Use specific numbers always (%, $, bps)
- No hedging language ("it remains to be seen", "investors will be watching")
- No disclaimers or "not financial advice"
- No emojis
- Return ONLY valid JSON, no markdown or code blocks`;

  // Step 3: Call Claude API
  const anthropic = getAnthropic();
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-5-20250514",
    max_tokens: 2000,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }

  // Step 4: Parse and structure
  const parsed = JSON.parse(content.text);
  const today = new Date().toISOString().split("T")[0];

  const brief: BriefData = {
    date: today,
    generatedAt: new Date().toISOString(),
    marketPulse: parsed.marketPulse || "",
    topMovers: parsed.topMovers || [],
    sectorSpotlight: parsed.sectorSpotlight || "",
    nonObviousTake: parsed.nonObviousTake || "",
    thingToWatch: parsed.thingToWatch || "",
    todayCalendar: parsed.todayCalendar || [],
    sectorPerformance: parsed.sectorPerformance || [],
    outlook: parsed.outlook || "",
    dataSourcesUsed,
    // Legacy compat
    summary: parsed.marketPulse || "",
  };

  // Step 5: Cache the result
  await saveBriefCache(brief);

  return brief;
}

// Get a brief for a specific date from Supabase
export async function getBriefByDate(date: string): Promise<BriefData | null> {
  try {
    const supabase = createServerSupabase();
    const { data, error } = await supabase
      .from("briefs")
      .select("content")
      .eq("date", date)
      .single();

    if (error || !data) return null;
    return data.content as BriefData;
  } catch {
    return null;
  }
}

// Save a brief to the archive (called after generation)
export async function archiveBrief(brief: BriefData): Promise<void> {
  try {
    const supabase = createServerSupabase();
    await supabase
      .from("briefs")
      .upsert({ date: brief.date, content: brief }, { onConflict: "date" });
  } catch (err) {
    console.error("Failed to archive brief:", err);
  }
}
