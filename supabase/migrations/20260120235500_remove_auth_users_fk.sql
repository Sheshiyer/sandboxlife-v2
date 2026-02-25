-- ============================================
-- MVP: REMOVE FOREIGN KEY TO auth.users
-- This allows user_id to be any UUID without requiring auth.users entry
-- ============================================

-- Drop the foreign key constraint on user_id
DO $$
DECLARE
    fk_name TEXT;
BEGIN
    SELECT tc.constraint_name INTO fk_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
    WHERE tc.table_name = 'user_journal_entries'
    AND tc.constraint_type = 'FOREIGN KEY'
    AND kcu.column_name = 'user_id';

    IF fk_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE user_journal_entries DROP CONSTRAINT ' || fk_name;
    END IF;
END $$;
