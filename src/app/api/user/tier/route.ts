import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserTier } from "@/lib/subscription";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ tier: "free" });
    }

    const tier = await getUserTier(session.user.email);
    return NextResponse.json({ tier });
  } catch {
    return NextResponse.json({ tier: "free" });
  }
}
