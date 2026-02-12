"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

interface TopMover {
  ticker: string;
  name: string;
  change: string;
  analysis: string;
}

interface SectorData {
  sector: string;
  performance: string;
  insight: string;
}

interface BriefData {
  date: string;
  generatedAt: string;
  summary: string;
  topMovers: TopMover[];
  sectorPerformance: SectorData[];
  outlook: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [brief, setBrief] = useState<BriefData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateBrief = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/brief", { method: "POST" });
      if (!res.ok) throw new Error("Failed to generate brief");
      const data = await res.json();
      setBrief(data);
    } catch {
      setError("Failed to generate brief. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated" && !brief) {
      generateBrief();
    }
  }, [status, brief, generateBrief]);

  if (status === "loading") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Market Brief</h1>
          <p className="text-gray-400 text-sm mt-1">
            {brief
              ? `Generated ${new Date(brief.generatedAt).toLocaleString()}`
              : "Loading your daily brief..."}
          </p>
        </div>
        <button
          onClick={generateBrief}
          disabled={loading}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          {loading ? (
            <>
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Generating...
            </>
          ) : (
            "Generate New Brief"
          )}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {loading && !brief ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl bg-white/5 border border-white/10 p-6 animate-pulse"
            >
              <div className="h-4 bg-white/10 rounded w-1/4 mb-4" />
              <div className="h-3 bg-white/10 rounded w-full mb-2" />
              <div className="h-3 bg-white/10 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : brief ? (
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="rounded-xl bg-white/5 border border-white/10 p-6">
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-brand-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                />
              </svg>
              Market Summary
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
              {brief.summary}
            </p>
          </div>

          {/* Top Movers Card */}
          <div className="rounded-xl bg-white/5 border border-white/10 p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-brand-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
                />
              </svg>
              Top Movers
            </h2>
            <div className="space-y-4">
              {brief.topMovers.map((mover) => (
                <div
                  key={mover.ticker}
                  className="flex items-start gap-4 p-4 rounded-lg bg-white/5"
                >
                  <div className="shrink-0">
                    <span className="text-sm font-bold text-white bg-white/10 px-2 py-1 rounded">
                      {mover.ticker}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-gray-300">
                        {mover.name}
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          mover.change.startsWith("+")
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {mover.change}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">{mover.analysis}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sector Performance Card */}
          <div className="rounded-xl bg-white/5 border border-white/10 p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-brand-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z"
                />
              </svg>
              Sector Performance
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {brief.sectorPerformance.map((sector) => (
                <div
                  key={sector.sector}
                  className="p-4 rounded-lg bg-white/5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">
                      {sector.sector}
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        sector.performance.startsWith("+")
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {sector.performance}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs">{sector.insight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Outlook Card */}
          <div className="rounded-xl bg-gradient-to-br from-brand-900/30 to-brand-950/20 border border-brand-500/20 p-6">
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-brand-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Forward Outlook
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              {brief.outlook}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
