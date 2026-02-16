/**
 * UTM tracking utilities for AI Finance Brief marketing campaigns.
 *
 * Captures UTM parameters on first visit, persists in localStorage,
 * and makes them available for analytics and conversion attribution.
 */

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  referrer?: string;
  landed_at?: string;
}

const UTM_STORAGE_KEY = "afb_utm";
const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

/**
 * Parse UTM params from a URL search string.
 */
export function parseUTMFromURL(search: string): UTMParams | null {
  const params = new URLSearchParams(search);
  const utm: UTMParams = {};
  let hasAny = false;

  for (const key of UTM_KEYS) {
    const val = params.get(key);
    if (val) {
      utm[key] = val;
      hasAny = true;
    }
  }

  return hasAny ? utm : null;
}

/**
 * Capture and persist UTM params from current page URL.
 * Only captures on first visit — doesn't overwrite existing attribution.
 */
export function captureUTM(): void {
  if (typeof window === "undefined") return;

  // Don't overwrite existing attribution
  const existing = getStoredUTM();
  if (existing) return;

  const utm = parseUTMFromURL(window.location.search);
  if (utm) {
    utm.referrer = document.referrer || undefined;
    utm.landed_at = new Date().toISOString();
    localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm));
  }
}

/**
 * Get stored UTM params from localStorage.
 */
export function getStoredUTM(): UTMParams | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(UTM_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Clear stored UTM (e.g., after conversion).
 */
export function clearUTM(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(UTM_STORAGE_KEY);
}

/**
 * UTM parameter scheme for each marketing channel.
 * Use these when creating ad links.
 *
 * Google Ads:     ?utm_source=google&utm_medium=cpc&utm_campaign=launch_feb26&utm_term={keyword}
 * Reddit Ads:     ?utm_source=reddit&utm_medium=paid&utm_campaign=launch_feb26&utm_content={ad_variant}
 * Twitter Ads:    ?utm_source=twitter&utm_medium=paid&utm_campaign=launch_feb26&utm_content={ad_variant}
 * Newsletter:     ?utm_source={newsletter_name}&utm_medium=sponsor&utm_campaign=launch_feb26
 * Product Hunt:   ?utm_source=producthunt&utm_medium=referral&utm_campaign=launch
 * Hacker News:    ?utm_source=hackernews&utm_medium=referral&utm_campaign=show_hn
 * Reddit Organic: ?utm_source=reddit&utm_medium=organic&utm_campaign=r_{subreddit}
 * Twitter Org:    ?utm_source=twitter&utm_medium=organic&utm_campaign=daily_post
 * Direct/SEO:     (no UTM — tracked via referrer header)
 */
