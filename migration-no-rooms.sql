-- Migration to remove rooms and simplify to email-based solo swiping

-- Step 1: Drop room-related tables
DROP TABLE IF EXISTS room_members CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;

-- Step 2: Users table already has email, just ensure it's set up correctly
-- (Already done in previous migration)

-- Step 3: Swipes table is fine as-is (no room references needed)

-- Done! Now users can swipe independently and compare with any other user by email
