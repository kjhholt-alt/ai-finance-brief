/**
 * Adapter for callers that previously used `getAnthropic()` to get an SDK client.
 * Now backed by claudex (Max-sub `claude -p` subprocess) — no API key.
 *
 * Provides `claudeMessage({ system, messages, max_tokens })` returning a
 * string. Streaming is not supported by claude -p; if you needed streaming,
 * adopt the non-streaming path or call `ask` directly.
 */

import { ask } from "./claudex.js";

export interface ClaudeMessageOptions {
  system?: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  max_tokens?: number;
  model?: string;
  temperature?: number;
}

export async function claudeMessage(opts: ClaudeMessageOptions): Promise<string> {
  const parts: string[] = [];
  if (opts.system) parts.push(`<system>\n${opts.system}\n</system>`);
  for (const m of opts.messages) {
    parts.push(`<${m.role}>\n${m.content}\n</${m.role}>`);
  }
  parts.push("<assistant>");
  const r = await ask(parts.join("\n\n"), { useCache: true, timeoutMs: 90_000 });
  return r.text.trim();
}

// Back-compat: callers that did `const a = getAnthropic(); a.messages.create(...)`
// can replace with `claudeMessage(...)`. This shim throws to surface lingering uses.
export function getAnthropic(): never {
  throw new Error(
    "getAnthropic() removed — use claudeMessage(opts) from @/lib/anthropic instead. " +
      "Backed by claudex (Max-sub `claude -p`)."
  );
}
