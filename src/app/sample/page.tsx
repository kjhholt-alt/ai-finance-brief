import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  TrendingUp,
  TrendingDown,
  PieChart,
  Eye,
  AlertCircle,
  BarChart3,
  Sparkles,
  Target,
  Lightbulb,
  Calendar,
  Clock,
  ArrowRight,
  Lock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Sample Market Brief - AI Finance Brief",
  description:
    "See a real AI-generated daily market brief. 20 sectors analyzed, top movers explained, risk signals flagged — all in a 2-minute read. Try AI Finance Brief free.",
  openGraph: {
    title: "Sample Market Brief - AI Finance Brief",
    description:
      "See what an AI-generated daily market brief looks like. Top movers, sector analysis, and non-obvious insights in 2 minutes.",
    type: "website",
    siteName: "AI Finance Brief",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sample Market Brief - AI Finance Brief",
    description:
      "See what an AI-generated daily market brief looks like. Top movers, sector analysis, and non-obvious insights in 2 minutes.",
  },
};

// Realistic sample brief data
const sampleBrief = {
  date: "2026-02-14",
  generatedAt: "2026-02-14T11:58:00Z",
  marketPulse:
    "Markets closed mixed Friday as strong retail sales data reignited inflation concerns, offsetting gains from better-than-expected earnings. The S&P 500 edged down 0.2% to 6,128, while the Nasdaq Composite gained 0.4% on continued AI infrastructure strength. The Dow fell 0.5%, dragged by UnitedHealth (-3.1%) on renewed DOJ scrutiny. The 10-year Treasury yield climbed 6bps to 4.58% after January retail sales came in at +0.9% vs +0.5% expected. Breadth was flat — advancers and decliners split nearly evenly.",
  topMovers: [
    {
      ticker: "NVDA",
      name: "NVIDIA Corp",
      change: "+3.8%",
      positive: true,
      analysis:
        "Hit fresh all-time high on report that Microsoft is accelerating Blackwell GPU orders for Azure AI expansion. Options flow heavily bullish with $150 calls seeing 4x average volume.",
    },
    {
      ticker: "COIN",
      name: "Coinbase Global",
      change: "+6.2%",
      positive: true,
      analysis:
        "Bitcoin breaking above $105K drove a surge in trading volume. Q4 earnings next week expected to show transaction revenue up 40% QoQ.",
    },
    {
      ticker: "UNH",
      name: "UnitedHealth Group",
      change: "-3.1%",
      positive: false,
      analysis:
        "DOJ reportedly expanding investigation into Medicare Advantage billing practices. Dragged the entire managed care sector — HUM (-2.4%), CI (-1.8%).",
    },
    {
      ticker: "SMCI",
      name: "Super Micro Computer",
      change: "+5.4%",
      positive: true,
      analysis:
        "Upgraded to Buy at Needham with $45 PT on AI server demand acceleration. Backlog reportedly extends through Q3 2026.",
    },
    {
      ticker: "DIS",
      name: "Walt Disney Co",
      change: "-2.7%",
      positive: false,
      analysis:
        "Streaming subscriber adds missed estimates despite strong domestic parks revenue. Guidance cautious on international content spend.",
    },
  ],
  sectorSpotlight:
    "Semiconductors (SMH +2.8%) are the clear leader this week, with the SOX index pushing to new highs on the back of AI capex acceleration from hyperscalers. NVDA, AVGO, and AMD are all making new highs simultaneously for the first time since October 2024. The rotation from software into hardware names continues — IGV underperforming SMH by 4.2% MTD.",
  nonObviousTake:
    "The 10Y yield just hit 4.58% — its highest since November — yet semiconductors are rallying. This divergence from 2024's playbook (when rising yields crushed growth stocks) suggests the market is treating AI capex as a secular theme that transcends rate sensitivity. Watch for this to break: if yields push above 4.7%, even AI names will feel gravity. But for now, the bid is real.",
  thingToWatch:
    "Fed Governor Waller speaks Monday at 2:00 PM ET on the economic outlook. He's been the most hawkish voice recently — if he signals concern about the hot retail sales print, expect the 2-year yield to spike and rate-sensitive sectors (homebuilders, REITs, small caps) to sell off. The market is pricing in only one cut in 2026. Waller could take that to zero.",
  todayCalendar: [
    {
      time: "10:00 AM",
      event: "U. of Michigan Consumer Sentiment (Feb Prelim)",
      why: "Inflation expectations component is the key number. January came in at 3.3% — anything above 3.5% could trigger a bond selloff.",
    },
    {
      time: "1:00 PM",
      event: "Baker Hughes Rig Count",
      why: "Oil rigs declining for 3 straight weeks. A further drop supports crude above $78 and energy sector momentum.",
    },
    {
      time: "4:00 PM",
      event: "CFTC Commitment of Traders Report",
      why: "Speculative positioning in S&P futures near 2024 highs — a crowded long that could amplify any selloff.",
    },
  ],
  sectorPerformance: [
    {
      sector: "Technology",
      performance: "+0.8%",
      positive: true,
      insight: "AI infrastructure names driving gains; software lagging as Microsoft guides conservatively on margins.",
    },
    {
      sector: "Healthcare",
      performance: "-1.2%",
      positive: false,
      insight: "Managed care sell-off on DOJ headlines. Biotech (XBI) bucked the trend +0.6% on M&A speculation.",
    },
    {
      sector: "Energy",
      performance: "+0.4%",
      positive: true,
      insight: "Crude holding $78 on Middle East supply concerns. E&P names outperforming integrated majors.",
    },
    {
      sector: "Financials",
      performance: "+0.3%",
      positive: true,
      insight: "Regional banks rally on hot economic data — higher-for-longer rates widen net interest margins.",
    },
    {
      sector: "Consumer Disc.",
      performance: "-0.6%",
      positive: false,
      insight: "Retail sales beat masked weakness in discretionary spending. Auto dealers and restaurants under pressure.",
    },
    {
      sector: "Industrials",
      performance: "+0.2%",
      positive: true,
      insight: "Aerospace & defense leading on increased European NATO spending commitments.",
    },
    {
      sector: "Real Estate",
      performance: "-1.4%",
      positive: false,
      insight: "Rising yields pressuring REITs. Office vacancy concerns resurface with WeWork's latest restructuring.",
    },
    {
      sector: "Utilities",
      performance: "-0.3%",
      positive: false,
      insight: "Rate-sensitive. But data center power demand narrative keeping NEE and VST above 50-DMA.",
    },
    {
      sector: "Materials",
      performance: "+0.5%",
      positive: true,
      insight: "Copper at 3-month high on China stimulus expectations. FCX +2.1%.",
    },
  ],
  outlook:
    "Next week is dominated by Fed speakers and earnings from COIN, WMT, and PANW. The technical picture is constructive — the S&P 500 is holding above its 21-day EMA and breadth hasn't deteriorated despite yield pressure. The key level to watch is 4.65% on the 10Y — a close above that would likely trigger a 2-3% pullback in equities as rate cut expectations get repriced to zero for 2026. Position accordingly: overweight quality large-cap tech, underweight rate-sensitive sectors until yields stabilize.",
  dataSourcesUsed: [
    "Alpha Vantage",
    "Market data feeds",
    "Federal Reserve calendar",
    "SEC filings",
  ],
};

