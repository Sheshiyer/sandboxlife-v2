-- Icon Unlock & Progression System Migration
-- D&D themed progression system for unlocking journal icons

-- ============================================
-- 1. User progression tracking table
-- ============================================
CREATE TABLE IF NOT EXISTS user_progression (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  level INTEGER DEFAULT 1 CHECK (level >= 1 AND level <= 100),
  xp INTEGER DEFAULT 0 CHECK (xp >= 0),
  total_entries INTEGER DEFAULT 0 CHECK (total_entries >= 0),
  streak_days INTEGER DEFAULT 0 CHECK (streak_days >= 0),
  longest_streak INTEGER DEFAULT 0 CHECK (longest_streak >= 0),
  last_entry_date DATE,
  title TEXT DEFAULT 'Wanderer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_progression_user ON user_progression(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progression_level ON user_progression(level DESC);
CREATE INDEX IF NOT EXISTS idx_user_progression_xp ON user_progression(xp DESC);

-- ============================================
-- 2. Icon unlock definitions table
-- ============================================
CREATE TABLE IF NOT EXISTS icon_unlock_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon_uuid TEXT NOT NULL UNIQUE,
  icon_name TEXT NOT NULL,
  journal_type TEXT NOT NULL CHECK (journal_type IN ('book_journal', 'daily_journal', 'thought_of_the_day')),
  unlock_type TEXT NOT NULL CHECK (unlock_type IN ('level', 'entries', 'streak', 'achievement', 'default')),
  unlock_value INTEGER DEFAULT 0,
  is_default BOOLEAN DEFAULT FALSE,
  rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_icon_unlock_journal_type ON icon_unlock_requirements(journal_type);
CREATE INDEX IF NOT EXISTS idx_icon_unlock_type ON icon_unlock_requirements(unlock_type);
CREATE INDEX IF NOT EXISTS idx_icon_unlock_rarity ON icon_unlock_requirements(rarity);

-- ============================================
-- 3. User unlocked icons tracking table
-- ============================================
CREATE TABLE IF NOT EXISTS user_unlocked_icons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  icon_uuid TEXT NOT NULL REFERENCES icon_unlock_requirements(icon_uuid) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unlock_method TEXT,
  UNIQUE(user_id, icon_uuid)
);

CREATE INDEX IF NOT EXISTS idx_user_unlocked_user ON user_unlocked_icons(user_id);
CREATE INDEX IF NOT EXISTS idx_user_unlocked_icon ON user_unlocked_icons(icon_uuid);

-- ============================================
-- 4. Achievement definitions table
-- ============================================
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  achievement_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT CHECK (category IN ('journal', 'social', 'streak', 'milestone', 'special')),
  icon_url TEXT,
  xp_reward INTEGER DEFAULT 0,
  rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  requirement_type TEXT CHECK (requirement_type IN ('entries_count', 'streak_days', 'friends_count', 'messages_sent', 'custom')),
  requirement_value INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_achievements_category ON achievements(category);
CREATE INDEX IF NOT EXISTS idx_achievements_rarity ON achievements(rarity);

-- ============================================
-- 5. User earned achievements table
-- ============================================
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_key TEXT NOT NULL REFERENCES achievements(achievement_key) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress_data JSONB,
  UNIQUE(user_id, achievement_key)
);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_earned ON user_achievements(earned_at DESC);

-- ============================================
-- 6. D&D Level titles configuration
-- ============================================
CREATE TABLE IF NOT EXISTS level_titles (
  level INTEGER PRIMARY KEY CHECK (level >= 1 AND level <= 100),
  title TEXT NOT NULL,
  description TEXT
);

