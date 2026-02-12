"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  RefreshCw,
  Loader2,
  AlertCircle,
  BarChart3,
  Sparkles,
  Target,
  Lightbulb,
  Calendar,
  Clock,
} from "lucide-react";
import { BriefRating } from "@/components/brief-rating";

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

interface WatchEvent {
  time: string;
  event: string;
  why: string;
}

interface BriefData {
  date: string;
  generatedAt: string;
  summary: string;
  marketPulse?: string;
  topMovers: TopMover[];
  sectorPerformance: SectorData[];
  sectorSpotlight?: string;
  nonObviousTake?: string;
  thingToWatch?: string;
  todayCalendar?: WatchEvent[];
  outlook: string;
  dataSourcesUsed?: string[];
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

function SkeletonCard() {
  return (
    <Card className="glass border-white/[0.06] bg-white/[0.02]">
      <CardHeader>
        <div className="h-5 bg-white/[0.06] rounded w-1/3 animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="h-3 bg-white/[0.06] rounded w-full animate-pulse" />
          <div className="h-3 bg-white/[0.06] rounded w-5/6 animate-pulse" />
          <div className="h-3 bg-white/[0.06] rounded w-4/6 animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [brief, setBrief] = useState<BriefData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateBrief = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/brief", { method: "POST" });
      if (!res.ok) throw new Error("Failed to generate brief");
      const data = await res.json();
      setBrief(data);
    } catch {
      setError("Failed to generate brief. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated" && !brief) {
      generateBrief();
    }
  }, [status, brief, generateBrief]);

  if (status === "loading") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading...
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-indigo-400" />
            Market Brief
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {brief
              ? `Generated ${new Date(brief.generatedAt).toLocaleString()}`
              : "Loading your daily brief..."}
          </p>
        </div>
        <Button
          onClick={generateBrief}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Generate New Brief
            </>
          )}
        </Button>
      </motion.div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading skeletons */}
      {loading && !brief ? (
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : brief ? (
        <div className="space-y-6">
          {/* Market Pulse / Summary Card */}
          <motion.div custom={0} initial="hidden" animate="visible" variants={cardVariants}>
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
                <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                  {brief.marketPulse || brief.summary}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Movers Card */}
          <motion.div custom={1} initial="hidden" animate="visible" variants={cardVariants}>
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
                  {brief.topMovers.map((mover) => (
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
                              mover.change.startsWith("+")
                                ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                                : "text-red-400 border-red-500/30 bg-red-500/10"
                            }`}
                          >
                            {mover.change.startsWith("+") ? (
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
          </motion.div>

          {/* Two-column: Sector Spotlight + Non-Obvious Take */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sector Spotlight */}
            {brief.sectorSpotlight && (
              <motion.div custom={2} initial="hidden" animate="visible" variants={cardVariants}>
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
                      {brief.sectorSpotlight}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Non-Obvious Take */}
            {brief.nonObviousTake && (
              <motion.div custom={2.5} initial="hidden" animate="visible" variants={cardVariants}>
                <Card className="border-purple-500/20 bg-gradient-to-br from-purple-950/30 to-purple-900/10 h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center">
                        <Lightbulb className="w-3.5 h-3.5 text-purple-400" />
                      </div>
                      Non-Obvious Take
                      <Badge variant="outline" className="ml-auto text-xs text-purple-400 border-purple-500/30 bg-purple-500/10">
                        Insight
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {brief.nonObviousTake}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Sector Performance Card */}
          <motion.div custom={3} initial="hidden" animate="visible" variants={cardVariants}>
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
                  {brief.sectorPerformance.map((sector) => (
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
                            sector.performance.startsWith("+")
                              ? "text-emerald-400"
                              : "text-red-400"
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
          </motion.div>

          {/* Thing to Watch Card */}
          {brief.thingToWatch && (
            <motion.div custom={4} initial="hidden" animate="visible" variants={cardVariants}>
              <Card className="border-amber-500/20 bg-gradient-to-br from-amber-950/30 to-amber-900/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                    </div>
                    Thing to Watch Today
                    <Badge variant="outline" className="ml-auto text-xs text-amber-400 border-amber-500/30 bg-amber-500/10">
                      Key Event
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {brief.thingToWatch}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Today's Calendar */}
          {brief.todayCalendar && brief.todayCalendar.length > 0 && (
            <motion.div custom={4.5} initial="hidden" animate="visible" variants={cardVariants}>
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
                    {brief.todayCalendar.map((event, idx) => (
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
            </motion.div>
          )}

          {/* Outlook Card */}
          <motion.div custom={5} initial="hidden" animate="visible" variants={cardVariants}>
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
                  {brief.outlook}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Data Sources */}
          {brief.dataSourcesUsed && brief.dataSourcesUsed.length > 0 && (
            <motion.div custom={5.5} initial="hidden" animate="visible" variants={cardVariants}>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/40">
                <Separator className="flex-1 bg-white/[0.04]" />
                <span>Sources: {brief.dataSourcesUsed.join(", ")}</span>
                <Separator className="flex-1 bg-white/[0.04]" />
              </div>
            </motion.div>
          )}

          {/* Brief Rating */}
          <BriefRating date={brief.date} />
        </div>
      ) : null}
    </div>
  );
}
