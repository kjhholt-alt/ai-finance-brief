import { NextResponse } from "next/server";
import { getAnthropic } from "@/lib/anthropic";

export const dynamic = "force-dynamic";

const MOCK_MARKET_DATA = {
  date: new Date().toISOString().split("T")[0],
  indices: {
    SPY: { price: 502.45, change: 1.23, changePercent: 0.25 },
    DJI: { price: 38654.32, change: 156.78, changePercent: 0.41 },
    IXIC: { price: 15832.45, change: -23.12, changePercent: -0.15 },
  },
  stocks: [
    {
      ticker: "AAPL",
      name: "Apple Inc.",
      price: 187.32,
      change: 3.45,
      changePercent: 1.88,
      volume: "52.3M",
    },
    {
      ticker: "MSFT",
      name: "Microsoft Corp.",
      price: 415.67,
      change: -2.13,
      changePercent: -0.51,
      volume: "28.1M",
    },
    {
      ticker: "GOOGL",
      name: "Alphabet Inc.",
      price: 155.89,
      change: 4.21,
      changePercent: 2.78,
      volume: "31.7M",
    },
    {
      ticker: "TSLA",
      name: "Tesla Inc.",
      price: 238.45,
      change: -8.67,
      changePercent: -3.51,
      volume: "89.2M",
    },
    {
      ticker: "SPY",
      name: "S&P 500 ETF",
      price: 502.45,
      change: 1.23,
      changePercent: 0.25,
      volume: "75.4M",
    },
  ],
  sectors: [
    { name: "Technology", changePercent: 0.85 },
    { name: "Healthcare", changePercent: -0.32 },
    { name: "Financials", changePercent: 1.12 },
    { name: "Energy", changePercent: -1.45 },
    { name: "Consumer Discretionary", changePercent: 0.67 },
    { name: "Industrials", changePercent: 0.23 },
    { name: "Utilities", changePercent: -0.15 },
    { name: "Real Estate", changePercent: -0.78 },
  ],
  events: [
    "Federal Reserve meeting minutes released",
    "AAPL announced new AI features at developer conference",
    "TSLA recalls 125,000 vehicles for seatbelt warning issue",
    "US initial jobless claims came in at 210K vs 215K expected",
    "GOOGL completes acquisition of cloud security startup",
  ],
};

export async function POST() {
  try {
    const prompt = `You are a professional financial analyst writing a daily market brief. Based on the following market data, generate a comprehensive but concise market brief.

Market Data:
${JSON.stringify(MOCK_MARKET_DATA, null, 2)}

Generate a JSON response with the following structure:
{
  "summary": "A 2-3 paragraph market summary covering the overall market sentiment, key drivers, and notable movements.",
  "topMovers": [
    {
      "ticker": "SYMBOL",
      "name": "Company Name",
      "change": "+X.XX%",
      "analysis": "Brief explanation of why this stock moved"
    }
  ],
  "sectorPerformance": [
    {
      "sector": "Sector Name",
      "performance": "+X.XX%",
      "insight": "Brief insight about sector performance"
    }
  ],
  "outlook": "A forward-looking paragraph about what to watch for in the coming days, including upcoming events and potential market catalysts."
}

Important: Return ONLY valid JSON, no markdown formatting or code blocks.`;

    const anthropic = getAnthropic();
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250514",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    const brief = JSON.parse(content.text);

    return NextResponse.json({
      date: MOCK_MARKET_DATA.date,
      generatedAt: new Date().toISOString(),
      ...brief,
    });
  } catch (error) {
    console.error("Brief generation error:", error);

    // Return fallback brief if API fails
    return NextResponse.json({
      date: new Date().toISOString().split("T")[0],
      generatedAt: new Date().toISOString(),
      summary:
        "Markets showed mixed performance today. The S&P 500 gained 0.25% while the Nasdaq dipped slightly by 0.15%. Technology stocks led gains with Apple and Alphabet posting notable advances. Tesla was the biggest decliner among major names, falling 3.51% on recall news. The Federal Reserve meeting minutes provided limited new information, keeping markets in a wait-and-see mode.",
      topMovers: [
        {
          ticker: "GOOGL",
          name: "Alphabet Inc.",
          change: "+2.78%",
          analysis:
            "Shares rose on the completion of a strategic cloud security acquisition, strengthening its enterprise offerings.",
        },
        {
          ticker: "AAPL",
          name: "Apple Inc.",
          change: "+1.88%",
          analysis:
            "Gained on excitement around newly announced AI features at the developer conference.",
        },
        {
          ticker: "TSLA",
          name: "Tesla Inc.",
          change: "-3.51%",
          analysis:
            "Declined after announcing a recall of 125,000 vehicles for a seatbelt warning system issue.",
        },
      ],
      sectorPerformance: [
        {
          sector: "Financials",
          performance: "+1.12%",
          insight:
            "Financial stocks led the market higher on better-than-expected economic data.",
        },
        {
          sector: "Technology",
          performance: "+0.85%",
          insight:
            "Tech continues to benefit from AI optimism and strong earnings momentum.",
        },
        {
          sector: "Energy",
          performance: "-1.45%",
          insight:
            "Energy lagged as crude oil prices pulled back on demand concerns.",
        },
      ],
      outlook:
        "Looking ahead, investors should watch for upcoming earnings reports from major retailers and the next jobs report. The Fed minutes suggest rates may stay higher for longer, which could put pressure on rate-sensitive sectors. Key support for the S&P 500 sits at 498, while a break above 505 could signal further upside momentum.",
    });
  }
}
