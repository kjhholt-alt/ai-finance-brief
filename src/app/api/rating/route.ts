import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const RATINGS_PATH = path.join(process.cwd(), "data", "ratings.json");

interface Rating {
  date: string;
  rating: number; // 1-5
  feedback?: string;
  createdAt: string;
}

async function getRatings(): Promise<Rating[]> {
  try {
    const data = await fs.readFile(RATINGS_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveRatings(ratings: Rating[]): Promise<void> {
  const dir = path.dirname(RATINGS_PATH);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(RATINGS_PATH, JSON.stringify(ratings, null, 2));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date, rating, feedback } = body;

    if (!date || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Invalid rating. Must be 1-5 with a date." },
        { status: 400 }
      );
    }

    const ratings = await getRatings();

    // Update or create rating for this date
    const existingIndex = ratings.findIndex((r) => r.date === date);
    const ratingEntry: Rating = {
      date,
      rating: Math.round(rating),
      feedback: feedback || undefined,
      createdAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      ratings[existingIndex] = ratingEntry;
    } else {
      ratings.push(ratingEntry);
    }

    await saveRatings(ratings);

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
    const ratings = await getRatings();
    const avgRating =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 0;

    return NextResponse.json({
      totalRatings: ratings.length,
      averageRating: Math.round(avgRating * 10) / 10,
      ratings: ratings.slice(-30), // Last 30 ratings
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch ratings" },
      { status: 500 }
    );
  }
}
