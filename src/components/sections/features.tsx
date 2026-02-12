"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Brain,
  TrendingUp,
  PieChart,
  CalendarDays,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Market Summary",
    description:
      "Claude-powered analysis distills the day's market movements into clear, actionable insights you can read in under 2 minutes.",
    gradient: "from-indigo-500 to-purple-500",
    glow: "shadow-indigo-500/20",
  },
  {
    icon: TrendingUp,
    title: "Top Movers Tracking",
    description:
      "Instantly see which stocks moved the most and why. No more digging through multiple sources to understand market shifts.",
    gradient: "from-emerald-500 to-teal-500",
    glow: "shadow-emerald-500/20",
  },
  {
    icon: PieChart,
    title: "Sector Performance",
    description:
      "Understand sector rotation and where money is flowing. Stay ahead of trends with AI-detected patterns across industries.",
    gradient: "from-amber-500 to-orange-500",
    glow: "shadow-amber-500/20",
  },
  {
    icon: CalendarDays,
    title: "Key Events & Outlook",
    description:
      "Never miss an earnings report, Fed announcement, or market-moving event. Get forward-looking analysis on what matters next.",
    gradient: "from-rose-500 to-pink-500",
    glow: "shadow-rose-500/20",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 sm:py-32 border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">
            Everything you need to{" "}
            <span className="gradient-text">stay informed</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Our AI reads thousands of data points and synthesizes them into a
            brief you can digest in minutes.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={cardVariants}>
              <Card className="glass glass-hover h-full border-white/[0.06] bg-white/[0.02] group">
                <CardContent className="p-7">
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg ${feature.glow} mb-5 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
