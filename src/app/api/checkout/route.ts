import { NextResponse } from "next/server";
import { lemonSqueezySetup, createCheckout } from "@lemonsqueezy/lemonsqueezy.js";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const apiKey = process.env.LEMONSQUEEZY_API_KEY;
    const storeId = process.env.LEMONSQUEEZY_STORE_ID;

    if (!apiKey || !storeId) {
      return NextResponse.json(
        { error: "Payment system not configured" },
        { status: 503 }
      );
    }

    lemonSqueezySetup({ apiKey });

    // Create a checkout for the Pro plan ($9/mo)
    // The variant ID will need to be set once the product is created in LemonSqueezy
    const variantId = process.env.LEMONSQUEEZY_VARIANT_ID || "1";

    const { data, error } = await createCheckout(storeId, variantId, {
      checkoutData: {
        email: email || undefined,
        custom: {
          user_email: email || "",
        },
      },
      productOptions: {
        redirectUrl: `${process.env.NEXTAUTH_URL || "https://aifinancebrief.com"}/dashboard?upgraded=true`,
      },
    });

    if (error) {
      console.error("LemonSqueezy checkout error:", error);
      return NextResponse.json(
        { error: "Failed to create checkout" },
        { status: 500 }
      );
    }

    const checkoutUrl = data?.data?.attributes?.url;
    if (!checkoutUrl) {
      return NextResponse.json(
        { error: "No checkout URL returned" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
