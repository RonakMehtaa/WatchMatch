-- WatchMatch Database Schema for Supabase (Simplified - No Rooms)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (email-based authentication)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Swipes table (no room references)
CREATE TABLE IF NOT EXISTS swipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content_id INTEGER NOT NULL,
  liked BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, content_id)
);

-- Content cache table
CREATE TABLE IF NOT EXISTS content_cache (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  overview TEXT NOT NULL,
  poster_path TEXT NOT NULL,
  rating NUMERIC(3,1) NOT NULL,
  popularity NUMERIC(10,2) NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('movie', 'tv')),
  providers TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_swipes_user_id ON swipes(user_id);
CREATE INDEX IF NOT EXISTS idx_swipes_content_id ON swipes(content_id);
CREATE INDEX IF NOT EXISTS idx_swipes_liked ON swipes(liked);
CREATE INDEX IF NOT EXISTS idx_content_cache_rating ON content_cache(rating DESC);
CREATE INDEX IF NOT EXISTS idx_content_cache_popularity ON content_cache(popularity DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_cache ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow all on users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all on swipes" ON swipes FOR ALL USING (true);
CREATE POLICY "Allow all on content_cache" ON content_cache FOR ALL USING (true);
