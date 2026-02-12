"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { WaitlistForm } from "@/components/waitlist-form";
import { Rocket, CheckCircle2 } from "lucide-react";

const perks = [
  "Full access to all features",
  "Daily AI-generated market briefs",
  "No credit card required",
  "Cancel anytime",
];

export function BetaCTA() {
  return (
    <section id="pricing" className="py-24 sm:py-32 border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <div className="glass rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative">
              <Badge
                variant="outline"
                className="mb-6 border-emerald-500/30 bg-emerald-500/10 text-emerald-300 px-4 py-1.5 text-sm font-medium"
              >
                <Rocket className="w-3.5 h-3.5 mr-1.5" />
                Limited Beta
              </Badge>

              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">
                Free during beta
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                Get full access to AI-powered market briefs at no cost while we
                refine the product. Join now and lock in early access.
              </p>

              <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto mb-8">
                {perks.map((perk) => (
                  <div
                    key={perk}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-center">
                <WaitlistForm />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
