import { NextResponse } from "next/server";
import crypto from "crypto";
import { upsertSubscription } from "@/lib/subscription";

export const dynamic = "force-dynamic";

function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(payload).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

export async function POST(request: Request) {
  try {
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    if (!secret) {
      console.error("LEMONSQUEEZY_WEBHOOK_SECRET not configured");
      return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
    }

    const rawBody = await request.text();
    const signature = request.headers.get("x-signature") || "";

    // Verify signature
    if (!verifyWebhookSignature(rawBody, signature, secret)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const eventName = event.meta?.event_name;
    const customData = event.meta?.custom_data;
    const userEmail = customData?.user_email;

    if (!userEmail) {
      console.warn("Webhook missing user_email in custom_data");
      return NextResponse.json({ received: true });
    }

    const attributes = event.data?.attributes;
    const subscriptionId = String(event.data?.id || "");

    switch (eventName) {
      case "subscription_created":
      case "subscription_updated": {
        const status = attributes?.status === "active" ? "active" : "inactive";
        const currentPeriodEnd = attributes?.renews_at || attributes?.ends_at || null;

        await upsertSubscription({
          userId: userEmail,
          providerId: subscriptionId,
          status,
          plan: "pro",
          currentPeriodEnd,
        });
        break;
      }

      case "subscription_cancelled":
      case "subscription_expired": {
        await upsertSubscription({
          userId: userEmail,
          providerId: subscriptionId,
          status: "cancelled",
          plan: "pro",
          currentPeriodEnd: attributes?.ends_at || null,
        });
        break;
      }

      default:
        console.log(`Unhandled LemonSqueezy event: ${eventName}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
