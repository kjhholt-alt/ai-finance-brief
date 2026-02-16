import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SECTORS, getSectorBySlug, getAllSectorSlugs } from "@/lib/seo/sectors";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  BarChart3,
  TrendingUp,
  Sparkles,
  BookOpen,
  ChevronRight,
} from "lucide-react";

interface SectorPageProps {
  params: { sector: string };
}

export function generateStaticParams() {
  return getAllSectorSlugs().map((sector) => ({ sector }));
}

export async function generateMetadata({ params }: SectorPageProps): Promise<Metadata> {
  const sector = getSectorBySlug(params.sector);
  if (!sector) return {};

  const title = `${sector.name} Market Brief - AI Finance Brief`;
  const description = sector.metaDescription;

  return {
    title,
    description,
    keywords: sector.keywords,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "AI Finance Brief",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function SectorPage({ params }: SectorPageProps) {
  const sector = getSectorBySlug(params.sector);
  if (!sector) notFound();

  // Get related sectors (same general category or adjacent)
  const relatedSectors = SECTORS.filter(
    (s) => s.slug !== sector.slug
  ).slice(0, 5);

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-24">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/15 via-purple-600/10 to-transparent rounded-full blur-[120px]" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <Badge
              variant="outline"
              className="mb-6 border-indigo-500/30 bg-indigo-500/10 text-indigo-300 px-3 py-1 text-xs font-medium"
            >
              {sector.etf} SECTOR BRIEF
            </Badge>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6 leading-[1.1]">
              AI-Powered{" "}
              <span className="gradient-text">{sector.name}</span>{" "}
              Market Brief
            </h1>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-2xl">
              {sector.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                asChild
                className="h-12 px-8 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
              >
                <Link href="/dashboard">
                  Get Your Brief
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="h-12 px-8 border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.06] text-muted-foreground"
              >
                <Link href="/#preview">
                  See Sample Brief
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Tickers Section */}
      <section className="py-16 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            Key {sector.name} Tickers We Track
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {sector.sampleTickers.map((ticker) => (
              <Card
                key={ticker}
                className="glass border-white/[0.06] bg-white/[0.02] text-center"
              >
                <CardContent className="p-4">
                  <span className="text-lg font-mono font-bold text-foreground">
                    {ticker}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="py-16 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-indigo-400" />
            </div>
            What Your {sector.name} Brief Includes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "Sector Performance",
                desc: `Daily ${sector.name} sector movement with ${sector.etf} ETF tracking and peer comparison.`,
              },
              {
                title: "Top Movers Analysis",
                desc: `Which ${sector.name} stocks moved most and why. AI explains the catalysts behind each move.`,
              },
              {
                title: "Key Events Calendar",
                desc: `Earnings dates, FDA approvals, policy decisions, and other ${sector.name}-specific catalysts.`,
              },
              {
                title: "Non-Obvious Insights",
                desc: `Correlations and contrarian reads most ${sector.name} analysts miss. The insight that makes you forward the brief.`,
              },
            ].map((item) => (
              <Card
                key={item.title}
                className="glass border-white/[0.06] bg-white/[0.02]"
              >
                <CardContent className="p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 border-t border-white/[0.04]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Start Getting Your {sector.name} Brief
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Join investors who start their day with AI-powered {sector.name.toLowerCase()} sector analysis. Free to start, no credit card required.
          </p>
          <Button
            size="lg"
            asChild
            className="h-12 px-10 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
          >
            <Link href="/dashboard">
              Get Started Free
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Related Sectors */}
      <section className="py-16 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
            </div>
            Explore Other Sectors
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {relatedSectors.map((s) => (
              <Link key={s.slug} href={`/briefs/${s.slug}`}>
                <Card className="glass glass-hover border-white/[0.06] bg-white/[0.02] h-full">
                  <CardContent className="p-4 text-center">
                    <Badge
                      variant="outline"
                      className="mb-2 border-white/[0.1] bg-white/[0.04] text-xs font-mono"
                    >
                      {s.etf}
                    </Badge>
                    <div className="text-sm font-medium text-foreground">
                      {s.name}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-6">
            <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
              <Link href="/#pricing">
                View All Sectors
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
