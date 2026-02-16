"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  Mail,
  Calendar,
  Lock,
  Loader2,
  Copy,
  Check,
} from "lucide-react";

interface Subscriber {
  email: string;
  created_at: string;
}

export default function AdminPage() {
  const [apiKey, setApiKey] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [count, setCount] = useState(0);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  async function fetchSubscribers(key: string) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/subscribers", {
        headers: { Authorization: `Bearer ${key}` },
      });
      if (res.status === 401) {
        setError("Invalid API key");
        setAuthenticated(false);
        return;
      }
      const data = await res.json();
      setSubscribers(data.subscribers);
      setCount(data.count);
      setAuthenticated(true);
    } catch {
      setError("Failed to load subscribers");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (apiKey.trim()) {
      fetchSubscribers(apiKey.trim());
    }
  }

  function copyEmail(email: string, idx: number) {
    navigator.clipboard.writeText(email);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  }

  function copyAllEmails() {
    const emails = subscribers.map((s) => s.email).join("\n");
    navigator.clipboard.writeText(emails);
    setCopiedIdx(-1);
    setTimeout(() => setCopiedIdx(null), 1500);
  }

  // If they refresh after auth, clear state
  useEffect(() => {
    const saved = sessionStorage.getItem("admin_key");
    if (saved) {
      setApiKey(saved);
      fetchSubscribers(saved);
    }
  }, []);

  useEffect(() => {
    if (authenticated && apiKey) {
      sessionStorage.setItem("admin_key", apiKey);
    }
  }, [authenticated, apiKey]);

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md glass border-white/[0.06]">
          <CardHeader className="text-center">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6 text-indigo-400" />
            </div>
            <CardTitle className="text-xl">Admin Access</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Enter your admin API key to view subscribers
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <Input
                type="password"
                placeholder="Admin API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="bg-white/[0.04] border-white/[0.08]"
              />
              {error && (
                <p className="text-sm text-red-400">{error}</p>
              )}
              <Button
                type="submit"
                disabled={loading || !apiKey.trim()}
                className="bg-indigo-600 hover:bg-indigo-500 text-white"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Lock className="w-4 h-4 mr-2" />
                )}
                Unlock
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Subscribers</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Newsletter distribution list
            </p>
          </div>
          <Badge className="bg-indigo-500/10 text-indigo-300 border-indigo-500/30 text-lg px-4 py-1.5">
            <Users className="w-4 h-4 mr-2" />
            {count}
          </Badge>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="glass border-white/[0.06]">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{count}</p>
                <p className="text-xs text-muted-foreground">Total subscribers</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass border-white/[0.06]">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {subscribers.filter((s) => {
                    const d = new Date(s.created_at);
                    const now = new Date();
                    return (
                      d.getMonth() === now.getMonth() &&
                      d.getFullYear() === now.getFullYear()
                    );
                  }).length}
                </p>
                <p className="text-xs text-muted-foreground">This month</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={copyAllEmails}
            className="border-white/[0.08] text-muted-foreground hover:text-foreground"
          >
            {copiedIdx === -1 ? (
              <Check className="w-4 h-4 mr-1.5 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 mr-1.5" />
            )}
            {copiedIdx === -1 ? "Copied!" : "Copy all emails"}
          </Button>
        </div>

        {/* Subscriber list */}
        <Card className="glass border-white/[0.06]">
          <CardContent className="p-0">
            <div className="divide-y divide-white/[0.04]">
              {subscribers.map((sub, i) => (
                <div
                  key={sub.email}
                  className="flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-foreground truncate">
                        {sub.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(sub.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => copyEmail(sub.email, i)}
                    className="text-muted-foreground hover:text-foreground transition-colors p-1"
                  >
                    {copiedIdx === i ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
              {subscribers.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  No subscribers yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
