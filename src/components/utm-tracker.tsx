"use client";

import { useEffect } from "react";
import { captureUTM } from "@/lib/utm";

/**
 * Drop this component in the root layout to auto-capture UTM params
 * on every page load. Only captures on first visit (won't overwrite).
 */
export function UTMTracker() {
  useEffect(() => {
    captureUTM();
  }, []);

  return null;
}
