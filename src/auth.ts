import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import { createClient } from "@supabase/supabase-js";

// MVP: Using Credentials provider for simplicity (no database required).
// GitHub OAuth added as an additional sign-in option.

async function addToWaitlist(email: string) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return;
    const supabase = createClient(url, key);
    await supabase.from("waitlist").upsert(
      { email: email.toLowerCase() },
      { onConflict: "email" }
    );
  } catch {
    // Non-blocking — don't break sign-in if waitlist insert fails
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
      },
      async authorize(credentials) {
        // MVP: Accept any email as valid login
        const email = credentials?.email as string | undefined;
        if (!email) return null;
        return {
          id: email,
          email: email,
          name: email.split("@")[0],
        };
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async signIn({ user }) {
      // Auto-add every signed-in user to the waitlist for email briefs
      if (user?.email) {
        await addToWaitlist(user.email);
      }
      return true;
    },
    authorized({ auth: session, request: { nextUrl } }) {
      const isLoggedIn = !!session?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      }
      return true;
    },
  },
});
