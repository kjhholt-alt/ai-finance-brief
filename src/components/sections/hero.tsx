"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { WaitlistForm } from "@/components/waitlist-form";
import { Brain, TrendingUp, BarChart3, Shield } from "lucide-react";

const stats = [
  { icon: Brain, label: "AI-Powered", sublabel: "Claude Analysis" },
  { icon: TrendingUp, label: "Top Movers", sublabel: "Daily Tracking" },
  { icon: BarChart3, label: "11 Sectors", sublabel: "Full Coverage" },
  { icon: Shield, label: "Trusted Data", sublabel: "Real-Time" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 pb-24 sm:pt-28 sm:pb-32">
      {/* Extra glow behind hero */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge
              variant="outline"
              className="mb-6 border-indigo-500/30 bg-indigo-500/10 text-indigo-300 px-4 py-1.5 text-sm font-medium"
            >
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse mr-2" />
              Powered by Claude AI
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-6"
          >
            AI-Powered Daily{" "}
            <span className="gradient-text">Market Briefs</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Stop spending hours reading financial news. Get a concise,
            AI-generated market summary with top movers, sector analysis, and
            key events — every single day.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center gap-4"
          >
            <WaitlistForm />
            <p className="text-muted-foreground/60 text-sm">
              Join 500+ investors on the waitlist. Free during beta.
            </p>
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-20 max-w-3xl mx-auto"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
                className="glass rounded-xl p-4 text-center glass-hover"
              >
                <stat.icon className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
                <div className="text-foreground text-sm font-medium">
                  {stat.label}
                </div>
                <div className="text-muted-foreground text-xs">
                  {stat.sublabel}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