-- Insert D&D themed level titles
INSERT INTO level_titles (level, title, description) VALUES
  (1, 'Wanderer', 'A new adventurer beginning their journey'),
  (5, 'Apprentice Scribe', 'Learning the ways of the written word'),
  (10, 'Journeyman', 'Gaining experience in the art of reflection'),
  (15, 'Chronicler', 'Documenting experiences with skill'),
  (20, 'Lorekeeper', 'Preserving stories and wisdom'),
  (25, 'Sage', 'A scholar of personal insight'),
  (30, 'Archivist', 'Master of organized thought'),
  (35, 'Mystic', 'Touching deeper truths through writing'),
  (40, 'Oracle', 'Seeing patterns in life''s tapestry'),
  (45, 'Grand Scribe', 'A legendary writer of one''s own tale'),
  (50, 'Master Chronicler', 'Elite keeper of personal history'),
  (60, 'Archmage of Reflection', 'Wielding profound self-awareness'),
  (70, 'Legendary Loremaster', 'A beacon of wisdom and insight'),
  (80, 'Mythic Sage', 'Transcendent understanding of self'),
  (90, 'Eternal Chronicler', 'Immortalized through words'),
  (100, 'Ascended Author', 'The ultimate master of self-narrative')
ON CONFLICT (level) DO NOTHING;

-- ============================================
-- 7. Insert default unlocked icons for each journal type
-- ============================================

-- Book Journal default icons (first 3 unlocked by default)
INSERT INTO icon_unlock_requirements (icon_uuid, icon_name, journal_type, unlock_type, unlock_value, is_default, rarity, description) VALUES
  ('b_shield', 'Shield', 'book_journal', 'default', 0, true, 'common', 'A symbol of protection - unlocked from the start'),
  ('b_snake', 'Snake', 'book_journal', 'default', 0, true, 'common', 'Represents growth and transformation - unlocked from the start'),
  ('b_treasure', 'Treasure', 'book_journal', 'default', 0, true, 'common', 'Discovery and prosperity - unlocked from the start'),
  ('b_sword', 'Sword', 'book_journal', 'level', 3, false, 'common', 'Unlock at level 3 - Symbol of courage'),
  ('b_star', 'Star', 'book_journal', 'level', 5, false, 'uncommon', 'Unlock at level 5 - Guidance and hope'),
  ('b_anchor', 'Anchor', 'book_journal', 'entries', 10, false, 'uncommon', 'Write 10 book entries - Stability and grounding'),
  ('b_rose', 'Rose', 'book_journal', 'level', 8, false, 'uncommon', 'Unlock at level 8 - Beauty and passion'),
  ('b_key', 'Key', 'book_journal', 'entries', 20, false, 'rare', 'Write 20 book entries - Unlocking potential'),
  ('b_lighthouse', 'Lighthouse', 'book_journal', 'level', 12, false, 'rare', 'Unlock at level 12 - Beacon of wisdom'),
  ('b_compass', 'Compass', 'book_journal', 'entries', 30, false, 'rare', 'Write 30 book entries - Finding direction'),
  ('b_dragon', 'Dragon', 'book_journal', 'level', 20, false, 'epic', 'Unlock at level 20 - Power and transformation'),
  ('b_phoenix', 'Phoenix', 'book_journal', 'entries', 50, false, 'epic', 'Write 50 book entries - Rebirth and renewal'),
  ('b_crystal', 'Crystal', 'book_journal', 'level', 30, false, 'legendary', 'Unlock at level 30 - Clarity and enlightenment'),
  ('b_infinity', 'Infinity', 'book_journal', 'entries', 100, false, 'legendary', 'Write 100 book entries - Eternal wisdom')
ON CONFLICT (icon_uuid) DO NOTHING;

