import {
  Newspaper,
  Search,
  Bell,
  CalendarDays,
  Zap,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

export interface SubscriptionCategory {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  active: boolean; // whether this category is currently sending
}

export const SUBSCRIPTION_CATEGORIES: SubscriptionCategory[] = [
  {
    id: "daily_market_brief",
    label: "Daily Market Brief",
    description: "AI-powered market summary every trading day",
    icon: Newspaper,
    active: true,
  },
  {
    id: "sector_deep_dives",
    label: "Sector Deep Dives",
    description: "In-depth analysis of individual sectors",
    icon: Search,
    active: false,
  },
  {
    id: "watchlist_alerts",
    label: "Watchlist Alerts",
    description: "Notifications when your watchlist tickers move",
    icon: Bell,
    active: false,
  },
  {
    id: "weekly_recap",
    label: "Weekly Recap",
    description: "End-of-week market summary and highlights",
    icon: CalendarDays,
    active: false,
  },
  {
    id: "breaking_news",
    label: "Breaking News",
    description: "Urgent market-moving events as they happen",
    icon: Zap,
    active: false,
  },
  {
    id: "earnings_reports",
    label: "Earnings Reports",
    description: "Key earnings results and analysis",
    icon: BarChart3,
    active: false,
  },
];

export type SubscriptionPreferences = Record<string, boolean>;

export function getDefaultSubscriptions(): SubscriptionPreferences {
  const defaults: SubscriptionPreferences = {};
  for (const cat of SUBSCRIPTION_CATEGORIES) {
    defaults[cat.id] = true;
  }
  return defaults;
}

export function resolveSubscriptions(
  prefs: Record<string, unknown> | null
): SubscriptionPreferences {
  const defaults = getDefaultSubscriptions();
  if (!prefs || typeof prefs !== "object") return defaults;

  const subs = prefs.subscriptions as Record<string, unknown> | undefined;
  if (!subs || typeof subs !== "object") return defaults;

  const resolved: SubscriptionPreferences = {};
  for (const cat of SUBSCRIPTION_CATEGORIES) {
    resolved[cat.id] = subs[cat.id] === undefined ? true : Boolean(subs[cat.id]);
  }
  return resolved;
}
