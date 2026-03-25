-- Migration script to add email authentication
-- Run this in Supabase SQL Editor

-- Step 1: Add email column to existing users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL;

-- Step 2: For existing users without email, generate placeholder emails
-- (You can manually update these later in Supabase dashboard)
UPDATE users 
SET email = CONCAT('user-', id::text, '@watchmatch.temp')
WHERE email IS NULL;

-- Step 3: Now make email required and unique
ALTER TABLE users ALTER COLUMN email SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Step 4: Create room_members table
CREATE TABLE IF NOT EXISTS room_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  room_id TEXT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, room_id)
);

-- Step 5: Migrate existing user-room relationships to room_members
INSERT INTO room_members (user_id, room_id)
SELECT id, room_id FROM users
ON CONFLICT (user_id, room_id) DO NOTHING;

-- Step 6: Remove room_id from users table (it's now in room_members)
ALTER TABLE users DROP COLUMN IF EXISTS room_id;

-- Step 7: Add indexes
CREATE INDEX IF NOT EXISTS idx_room_members_user_id ON room_members(user_id);
CREATE INDEX IF NOT EXISTS idx_room_members_room_id ON room_members(room_id);

-- Step 8: Enable RLS on new table
ALTER TABLE room_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on room_members" ON room_members FOR ALL USING (true);
