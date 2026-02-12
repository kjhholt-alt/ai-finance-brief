import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const ARCHIVE_DIR = path.join(process.cwd(), "data", "briefs");

export async function GET() {
  try {
    await fs.mkdir(ARCHIVE_DIR, { recursive: true });
    const files = await fs.readdir(ARCHIVE_DIR);
    const jsonFiles = files
      .filter((f) => f.endsWith(".json"))
      .sort()
      .reverse(); // Most recent first

    const briefs = await Promise.all(
      jsonFiles.map(async (file) => {
        const data = await fs.readFile(path.join(ARCHIVE_DIR, file), "utf-8");
        return JSON.parse(data);
      })
    );

    return NextResponse.json({ briefs });
  } catch {
    return NextResponse.json({ briefs: [] });
  }
}
