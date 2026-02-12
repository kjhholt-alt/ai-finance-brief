import { NextResponse } from "next/server";
import { getBriefByDate } from "@/lib/brief/generator";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { date: string } }
) {
  try {
    const brief = await getBriefByDate(params.date);
    if (!brief) {
      return NextResponse.json(
        { error: "No brief found for this date" },
        { status: 404 }
      );
    }
    return NextResponse.json(brief);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch brief" },
      { status: 500 }
    );
  }
}
