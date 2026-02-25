-- Persist journal prompt/icon snapshots and enforce one primary calendar entry per user/day
ALTER TABLE user_journal_entries
  ADD COLUMN IF NOT EXISTS question_uuid TEXT,
  ADD COLUMN IF NOT EXISTS question_text TEXT,
  ADD COLUMN IF NOT EXISTS question_variant INTEGER,
  ADD COLUMN IF NOT EXISTS icon_name TEXT,
  ADD COLUMN IF NOT EXISTS icon_color TEXT,
  ADD COLUMN IF NOT EXISTS chapter_label TEXT,
  ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::jsonb;

UPDATE user_journal_entries
SET chapter_label = journal_meaning
WHERE chapter_label IS NULL
  AND journal_meaning IS NOT NULL;

WITH ranked_primary AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY user_id, ((created_at AT TIME ZONE 'UTC')::date)
      ORDER BY created_at DESC, id DESC
    ) AS rn
  FROM user_journal_entries
  WHERE primary_to_calendar = TRUE
)
UPDATE user_journal_entries AS uje
SET primary_to_calendar = FALSE
FROM ranked_primary rp
WHERE uje.id = rp.id
  AND rp.rn > 1;

CREATE UNIQUE INDEX IF NOT EXISTS uniq_user_journal_entries_primary_per_day
  ON user_journal_entries (user_id, (((created_at AT TIME ZONE 'UTC')::date)))
  WHERE primary_to_calendar = TRUE;

CREATE OR REPLACE FUNCTION ensure_single_primary_calendar_entry()
RETURNS TRIGGER AS $$
BEGIN
  IF COALESCE(NEW.primary_to_calendar, FALSE) = TRUE THEN
    UPDATE user_journal_entries
    SET primary_to_calendar = FALSE
    WHERE user_id = NEW.user_id
      AND ((created_at AT TIME ZONE 'UTC')::date) = ((COALESCE(NEW.created_at, NOW()) AT TIME ZONE 'UTC')::date)
      AND id IS DISTINCT FROM NEW.id
      AND primary_to_calendar = TRUE;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_ensure_single_primary_calendar_entry ON user_journal_entries;
CREATE TRIGGER trg_ensure_single_primary_calendar_entry
  BEFORE INSERT OR UPDATE OF primary_to_calendar, created_at, user_id
  ON user_journal_entries
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_primary_calendar_entry();

CREATE OR REPLACE FUNCTION set_primary_calendar_entry(p_entry_id UUID)
RETURNS user_journal_entries
LANGUAGE plpgsql
AS $$
DECLARE
  v_entry user_journal_entries%ROWTYPE;
BEGIN
  SELECT *
  INTO v_entry
  FROM user_journal_entries
  WHERE id = p_entry_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Journal entry not found for id %', p_entry_id;
  END IF;

  UPDATE user_journal_entries
  SET primary_to_calendar = FALSE
  WHERE user_id = v_entry.user_id
    AND ((created_at AT TIME ZONE 'UTC')::date) = ((v_entry.created_at AT TIME ZONE 'UTC')::date)
    AND primary_to_calendar = TRUE
    AND id <> v_entry.id;

  UPDATE user_journal_entries
  SET primary_to_calendar = TRUE
  WHERE id = v_entry.id
  RETURNING * INTO v_entry;

  RETURN v_entry;
END;
$$;
