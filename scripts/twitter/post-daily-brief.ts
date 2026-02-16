/**
 * Daily Twitter/X Post Automation for AI Finance Brief
 *
 * Fetches today's brief from the API, uses Claude Haiku to craft a tweet,
 * and posts it to Twitter/X. Run via cron or manually.
 *
 * Usage:
 *   npx tsx scripts/twitter/post-daily-brief.ts
 *   npx tsx scripts/twitter/post-daily-brief.ts --dry-run    (preview without posting)
 *   npx tsx scripts/twitter/post-daily-brief.ts --thread     (post as a thread)
 *
 * Required env vars (in .env.local):
 *   TWITTER_CONSUMER_KEY
 *   TWITTER_CONSUMER_SECRET
 *   TWITTER_ACCESS_TOKEN         (OAuth 1.0a — needed to post)
 *   TWITTER_ACCESS_TOKEN_SECRET  (OAuth 1.0a — needed to post)
 *   ANTHROPIC_API_KEY            (for Claude Haiku tweet generation)
 *
 * Schedule: Run daily at 7:00 AM ET (after brief generates at ~6 AM)
 */

import { TwitterApi } from "twitter-api-v2";
import Anthropic from "@anthropic-ai/sdk";
import { config } from "dotenv";
import { resolve } from "path";

// Load .env.local from project root
config({ path: resolve(__dirname, "../../.env.local") });

// ─── Config ──────────────────────────────────────────────────────────
const BRIEF_API_URL =
  process.env.BRIEF_API_URL || "https://ai-finance-brief.vercel.app";
const SAMPLE_URL = `${BRIEF_API_URL}/sample`;
const DRY_RUN = process.argv.includes("--dry-run");
const THREAD_MODE = process.argv.includes("--thread");

// ─── Twitter Client ──────────────────────────────────────────────────
function getTwitterClient(): TwitterApi {
  const consumerKey = process.env.TWITTER_CONSUMER_KEY;
  const consumerSecret = process.env.TWITTER_CONSUMER_SECRET;
  const accessToken = process.env.TWITTER_ACCESS_TOKEN;
  const accessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET;

  if (!consumerKey || !consumerSecret || !accessToken || !accessTokenSecret) {
    console.error("Missing Twitter API credentials.");
    console.error("Required: TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET,");
    console.error("          TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_TOKEN_SECRET");
    console.error("");
    console.error("Generate Access Token + Secret at https://console.x.com");
    console.error("under your app > Keys and tokens > Access Token and Secret");
    process.exit(1);
  }

  return new TwitterApi({
    appKey: consumerKey,
    appSecret: consumerSecret,
    accessToken,
    accessSecret: accessTokenSecret,
  });
}

// ─── Claude Client ───────────────────────────────────────────────────
function getAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("Missing ANTHROPIC_API_KEY in .env.local");
    process.exit(1);
  }
  return new Anthropic({ apiKey });
}

// ─── Brief Data Types ────────────────────────────────────────────────
interface TopMover {
  ticker: string;
  name: string;
  change: string;
  analysis: string;
}

interface SectorData {
  sector: string;
  performance: string;
  insight: string;
}

interface BriefData {
  date: string;
  marketPulse: string;
  topMovers: TopMover[];
  sectorSpotlight?: string;
  nonObviousTake?: string;
  thingToWatch?: string;
  sectorPerformance: SectorData[];
  outlook: string;
}

// ─── Fetch Today's Brief ─────────────────────────────────────────────
async function fetchTodaysBrief(): Promise<BriefData | null> {
  try {
    // Try the live API first
    const res = await fetch(`${BRIEF_API_URL}/api/brief`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      return await res.json();
    }

    console.warn(`Brief API returned ${res.status}, using sample data`);
    return null;
  } catch (err) {
    console.warn("Could not fetch live brief:", err);
    return null;
  }
}

// ─── Generate Tweet with Claude ──────────────────────────────────────
async function generateTweet(brief: BriefData): Promise<string> {
  const anthropic = getAnthropicClient();

  const prompt = `You are a social media writer for a finance product called AI Finance Brief. Generate a single tweet (max 270 characters to leave room for a link) based on today's market brief data.

BRIEF DATA:
Market Pulse: ${brief.marketPulse}

Top Movers:
${brief.topMovers
  .slice(0, 3)
  .map((m) => `${m.ticker} ${m.change}: ${m.analysis}`)
  .join("\n")}

${brief.nonObviousTake ? `Non-Obvious Take: ${brief.nonObviousTake}` : ""}
${brief.thingToWatch ? `Thing to Watch: ${brief.thingToWatch}` : ""}

RULES:
- Max 270 characters (a link will be appended separately)
- Lead with the most interesting insight or data point
- Use specific numbers (%, $, tickers)
- No hashtags (they look spammy on FinTwit)
- No emojis
- Sound like a smart analyst, not a marketer
- Don't say "AI Finance Brief" in the tweet — the link does that
- End with something that makes people want to click for more
- Return ONLY the tweet text, nothing else`;

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 200,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected Claude response");

  return content.text.trim();
}

