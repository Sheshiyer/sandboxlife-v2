-- First, check if RLS is enabled
ALTER TABLE user_journal_entries ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can view own entries" ON user_journal_entries;
DROP POLICY IF EXISTS "Users can insert own entries" ON user_journal_entries;
DROP POLICY IF EXISTS "Users can update own entries" ON user_journal_entries;
DROP POLICY IF EXISTS "Users can delete own entries" ON user_journal_entries;

-- Create policies with proper UUID comparison
CREATE POLICY "Users can view own entries" 
  ON user_journal_entries 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own entries" 
  ON user_journal_entries 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own entries" 
  ON user_journal_entries 
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own entries" 
  ON user_journal_entries 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Grant usage on the table
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON user_journal_entries TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
