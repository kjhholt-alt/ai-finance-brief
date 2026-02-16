"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Lock, ArrowRight, Loader2 } from "lucide-react";

interface UpgradeCtaProps {
  feature: string;
  description?: string;
  compact?: boolean;
}

export function UpgradeCta({ feature, description, compact = false }: UpgradeCtaProps) {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (res.ok) {
        const { url } = await res.json();
        if (url) {
          window.location.href = url;
          return;
        }
      }
      // Fallback: scroll to pricing on the landing page
      window.location.href = "/#pricing";
    } catch {
      window.location.href = "/#pricing";
    } finally {
      setLoading(false);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
        <Lock className="w-4 h-4 text-indigo-400 shrink-0" />
        <span className="text-sm text-muted-foreground flex-1">
          <span className="text-indigo-300 font-medium">{feature}</span> is a Pro feature.
        </span>
        <Button
          size="sm"
          onClick={handleUpgrade}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs h-7 px-3"
        >
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Upgrade"}
        </Button>
      </div>
    );
  }

  return (
    <Card className="border-indigo-500/20 bg-gradient-to-br from-indigo-950/40 to-purple-950/20">
      <CardContent className="p-6 sm:p-8 text-center">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-4">
          <Zap className="w-6 h-6 text-indigo-400" />
        </div>
        <Badge
          variant="outline"
          className="mb-3 border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs"
        >
          PRO FEATURE
        </Badge>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Unlock {feature}
        </h3>
        <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
          {description || `Upgrade to Pro for $9/month to access ${feature.toLowerCase()} and all premium features.`}
        </p>
        <Button
          onClick={handleUpgrade}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              Upgrade to Pro — $9/mo
              <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