// ─── Generate Thread with Claude ─────────────────────────────────────
async function generateThread(brief: BriefData): Promise<string[]> {
  const anthropic = getAnthropicClient();

  const prompt = `You are a social media writer for a finance product called AI Finance Brief. Generate a 4-tweet thread based on today's market brief.

BRIEF DATA:
Market Pulse: ${brief.marketPulse}

Top Movers:
${brief.topMovers.map((m) => `${m.ticker} ${m.change}: ${m.analysis}`).join("\n")}

Sector Spotlight: ${brief.sectorSpotlight || "N/A"}
Non-Obvious Take: ${brief.nonObviousTake || "N/A"}
Thing to Watch: ${brief.thingToWatch || "N/A"}
Outlook: ${brief.outlook}

RULES:
- 4 tweets, each max 270 characters
- Tweet 1: Hook — the most interesting market move or data point today
- Tweet 2: Top movers — 2-3 tickers with % changes and why
- Tweet 3: The non-obvious insight or thing to watch
- Tweet 4: CTA — "Full brief (20 sectors, 2-min read):" (a link will be appended)
- Use specific numbers always
- No hashtags, no emojis
- Sound like a smart analyst sharing morning notes
- Return each tweet on its own line, separated by ---
- Return ONLY the tweets, nothing else`;

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 500,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected Claude response");

  return content.text
    .trim()
    .split("---")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

// ─── Post Single Tweet ───────────────────────────────────────────────
async function postTweet(text: string): Promise<void> {
  const linkUrl = `${SAMPLE_URL}?utm_source=twitter&utm_medium=organic&utm_campaign=daily_post`;
  const fullTweet = `${text}\n\n${linkUrl}`;

  console.log("\n--- Tweet Preview ---");
  console.log(fullTweet);
  console.log(`--- ${fullTweet.length} characters ---\n`);

  if (DRY_RUN) {
    console.log("[DRY RUN] Would have posted the above tweet.");
    return;
  }

  const client = getTwitterClient();
  const result = await client.v2.tweet(fullTweet);
  console.log(`Posted tweet: https://x.com/i/status/${result.data.id}`);
}

// ─── Post Thread ─────────────────────────────────────────────────────
async function postThread(tweets: string[]): Promise<void> {
  const linkUrl = `${SAMPLE_URL}?utm_source=twitter&utm_medium=organic&utm_campaign=daily_thread`;

  // Append link to the last tweet
  const tweetsWithLink = tweets.map((t, i) =>
    i === tweets.length - 1 ? `${t}\n\n${linkUrl}` : t
  );

  console.log("\n--- Thread Preview ---");
  tweetsWithLink.forEach((t, i) => {
    console.log(`\nTweet ${i + 1}/${tweetsWithLink.length}:`);
    console.log(t);
    console.log(`(${t.length} chars)`);
  });
  console.log("--- End Thread ---\n");

  if (DRY_RUN) {
    console.log("[DRY RUN] Would have posted the above thread.");
    return;
  }

  const client = getTwitterClient();

  // Post thread: first tweet, then reply chain
  let lastTweetId: string | undefined;
  for (let i = 0; i < tweetsWithLink.length; i++) {
    const options = lastTweetId
      ? { reply: { in_reply_to_tweet_id: lastTweetId } }
      : {};

    const result = await client.v2.tweet(tweetsWithLink[i], options);
    lastTweetId = result.data.id;

    if (i === 0) {
      console.log(
        `Thread started: https://x.com/i/status/${result.data.id}`
      );
    }
  }

  console.log(`Thread complete (${tweetsWithLink.length} tweets)`);
}

// ─── Main ────────────────────────────────────────────────────────────
async function main() {
  console.log(
    `AI Finance Brief — Twitter Automation (${DRY_RUN ? "DRY RUN" : "LIVE"})`
  );
  console.log(`Mode: ${THREAD_MODE ? "Thread" : "Single tweet"}\n`);

  // Fetch brief
  console.log("Fetching today's brief...");
  const brief = await fetchTodaysBrief();

  if (!brief) {
    console.error(
      "No brief available. Make sure the brief has been generated first."
    );
    console.error("Try generating one at: " + BRIEF_API_URL + "/dashboard");
    process.exit(1);
  }

  console.log(`Brief date: ${brief.date}`);
  console.log(`Top movers: ${brief.topMovers.map((m) => m.ticker).join(", ")}`);

  // Generate and post
  if (THREAD_MODE) {
    console.log("\nGenerating thread with Claude Haiku...");
    const tweets = await generateThread(brief);
    await postThread(tweets);
  } else {
    console.log("\nGenerating tweet with Claude Haiku...");
    const tweet = await generateTweet(brief);
    await postTweet(tweet);
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