-- Daily Journal default icons
INSERT INTO icon_unlock_requirements (icon_uuid, icon_name, journal_type, unlock_type, unlock_value, is_default, rarity, description) VALUES
  ('d_apple', 'Apple', 'daily_journal', 'default', 0, true, 'common', 'Simple beginnings - unlocked from the start'),
  ('d_bird', 'Bird', 'daily_journal', 'default', 0, true, 'common', 'Freedom and perspective - unlocked from the start'),
  ('d_leaf', 'Leaf', 'daily_journal', 'default', 0, true, 'common', 'Growth and nature - unlocked from the start'),
  ('d_shell', 'Shell', 'daily_journal', 'level', 2, false, 'common', 'Unlock at level 2 - Protection and patience'),
  ('d_butterfly', 'Butterfly', 'daily_journal', 'streak', 3, false, 'uncommon', '3-day streak - Transformation'),
  ('d_lotus', 'Lotus', 'daily_journal', 'level', 6, false, 'uncommon', 'Unlock at level 6 - Purity and enlightenment'),
  ('d_moon', 'Moon', 'daily_journal', 'streak', 7, false, 'rare', '7-day streak - Cycles and reflection'),
  ('d_sun', 'Sun', 'daily_journal', 'level', 10, false, 'rare', 'Unlock at level 10 - Energy and vitality'),
  ('d_mountain', 'Mountain', 'daily_journal', 'streak', 14, false, 'rare', '14-day streak - Strength and endurance'),
  ('d_ocean', 'Ocean', 'daily_journal', 'level', 15, false, 'epic', 'Unlock at level 15 - Depth and mystery'),
  ('d_phoenix_daily', 'Phoenix', 'daily_journal', 'streak', 30, false, 'epic', '30-day streak - Ultimate rebirth'),
  ('d_galaxy', 'Galaxy', 'daily_journal', 'level', 25, false, 'legendary', 'Unlock at level 25 - Infinite possibility'),
  ('d_aurora', 'Aurora', 'daily_journal', 'streak', 60, false, 'legendary', '60-day streak - Natural wonder')
ON CONFLICT (icon_uuid) DO NOTHING;

-- Thought of the Day icons
INSERT INTO icon_unlock_requirements (icon_uuid, icon_name, journal_type, unlock_type, unlock_value, is_default, rarity, description) VALUES
  ('t_candle', 'Candle', 'thought_of_the_day', 'default', 0, true, 'common', 'A spark of wisdom - unlocked from the start'),
  ('t_book', 'Book', 'thought_of_the_day', 'default', 0, true, 'common', 'Knowledge and learning - unlocked from the start'),
  ('t_quill', 'Quill', 'thought_of_the_day', 'entries', 5, false, 'uncommon', '5 thoughts recorded - The writer''s tool'),
  ('t_scroll', 'Scroll', 'thought_of_the_day', 'entries', 15, false, 'rare', '15 thoughts recorded - Ancient wisdom'),
  ('t_lantern', 'Lantern', 'thought_of_the_day', 'level', 7, false, 'rare', 'Unlock at level 7 - Guiding light'),
  ('t_crown', 'Crown', 'thought_of_the_day', 'entries', 30, false, 'epic', '30 thoughts recorded - Master of reflection'),
  ('t_constellation', 'Constellation', 'thought_of_the_day', 'level', 18, false, 'legendary', 'Unlock at level 18 - Connected wisdom')
ON CONFLICT (icon_uuid) DO NOTHING;

