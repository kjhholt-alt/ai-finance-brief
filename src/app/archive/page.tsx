"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Archive,
  Calendar,
  ChevronRight,
  Loader2,
  BookOpen,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Eye,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

interface ArchivedBrief {
  date: string;
  generatedAt: string;
  summary: string;
  marketPulse?: string;
  topMovers: { ticker: string; name: string; change: string; analysis: string }[];
  sectorPerformance: { sector: string; performance: string; insight: string }[];
  thingToWatch?: string;
  outlook: string;
}

export default function ArchivePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [briefs, setBriefs] = useState<ArchivedBrief[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrief, setSelectedBrief] = useState<ArchivedBrief | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchArchive();
    }
  }, [status]);

  const fetchArchive = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/brief/archive");
      if (res.ok) {
        const data = await res.json();
        setBriefs(data.briefs || []);
      }
    } catch {
      // Archive might not have briefs yet
    } finally {
      setLoading(false);
    }
  };

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

  // If viewing a specific brief
  if (selectedBrief) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            variant="ghost"
            onClick={() => setSelectedBrief(null)}
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Archive
          </Button>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {new Date(selectedBrief.date + "T12:00:00").toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h1>
              <p className="text-sm text-muted-foreground">
                Generated {new Date(selectedBrief.generatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-6">
          {/* Summary */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="glass border-white/[0.06] bg-white/[0.02]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-indigo-400" />
                  </div>
                  Market Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                  {selectedBrief.marketPulse || selectedBrief.summary}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Movers */}
          {selectedBrief.topMovers.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
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
                    {selectedBrief.topMovers.map((mover) => (
                      <div
                        key={mover.ticker}
                        className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                      >
                        <Badge variant="outline" className="shrink-0 font-mono font-bold border-white/[0.1] bg-white/[0.04]">
                          {mover.ticker}
                        </Badge>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-foreground font-medium">{mover.name}</span>
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
                          <p className="text-muted-foreground text-sm">{mover.analysis}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Thing to Watch */}
          {selectedBrief.thingToWatch && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="border-amber-500/20 bg-gradient-to-br from-amber-950/30 to-amber-900/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                    </div>
                    Thing to Watch
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">{selectedBrief.thingToWatch}</p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Outlook */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="border-indigo-500/20 bg-gradient-to-br from-indigo-950/30 to-indigo-900/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                    <Eye className="w-4 h-4 text-indigo-400" />
                  </div>
                  Forward Outlook
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">{selectedBrief.outlook}</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight flex items-center gap-2">
          <Archive className="w-7 h-7 text-indigo-400" />
          Brief Archive
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Browse your past daily market briefs.
        </p>
      </motion.div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="glass border-white/[0.06] bg-white/[0.02]">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-5 bg-white/[0.06] rounded w-1/4 animate-pulse" />
                  <div className="h-3 bg-white/[0.06] rounded w-full animate-pulse" />
                  <div className="h-3 bg-white/[0.06] rounded w-3/4 animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : briefs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="glass border-white/[0.06] bg-white/[0.02]">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-4">
                <Archive className="w-8 h-8 text-indigo-400/60" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No archived briefs yet
              </h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
                Your daily briefs will appear here after they are generated. Head to the dashboard to generate your first brief.
              </p>
              <Button asChild className="bg-indigo-600 hover:bg-indigo-500">
                <Link href="/dashboard">
                  Go to Dashboard
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {briefs.map((brief, i) => (
            <motion.div
              key={brief.date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card
                className="glass glass-hover border-white/[0.06] bg-white/[0.02] cursor-pointer"
                onClick={() => setSelectedBrief(brief)}
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">
                          {new Date(brief.date + "T12:00:00").toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1 max-w-md">
                          {(brief.marketPulse || brief.summary).slice(0, 100)}...
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs border-white/[0.1] bg-white/[0.04]">
                        {brief.topMovers.length} movers
                      </Badge>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
