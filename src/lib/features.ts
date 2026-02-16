import { UserTier } from "@/lib/subscription";

export interface TierFeatures {
  briefsPerDay: number;
  sectors: string[];
  archiveAccess: boolean;
  archiveLimit: number; // 0 = unlimited
  aiChat: boolean;
  emailDelivery: boolean;
  priorityGeneration: boolean;
  customWatchlist: boolean;
}

const TIER_CONFIG: Record<UserTier, TierFeatures> = {
  free: {
    briefsPerDay: 1,
    sectors: ["technology", "finance"],
    archiveAccess: true,
    archiveLimit: 3, // Last 3 briefs only
    aiChat: false,
    emailDelivery: false,
    priorityGeneration: false,
    customWatchlist: false,
  },
  pro: {
    briefsPerDay: -1, // Unlimited
    sectors: [
      "technology", "healthcare", "energy", "finance",
      "consumer", "industrial", "real-estate", "crypto",
      "commodities", "emerging-markets",
    ],
    archiveAccess: true,
    archiveLimit: 0, // Unlimited
    aiChat: true,
    emailDelivery: true,
    priorityGeneration: true,
    customWatchlist: true,
  },
};

export function getFeatures(tier: UserTier): TierFeatures {
  return TIER_CONFIG[tier];
}

export function canAccessFeature(tier: UserTier, feature: keyof TierFeatures): boolean {
  const features = getFeatures(tier);
  const value = features[feature];
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

export function isProFeature(feature: keyof TierFeatures): boolean {
  const freeFeatures = TIER_CONFIG.free;
  const value = freeFeatures[feature];
  if (typeof value === "boolean") return !value;
  return false;
}
