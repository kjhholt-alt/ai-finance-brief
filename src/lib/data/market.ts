/**
 * Market data fetching utilities
 * Uses Financial Modeling Prep (FMP) stable API for all market data.
 * Free tier: 250 req/day, single-symbol quotes, gainers/losers, sectors, treasury.
 * ~10 API calls per brief, well within limits.
 */

const FMP_KEY = process.env.FMP_API_KEY || "";
const FMP_BASE = "https://financialmodelingprep.com/stable";

// ============ TYPES ============

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

interface SectorPerformance {
  sector: string;
  changesPercentage: string;
}

interface CommodityQuote {
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

interface TreasuryData {
  name: string;
  value: number;
  date: string;
}

interface EconomicEvent {
  date: string;
  event: string;
  actual: string | null;
  estimate: string | null;
  change: string | null;
}

interface PreMarketData {
  futures: { name: string; value: number; change: number; changePercent: number }[];
  commodities: { name: string; value: number; change: number; changePercent: number }[];
  bonds: { name: string; value: number; change: number }[];
}

// ============ FMP FETCHER ============

async function fetchFMP<T>(path: string): Promise<T | null> {
  if (!FMP_KEY) {
    console.warn("FMP_API_KEY not set — skipping FMP fetch");
    return null;
  }
  try {
    const separator = path.includes("?") ? "&" : "?";
    const url = `${FMP_BASE}${path}${separator}apikey=${FMP_KEY}`;
    const response = await fetch(url, { next: { revalidate: 1800 } });
    if (!response.ok) {
      console.error(`FMP ${path} returned ${response.status}`);
      return null;
    }
    const text = await response.text();
    // FMP returns error strings for premium endpoints
    if (text.startsWith("Premium") || text.startsWith("Restricted") || text.startsWith("Query Error")) {
      console.warn(`FMP endpoint restricted (free tier): ${path}`);
      return null;
    }
    const data = JSON.parse(text);
    if (data?.["Error Message"]) {
      console.error("FMP error:", data["Error Message"]);
      return null;
    }
    return data as T;
  } catch (error) {
    console.error(`FMP fetch error (${path}):`, error);
    return null;
  }
}

// ============ MARKET DATA FUNCTIONS ============

interface FMPQuote {
  symbol: string;
  name: string;
  price: number;
  changePercentage: number;
  change: number;
  volume: number;
  dayLow: number;
  dayHigh: number;
  yearHigh: number;
  yearLow: number;
  marketCap: number;
  priceAvg50: number;
  priceAvg200: number;
  exchange: string;
  open: number;
  previousClose: number;
  timestamp: number;
}

export async function getMarketOverview(): Promise<MarketOverview> {
  // Free tier only supports individual symbol quotes, not batch
  const symbols = [
    { symbol: "SPY", name: "S&P 500" },
    { symbol: "QQQ", name: "Nasdaq 100" },
    { symbol: "DIA", name: "Dow Jones" },
  ];

  const results: IndexData[] = [];

  // Fetch in parallel — each may fail independently (QQQ/DIA may be premium)
  const quotes = await Promise.all(
    symbols.map(({ symbol }) => fetchFMP<FMPQuote[]>(`/quote?symbol=${symbol}`))
  );

  for (let i = 0; i < symbols.length; i++) {
    const data = quotes[i];
    if (data && data.length > 0) {
      const q = data[0];
      results.push({
        symbol: symbols[i].symbol,
        name: symbols[i].name,
        price: q.price,
        change: q.change,
        changePercent: q.changePercentage,
      });
    }
  }

  return {
    indices: results,
    lastUpdated: new Date().toISOString(),
  };
}

interface FMPMover {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changesPercentage: number;
  exchange: string;
}

export async function getTopMovers(): Promise<TopMovers> {
  const [gainersData, losersData] = await Promise.all([
    fetchFMP<FMPMover[]>("/biggest-gainers"),
    fetchFMP<FMPMover[]>("/biggest-losers"),
  ]);

  const formatMover = (m: FMPMover): StockMover => ({
    ticker: m.symbol,
    name: m.name || m.symbol,
    price: m.price || 0,
    change: m.change || 0,
    changePercent: m.changesPercentage || 0,
    volume: "N/A",
  });

  return {
    gainers: (gainersData || []).slice(0, 5).map(formatMover),
    losers: (losersData || []).slice(0, 5).map(formatMover),
  };
}

interface FMPSectorSnapshot {
  date: string;
  sector: string;
  exchange: string;
  averageChange: number;
}

export async function getSectorPerformance(): Promise<SectorPerformance[]> {
  // Sector snapshot requires a business day date — try last 4 days to find one
  for (let daysBack = 1; daysBack <= 4; daysBack++) {
    const d = new Date();
    d.setDate(d.getDate() - daysBack);
    const dateStr = d.toISOString().split("T")[0];

    const data = await fetchFMP<FMPSectorSnapshot[]>(`/sector-performance-snapshot?date=${dateStr}`);
    if (data && data.length > 0) {
      const sectorMap = new Map<string, number[]>();
      for (const entry of data) {
        const existing = sectorMap.get(entry.sector) || [];
        existing.push(entry.averageChange);
        sectorMap.set(entry.sector, existing);
      }
      return Array.from(sectorMap.entries()).map(([sector, changes]) => ({
        sector,
        changesPercentage: (changes.reduce((a, b) => a + b, 0) / changes.length).toFixed(2) + "%",
      }));
    }
  }
  return [];

}

export async function getCommodities(): Promise<CommodityQuote[]> {
  // Commodity symbols (GCUSD, CLUSD) are premium on free tier
  // Try commodity ETFs as proxies instead
  const etfs = [
    { symbol: "GLD", name: "Gold (GLD ETF)" },
    { symbol: "USO", name: "Crude Oil (USO ETF)" },
  ];

  const results: CommodityQuote[] = [];
  const quotes = await Promise.all(
    etfs.map(({ symbol }) => fetchFMP<FMPQuote[]>(`/quote?symbol=${symbol}`))
  );

  for (let i = 0; i < etfs.length; i++) {
    const data = quotes[i];
    if (data && data.length > 0) {
      const q = data[0];
      results.push({
        name: etfs[i].name,
        symbol: etfs[i].symbol,
        price: q.price,
        change: q.change,
        changePercent: q.changePercentage,
      });
    }
  }

  return results;
}

export async function getVIX(): Promise<{ value: number; change: number; changePercent: number } | null> {
  // VIX (^VIX) may be premium — try it, handle gracefully if restricted
  const data = await fetchFMP<FMPQuote[]>("/quote?symbol=%5EVIX");
  if (!data || data.length === 0) return null;
  const vix = data[0];
  return {
    value: vix.price,
    change: vix.change,
    changePercent: vix.changePercentage,
  };
}

interface FMPTreasuryRate {
  date: string;
  month1: number;
  month2: number;
  month3: number;
  month6: number;
  year1: number;
  year2: number;
  year3: number;
  year5: number;
  year7: number;
  year10: number;
  year20: number;
  year30: number;
}

export async function getTreasuryYields(): Promise<TreasuryData[]> {
  const data = await fetchFMP<FMPTreasuryRate[]>("/treasury-rates");
  if (!data || data.length === 0) return [];

  const rates = data[0]; // Most recent
  return [
    { name: "10Y Treasury Yield", value: rates.year10, date: rates.date },
    { name: "2Y Treasury Yield", value: rates.year2, date: rates.date },
    { name: "30Y Treasury Yield", value: rates.year30, date: rates.date },
  ];
}

export async function getEconomicCalendar(): Promise<EconomicEvent[]> {
  // Economic calendar is premium on free tier — try it, handle gracefully
  const today = new Date().toISOString().split("T")[0];
  const data = await fetchFMP<EconomicEvent[]>(`/economic-calendar?from=${today}&to=${today}`);
  return (data || []).slice(0, 10);
}

// ============ AGGREGATE FETCHER ============

export interface AllMarketData {
  overview: MarketOverview;
  movers: TopMovers;
  premarket: PreMarketData;
  sectors: SectorPerformance[];
  commodities: CommodityQuote[];
  vix: { value: number; change: number; changePercent: number } | null;
  treasuryYields: TreasuryData[];
  economicCalendar: EconomicEvent[];
  fetchedAt: string;
  sourcesSucceeded: string[];
  sourcesFailed: string[];
}

export async function getAllMarketData(): Promise<AllMarketData> {
  const sourcesSucceeded: string[] = [];
  const sourcesFailed: string[] = [];

  // Fetch all data in parallel — each source independent with its own error handling
  const [overview, movers, sectors, commodities, vix, treasuryYields, economicCalendar] =
    await Promise.all([
      getMarketOverview().catch((e) => {
        console.error("getMarketOverview failed:", e);
        return { indices: [], lastUpdated: new Date().toISOString() } as MarketOverview;
      }),
      getTopMovers().catch((e) => {
        console.error("getTopMovers failed:", e);
        return { gainers: [], losers: [] } as TopMovers;
      }),
      getSectorPerformance().catch((e) => {
        console.error("getSectorPerformance failed:", e);
        return [] as SectorPerformance[];
      }),
      getCommodities().catch((e) => {
        console.error("getCommodities failed:", e);
        return [] as CommodityQuote[];
      }),
      getVIX().catch((e) => {
        console.error("getVIX failed:", e);
        return null;
      }),
      getTreasuryYields().catch((e) => {
        console.error("getTreasuryYields failed:", e);
        return [] as TreasuryData[];
      }),
      getEconomicCalendar().catch((e) => {
        console.error("getEconomicCalendar failed:", e);
        return [] as EconomicEvent[];
      }),
    ]);

  // Track which sources returned data
  if (overview.indices.length > 0) sourcesSucceeded.push("fmp_indices");
  else sourcesFailed.push("fmp_indices");

  if (movers.gainers.length > 0 || movers.losers.length > 0) sourcesSucceeded.push("fmp_movers");
  else sourcesFailed.push("fmp_movers");

  if (sectors.length > 0) sourcesSucceeded.push("fmp_sectors");
  else sourcesFailed.push("fmp_sectors");

  if (commodities.length > 0) sourcesSucceeded.push("fmp_commodities");
  else sourcesFailed.push("fmp_commodities");

  if (vix) sourcesSucceeded.push("fmp_vix");
  else sourcesFailed.push("fmp_vix");

  if (treasuryYields.length > 0) sourcesSucceeded.push("fmp_treasury");
  else sourcesFailed.push("fmp_treasury");

  if (economicCalendar.length > 0) sourcesSucceeded.push("fmp_calendar");
  else sourcesFailed.push("fmp_calendar");

  // Build premarket-compatible structure from real data
  const premarket: PreMarketData = {
    futures: [],
    commodities: commodities.map((c) => ({
      name: c.name,
      value: c.price,
      change: c.change,
      changePercent: c.changePercent,
    })),
    bonds: treasuryYields.map((t) => ({
      name: t.name,
      value: t.value,
      change: 0,
    })),
  };

  return {
    overview,
    movers,
    premarket,
    sectors,
    commodities,
    vix,
    treasuryYields,
    economicCalendar,
    fetchedAt: new Date().toISOString(),
    sourcesSucceeded,
    sourcesFailed,
  };
}

export type { IndexData, StockMover, MarketOverview, TopMovers, PreMarketData, SectorPerformance, CommodityQuote, TreasuryData, EconomicEvent };