-- ============================================
-- 8. Insert achievement definitions
-- ============================================
INSERT INTO achievements (achievement_key, name, description, category, xp_reward, rarity, requirement_type, requirement_value) VALUES
  ('first_entry', 'First Steps', 'Write your first journal entry', 'milestone', 50, 'common', 'entries_count', 1),
  ('entries_10', 'Dedicated Writer', 'Write 10 journal entries', 'journal', 100, 'common', 'entries_count', 10),
  ('entries_50', 'Prolific Chronicler', 'Write 50 journal entries', 'journal', 300, 'uncommon', 'entries_count', 50),
  ('entries_100', 'Century Club', 'Write 100 journal entries', 'journal', 500, 'rare', 'entries_count', 100),
  ('entries_250', 'Legendary Scribe', 'Write 250 journal entries', 'journal', 1000, 'epic', 'entries_count', 250),
  ('entries_500', 'Ascended Author', 'Write 500 journal entries', 'journal', 2000, 'legendary', 'entries_count', 500),
  
  ('streak_3', 'Habit Forming', 'Maintain a 3-day streak', 'streak', 75, 'common', 'streak_days', 3),
  ('streak_7', 'Week Warrior', 'Maintain a 7-day streak', 'streak', 150, 'uncommon', 'streak_days', 7),
  ('streak_14', 'Fortnight Fighter', 'Maintain a 14-day streak', 'streak', 300, 'rare', 'streak_days', 14),
  ('streak_30', 'Monthly Master', 'Maintain a 30-day streak', 'streak', 600, 'epic', 'streak_days', 30),
  ('streak_60', 'Unbreakable', 'Maintain a 60-day streak', 'streak', 1200, 'legendary', 'streak_days', 60),
  ('streak_100', 'Eternal Flame', 'Maintain a 100-day streak', 'streak', 2500, 'legendary', 'streak_days', 100),
  
  ('first_friend', 'Companion Found', 'Add your first friend', 'social', 50, 'common', 'friends_count', 1),
  ('friends_5', 'Social Circle', 'Add 5 friends', 'social', 150, 'uncommon', 'friends_count', 5),
  ('friends_10', 'Popular Chronicler', 'Add 10 friends', 'social', 300, 'rare', 'friends_count', 10),
  
  ('level_10', 'Journeyman Achievement', 'Reach level 10', 'milestone', 200, 'uncommon', 'custom', 10),
  ('level_25', 'Sage Achievement', 'Reach level 25', 'milestone', 500, 'rare', 'custom', 25),
  ('level_50', 'Master Achievement', 'Reach level 50', 'milestone', 1500, 'epic', 'custom', 50),
  ('level_100', 'Ascension', 'Reach level 100', 'milestone', 5000, 'legendary', 'custom', 100)
ON CONFLICT (achievement_key) DO NOTHING;

-- ============================================
-- 9. Functions for XP and leveling
-- ============================================

-- Calculate XP required for a level (exponential growth)
CREATE OR REPLACE FUNCTION calculate_xp_for_level(target_level INTEGER)
RETURNS INTEGER AS $$
BEGIN
  -- Formula: 100 * level^1.5 (rounded)
  RETURN FLOOR(100 * POWER(target_level, 1.5))::INTEGER;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Award XP to user and handle level ups
CREATE OR REPLACE FUNCTION award_xp(p_user_id UUID, xp_amount INTEGER)
RETURNS TABLE(new_level INTEGER, new_xp INTEGER, leveled_up BOOLEAN, new_title TEXT) AS $$
DECLARE
  current_level INTEGER;
  current_xp INTEGER;
  xp_needed INTEGER;
  level_increased BOOLEAN := FALSE;
  updated_title TEXT;
BEGIN
  -- Get current progression
  SELECT level, xp INTO current_level, current_xp
  FROM user_progression
  WHERE user_id = p_user_id;
  
  -- If no progression record, create one
  IF NOT FOUND THEN
    INSERT INTO user_progression (user_id, level, xp)
    VALUES (p_user_id, 1, xp_amount)
    RETURNING level, xp INTO current_level, current_xp;
  ELSE
    -- Add XP
    current_xp := current_xp + xp_amount;
  END IF;
  
  -- Check for level ups
  xp_needed := calculate_xp_for_level(current_level + 1);
  
  WHILE current_xp >= xp_needed AND current_level < 100 LOOP
    current_level := current_level + 1;
    current_xp := current_xp - xp_needed;
    level_increased := TRUE;
    xp_needed := calculate_xp_for_level(current_level + 1);
  END LOOP;
  
  -- Get new title
  SELECT title INTO updated_title
  FROM level_titles
  WHERE level <= current_level
  ORDER BY level DESC
  LIMIT 1;
  
  -- Update progression
  UPDATE user_progression
  SET level = current_level,
      xp = current_xp,
      title = COALESCE(updated_title, title),
      updated_at = NOW()
  WHERE user_id = p_user_id;
  
  RETURN QUERY SELECT current_level, current_xp, level_increased, updated_title;
