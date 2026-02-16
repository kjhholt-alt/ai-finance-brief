import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date, rating, feedback, userId } = body;

    if (!date || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Invalid rating. Must be 1-5 with a date." },
        { status: 400 }
      );
    }

    const supabase = createServerSupabase();

    // Check for existing rating by user + date
    if (userId) {
      const { data: existing } = await supabase
        .from("ratings")
        .select("id")
        .eq("user_id", userId)
        .eq("brief_date", date)
        .single();

      if (existing) {
        await supabase
          .from("ratings")
          .update({
            rating: Math.round(rating),
            feedback: feedback || null,
            created_at: new Date().toISOString(),
          })
          .eq("id", existing.id);
      } else {
        await supabase.from("ratings").insert({
          user_id: userId || null,
          brief_date: date,
          rating: Math.round(rating),
          feedback: feedback || null,
        });
      }
    } else {
      await supabase.from("ratings").insert({
        user_id: null,
        brief_date: date,
        rating: Math.round(rating),
        feedback: feedback || null,
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to save rating" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = createServerSupabase();
    const { data: ratings, error } = await supabase
      .from("ratings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(30);

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch ratings" },
        { status: 500 }
      );
    }

    const allRatings = ratings || [];
    const avgRating =
      allRatings.length > 0
        ? allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length
        : 0;

    return NextResponse.json({
      totalRatings: allRatings.length,
      averageRating: Math.round(avgRating * 10) / 10,
      ratings: allRatings,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch ratings" },
      { status: 500 }
    );
  }
}
