import { createHmac, timingSafeEqual } from "crypto";

function getSecret(): string {
  const secret = process.env.CRON_SECRET;
  if (!secret) throw new Error("CRON_SECRET is not set");
  return secret;
}

export function generateManageToken(email: string): string {
  const hmac = createHmac("sha256", getSecret());
  hmac.update(email.toLowerCase().trim());
  return hmac.digest("hex");
}

export function verifyManageToken(email: string, token: string): boolean {
  try {
    const expected = generateManageToken(email);
    const a = Buffer.from(expected, "utf-8");
    const b = Buffer.from(token, "utf-8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function getManageUrl(email: string): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://ai-finance-brief.vercel.app";
  const token = generateManageToken(email);
  return `${baseUrl}/manage?email=${encodeURIComponent(email)}&token=${token}`;
}
