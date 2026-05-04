/**
 * Daily brief generation pipeline
 * Fetches market data from FMP -> sends to Claude API -> returns structured brief
 */

import { claudeMessage } from "@/lib/anthropic";
import { getAllMarketData, type AllMarketData } from "@/lib/data/market";
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

function buildPrompt(marketData: AllMarketData): string {
  // Build structured, labeled sections so Claude gets clean data
  const sections: string[] = [];

  // Indices
  if (marketData.overview.indices.length > 0) {
    sections.push(`=== MAJOR INDICES ===
${marketData.overview.indices.map((i) => `${i.name} (${i.symbol}): $${i.price.toFixed(2)} | Change: ${i.change >= 0 ? "+" : ""}${i.change.toFixed(2)} (${i.changePercent >= 0 ? "+" : ""}${i.changePercent.toFixed(2)}%)`).join("\n")}`);
  }

  // Top movers
  if (marketData.movers.gainers.length > 0 || marketData.movers.losers.length > 0) {
    const gainerLines = marketData.movers.gainers.map((m) => `  ${m.ticker} (${m.name}): $${m.price.toFixed(2)} | +${m.changePercent.toFixed(2)}%`);
    const loserLines = marketData.movers.losers.map((m) => `  ${m.ticker} (${m.name}): $${m.price.toFixed(2)} | ${m.changePercent.toFixed(2)}%`);
    sections.push(`=== TOP MOVERS ===
Gainers:
${gainerLines.join("\n")}
Losers:
${loserLines.join("\n")}`);
  }

  // Sector performance
  if (marketData.sectors.length > 0) {
    sections.push(`=== SECTOR PERFORMANCE ===
${marketData.sectors.map((s) => `${s.sector}: ${s.changesPercentage}`).join("\n")}`);
  }

  // Commodities
  if (marketData.commodities.length > 0) {
    sections.push(`=== COMMODITIES ===
${marketData.commodities.map((c) => `${c.name}: $${c.price.toFixed(2)} | Change: ${c.change >= 0 ? "+" : ""}${c.change.toFixed(2)} (${c.changePercent >= 0 ? "+" : ""}${c.changePercent.toFixed(2)}%)`).join("\n")}`);
  }

  // VIX
  if (marketData.vix) {
    sections.push(`=== VIX (FEAR INDEX) ===
VIX: ${marketData.vix.value.toFixed(2)} | Change: ${marketData.vix.change >= 0 ? "+" : ""}${marketData.vix.change.toFixed(2)} (${marketData.vix.changePercent >= 0 ? "+" : ""}${marketData.vix.changePercent.toFixed(2)}%)`);
  }

  // Treasury yields
  if (marketData.treasuryYields.length > 0) {
    sections.push(`=== TREASURY YIELDS ===
${marketData.treasuryYields.map((t) => `${t.name}: ${t.value.toFixed(2)}% (as of ${t.date})`).join("\n")}`);
  }

  // Economic calendar
  if (marketData.economicCalendar.length > 0) {
    sections.push(`=== ECONOMIC CALENDAR (TODAY) ===
${marketData.economicCalendar.map((e) => `${e.event} | Estimate: ${e.estimate || "N/A"} | Actual: ${e.actual || "pending"}`).join("\n")}`);
  }

  const dataBlock = sections.length > 0
    ? sections.join("\n\n")
    : "No market data available — generate a brief noting data unavailability.";

  return `You are the chief market strategist at a top-tier investment bank, writing a morning brief for your firm's trading desk and portfolio managers. This brief is known for being the most concise, insightful, and actionable morning read on Wall Street.

TODAY'S DATE: ${new Date().toISOString().split("T")[0]}
DATA SOURCES AVAILABLE: ${marketData.sourcesSucceeded.join(", ") || "none"}
DATA SOURCES FAILED: ${marketData.sourcesFailed.join(", ") || "none"}

LIVE MARKET DATA:
${dataBlock}

STRUCTURE (follow exactly — output as JSON):

{
  "marketPulse": "One paragraph, 3-4 sentences. What happened and where markets stand. Include S&P, Nasdaq, Dow with exact numbers. Treasury yields if available. Be specific with numbers.",

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
- Use ONLY the data provided above. Don't invent numbers.
- If a data source failed, acknowledge the gap but still write the best brief you can with available data.
- Be concise — entire brief should be a 2-minute read (~400 words)
- Lead with what matters most
- Use specific numbers always (%, $, bps)
- No hedging language ("it remains to be seen", "investors will be watching")
- No disclaimers or "not financial advice"
- No emojis
- Return ONLY valid JSON, no markdown or code blocks`;
}

export async function generateDailyBrief(forceRefresh = false): Promise<BriefData> {
  // Check cache first (one brief per day)
  if (!forceRefresh) {
    const cached = await getCachedBrief();
    if (cached) return cached.brief;
  }

  // Step 1: Fetch all market data in parallel (each source has its own try/catch)
  const marketData = await getAllMarketData();

  // At least one source must have returned data
  const hasAnyData = marketData.sourcesSucceeded.length > 0;

  if (!hasAnyData) {
    console.warn("All market data sources failed — brief will note data unavailability");
  }

  // Step 2: Build structured prompt with labeled sections
  const prompt = buildPrompt(marketData);

  // Step 3: Call Claude via claudex (Max sub, no API key)
  const text = await claudeMessage({
    messages: [{ role: "user", content: prompt }],
    max_tokens: 2000,
  });

  // Step 4: Parse and structure — strip markdown fences if Claude adds them
  let jsonText = text.trim();
  if (jsonText.startsWith("```")) {
    jsonText = jsonText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }

  const parsed = JSON.parse(jsonText);
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
    dataSourcesUsed: marketData.sourcesSucceeded,
    // Legacy compat
    summary: parsed.marketPulse || "",
  };

  // Step 5: Cache the result (non-blocking — don't let cache failure kill the brief)
  saveBriefCache(brief).catch((err) => {
    console.error("Brief cache save failed (non-blocking):", err);
  });

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
