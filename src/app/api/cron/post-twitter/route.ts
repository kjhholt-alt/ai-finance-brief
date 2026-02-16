/**
 * Cron endpoint to auto-post today's brief highlight to Twitter/X.
 *
 * Can be called by Vercel Cron, Railway cron, or external scheduler.
 * Protected by CRON_SECRET to prevent unauthorized triggers.
 *
 * POST /api/cron/post-twitter
 * Headers: Authorization: Bearer <CRON_SECRET>
 */

import { NextResponse } from "next/server";
import { TwitterApi } from "twitter-api-v2";
import Anthropic from "@anthropic-ai/sdk";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(request: Request) {
  // Auth check
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check required env vars
  const consumerKey = process.env.TWITTER_CONSUMER_KEY;
  const consumerSecret = process.env.TWITTER_CONSUMER_SECRET;
  const accessToken = process.env.TWITTER_ACCESS_TOKEN;
  const accessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (!consumerKey || !consumerSecret || !accessToken || !accessTokenSecret) {
    return NextResponse.json(
      { error: "Twitter credentials not configured" },
      { status: 503 }
    );
  }

  if (!anthropicKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured" },
      { status: 503 }
    );
  }

  try {
    // Fetch today's brief from our own API
    const baseUrl =
      process.env.NEXTAUTH_URL || "https://ai-finance-brief.vercel.app";
    const briefRes = await fetch(`${baseUrl}/api/brief`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!briefRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch brief" },
        { status: 500 }
      );
    }

    const brief = await briefRes.json();

    // Generate tweet with Claude Haiku
    const anthropic = new Anthropic({ apiKey: anthropicKey });
    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      messages: [
        {
          role: "user",
          content: `Generate a single tweet (max 270 chars) about today's market based on this data. Lead with the most interesting insight. Use specific numbers. No hashtags, no emojis. Sound like a smart analyst. Return ONLY the tweet text.

Market: ${brief.marketPulse || brief.summary || ""}
Top movers: ${(brief.topMovers || []).slice(0, 3).map((m: { ticker: string; change: string }) => `${m.ticker} ${m.change}`).join(", ")}
${brief.nonObviousTake ? `Insight: ${brief.nonObviousTake}` : ""}`,
        },
      ],
    });

    const tweetContent = message.content[0];
    if (tweetContent.type !== "text") {
      return NextResponse.json(
        { error: "Unexpected Claude response" },
        { status: 500 }
      );
    }

    const tweetText = tweetContent.text.trim();
    const sampleUrl = `${baseUrl}/sample?utm_source=twitter&utm_medium=organic&utm_campaign=daily_cron`;
    const fullTweet = `${tweetText}\n\n${sampleUrl}`;

    // Post to Twitter
    const twitter = new TwitterApi({
      appKey: consumerKey,
      appSecret: consumerSecret,
      accessToken,
      accessSecret: accessTokenSecret,
    });

    const result = await twitter.v2.tweet(fullTweet);

    return NextResponse.json({
      success: true,
      tweetId: result.data.id,
      tweetUrl: `https://x.com/i/status/${result.data.id}`,
      tweetText: fullTweet,
    });
  } catch (error) {
    console.error("Twitter cron error:", error);
    return NextResponse.json(
      { error: "Failed to post tweet" },
      { status: 500 }
    );
  }
}
