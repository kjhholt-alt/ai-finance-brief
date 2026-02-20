"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback, Suspense } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  SUBSCRIPTION_CATEGORIES,
  type SubscriptionPreferences,
} from "@/lib/subscriptions";
import {
  Mail,
  Loader2,
  ShieldAlert,
  Check,
} from "lucide-react";

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const visible = local.slice(0, 2);
  return `${visible}${"*".repeat(Math.max(local.length - 2, 2))}@${domain}`;
}

function ManageContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(false);
  const [emailOptIn, setEmailOptIn] = useState(true);
  const [subscriptions, setSubscriptions] = useState<SubscriptionPreferences>({});

  const loadPreferences = useCallback(async () => {
    if (!email || !token) {
      setError("Invalid link — missing email or token.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(
        `/api/manage/preferences?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`
      );
      if (res.status === 403) {
        setError("Invalid or expired link. Please use the link from your latest email.");
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setError("Something went wrong. Please try again later.");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setEmailOptIn(data.emailOptIn);
      setSubscriptions(data.subscriptions);
    } catch {
      setError("Failed to load preferences. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [email, token]);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  const savePreferences = useCallback(
    async (newEmailOptIn: boolean, newSubscriptions: SubscriptionPreferences) => {
      setSaving(true);
      setLastSaved(false);
      try {
        await fetch("/api/manage/preferences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            token,
            emailOptIn: newEmailOptIn,
            subscriptions: newSubscriptions,
          }),
        });
        setLastSaved(true);
        setTimeout(() => setLastSaved(false), 2000);
      } catch {
        // Silent fail
      } finally {
        setSaving(false);
      }
    },
    [email, token]
  );

  const handleEmailToggle = (checked: boolean) => {
    setEmailOptIn(checked);
    savePreferences(checked, subscriptions);
  };

  const handleSubscriptionToggle = (id: string) => {
    const updated = { ...subscriptions, [id]: !subscriptions[id] };
    setSubscriptions(updated);
    savePreferences(emailOptIn, updated);
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading your preferences...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card className="glass border-red-500/20 bg-red-500/[0.03]">
            <CardContent className="pt-8 pb-8 text-center">
              <ShieldAlert className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Invalid Link
              </h2>
              <p className="text-sm text-muted-foreground">{error}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Manage Subscriptions
        </h1>
        <p className="text-muted-foreground text-sm mt-2">
          {maskEmail(email)}
        </p>
        {(saving || lastSaved) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-1.5 mt-3 text-xs"
          >
            {saving ? (
              <span className="text-muted-foreground flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" /> Saving...
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1">
                <Check className="w-3 h-3" /> Saved
              </span>
            )}
          </motion.div>
        )}
      </motion.div>

      <div className="space-y-6">
        {/* Master Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass border-white/[0.06] bg-white/[0.02]">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      All Emails
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Master switch for all email communications
                    </div>
                  </div>
                </div>
                <Switch
                  checked={emailOptIn}
                  onCheckedChange={handleEmailToggle}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Newsletter Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass border-white/[0.06] bg-white/[0.02]">
            <CardHeader>
              <CardTitle className="text-lg">Newsletter Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {!emailOptIn && (
                <p className="text-xs text-amber-400/80 mb-3">
                  All emails are paused. Turn on the master switch above to receive newsletters.
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
                        onCheckedChange={() => handleSubscriptionToggle(cat.id)}
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

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center pt-4"
        >
          <p className="text-xs text-muted-foreground/60">
            AI Finance Brief &middot; AI-powered market intelligence
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function ManagePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading...
          </div>
        </div>
      }
    >
      <ManageContent />
    </Suspense>
  );
}
