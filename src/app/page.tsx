"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { WaitlistForm } from "@/components/waitlist-form";
import {
  BarChart3,
  Brain,
  Mail,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  CheckCircle2,
  Zap,
  Shield,
  BookOpen,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Clock,
  Target,
  Users,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */

function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const steps = [
  {
    num: "01",
    icon: BarChart3,
    title: "AI Scans Markets",
    desc: "Our AI analyzes indices, top movers, sectors, and macro events every morning.",
  },
  {
    num: "02",
    icon: Brain,
    title: "Generates Your Brief",
    desc: "Claude AI synthesizes data into a concise, actionable market brief.",
  },
  {
    num: "03",
    icon: Mail,
    title: "Delivered to You",
    desc: "Read on the dashboard or get it in your inbox at 7am ET.",
  },
];

const sampleMovers = [
  { ticker: "NVDA", name: "NVIDIA Corp", change: "+4.2%", positive: true, analysis: "Surged on strong data center revenue guidance, AI demand continues." },
  { ticker: "AAPL", name: "Apple Inc", change: "-1.8%", positive: false, analysis: "Pulled back on iPhone supply chain concerns in Asia markets." },
  { ticker: "SMCI", name: "Super Micro Computer", change: "+7.1%", positive: true, analysis: "AI server demand accelerating, raised full-year guidance." },
];

const freeTierFeatures = [
  "3 briefs per week",
  "Web dashboard access",
  "Basic market summary",
  "Top movers tracking",
];

const proTierFeatures = [
  "Daily briefs, every market day",
  "Email delivery at 7am ET",
  "Custom watchlist",
  "Sector deep dives",
  "Priority generation",
  "Historical brief archive",
];

const faqs = [
  {
    q: "How is the brief generated?",
    a: "Our system pulls real-time market data from multiple sources every morning. Claude AI then analyzes the data and generates a concise, human-readable brief covering market movements, top movers, sector performance, and key events to watch.",
  },
  {
    q: "Is it free?",
    a: "Yes. AI Finance Brief is completely free during beta. We plan to introduce a Pro tier with additional features like email delivery and custom watchlists, but the core experience will always have a free option.",
  },
  {
    q: "When do I get my brief?",
    a: "Briefs are generated every market day morning. The web dashboard updates automatically, and Pro users will receive email delivery at 7am ET before the market opens.",
  },
  {
    q: "What markets do you cover?",
    a: "We currently cover US equities, major indices (S&P 500, Nasdaq, Dow), sector performance across all 11 GICS sectors, and key macro events including Fed announcements, earnings, and economic data releases.",
  },
  {
    q: "Can I customize my brief?",
    a: "Custom watchlists and sector focus are coming in the Pro tier. You'll be able to specify which tickers and sectors matter most to you, and the AI will prioritize those in your daily brief.",
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function Home() {
  return (
    <div className="relative">
      {/* Bloomberg-style dot grid background */}
      <div
        className="fixed inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, hsl(215 20% 65%) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* ============================================================ */}
      {/*  HERO SECTION                                                 */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden pt-20 pb-28 sm:pt-28 sm:pb-36">
        {/* Animated gradient orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-emerald-600/5 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute inset-10 bg-gradient-to-tr from-indigo-500/15 via-transparent to-purple-500/10 rounded-full blur-[100px]" />
        </div>

        {/* Scanline effect */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.015]"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(215 20% 65%) 2px, hsl(215 20% 65%) 3px)",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge
                variant="outline"
                className="mb-6 border-emerald-500/30 bg-emerald-500/10 text-emerald-300 px-4 py-1.5 text-sm font-medium"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-2 inline-block" />
                Live Beta &mdash; Free Access
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground tracking-tight mb-6 leading-[1.1]"
            >
              Your AI Market Analyst.{" "}
              <span className="gradient-text">Every Morning.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              AI reads 50+ sources, analyzes market movements, and delivers a
              concise 2-minute brief before the opening bell. Stop drowning in
              noise. Start with clarity.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                size="lg"
                asChild
                className="h-12 px-8 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all text-base"
              >
                <Link href="/dashboard">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="h-12 px-8 border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.06] text-muted-foreground hover:text-foreground transition-all text-base"
              >
                <a href="#preview">
                  See a Sample Brief
                  <ChevronRight className="w-4 h-4 ml-1" />
                </a>
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground/60"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>No credit card required</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-white/20 hidden sm:block" />
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>2-minute daily read</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-white/20 hidden sm:block" />
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Powered by Claude AI</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  HOW IT WORKS                                                 */}
      {/* ============================================================ */}
      <section id="features" className="py-24 sm:py-32 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <Badge
              variant="outline"
              className="mb-4 border-indigo-500/30 bg-indigo-500/10 text-indigo-300 px-3 py-1 text-xs font-medium"
            >
              HOW IT WORKS
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">
              From market data to{" "}
              <span className="gradient-text">actionable insight</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Three steps, every morning, fully automated.
            </p>
          </AnimatedSection>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 relative"
          >
            {/* Connecting line (desktop only) */}
            <div className="hidden md:block absolute top-[72px] left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px bg-gradient-to-r from-indigo-500/30 via-indigo-500/50 to-indigo-500/30" />

            {steps.map((step, i) => (
              <motion.div key={step.num} variants={staggerItem}>
                <Card className="glass glass-hover border-white/[0.06] bg-white/[0.02] h-full text-center relative group">
                  <CardContent className="p-8">
                    {/* Step number */}
                    <div className="relative mx-auto mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 mx-auto group-hover:scale-110 transition-transform duration-300">
                        <step.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-background border-2 border-indigo-500/50 flex items-center justify-center text-xs font-mono font-bold text-indigo-400">
                        {step.num}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  SAMPLE BRIEF PREVIEW                                         */}
      {/* ============================================================ */}
      <section id="preview" className="py-24 sm:py-32 border-t border-white/[0.04] relative">
        {/* Background glow behind preview */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-indigo-600/8 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <AnimatedSection className="text-center mb-12">
            <Badge
              variant="outline"
              className="mb-4 border-emerald-500/30 bg-emerald-500/10 text-emerald-300 px-3 py-1 text-xs font-medium"
            >
              PREVIEW
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">
              Today&apos;s Brief Preview
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Here&apos;s what a real brief looks like. This is what you get
              every market day morning.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="relative">
              {/* Glow border effect */}
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-indigo-500/20 via-purple-500/10 to-transparent blur-sm" />

              <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl overflow-hidden">
                {/* Mock header bar */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-white/[0.02]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">
                        Market Brief
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        Feb 11, 2026 &bull; 6:58 AM ET
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 inline-block" />
                    Live
                  </Badge>
                </div>

                <div className="p-6 space-y-6">
                  {/* Market Summary */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                      </div>
                      <span className="text-sm font-semibold text-foreground">
                        Market Summary
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Markets rallied broadly as technology stocks led gains following strong
                      AI infrastructure spending data. The S&P 500 rose 0.8% to close at 6,142,
                      while the Nasdaq Composite advanced 1.3%. Bond yields edged lower as
                      investors bet on a pause in rate hikes. Volume was above average with
                      breadth favoring advancers 3-to-1.
                    </p>
                  </div>

                  {/* Top Movers */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <span className="text-sm font-semibold text-foreground">
                        Top Movers
                      </span>
                    </div>
                    <div className="space-y-2">
                      {sampleMovers.map((mover) => (
                        <div
                          key={mover.ticker}
                          className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                        >
                          <Badge
                            variant="outline"
                            className="shrink-0 font-mono font-bold border-white/[0.1] bg-white/[0.04] text-xs"
                          >
                            {mover.ticker}
                          </Badge>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
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
                            <p className="text-xs text-muted-foreground">
                              {mover.analysis}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Thing to Watch */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/30 to-amber-900/10 border border-amber-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                      <span className="text-sm font-semibold text-foreground">
                        Thing to Watch
                      </span>
                      <Badge
                        variant="outline"
                        className="ml-auto text-xs text-amber-400 border-amber-500/30 bg-amber-500/10"
                      >
                        Key Event
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      CPI data release tomorrow at 8:30 AM ET. Consensus expects 2.9% YoY.
                      A hotter print could reignite rate hike fears and pressure growth stocks.
                      Watch the 10Y yield reaction closely.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  PRICING                                                      */}
      {/* ============================================================ */}
      <section id="pricing" className="py-24 sm:py-32 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <Badge
              variant="outline"
              className="mb-4 border-indigo-500/30 bg-indigo-500/10 text-indigo-300 px-3 py-1 text-xs font-medium"
            >
              PRICING
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">
              Simple, transparent pricing
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Start free during beta. Upgrade when you&apos;re ready.
            </p>
          </AnimatedSection>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          >
            {/* Free Tier */}
            <motion.div variants={staggerItem}>
              <Card className="glass border-white/[0.06] bg-white/[0.02] h-full flex flex-col">
                <CardHeader className="pb-4">
                  <div className="mb-4">
                    <Badge
                      variant="outline"
                      className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs mb-3"
                    >
                      CURRENT PLAN
                    </Badge>
                    <CardTitle className="text-2xl">Free</CardTitle>
                    <p className="text-muted-foreground text-sm mt-1">
                      Free during beta
                    </p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground font-mono">
                      $0
                    </span>
                    <span className="text-muted-foreground text-sm">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <ul className="space-y-3 flex-1 mb-8">
                    {freeTierFeatures.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-3 text-sm text-muted-foreground"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                  >
                    <Link href="/dashboard">
                      Start Free
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Pro Tier */}
            <motion.div variants={staggerItem}>
              <Card className="relative h-full flex flex-col border-indigo-500/30 bg-gradient-to-b from-indigo-950/40 to-white/[0.02] shadow-lg shadow-indigo-500/10">
                {/* Coming soon ribbon */}
                <div className="absolute -top-3 right-6">
                  <Badge className="bg-indigo-600 text-white border-0 shadow-lg shadow-indigo-500/30 px-3 py-1">
                    <Zap className="w-3 h-3 mr-1" />
                    Coming Soon
                  </Badge>
                </div>

                <CardHeader className="pb-4">
                  <div className="mb-4">
                    <Badge
                      variant="outline"
                      className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs mb-3"
                    >
                      RECOMMENDED
                    </Badge>
                    <CardTitle className="text-2xl">Pro</CardTitle>
                    <p className="text-muted-foreground text-sm mt-1">
                      For serious investors
                    </p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground font-mono">
                      $9
                    </span>
                    <span className="text-muted-foreground text-sm">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <ul className="space-y-3 flex-1 mb-8">
                    {proTierFeatures.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-3 text-sm text-muted-foreground"
                      >
                        <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full h-11 border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 hover:text-indigo-200 transition-all"
                  >
                    <a href="#waitlist">
                      Join Waitlist
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FAQ                                                          */}
      {/* ============================================================ */}
      <section className="py-24 sm:py-32 border-t border-white/[0.04]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <Badge
              variant="outline"
              className="mb-4 border-indigo-500/30 bg-indigo-500/10 text-indigo-300 px-3 py-1 text-xs font-medium"
            >
              FAQ
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">
              Frequently asked questions
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="glass rounded-xl border-white/[0.06] bg-white/[0.02] px-6 data-[state=open]:bg-white/[0.04] transition-colors"
                >
                  <AccordionTrigger className="text-left text-foreground hover:no-underline py-5 text-sm sm:text-base font-medium">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AnimatedSection>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  WAITLIST / BOTTOM CTA                                        */}
      {/* ============================================================ */}
      <section id="waitlist" className="py-24 sm:py-32 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="max-w-2xl mx-auto">
              <div className="relative glass rounded-2xl p-8 sm:p-12 text-center overflow-hidden">
                {/* Background glow */}
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative">
                  <Badge
                    variant="outline"
                    className="mb-6 border-indigo-500/30 bg-indigo-500/10 text-indigo-300 px-4 py-1.5 text-sm font-medium"
                  >
                    <Target className="w-3.5 h-3.5 mr-1.5" />
                    Early Access
                  </Badge>

                  <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">
                    Get your edge,{" "}
                    <span className="gradient-text">every morning</span>
                  </h2>
                  <p className="text-muted-foreground mb-4 max-w-lg mx-auto">
                    Join investors who start their day with an AI-powered market
                    brief. Free during beta, no credit card required.
                  </p>

                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground/60 mb-8">
                    <Users className="w-4 h-4" />
                    <span>Join 200+ investors already signed up</span>
                  </div>

                  <div className="flex justify-center">
                    <WaitlistForm />
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
