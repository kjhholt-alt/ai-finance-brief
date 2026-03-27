import { describe, it, expect } from "vitest";
import { getFeatures, canAccessFeature, isProFeature } from "@/lib/features";
import { parseUTMFromURL } from "@/lib/utm";

// ---------------------------------------------------------------------------
// features.ts — tier feature gating
// ---------------------------------------------------------------------------

describe("getFeatures", () => {
  it("returns correct limits for free tier", () => {
    const free = getFeatures("free");
    expect(free.briefsPerDay).toBe(1);
    expect(free.archiveLimit).toBe(3);
    expect(free.aiChat).toBe(false);
    expect(free.emailDelivery).toBe(false);
  });

  it("returns correct limits for pro tier", () => {
    const pro = getFeatures("pro");
    expect(pro.briefsPerDay).toBe(-1); // unlimited
    expect(pro.archiveLimit).toBe(0); // unlimited
    expect(pro.aiChat).toBe(true);
    expect(pro.emailDelivery).toBe(true);
    expect(pro.customWatchlist).toBe(true);
  });
});

describe("canAccessFeature", () => {
  it("free tier cannot access pro-only boolean features", () => {
    expect(canAccessFeature("free", "aiChat")).toBe(false);
    expect(canAccessFeature("free", "emailDelivery")).toBe(false);
    expect(canAccessFeature("free", "priorityGeneration")).toBe(false);
    expect(canAccessFeature("free", "customWatchlist")).toBe(false);
  });

  it("pro tier can access all features", () => {
    expect(canAccessFeature("pro", "aiChat")).toBe(true);
    expect(canAccessFeature("pro", "emailDelivery")).toBe(true);
    expect(canAccessFeature("pro", "archiveAccess")).toBe(true);
    expect(canAccessFeature("pro", "sectors")).toBe(true);
  });

  it("free tier still has archive access (boolean true)", () => {
    expect(canAccessFeature("free", "archiveAccess")).toBe(true);
  });
});

describe("isProFeature", () => {
  it("identifies features that are pro-only", () => {
    expect(isProFeature("aiChat")).toBe(true);
    expect(isProFeature("emailDelivery")).toBe(true);
    expect(isProFeature("priorityGeneration")).toBe(true);
    expect(isProFeature("customWatchlist")).toBe(true);
  });

  it("identifies features available on free tier", () => {
    expect(isProFeature("archiveAccess")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// utm.ts — UTM parameter parsing
// ---------------------------------------------------------------------------

describe("parseUTMFromURL", () => {
  it("parses all UTM params from a query string", () => {
    const result = parseUTMFromURL(
      "?utm_source=google&utm_medium=cpc&utm_campaign=launch&utm_term=finance&utm_content=ad1"
    );
    expect(result).toEqual({
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "launch",
      utm_term: "finance",
      utm_content: "ad1",
    });
  });

  it("returns null when no UTM params present", () => {
    expect(parseUTMFromURL("?page=1&sort=date")).toBeNull();
    expect(parseUTMFromURL("")).toBeNull();
  });

  it("captures partial UTM params", () => {
    const result = parseUTMFromURL("?utm_source=reddit&utm_medium=organic");
    expect(result).toEqual({
      utm_source: "reddit",
      utm_medium: "organic",
    });
    expect(result).not.toHaveProperty("utm_campaign");
  });

  it("ignores non-UTM params in the query string", () => {
    const result = parseUTMFromURL("?foo=bar&utm_source=twitter&baz=qux");
    expect(result).toEqual({ utm_source: "twitter" });
  });
});
