"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Mail,
  Calendar,
  Loader2,
  Copy,
  Check,
} from "lucide-react";

interface Subscriber {
  email: string;
  created_at: string;
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [count, setCount] = useState(0);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/subscribers")
      .then((res) => res.json())
      .then((data) => {
        setSubscribers(data.subscribers ?? []);
        setCount(data.count ?? 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
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