END;
$$ LANGUAGE plpgsql;

-- Check and unlock icons based on progression
CREATE OR REPLACE FUNCTION check_icon_unlocks(p_user_id UUID)
RETURNS TABLE(newly_unlocked_icons TEXT[]) AS $$
DECLARE
  user_level INTEGER;
  user_entries INTEGER;
  user_streak INTEGER;
  unlocked_icon TEXT;
  result_icons TEXT[] := '{}';
BEGIN
  -- Get user stats
  SELECT level, total_entries, streak_days
  INTO user_level, user_entries, user_streak
  FROM user_progression
  WHERE user_id = p_user_id;
  
  -- Check level-based unlocks
  FOR unlocked_icon IN
    SELECT icon_uuid FROM icon_unlock_requirements
    WHERE unlock_type = 'level' 
      AND unlock_value <= user_level
      AND icon_uuid NOT IN (
        SELECT icon_uuid FROM user_unlocked_icons WHERE user_id = p_user_id
      )
  LOOP
    INSERT INTO user_unlocked_icons (user_id, icon_uuid, unlock_method)
    VALUES (p_user_id, unlocked_icon, 'level_requirement')
    ON CONFLICT (user_id, icon_uuid) DO NOTHING;
    
    result_icons := array_append(result_icons, unlocked_icon);
  END LOOP;
  
  -- Check entry-based unlocks
  FOR unlocked_icon IN
    SELECT icon_uuid FROM icon_unlock_requirements
    WHERE unlock_type = 'entries' 
      AND unlock_value <= user_entries
      AND icon_uuid NOT IN (
        SELECT icon_uuid FROM user_unlocked_icons WHERE user_id = p_user_id
      )
  LOOP
    INSERT INTO user_unlocked_icons (user_id, icon_uuid, unlock_method)
    VALUES (p_user_id, unlocked_icon, 'entries_milestone')
    ON CONFLICT (user_id, icon_uuid) DO NOTHING;
    
    result_icons := array_append(result_icons, unlocked_icon);
  END LOOP;
  
  -- Check streak-based unlocks
  FOR unlocked_icon IN
    SELECT icon_uuid FROM icon_unlock_requirements
    WHERE unlock_type = 'streak' 
      AND unlock_value <= user_streak
      AND icon_uuid NOT IN (
        SELECT icon_uuid FROM user_unlocked_icons WHERE user_id = p_user_id
      )
  LOOP
    INSERT INTO user_unlocked_icons (user_id, icon_uuid, unlock_method)
    VALUES (p_user_id, unlocked_icon, 'streak_milestone')
    ON CONFLICT (user_id, icon_uuid) DO NOTHING;
    
    result_icons := array_append(result_icons, unlocked_icon);
  END LOOP;
  
  RETURN QUERY SELECT result_icons;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 10. Trigger to update progression on new journal entry
-- ============================================
CREATE OR REPLACE FUNCTION update_progression_on_entry()
RETURNS TRIGGER AS $$
DECLARE
  xp_earned INTEGER := 0;
  entry_xp INTEGER := 20; -- Base XP per entry
  bonus_xp INTEGER := 0;
  user_last_entry DATE;
  current_streak INTEGER;
  entry_count INTEGER;
