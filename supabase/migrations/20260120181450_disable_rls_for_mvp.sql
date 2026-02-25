-- ============================================
-- DISABLE RLS FOR MVP/TESTING
-- WARNING: Re-enable RLS with proper policies before production!
-- ============================================

-- Disable RLS on user_journal_entries
ALTER TABLE user_journal_entries DISABLE ROW LEVEL SECURITY;

-- Drop all policies since RLS is disabled
DROP POLICY IF EXISTS "Users can view own entries" ON user_journal_entries;
DROP POLICY IF EXISTS "Users can insert own entries" ON user_journal_entries;
DROP POLICY IF EXISTS "Users can update own entries" ON user_journal_entries;
DROP POLICY IF EXISTS "Users can delete own entries" ON user_journal_entries;

-- Grant full access to authenticated and anon users
GRANT ALL ON user_journal_entries TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Also ensure other user tables are accessible (matching user_profiles pattern)
ALTER TABLE user_progression DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_unlocked_icons DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_quest_progress DISABLE ROW LEVEL SECURITY;

-- Grant access to these tables too
GRANT ALL ON user_progression TO anon, authenticated;
GRANT ALL ON user_unlocked_icons TO anon, authenticated;
GRANT ALL ON user_achievements TO anon, authenticated;
GRANT ALL ON user_quest_progress TO anon, authenticated;

-- Note: This is safe for MVP but should be replaced with proper RLS policies for production
