import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const USERS_PATH = path.join(process.cwd(), "data", "users.json");

interface UserPreferences {
  email: string;
  userType?: string;
  sectors?: string[];
  onboardingCompleted?: boolean;
  emailOptIn?: boolean;
  timezone?: string;
  watchlist?: string[];
  createdAt: string;
  lastLoginAt: string;
}

async function getUsers(): Promise<UserPreferences[]> {
  try {
    const data = await fs.readFile(USERS_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveUsers(users: UserPreferences[]): Promise<void> {
  const dir = path.dirname(USERS_PATH);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(USERS_PATH, JSON.stringify(users, null, 2));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, userType, sectors, onboardingCompleted, emailOptIn, timezone, watchlist } = body;

    // For MVP, we store by email. In production this would use auth session.
    const users = await getUsers();
    const existingIndex = users.findIndex((u) => u.email === email);

    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      // Update existing user
      const user = users[existingIndex];
      if (userType !== undefined) user.userType = userType;
      if (sectors !== undefined) user.sectors = sectors;
      if (onboardingCompleted !== undefined) user.onboardingCompleted = onboardingCompleted;
      if (emailOptIn !== undefined) user.emailOptIn = emailOptIn;
      if (timezone !== undefined) user.timezone = timezone;
      if (watchlist !== undefined) user.watchlist = watchlist;
      user.lastLoginAt = now;
      users[existingIndex] = user;
    } else if (email) {
      // Create new user
      users.push({
        email,
        userType: userType || "",
        sectors: sectors || [],
        onboardingCompleted: onboardingCompleted || false,
        emailOptIn: emailOptIn !== false,
        timezone: timezone || "America/New_York",
        watchlist: watchlist || [],
        createdAt: now,
        lastLoginAt: now,
      });
    }

    await saveUsers(users);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save preferences" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const users = await getUsers();
    return NextResponse.json({ count: users.length });
  } catch {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
