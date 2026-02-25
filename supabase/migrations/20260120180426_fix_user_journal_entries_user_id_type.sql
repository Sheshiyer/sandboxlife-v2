-- Fix user_id column type from VARCHAR to UUID
-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view own entries" ON user_journal_entries;
DROP POLICY IF EXISTS "Users can insert own entries" ON user_journal_entries;
DROP POLICY IF EXISTS "Users can update own entries" ON user_journal_entries;
DROP POLICY IF EXISTS "Users can delete own entries" ON user_journal_entries;

-- Alter column type to UUID
ALTER TABLE user_journal_entries 
  ALTER COLUMN user_id TYPE UUID USING user_id::UUID;

-- Recreate policies with correct types
CREATE POLICY "Users can view own entries" ON user_journal_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own entries" ON user_journal_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own entries" ON user_journal_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own entries" ON user_journal_entries
  FOR DELETE USING (auth.uid() = user_id);
