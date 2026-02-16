import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";
import { notifyNewSubscriber } from "@/lib/discord";

export async function GET() {
  try {
    const supabase = createServerSupabase();
    const { count, error } = await supabase
      .from("waitlist")
      .select("*", { count: "exact", head: true });

    if (error) throw error;

    return NextResponse.json({ count: count ?? 0 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const supabase = createServerSupabase();

    // Check if already on waitlist
    const { data: existing } = await supabase
      .from("waitlist")
      .select("id")
      .eq("email", email.toLowerCase())
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "This email is already on the waitlist" },
        { status: 409 }
      );
    }

    const { error } = await supabase.from("waitlist").insert({
      email: email.toLowerCase(),
    });

    if (error) {
      // Handle unique constraint violation
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "This email is already on the waitlist" },
          { status: 409 }
        );
      }
      throw error;
    }

    // Get total count and send Discord alert (non-blocking)
    const { count } = await supabase
      .from("waitlist")
      .select("*", { count: "exact", head: true });

    notifyNewSubscriber(email.toLowerCase(), count ?? 0).catch(() => {});

    return NextResponse.json(
      { message: "Successfully joined the waitlist!" },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
