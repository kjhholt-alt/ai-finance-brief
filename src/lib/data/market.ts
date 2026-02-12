/**
 * Market data fetching utilities
 * Uses Alpha Vantage free tier (25 requests/day)
 * Falls back to mock data when API is unavailable
 */

const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_API_KEY || "demo";
const BASE_URL = "https://www.alphavantage.co/query";

interface IndexData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

interface StockMover {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
}

interface MarketOverview {
  indices: IndexData[];
  lastUpdated: string;
}

interface TopMovers {
  gainers: StockMover[];
  losers: StockMover[];
}

interface PreMarketData {
  futures: { name: string; value: number; change: number; changePercent: number }[];
  commodities: { name: string; value: number; change: number; changePercent: number }[];
  bonds: { name: string; value: number; change: number }[];
}

async function fetchAlphaVantage(params: Record<string, string>): Promise<Record<string, unknown> | null> {
  try {
    const url = new URL(BASE_URL);
    url.searchParams.set("apikey", ALPHA_VANTAGE_KEY);
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }

    const response = await fetch(url.toString(), { next: { revalidate: 3600 } });
    if (!response.ok) return null;

    const data = await response.json();

    // Alpha Vantage returns a "Note" when rate-limited
    if (data["Note"] || data["Information"]) {
      console.warn("Alpha Vantage rate limited:", data["Note"] || data["Information"]);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Alpha Vantage fetch error:", error);
    return null;
  }
}

export async function getMarketOverview(): Promise<MarketOverview> {
  // Try fetching real data for SPY (S&P 500 proxy), QQQ (Nasdaq proxy), DIA (Dow proxy)
  const symbols = [
    { symbol: "SPY", name: "S&P 500" },
    { symbol: "QQQ", name: "Nasdaq 100" },
    { symbol: "DIA", name: "Dow Jones" },
  ];

  const results: IndexData[] = [];

  for (const { symbol, name } of symbols) {
    const data = await fetchAlphaVantage({
      function: "GLOBAL_QUOTE",
      symbol,
    });

    if (data && data["Global Quote"]) {
      const quote = data["Global Quote"] as Record<string, string>;
      results.push({
        symbol,
        name,
        price: parseFloat(quote["05. price"] || "0"),
        change: parseFloat(quote["09. change"] || "0"),
        changePercent: parseFloat((quote["10. change percent"] || "0").replace("%", "")),
      });
    }
  }

  // If we got real data, return it
  if (results.length > 0) {
    return { indices: results, lastUpdated: new Date().toISOString() };
  }

  // Fallback to mock data
  return getMockMarketOverview();
}

export async function getTopMovers(): Promise<TopMovers> {
  const data = await fetchAlphaVantage({
    function: "TOP_GAINERS_LOSERS",
  });

  if (data && data["top_gainers"] && data["top_losers"]) {
    const formatMover = (m: Record<string, string>): StockMover => ({
      ticker: m["ticker"] || "",
      name: m["ticker"] || "", // Alpha Vantage doesn't always return names
      price: parseFloat(m["price"] || "0"),
      change: parseFloat(m["change_amount"] || "0"),
      changePercent: parseFloat((m["change_percentage"] || "0").replace("%", "")),
      volume: m["volume"] || "N/A",
    });

    const gainers = (data["top_gainers"] as Record<string, string>[]).slice(0, 5).map(formatMover);
    const losers = (data["top_losers"] as Record<string, string>[]).slice(0, 5).map(formatMover);

    return { gainers, losers };
  }

  return getMockTopMovers();
}

export async function getPreMarketData(): Promise<PreMarketData> {
  // Alpha Vantage doesn't have great futures data on free tier
  // Use mock data for now — can upgrade to a paid source later
  return getMockPreMarketData();
}

// Fetch all market data in parallel
export async function getAllMarketData() {
  const [overview, movers, premarket] = await Promise.all([
    getMarketOverview(),
    getTopMovers(),
    getPreMarketData(),
  ]);

  return {
    overview,
    movers,
    premarket,
    fetchedAt: new Date().toISOString(),
  };
}

// ============ MOCK DATA FALLBACKS ============

function getMockMarketOverview(): MarketOverview {
  return {
    indices: [
      { symbol: "SPY", name: "S&P 500", price: 502.45, change: 1.23, changePercent: 0.25 },
      { symbol: "QQQ", name: "Nasdaq 100", price: 437.82, change: -0.67, changePercent: -0.15 },
      { symbol: "DIA", name: "Dow Jones", price: 386.54, change: 1.57, changePercent: 0.41 },
    ],
    lastUpdated: new Date().toISOString(),
  };
}

function getMockTopMovers(): TopMovers {
  return {
    gainers: [
      { ticker: "GOOGL", name: "Alphabet Inc.", price: 155.89, change: 4.21, changePercent: 2.78, volume: "31.7M" },
      { ticker: "AAPL", name: "Apple Inc.", price: 187.32, change: 3.45, changePercent: 1.88, volume: "52.3M" },
      { ticker: "JPM", name: "JPMorgan Chase", price: 198.45, change: 2.87, changePercent: 1.47, volume: "12.1M" },
      { ticker: "AMZN", name: "Amazon.com", price: 178.92, change: 2.15, changePercent: 1.22, volume: "38.5M" },
      { ticker: "UNH", name: "UnitedHealth Group", price: 542.10, change: 5.30, changePercent: 0.99, volume: "4.2M" },
    ],
    losers: [
      { ticker: "TSLA", name: "Tesla Inc.", price: 238.45, change: -8.67, changePercent: -3.51, volume: "89.2M" },
      { ticker: "NFLX", name: "Netflix Inc.", price: 612.30, change: -12.45, changePercent: -1.99, volume: "8.7M" },
      { ticker: "BA", name: "Boeing Co.", price: 178.20, change: -2.85, changePercent: -1.57, volume: "6.3M" },
      { ticker: "INTC", name: "Intel Corp.", price: 31.45, change: -0.42, changePercent: -1.32, volume: "45.1M" },
      { ticker: "DIS", name: "Walt Disney Co.", price: 112.67, change: -1.23, changePercent: -1.08, volume: "11.8M" },
    ],
  };
}

function getMockPreMarketData(): PreMarketData {
  return {
    futures: [
      { name: "S&P 500 Futures", value: 5032, change: 8.5, changePercent: 0.17 },
      { name: "Nasdaq Futures", value: 17845, change: -12.3, changePercent: -0.07 },
      { name: "Dow Futures", value: 38720, change: 45.0, changePercent: 0.12 },
    ],
    commodities: [
      { name: "Crude Oil (WTI)", value: 78.45, change: -0.82, changePercent: -1.03 },
      { name: "Gold", value: 2042.30, change: 5.60, changePercent: 0.27 },
    ],
    bonds: [
      { name: "10Y Treasury Yield", value: 4.32, change: 0.03 },
      { name: "2Y Treasury Yield", value: 4.67, change: -0.02 },
    ],
  };
}

export type { IndexData, StockMover, MarketOverview, TopMovers, PreMarketData };
