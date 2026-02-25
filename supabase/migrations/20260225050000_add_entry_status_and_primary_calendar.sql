-- Add journal entry status semantics and primary calendar mapping
ALTER TABLE user_journal_entries
  ADD COLUMN IF NOT EXISTS entry_status TEXT NOT NULL DEFAULT 'continue',
  ADD COLUMN IF NOT EXISTS primary_to_calendar BOOLEAN NOT NULL DEFAULT FALSE;

-- Keep status values constrained to supported UI states
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'user_journal_entries_entry_status_check'
  ) THEN
    ALTER TABLE user_journal_entries
      ADD CONSTRAINT user_journal_entries_entry_status_check
      CHECK (entry_status IN ('continue', 'certificate', 'completed', 'review'));
  END IF;
END $$;

-- Ensure at most one primary entry per user/day
WITH ranked_existing_primary AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY user_id, DATE(created_at)
      ORDER BY created_at DESC, id DESC
    ) AS rn
  FROM user_journal_entries
  WHERE primary_to_calendar = TRUE
)
UPDATE user_journal_entries uje
SET primary_to_calendar = FALSE
FROM ranked_existing_primary rep
WHERE uje.id = rep.id
  AND rep.rn > 1;

CREATE INDEX IF NOT EXISTS idx_user_journal_entries_primary_lookup
  ON user_journal_entries (user_id, created_at DESC)
  WHERE primary_to_calendar = TRUE;
