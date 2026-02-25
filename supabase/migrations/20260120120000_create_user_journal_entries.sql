-- Create user_journal_entries table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  journal_type TEXT NOT NULL,
  journal_id TEXT, -- Corresponds to the icon UUID or similar ID
  journal_icon TEXT,
  journal_meaning TEXT,
  journal_entry TEXT,
  wisdom_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_journal_entries ENABLE ROW LEVEL SECURITY;

-- Policies

-- Select: Users can view their own entries
DROP POLICY IF EXISTS "Users can view own entries" ON user_journal_entries;
CREATE POLICY "Users can view own entries" ON user_journal_entries
  FOR SELECT USING (auth.uid() = user_id);

-- Insert: Users can insert their own entries
DROP POLICY IF EXISTS "Users can insert own entries" ON user_journal_entries;
CREATE POLICY "Users can insert own entries" ON user_journal_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Update: Users can update their own entries
DROP POLICY IF EXISTS "Users can update own entries" ON user_journal_entries;
CREATE POLICY "Users can update own entries" ON user_journal_entries
  FOR UPDATE USING (auth.uid() = user_id);

-- Delete: Users can delete their own entries
DROP POLICY IF EXISTS "Users can delete own entries" ON user_journal_entries;
CREATE POLICY "Users can delete own entries" ON user_journal_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_user_journal_entries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_user_journal_entries_updated_at ON user_journal_entries;
CREATE TRIGGER update_user_journal_entries_updated_at
  BEFORE UPDATE ON user_journal_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_user_journal_entries_updated_at();
