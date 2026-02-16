-- AI Finance Brief - Initial Schema
-- Run this in Supabase SQL Editor

-- Profiles table (user data + tier info)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text UNIQUE NOT NULL,
  email text,
  tier text DEFAULT 'free' CHECK (tier IN ('free', 'pro')),
  preferences jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Subscriptions table (payment provider data)
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL,
  provider text NOT NULL DEFAULT 'lemonsqueezy',
  provider_id text,
  status text DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'cancelled', 'past_due', 'expired')),
  plan text DEFAULT 'pro',
  current_period_end timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Briefs table (cached daily briefs)
CREATE TABLE IF NOT EXISTS briefs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  date text UNIQUE NOT NULL,
  content jsonb NOT NULL,
  sector text,
  created_at timestamptz DEFAULT now()
);

-- Market snapshots table
CREATE TABLE IF NOT EXISTS market_snapshots (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  date text UNIQUE NOT NULL,
  data jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Ratings table
CREATE TABLE IF NOT EXISTS ratings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text,
  brief_date text NOT NULL,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback text,
  created_at timestamptz DEFAULT now()
);

-- Waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- User preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text UNIQUE NOT NULL,
  preferences jsonb DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_briefs_date ON briefs(date);
CREATE INDEX IF NOT EXISTS idx_market_snapshots_date ON market_snapshots(date);
CREATE INDEX IF NOT EXISTS idx_ratings_brief_date ON ratings(brief_date);
CREATE INDEX IF NOT EXISTS idx_ratings_user_id ON ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Allow service role (server-side) full access
-- The app uses server-side API routes, so anon key + service role policies
CREATE POLICY "Allow anon read briefs" ON briefs FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon read market_snapshots" ON market_snapshots FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon insert waitlist" ON waitlist FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon select waitlist" ON waitlist FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon insert ratings" ON ratings FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon select ratings" ON ratings FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon read profiles" ON profiles FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon insert profiles" ON profiles FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon update profiles" ON profiles FOR UPDATE TO anon USING (true);
CREATE POLICY "Allow anon read user_preferences" ON user_preferences FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon insert user_preferences" ON user_preferences FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon update user_preferences" ON user_preferences FOR UPDATE TO anon USING (true);
CREATE POLICY "Allow anon read subscriptions" ON subscriptions FOR SELECT TO anon USING (true);

-- Service role gets full access by default (bypasses RLS)
-- Server-side operations (brief generation, webhook handlers) use service role

-- Allow anon to upsert briefs and market_snapshots (server API routes use anon key)
CREATE POLICY "Allow anon insert briefs" ON briefs FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon update briefs" ON briefs FOR UPDATE TO anon USING (true);
CREATE POLICY "Allow anon insert market_snapshots" ON market_snapshots FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon update market_snapshots" ON market_snapshots FOR UPDATE TO anon USING (true);
CREATE POLICY "Allow anon insert subscriptions" ON subscriptions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon update subscriptions" ON subscriptions FOR UPDATE TO anon USING (true);
CREATE POLICY "Allow anon update ratings" ON ratings FOR UPDATE TO anon USING (true);
