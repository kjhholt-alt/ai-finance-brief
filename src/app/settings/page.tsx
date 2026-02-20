"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  SUBSCRIPTION_CATEGORIES,
  getDefaultSubscriptions,
  type SubscriptionPreferences,
} from "@/lib/subscriptions";
import {
  Settings,
  User,
  Bell,
  Clock,
  Briefcase,
  Loader2,
  Save,
  Check,
  Cpu,
  Heart,
  Zap,
  Building2,
  ShoppingCart,
  Bitcoin,
  Home,
  Globe,
} from "lucide-react";

const userTypes = [
  { id: "day-trader", label: "Day Trader", icon: Zap },
  { id: "swing-trader", label: "Swing Trader", icon: Briefcase },
  { id: "long-term", label: "Long-term Investor", icon: Clock },
  { id: "professional", label: "Finance Professional", icon: Building2 },
  { id: "beginner", label: "Curious Beginner", icon: User },
];

const sectors = [
  { id: "tech", label: "Technology", icon: Cpu },
  { id: "healthcare", label: "Healthcare", icon: Heart },
  { id: "energy", label: "Energy", icon: Zap },
  { id: "finance", label: "Financials", icon: Building2 },
  { id: "consumer", label: "Consumer", icon: ShoppingCart },
  { id: "crypto", label: "Crypto", icon: Bitcoin },
  { id: "real-estate", label: "Real Estate", icon: Home },
  { id: "macro", label: "Macro/Economics", icon: Globe },
];

const timezones = [
  { value: "America/New_York", label: "Eastern (ET)" },
  { value: "America/Chicago", label: "Central (CT)" },
  { value: "America/Denver", label: "Mountain (MT)" },
  { value: "America/Los_Angeles", label: "Pacific (PT)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Berlin", label: "Central Europe (CET)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
];

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("");
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [emailOptIn, setEmailOptIn] = useState(true);
  const [timezone, setTimezone] = useState("America/New_York");
  const [watchlist, setWatchlist] = useState("");
  const [subscriptions, setSubscriptions] = useState<SubscriptionPreferences>(
    getDefaultSubscriptions()
  );

  const loadPreferences = useCallback(async (email: string) => {
    try {
      const res = await fetch(`/api/user/preferences?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.preferences) {
        const prefs = data.preferences;
        if (prefs.userType) setSelectedType(prefs.userType);
        if (prefs.sectors) setSelectedSectors(prefs.sectors);
        if (prefs.emailOptIn !== undefined) setEmailOptIn(prefs.emailOptIn);
        if (prefs.timezone) setTimezone(prefs.timezone);
        if (prefs.watchlist) setWatchlist(prefs.watchlist.join(", "));
        if (prefs.subscriptions) {
          const defaults = getDefaultSubscriptions();
          setSubscriptions({ ...defaults, ...prefs.subscriptions });
        }
      }
    } catch {
      // Use defaults on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
    if (status === "authenticated" && session?.user?.email) {
      loadPreferences(session.user.email);
    }
    if (status !== "loading") {
      setLoading(false);
    }
  }, [status, session, router, loadPreferences]);

  const toggleSector = (id: string) => {
    setSelectedSectors((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleSubscription = (id: string) => {
    setSubscriptions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const tickers = watchlist
        .split(",")
        .map((t) => t.trim().toUpperCase())
        .filter(Boolean);

      await fetch("/api/user/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session?.user?.email,
          userType: selectedType,
          sectors: selectedSectors,
          emailOptIn,
          timezone,
          watchlist: tickers,
          subscriptions,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // Silent fail for MVP
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight flex items-center gap-2">
          <Settings className="w-7 h-7 text-indigo-400" />
          Settings
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Customize your daily brief experience.
        </p>
      </motion.div>

      <div className="space-y-6">
        {/* Account */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass border-white/[0.06] bg-white/[0.02]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-indigo-400" />
                </div>
                Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">
                  Email
                </label>
                <Input
                  value={session.user?.email || ""}
                  disabled
                  className="bg-white/[0.03] border-white/[0.08]"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">
                  Plan
                </label>
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                  Free Beta
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Investor Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass border-white/[0.06] bg-white/[0.02]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-purple-400" />
                </div>
                Investor Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  What best describes you?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {userTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = selectedType === type.id;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={`flex items-center gap-2 p-3 rounded-xl border text-sm transition-all ${
                          isSelected
                            ? "border-indigo-500/50 bg-indigo-500/10 text-foreground"
                            : "border-white/[0.06] bg-white/[0.02] text-muted-foreground hover:bg-white/[0.04]"
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isSelected ? "text-indigo-400" : ""}`} />
                        {type.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Separator className="bg-white/[0.06]" />

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Sectors you follow
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {sectors.map((sector) => {
                    const Icon = sector.icon;
                    const isSelected = selectedSectors.includes(sector.id);
                    return (
                      <button
                        key={sector.id}
                        onClick={() => toggleSector(sector.id)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs transition-all ${
                          isSelected
                            ? "border-indigo-500/50 bg-indigo-500/10 text-foreground"
                            : "border-white/[0.06] bg-white/[0.02] text-muted-foreground hover:bg-white/[0.04]"
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-indigo-400" : ""}`} />
                        {sector.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Separator className="bg-white/[0.06]" />

              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">
                  Watchlist (comma-separated tickers)
                </label>
                <Input
                  value={watchlist}
                  onChange={(e) => setWatchlist(e.target.value)}
                  placeholder="AAPL, MSFT, NVDA, TSLA"
                  className="bg-white/[0.03] border-white/[0.08]"
                />
                <p className="text-xs text-muted-foreground/60 mt-1">
                  These tickers will be highlighted in your daily brief.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Delivery Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass border-white/[0.06] bg-white/[0.02]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-amber-400" />
                </div>
                Delivery Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-foreground">
                    Email delivery
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Receive your brief by email every market day
                  </div>
                </div>
                <Switch
                  checked={emailOptIn}
                  onCheckedChange={setEmailOptIn}
                />
              </div>

              <Separator className="bg-white/[0.06]" />

              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">
                  Timezone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                >
                  {timezones.map((tz) => (
                    <option key={tz.value} value={tz.value} className="bg-background">
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Newsletter Subscriptions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card className="glass border-white/[0.06] bg-white/[0.02]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-emerald-400" />
                </div>
                Newsletter Subscriptions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {!emailOptIn && (
                <p className="text-xs text-amber-400/80 mb-3">
                  Email delivery is off. Turn it on above to receive newsletters.
                </p>
              )}
              {SUBSCRIPTION_CATEGORIES.map((cat, idx) => {
                const Icon = cat.icon;
                return (
                  <div key={cat.id}>
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-foreground flex items-center gap-2">
                            {cat.label}
                            {!cat.active && (
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                Coming Soon
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {cat.description}
                          </div>
                        </div>
                      </div>
                      <Switch
                        checked={subscriptions[cat.id] ?? true}
                        onCheckedChange={() => toggleSubscription(cat.id)}
                        disabled={!emailOptIn}
                      />
                    </div>
                    {idx < SUBSCRIPTION_CATEGORIES.length - 1 && (
                      <Separator className="bg-white/[0.04]" />
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-end"
        >
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 min-w-[140px]"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : saved ? (
              <>
                <Check className="w-4 h-4" />
                Saved
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Settings
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
