import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Server-side client for API routes (uses anon key, RLS applies)
export function createServerSupabase() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

// Browser-side client for client components
let browserClient: ReturnType<typeof createClient> | null = null;

export function createBrowserSupabase() {
  if (browserClient) return browserClient;
  browserClient = createClient(supabaseUrl, supabaseAnonKey);
  return browserClient;
}