BEGIN
  -- Award base XP for entry
  xp_earned := entry_xp;
  
  -- Get current user stats
  SELECT last_entry_date, streak_days, total_entries
  INTO user_last_entry, current_streak, entry_count
  FROM user_progression
  WHERE user_id = NEW.user_id;
  
  -- If no progression record, create one
  IF NOT FOUND THEN
    INSERT INTO user_progression (user_id, total_entries, last_entry_date, streak_days)
    VALUES (NEW.user_id, 1, CURRENT_DATE, 1);
    
    -- Unlock default icons for new user
    INSERT INTO user_unlocked_icons (user_id, icon_uuid, unlock_method)
    SELECT NEW.user_id, icon_uuid, 'default'
    FROM icon_unlock_requirements
    WHERE is_default = true
    ON CONFLICT (user_id, icon_uuid) DO NOTHING;
    
  ELSE
    -- Update entry count
    entry_count := entry_count + 1;
    
    -- Update streak
    IF user_last_entry = CURRENT_DATE THEN
      -- Same day entry, no streak update
      NULL;
    ELSIF user_last_entry = CURRENT_DATE - INTERVAL '1 day' THEN
      -- Consecutive day
      current_streak := current_streak + 1;
      
      -- Bonus XP for streaks
      IF current_streak >= 7 THEN
        bonus_xp := 15;
      ELSIF current_streak >= 3 THEN
        bonus_xp := 5;
      END IF;
      
    ELSE
      -- Streak broken
      current_streak := 1;
    END IF;
    
    -- Update progression
    UPDATE user_progression
    SET total_entries = entry_count,
        last_entry_date = CURRENT_DATE,
        streak_days = current_streak,
        longest_streak = GREATEST(longest_streak, current_streak),
        updated_at = NOW()
    WHERE user_id = NEW.user_id;
  END IF;
  
  -- Award XP
  PERFORM award_xp(NEW.user_id, xp_earned + bonus_xp);
  
  -- Check for icon unlocks
  PERFORM check_icon_unlocks(NEW.user_id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS progression_on_entry ON user_journal_entries;
CREATE TRIGGER progression_on_entry
  AFTER INSERT ON user_journal_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_progression_on_entry();

-- ============================================
-- 11. Row Level Security (RLS)
-- ============================================
ALTER TABLE user_progression ENABLE ROW LEVEL SECURITY;
ALTER TABLE icon_unlock_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_unlocked_icons ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE level_titles ENABLE ROW LEVEL SECURITY;

-- User progression policies
DROP POLICY IF EXISTS "Users can view own progression" ON user_progression;
CREATE POLICY "Users can view own progression" ON user_progression
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view friends progression" ON user_progression;
CREATE POLICY "Users can view friends progression" ON user_progression
  FOR SELECT USING (
    user_id IN (
      SELECT addressee_id FROM friendships 
      WHERE requester_id = auth.uid() AND status = 'accepted'
      UNION
      SELECT requester_id FROM friendships 
      WHERE addressee_id = auth.uid() AND status = 'accepted'
    )
  );

-- Icon unlock requirements are public (read-only)
DROP POLICY IF EXISTS "Anyone can view icon requirements" ON icon_unlock_requirements;
CREATE POLICY "Anyone can view icon requirements" ON icon_unlock_requirements
  FOR SELECT USING (true);

-- User unlocked icons
DROP POLICY IF EXISTS "Users can view own unlocked icons" ON user_unlocked_icons;
CREATE POLICY "Users can view own unlocked icons" ON user_unlocked_icons
  FOR SELECT USING (auth.uid() = user_id);

-- Achievements are public
DROP POLICY IF EXISTS "Anyone can view achievements" ON achievements;
CREATE POLICY "Anyone can view achievements" ON achievements
  FOR SELECT USING (true);

-- User achievements
DROP POLICY IF EXISTS "Users can view own achievements" ON user_achievements;
CREATE POLICY "Users can view own achievements" ON user_achievements
  FOR SELECT USING (auth.uid() = user_id);

-- Level titles are public
DROP POLICY IF EXISTS "Anyone can view level titles" ON level_titles;
CREATE POLICY "Anyone can view level titles" ON level_titles
  FOR SELECT USING (true);