export default function SamplePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Badge
              variant="outline"
              className="border-amber-500/30 bg-amber-500/10 text-amber-300 px-3 py-1 text-xs font-medium"
            >
              SAMPLE BRIEF
            </Badge>
            <Badge
              variant="outline"
              className="border-white/[0.1] bg-white/[0.04] text-muted-foreground text-xs font-mono"
            >
              Feb 14, 2026
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-indigo-400" />
            Market Brief
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            This is what you get every market day morning. No sign-up required
            to preview.
          </p>
        </div>
        <Button
          size="lg"
          asChild
          className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
        >
          <Link href="/dashboard">
            Get Your Own Brief
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </div>

      <div className="space-y-6">
        {/* Market Pulse */}
        <Card className="glass border-white/[0.06] bg-white/[0.02]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-indigo-400" />
              </div>
              Market Pulse
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {sampleBrief.marketPulse}
            </p>
          </CardContent>
        </Card>

        {/* Top Movers */}
        <Card className="glass border-white/[0.06] bg-white/[0.02]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              Top Movers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sampleBrief.topMovers.map((mover) => (
                <div
                  key={mover.ticker}
                  className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors"
                >
                  <Badge
                    variant="outline"
                    className="shrink-0 font-mono font-bold border-white/[0.1] bg-white/[0.04]"
                  >
                    {mover.ticker}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-foreground font-medium">
                        {mover.name}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          mover.positive
                            ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                            : "text-red-400 border-red-500/30 bg-red-500/10"
                        }`}
                      >
                        {mover.positive ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {mover.change}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {mover.analysis}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Two-column: Sector Spotlight + Non-Obvious Take */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass border-white/[0.06] bg-white/[0.02] h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Target className="w-3.5 h-3.5 text-purple-400" />
                </div>
                Sector Spotlight
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {sampleBrief.sectorSpotlight}
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-500/20 bg-gradient-to-br from-purple-950/30 to-purple-900/10 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Lightbulb className="w-3.5 h-3.5 text-purple-400" />
                </div>
                Non-Obvious Take
                <Badge
                  variant="outline"
                  className="ml-auto text-xs text-purple-400 border-purple-500/30 bg-purple-500/10"
                >
                  Insight
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {sampleBrief.nonObviousTake}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sector Performance */}
        <Card className="glass border-white/[0.06] bg-white/[0.02]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <PieChart className="w-4 h-4 text-amber-400" />
              </div>
              Sector Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {sampleBrief.sectorPerformance.map((sector) => (
                <div
                  key={sector.sector}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">
                      {sector.sector}
                    </span>
                    <span
                      className={`text-sm font-semibold ${
                        sector.positive ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {sector.performance}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {sector.insight}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Thing to Watch */}
        <Card className="border-amber-500/20 bg-gradient-to-br from-amber-950/30 to-amber-900/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-amber-400" />
              </div>
              Thing to Watch Today
              <Badge
                variant="outline"
                className="ml-auto text-xs text-amber-400 border-amber-500/30 bg-amber-500/10"
              >
                Key Event
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {sampleBrief.thingToWatch}
            </p>
          </CardContent>
        </Card>

        {/* Today's Calendar */}
        <Card className="glass border-white/[0.06] bg-white/[0.02]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-cyan-400" />
              </div>
              Today&apos;s Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sampleBrief.todayCalendar.map((event, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                >
                  <div className="flex items-center gap-1.5 shrink-0 min-w-[80px]">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-xs font-mono text-cyan-400">
                      {event.time}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {event.event}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {event.why}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Forward Outlook */}
        <Card className="border-indigo-500/20 bg-gradient-to-br from-indigo-950/30 to-indigo-900/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                <Eye className="w-4 h-4 text-indigo-400" />
              </div>
              Forward Outlook
              <Sparkles className="w-4 h-4 text-indigo-400/60 ml-auto" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {sampleBrief.outlook}
            </p>
          </CardContent>
        </Card>

        {/* Data Sources */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/40">
          <Separator className="flex-1 bg-white/[0.04]" />
          <span>
            Sources: {sampleBrief.dataSourcesUsed.join(", ")}
          </span>
          <Separator className="flex-1 bg-white/[0.04]" />
        </div>

        {/* CTA Section */}
        <Card className="border-indigo-500/20 bg-gradient-to-b from-indigo-950/40 to-white/[0.02]">
          <CardContent className="p-8 sm:p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-indigo-500/20">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Get this brief every morning
            </h2>
            <p className="text-muted-foreground mb-2 max-w-lg mx-auto">
              20 sectors analyzed. Delivered by 6 AM ET. 2-minute read. Your AI
              market analyst that never sleeps.
            </p>
            <p className="text-muted-foreground/60 text-sm mb-6">
              Free tier available. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                size="lg"
                asChild
                className="h-12 px-8 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
              >
                <Link href="/dashboard">
                  Start Free
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="h-12 px-8 border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.06] text-muted-foreground"
              >
                <Link href="/#pricing">
                  <Lock className="w-4 h-4 mr-1" />
                  View Pro Plan — $9/mo
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
