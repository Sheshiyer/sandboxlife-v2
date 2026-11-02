BEGIN;

SET LOCAL lock_timeout = '5s';

SET LOCAL statement_timeout = '60s';

CREATE SCHEMA IF NOT EXISTS sbl_private;

REVOKE ALL ON SCHEMA sbl_private FROM PUBLIC, anon;

GRANT USAGE ON SCHEMA sbl_private TO authenticated;

REVOKE CREATE ON SCHEMA public FROM PUBLIC, anon, authenticated;

ALTER TABLE public."user_journal_entries" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."user_journal_entries" FROM PUBLIC, anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."user_journal_entries" TO authenticated;

CREATE POLICY sbl_owner_select ON public."user_journal_entries" FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);

CREATE POLICY sbl_owner_insert ON public."user_journal_entries" FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY sbl_owner_update ON public."user_journal_entries" FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY sbl_owner_delete ON public."user_journal_entries" FOR DELETE TO authenticated USING ((SELECT auth.uid()) = user_id);

ALTER TABLE public."user_define_settings" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."user_define_settings" FROM PUBLIC, anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."user_define_settings" TO authenticated;

CREATE POLICY sbl_owner_select ON public."user_define_settings" FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);

CREATE POLICY sbl_owner_insert ON public."user_define_settings" FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY sbl_owner_update ON public."user_define_settings" FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY sbl_owner_delete ON public."user_define_settings" FOR DELETE TO authenticated USING ((SELECT auth.uid()) = user_id);

DROP POLICY "Users can insert their own settings." ON public."user_settings";

DROP POLICY "Users can update their own settings." ON public."user_settings";

DROP POLICY "Users can view their own settings." ON public."user_settings";

ALTER TABLE public."user_settings" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."user_settings" FROM PUBLIC, anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."user_settings" TO authenticated;

CREATE POLICY sbl_owner_select ON public."user_settings" FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);

CREATE POLICY sbl_owner_insert ON public."user_settings" FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY sbl_owner_update ON public."user_settings" FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY sbl_owner_delete ON public."user_settings" FOR DELETE TO authenticated USING ((SELECT auth.uid()) = user_id);

ALTER TABLE public."user_profiles" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."user_profiles" FROM PUBLIC, anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."user_profiles" TO authenticated;

CREATE POLICY sbl_owner_select ON public."user_profiles" FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);

CREATE POLICY sbl_owner_insert ON public."user_profiles" FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY sbl_owner_update ON public."user_profiles" FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY sbl_owner_delete ON public."user_profiles" FOR DELETE TO authenticated USING ((SELECT auth.uid()) = user_id);

DROP POLICY "Public profiles are viewable by everyone." ON public."profiles";

DROP POLICY "Users can insert their own profile." ON public."profiles";

DROP POLICY "Users can update own profile." ON public."profiles";

ALTER TABLE public."profiles" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."profiles" FROM PUBLIC, anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."profiles" TO authenticated;

CREATE POLICY sbl_owner_select ON public."profiles" FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);

CREATE POLICY sbl_owner_insert ON public."profiles" FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY sbl_owner_update ON public."profiles" FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY sbl_owner_delete ON public."profiles" FOR DELETE TO authenticated USING ((SELECT auth.uid()) = user_id);

DROP POLICY "Users can view own progression" ON public."user_progression";

DROP POLICY "Users can view friends progression" ON public."user_progression";

ALTER TABLE public."user_progression" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."user_progression" FROM PUBLIC, anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."user_progression" TO authenticated;

CREATE POLICY sbl_owner_select ON public."user_progression" FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);

CREATE POLICY sbl_owner_insert ON public."user_progression" FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY sbl_owner_update ON public."user_progression" FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY sbl_owner_delete ON public."user_progression" FOR DELETE TO authenticated USING ((SELECT auth.uid()) = user_id);

DROP POLICY "Users can view own unlocked icons" ON public."user_unlocked_icons";

ALTER TABLE public."user_unlocked_icons" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."user_unlocked_icons" FROM PUBLIC, anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."user_unlocked_icons" TO authenticated;

CREATE POLICY sbl_owner_select ON public."user_unlocked_icons" FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);

CREATE POLICY sbl_owner_insert ON public."user_unlocked_icons" FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY sbl_owner_update ON public."user_unlocked_icons" FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY sbl_owner_delete ON public."user_unlocked_icons" FOR DELETE TO authenticated USING ((SELECT auth.uid()) = user_id);

DROP POLICY "Users can view own achievements" ON public."user_achievements";

ALTER TABLE public."user_achievements" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."user_achievements" FROM PUBLIC, anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."user_achievements" TO authenticated;

CREATE POLICY sbl_owner_select ON public."user_achievements" FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);

CREATE POLICY sbl_owner_insert ON public."user_achievements" FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY sbl_owner_update ON public."user_achievements" FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY sbl_owner_delete ON public."user_achievements" FOR DELETE TO authenticated USING ((SELECT auth.uid()) = user_id);

DROP POLICY "Users can view own quest progress" ON public."user_quest_progress";

DROP POLICY "Users can insert own quest progress" ON public."user_quest_progress";

DROP POLICY "Users can update own quest progress" ON public."user_quest_progress";

ALTER TABLE public."user_quest_progress" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."user_quest_progress" FROM PUBLIC, anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."user_quest_progress" TO authenticated;

CREATE POLICY sbl_owner_select ON public."user_quest_progress" FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);

CREATE POLICY sbl_owner_insert ON public."user_quest_progress" FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY sbl_owner_update ON public."user_quest_progress" FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY sbl_owner_delete ON public."user_quest_progress" FOR DELETE TO authenticated USING ((SELECT auth.uid()) = user_id);

DROP POLICY "Anyone can view icon requirements" ON public."icon_unlock_requirements";

ALTER TABLE public."icon_unlock_requirements" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."icon_unlock_requirements" FROM PUBLIC, anon, authenticated;

GRANT SELECT ON public."icon_unlock_requirements" TO authenticated;

CREATE POLICY sbl_catalog_read ON public."icon_unlock_requirements" FOR SELECT TO authenticated USING (true);

DROP POLICY "Anyone can view achievements" ON public."achievements";

ALTER TABLE public."achievements" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."achievements" FROM PUBLIC, anon, authenticated;

GRANT SELECT ON public."achievements" TO authenticated;

CREATE POLICY sbl_catalog_read ON public."achievements" FOR SELECT TO authenticated USING (true);

DROP POLICY "Anyone can view level titles" ON public."level_titles";

ALTER TABLE public."level_titles" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."level_titles" FROM PUBLIC, anon, authenticated;

GRANT SELECT ON public."level_titles" TO authenticated;

CREATE POLICY sbl_catalog_read ON public."level_titles" FOR SELECT TO authenticated USING (true);

DROP POLICY "Anyone can view quest definitions" ON public."quest_definitions";

ALTER TABLE public."quest_definitions" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."quest_definitions" FROM PUBLIC, anon, authenticated;

GRANT SELECT ON public."quest_definitions" TO authenticated;

CREATE POLICY sbl_catalog_read ON public."quest_definitions" FOR SELECT TO authenticated USING (true);

DROP POLICY "Users can view own friendships" ON public."friendships";

DROP POLICY "Users can send friend requests" ON public."friendships";

DROP POLICY "Users can update own friendships" ON public."friendships";

DROP POLICY "Users can delete own friendships" ON public."friendships";

ALTER TABLE public."friendships" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."friendships" FROM PUBLIC, anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."friendships" TO authenticated;

DROP POLICY "Users can view conversations" ON public."conversations";

DROP POLICY "Users can create conversations" ON public."conversations";

ALTER TABLE public."conversations" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."conversations" FROM PUBLIC, anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."conversations" TO authenticated;

DROP POLICY "Users can view conversation participants" ON public."conversation_participants";

DROP POLICY "Users can join conversations" ON public."conversation_participants";

DROP POLICY "Users can leave conversations" ON public."conversation_participants";

ALTER TABLE public."conversation_participants" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."conversation_participants" FROM PUBLIC, anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."conversation_participants" TO authenticated;

DROP POLICY "Users can edit own messages" ON public."chat_messages";

DROP POLICY "Users can view messages" ON public."chat_messages";

DROP POLICY "Users can send messages" ON public."chat_messages";

DROP POLICY "Users can delete own messages" ON public."chat_messages";

ALTER TABLE public."chat_messages" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."chat_messages" FROM PUBLIC, anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."chat_messages" TO authenticated;

ALTER TABLE public."messages" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."messages" FROM PUBLIC, anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."messages" TO authenticated;


CREATE POLICY sbl_friend_progression ON public.user_progression FOR SELECT TO authenticated USING (
 EXISTS (SELECT 1 FROM public.friendships f WHERE f.status='accepted' AND
 ((f.requester_id=auth.uid() AND f.addressee_id=user_progression.user_id) OR
 (f.addressee_id=auth.uid() AND f.requester_id=user_progression.user_id))));
CREATE OR REPLACE FUNCTION sbl_private.can_read_conversation(p_id uuid) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = pg_catalog
AS $$ SELECT auth.uid() IS NOT NULL AND EXISTS (
 SELECT 1 FROM public.conversations c WHERE c.id=p_id AND (c.type='global' OR c.created_by=auth.uid() OR EXISTS (
 SELECT 1 FROM public.conversation_participants cp WHERE cp.conversation_id=c.id AND cp.user_id=auth.uid()))) $$;
CREATE OR REPLACE FUNCTION sbl_private.can_manage_conversation(p_id uuid) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = pg_catalog
AS $$ SELECT auth.uid() IS NOT NULL AND EXISTS (
 SELECT 1 FROM public.conversations c WHERE c.id=p_id AND (c.created_by=auth.uid() OR EXISTS (
 SELECT 1 FROM public.conversation_participants cp WHERE cp.conversation_id=c.id AND cp.user_id=auth.uid() AND cp.role='admin'))) $$;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA sbl_private FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION sbl_private.can_read_conversation(uuid), sbl_private.can_manage_conversation(uuid) TO authenticated;
CREATE POLICY sbl_conversation_read ON public.conversations FOR SELECT TO authenticated USING (created_by=auth.uid() OR sbl_private.can_read_conversation(id));
CREATE POLICY sbl_conversation_insert ON public.conversations FOR INSERT TO authenticated WITH CHECK (created_by=auth.uid());
CREATE POLICY sbl_conversation_update ON public.conversations FOR UPDATE TO authenticated USING (created_by=auth.uid()) WITH CHECK (created_by=auth.uid());
CREATE POLICY sbl_conversation_delete ON public.conversations FOR DELETE TO authenticated USING (created_by=auth.uid());
CREATE POLICY sbl_participant_read ON public.conversation_participants FOR SELECT TO authenticated USING (sbl_private.can_read_conversation(conversation_id));
CREATE POLICY sbl_participant_insert ON public.conversation_participants FOR INSERT TO authenticated WITH CHECK (
 sbl_private.can_manage_conversation(conversation_id) OR (user_id=auth.uid() AND role='member' AND EXISTS (
 SELECT 1 FROM public.conversations c WHERE c.id=conversation_id AND c.type='global')));
CREATE POLICY sbl_participant_update ON public.conversation_participants FOR UPDATE TO authenticated USING (user_id=auth.uid()) WITH CHECK (user_id=auth.uid());
CREATE POLICY sbl_participant_delete ON public.conversation_participants FOR DELETE TO authenticated USING (user_id=auth.uid() OR sbl_private.can_manage_conversation(conversation_id));
REVOKE UPDATE ON public.conversation_participants FROM authenticated;
GRANT UPDATE (last_read_at) ON public.conversation_participants TO authenticated;
CREATE POLICY sbl_chat_read ON public.chat_messages FOR SELECT TO authenticated USING (sbl_private.can_read_conversation(conversation_id));
CREATE POLICY sbl_chat_insert ON public.chat_messages FOR INSERT TO authenticated WITH CHECK (sender_id=auth.uid() AND sbl_private.can_read_conversation(conversation_id));
CREATE POLICY sbl_chat_update ON public.chat_messages FOR UPDATE TO authenticated USING (sender_id=auth.uid()) WITH CHECK (sender_id=auth.uid() AND sbl_private.can_read_conversation(conversation_id));
CREATE POLICY sbl_chat_delete ON public.chat_messages FOR DELETE TO authenticated USING (sender_id=auth.uid());
CREATE POLICY sbl_legacy_room_read ON public.messages FOR SELECT TO authenticated USING (true);
CREATE POLICY sbl_legacy_room_insert ON public.messages FOR INSERT TO authenticated WITH CHECK (user_id=auth.uid());
CREATE POLICY sbl_legacy_room_update ON public.messages FOR UPDATE TO authenticated USING (user_id=auth.uid()) WITH CHECK (user_id=auth.uid());
CREATE POLICY sbl_legacy_room_delete ON public.messages FOR DELETE TO authenticated USING (user_id=auth.uid());
CREATE POLICY sbl_friend_read ON public.friendships FOR SELECT TO authenticated USING (auth.uid() IN (requester_id,addressee_id));
CREATE POLICY sbl_friend_insert ON public.friendships FOR INSERT TO authenticated WITH CHECK (requester_id=auth.uid() AND status='pending');
CREATE POLICY sbl_friend_update ON public.friendships FOR UPDATE TO authenticated USING (auth.uid() IN (requester_id,addressee_id)) WITH CHECK (auth.uid() IN (requester_id,addressee_id));
CREATE POLICY sbl_friend_delete ON public.friendships FOR DELETE TO authenticated USING (auth.uid() IN (requester_id,addressee_id));
CREATE OR REPLACE FUNCTION sbl_private.guard_friendship_update() RETURNS trigger LANGUAGE plpgsql SET search_path = pg_catalog AS $$
BEGIN
 IF NEW.requester_id<>OLD.requester_id OR NEW.addressee_id<>OLD.addressee_id THEN RAISE EXCEPTION 'Friendship identities are immutable' USING ERRCODE='42501'; END IF;
 IF NEW.status='accepted' AND OLD.status IS DISTINCT FROM 'accepted' AND (auth.uid() IS DISTINCT FROM OLD.addressee_id OR OLD.status<>'pending') THEN RAISE EXCEPTION 'Only the recipient can accept a pending request' USING ERRCODE='42501'; END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER sbl_guard_friendship_update BEFORE UPDATE ON public.friendships FOR EACH ROW EXECUTE FUNCTION sbl_private.guard_friendship_update();
ALTER VIEW public.basic_profiles SET (security_invoker=true);
REVOKE ALL ON public.basic_profiles FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.basic_profiles TO authenticated;
REVOKE ALL ON SEQUENCE public.messages_id_seq,public.user_journal_entries_id_seq FROM PUBLIC,anon,authenticated;
GRANT USAGE,SELECT ON SEQUENCE public.messages_id_seq,public.user_journal_entries_id_seq TO authenticated;
DROP FUNCTION public.set_primary_calendar_entry(uuid);
CREATE FUNCTION public.set_primary_calendar_entry(p_entry_id bigint) RETURNS public.user_journal_entries
LANGUAGE plpgsql SECURITY INVOKER SET search_path=pg_catalog,public,pg_temp AS $$
DECLARE v public.user_journal_entries%ROWTYPE; uid uuid:=auth.uid();
BEGIN
 IF uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='42501'; END IF;
 SELECT * INTO v FROM public.user_journal_entries WHERE id=p_entry_id AND user_id=uid;
 IF NOT FOUND THEN RAISE EXCEPTION 'Entry unavailable' USING ERRCODE='42501'; END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended(uid::text||':'||((v.created_at AT TIME ZONE 'UTC')::date)::text,0));
 UPDATE public.user_journal_entries SET primary_to_calendar=false WHERE user_id=uid AND (created_at AT TIME ZONE 'UTC')::date=(v.created_at AT TIME ZONE 'UTC')::date AND primary_to_calendar AND id<>p_entry_id;
 UPDATE public.user_journal_entries SET primary_to_calendar=true WHERE id=p_entry_id AND user_id=uid RETURNING * INTO v;
 RETURN v;
END $$;
REVOKE ALL ON FUNCTION public.set_primary_calendar_entry(bigint) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.set_primary_calendar_entry(bigint) TO authenticated;
DROP TRIGGER trigger_update_progression ON public.user_journal_entries;


CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$
;

ALTER FUNCTION public."update_updated_at_column"() SET search_path = pg_catalog,public,pg_temp;

REVOKE EXECUTE ON FUNCTION public."update_updated_at_column"() FROM PUBLIC,anon,authenticated;

CREATE OR REPLACE FUNCTION public.update_conversation_last_message()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE conversations
  SET last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$function$
;

ALTER FUNCTION public."update_conversation_last_message"() SET search_path = pg_catalog,public,pg_temp;

REVOKE EXECUTE ON FUNCTION public."update_conversation_last_message"() FROM PUBLIC,anon,authenticated;

CREATE OR REPLACE FUNCTION public.calculate_xp_for_level(target_level integer)
 RETURNS integer
 LANGUAGE plpgsql
 IMMUTABLE
AS $function$
BEGIN
  -- Formula: 100 * level^1.5 (rounded)
  RETURN FLOOR(100 * POWER(target_level, 1.5))::INTEGER;
END;
$function$
;

ALTER FUNCTION public."calculate_xp_for_level"(target_level integer) SET search_path = pg_catalog,public,pg_temp;

REVOKE EXECUTE ON FUNCTION public."calculate_xp_for_level"(target_level integer) FROM PUBLIC,anon,authenticated;

GRANT EXECUTE ON FUNCTION public."calculate_xp_for_level"(target_level integer) TO authenticated;

CREATE OR REPLACE FUNCTION sbl_private.get_friends(p_user_id uuid)
 RETURNS TABLE(friendship_id uuid, friend_id uuid, friend_email text, friend_display_name text, friend_avatar_url text, friend_online_status text, friendship_created_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
IF auth.uid() IS DISTINCT FROM p_user_id  THEN RAISE EXCEPTION 'Caller identity mismatch' USING ERRCODE='42501'; END IF;

  RETURN QUERY
  SELECT
    f.id AS friendship_id,
    CASE WHEN f.requester_id = p_user_id THEN f.addressee_id ELSE f.requester_id END AS friend_id,
    u.email AS friend_email,
    up.display_name AS friend_display_name,
    up.avatar_url AS friend_avatar_url,
    COALESCE(up.online_status, 'offline') AS friend_online_status,
    f.created_at AS friendship_created_at
  FROM friendships f
  JOIN auth.users u ON u.id = CASE WHEN f.requester_id = p_user_id THEN f.addressee_id ELSE f.requester_id END
  LEFT JOIN user_profiles up ON up.user_id = u.id
  WHERE (f.requester_id = p_user_id OR f.addressee_id = p_user_id)
    AND f.status = 'accepted';
END;
$function$
;

ALTER FUNCTION sbl_private."get_friends"(p_user_id uuid) SET search_path = pg_catalog,public,pg_temp;

CREATE OR REPLACE FUNCTION public.get_friends(p_user_id uuid) RETURNS TABLE(friendship_id uuid, friend_id uuid, friend_email text, friend_display_name text, friend_avatar_url text, friend_online_status text, friendship_created_at timestamp with time zone) LANGUAGE sql SECURITY INVOKER SET search_path = pg_catalog AS $$ SELECT * FROM sbl_private.get_friends(p_user_id); $$;

REVOKE ALL ON FUNCTION sbl_private.get_friends(p_user_id uuid) FROM PUBLIC,anon; GRANT EXECUTE ON FUNCTION sbl_private.get_friends(p_user_id uuid) TO authenticated;

ALTER FUNCTION public."get_friends"(p_user_id uuid) SET search_path = pg_catalog,public,pg_temp;

REVOKE EXECUTE ON FUNCTION public."get_friends"(p_user_id uuid) FROM PUBLIC,anon,authenticated;

GRANT EXECUTE ON FUNCTION public."get_friends"(p_user_id uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.check_and_award_achievements()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY INVOKER
AS $function$ DECLARE ach RECORD; prog RECORD; entry_counts RECORD; already_earned BOOLEAN; BEGIN SELECT * INTO prog FROM user_progression WHERE user_id = NEW.user_id; SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE journal_type IN ('book','book_journal')) as book_count, COUNT(*) FILTER (WHERE journal_type IN ('daily','daily_journal')) as daily_count, COUNT(*) FILTER (WHERE journal_type IN ('thought','thought_of_the_day')) as thought_count INTO entry_counts FROM user_journal_entries WHERE user_id = NEW.user_id; FOR ach IN SELECT * FROM achievements WHERE is_active = true LOOP SELECT EXISTS(SELECT 1 FROM user_achievements WHERE user_id = NEW.user_id AND (achievement_id = ach.id OR achievement_key = ach.achievement_key)) INTO already_earned; IF already_earned THEN CONTINUE; END IF; IF (ach.category = 'journal' AND ach.requirement_type = 'total_entries' AND entry_counts.total >= ach.requirement_value) OR (ach.category = 'journal' AND ach.requirement_type = 'book_entries' AND entry_counts.book_count >= ach.requirement_value) OR (ach.category = 'journal' AND ach.requirement_type = 'daily_entries' AND entry_counts.daily_count >= ach.requirement_value) OR (ach.category = 'journal' AND ach.requirement_type = 'thought_entries' AND entry_counts.thought_count >= ach.requirement_value) OR (ach.category = 'streak' AND ach.requirement_type = 'streak_days' AND prog.streak_days >= ach.requirement_value) OR (ach.category = 'streak' AND ach.requirement_type = 'longest_streak' AND prog.longest_streak >= ach.requirement_value) OR (ach.category = 'milestone' AND ach.requirement_type = 'level_reached' AND prog.level >= ach.requirement_value) THEN INSERT INTO user_achievements (user_id, achievement_id, achievement_key) VALUES (NEW.user_id, ach.id, ach.achievement_key) ON CONFLICT (user_id, achievement_key) DO NOTHING; IF FOUND THEN PERFORM award_xp(NEW.user_id, ach.xp_reward); END IF; END IF; END LOOP; RETURN NEW; END; $function$
;

ALTER FUNCTION public."check_and_award_achievements"() SET search_path = pg_catalog,public,pg_temp;

REVOKE EXECUTE ON FUNCTION public."check_and_award_achievements"() FROM PUBLIC,anon,authenticated;

CREATE OR REPLACE FUNCTION sbl_private.get_or_create_direct_conversation(p_user1_id uuid, p_user2_id uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_conversation_id UUID;
BEGIN
IF auth.uid() IS DISTINCT FROM p_user1_id  THEN RAISE EXCEPTION 'Caller identity mismatch' USING ERRCODE='42501'; END IF;
IF p_user1_id=p_user2_id OR NOT EXISTS (SELECT 1 FROM auth.users WHERE id=p_user2_id) OR EXISTS (SELECT 1 FROM public.friendships WHERE status='blocked' AND ((requester_id=p_user1_id AND addressee_id=p_user2_id) OR (requester_id=p_user2_id AND addressee_id=p_user1_id))) THEN RAISE EXCEPTION 'Conversation unavailable' USING ERRCODE='42501'; END IF;

  -- Check if direct conversation already exists
  SELECT c.id INTO v_conversation_id
  FROM conversations c
  JOIN conversation_participants cp1 ON cp1.conversation_id = c.id AND cp1.user_id = p_user1_id
  JOIN conversation_participants cp2 ON cp2.conversation_id = c.id AND cp2.user_id = p_user2_id
  WHERE c.type = 'direct'
  LIMIT 1;

  -- If not found, create new conversation
  IF v_conversation_id IS NULL THEN
    INSERT INTO conversations (type, created_by)
    VALUES ('direct', p_user1_id)
    RETURNING id INTO v_conversation_id;

    -- Add both participants
    INSERT INTO conversation_participants (conversation_id, user_id)
    VALUES (v_conversation_id, p_user1_id), (v_conversation_id, p_user2_id);
  END IF;

  RETURN v_conversation_id;
END;
$function$
;

ALTER FUNCTION sbl_private."get_or_create_direct_conversation"(p_user1_id uuid, p_user2_id uuid) SET search_path = pg_catalog,public,pg_temp;

CREATE OR REPLACE FUNCTION public.get_or_create_direct_conversation(p_user1_id uuid, p_user2_id uuid) RETURNS uuid LANGUAGE sql SECURITY INVOKER SET search_path = pg_catalog AS $$ SELECT * FROM sbl_private.get_or_create_direct_conversation(p_user1_id,p_user2_id); $$;

REVOKE ALL ON FUNCTION sbl_private.get_or_create_direct_conversation(p_user1_id uuid, p_user2_id uuid) FROM PUBLIC,anon; GRANT EXECUTE ON FUNCTION sbl_private.get_or_create_direct_conversation(p_user1_id uuid, p_user2_id uuid) TO authenticated;

ALTER FUNCTION public."get_or_create_direct_conversation"(p_user1_id uuid, p_user2_id uuid) SET search_path = pg_catalog,public,pg_temp;

REVOKE EXECUTE ON FUNCTION public."get_or_create_direct_conversation"(p_user1_id uuid, p_user2_id uuid) FROM PUBLIC,anon,authenticated;

GRANT EXECUTE ON FUNCTION public."get_or_create_direct_conversation"(p_user1_id uuid, p_user2_id uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.award_xp(p_user_id uuid, xp_amount integer)
 RETURNS TABLE(new_level integer, new_xp integer, leveled_up boolean, new_title text)
 LANGUAGE plpgsql
AS $function$
DECLARE
  current_level INTEGER;
  current_xp INTEGER;
  xp_needed INTEGER;
  level_increased BOOLEAN := FALSE;
  updated_title TEXT;
BEGIN
IF auth.uid() IS DISTINCT FROM p_user_id AND current_user NOT IN ('postgres','service_role','supabase_admin') THEN RAISE EXCEPTION 'Caller identity mismatch' USING ERRCODE='42501'; END IF;

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
$function$
;

ALTER FUNCTION public."award_xp"(p_user_id uuid, xp_amount integer) SET search_path = pg_catalog,public,pg_temp;

REVOKE EXECUTE ON FUNCTION public."award_xp"(p_user_id uuid, xp_amount integer) FROM PUBLIC,anon,authenticated;

GRANT EXECUTE ON FUNCTION public."award_xp"(p_user_id uuid, xp_amount integer) TO authenticated;

CREATE OR REPLACE FUNCTION public.check_icon_unlocks(p_user_id uuid)
 RETURNS TABLE(newly_unlocked_icons text[])
 LANGUAGE plpgsql
AS $function$
DECLARE
  user_level INTEGER;
  user_entries INTEGER;
  user_streak INTEGER;
  unlocked_icon TEXT;
  result_icons TEXT[] := '{}';
BEGIN
IF auth.uid() IS DISTINCT FROM p_user_id AND current_user NOT IN ('postgres','service_role','supabase_admin') THEN RAISE EXCEPTION 'Caller identity mismatch' USING ERRCODE='42501'; END IF;

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
$function$
;

ALTER FUNCTION public."check_icon_unlocks"(p_user_id uuid) SET search_path = pg_catalog,public,pg_temp;

REVOKE EXECUTE ON FUNCTION public."check_icon_unlocks"(p_user_id uuid) FROM PUBLIC,anon,authenticated;

GRANT EXECUTE ON FUNCTION public."check_icon_unlocks"(p_user_id uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.update_progression_on_entry()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
$function$
;

ALTER FUNCTION public."update_progression_on_entry"() SET search_path = pg_catalog,public,pg_temp;

REVOKE EXECUTE ON FUNCTION public."update_progression_on_entry"() FROM PUBLIC,anon,authenticated;

CREATE OR REPLACE FUNCTION public.check_icon_unlocks()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY INVOKER
AS $function$ DECLARE icon RECORD; prog RECORD; entry_counts RECORD; already_unlocked BOOLEAN; BEGIN SELECT * INTO prog FROM user_progression WHERE user_id = NEW.user_id; SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE journal_type IN ('book','book_journal')) as book_count, COUNT(*) FILTER (WHERE journal_type IN ('daily','daily_journal')) as daily_count, COUNT(*) FILTER (WHERE journal_type IN ('thought','thought_of_the_day')) as thought_count INTO entry_counts FROM user_journal_entries WHERE user_id = NEW.user_id; FOR icon IN SELECT * FROM icon_unlock_requirements WHERE is_default = false LOOP SELECT EXISTS(SELECT 1 FROM user_unlocked_icons WHERE user_id = NEW.user_id AND icon_uuid = icon.icon_uuid) INTO already_unlocked; IF already_unlocked THEN CONTINUE; END IF; IF (icon.unlock_type = 'level' AND prog.level >= icon.unlock_value) OR (icon.unlock_type = 'entries' AND icon.journal_type IN ('book','book_journal') AND entry_counts.book_count >= icon.unlock_value) OR (icon.unlock_type = 'entries' AND icon.journal_type IN ('daily','daily_journal') AND entry_counts.daily_count >= icon.unlock_value) OR (icon.unlock_type = 'entries' AND icon.journal_type IN ('thought','thought_of_the_day') AND entry_counts.thought_count >= icon.unlock_value) OR (icon.unlock_type = 'streak' AND prog.streak_days >= icon.unlock_value) THEN INSERT INTO user_unlocked_icons (user_id, icon_uuid, unlock_method) VALUES (NEW.user_id, icon.icon_uuid, icon.unlock_type); END IF; END LOOP; RETURN NEW; END; $function$
;

ALTER FUNCTION public."check_icon_unlocks"() SET search_path = pg_catalog,public,pg_temp;

REVOKE EXECUTE ON FUNCTION public."check_icon_unlocks"() FROM PUBLIC,anon,authenticated;

CREATE OR REPLACE FUNCTION public.rls_auto_enable()
 RETURNS event_trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog'
AS $function$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$function$
;

ALTER FUNCTION public."rls_auto_enable"() SET search_path = pg_catalog,public,pg_temp;

REVOKE EXECUTE ON FUNCTION public."rls_auto_enable"() FROM PUBLIC,anon,authenticated;

CREATE OR REPLACE FUNCTION public.reset_daily_quests()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$ BEGIN DELETE FROM user_quest_progress WHERE quest_key IN (SELECT quest_key FROM quest_definitions WHERE quest_type = 'daily') AND reset_at < CURRENT_DATE; END; $function$
;

ALTER FUNCTION public."reset_daily_quests"() SET search_path = pg_catalog,public,pg_temp;

REVOKE EXECUTE ON FUNCTION public."reset_daily_quests"() FROM PUBLIC,anon,authenticated;

CREATE OR REPLACE FUNCTION public.ensure_single_primary_calendar_entry()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
$function$
;

ALTER FUNCTION public."ensure_single_primary_calendar_entry"() SET search_path = pg_catalog,public,pg_temp;

REVOKE EXECUTE ON FUNCTION public."ensure_single_primary_calendar_entry"() FROM PUBLIC,anon,authenticated;

CREATE OR REPLACE FUNCTION public.reset_weekly_quests()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$ DECLARE week_start DATE; BEGIN week_start := date_trunc('week', CURRENT_DATE)::DATE; DELETE FROM user_quest_progress WHERE quest_key IN (SELECT quest_key FROM quest_definitions WHERE quest_type = 'weekly') AND reset_at < week_start; END; $function$
;

ALTER FUNCTION public."reset_weekly_quests"() SET search_path = pg_catalog,public,pg_temp;

REVOKE EXECUTE ON FUNCTION public."reset_weekly_quests"() FROM PUBLIC,anon,authenticated;

CREATE OR REPLACE FUNCTION public.get_pending_requests(p_user_id uuid)
 RETURNS TABLE(id uuid, requester_id uuid, addressee_id uuid, status text, created_at timestamp with time zone)
 LANGUAGE plpgsql
AS $function$
  BEGIN
IF auth.uid() IS DISTINCT FROM p_user_id AND current_user NOT IN ('postgres','service_role','supabase_admin') THEN RAISE EXCEPTION 'Caller identity mismatch' USING ERRCODE='42501'; END IF;

    RETURN QUERY
    SELECT f.id, f.requester_id, f.addressee_id, f.status, f.created_at
    FROM friendships f
    WHERE f.addressee_id = p_user_id
    AND f.status = 'pending';
  END;
  $function$
;

ALTER FUNCTION public."get_pending_requests"(p_user_id uuid) SET search_path = pg_catalog,public,pg_temp;

REVOKE EXECUTE ON FUNCTION public."get_pending_requests"(p_user_id uuid) FROM PUBLIC,anon,authenticated;

GRANT EXECUTE ON FUNCTION public."get_pending_requests"(p_user_id uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.trigger_set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$
;

ALTER FUNCTION public."trigger_set_updated_at"() SET search_path = pg_catalog,public,pg_temp;

REVOKE EXECUTE ON FUNCTION public."trigger_set_updated_at"() FROM PUBLIC,anon,authenticated;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY INVOKER
AS $function$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$function$
;

ALTER FUNCTION public."handle_updated_at"() SET search_path = pg_catalog,public,pg_temp;

REVOKE EXECUTE ON FUNCTION public."handle_updated_at"() FROM PUBLIC,anon,authenticated;

DROP POLICY "allow all access 1oj01fe_1" ON storage.objects;

DROP POLICY "allow all access 1oj01fe_2" ON storage.objects;

DROP POLICY "allow all access 1oj01fe_3" ON storage.objects;

DROP POLICY "allow_all 1uoo9tn_1" ON storage.objects;

DROP POLICY "allow_all 1uoo9tn_2" ON storage.objects;

DROP POLICY "allow_all 1uoo9tn_3" ON storage.objects;

CREATE POLICY sbl_avatar_insert ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id='avatars' AND split_part(name,'/',1)='user_avatars' AND split_part(split_part(name,'/',2),'.',1)=(SELECT auth.uid())::text);

CREATE POLICY sbl_avatar_update ON storage.objects FOR UPDATE TO authenticated USING (bucket_id='avatars' AND split_part(name,'/',1)='user_avatars' AND split_part(split_part(name,'/',2),'.',1)=(SELECT auth.uid())::text) WITH CHECK (bucket_id='avatars' AND split_part(name,'/',1)='user_avatars' AND split_part(split_part(name,'/',2),'.',1)=(SELECT auth.uid())::text);

CREATE POLICY sbl_avatar_delete ON storage.objects FOR DELETE TO authenticated USING (bucket_id='avatars' AND split_part(name,'/',1)='user_avatars' AND split_part(split_part(name,'/',2),'.',1)=(SELECT auth.uid())::text);


CREATE FUNCTION sbl_private.get_social_profiles(p_search text DEFAULT NULL,p_user_id uuid DEFAULT NULL)
RETURNS TABLE(user_id uuid,display_name text,avatar_url text,online_status text,is_public boolean,about_me text,activities text[],hobbies text[],interests text[],entertainment text,work_education text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog AS $$
 WITH projected AS (
 SELECT p.*, (p.user_id=auth.uid() OR p.is_public OR EXISTS(SELECT 1 FROM public.friendships f WHERE f.status='accepted' AND
 ((f.requester_id=auth.uid() AND f.addressee_id=p.user_id) OR (f.addressee_id=auth.uid() AND f.requester_id=p.user_id)))) AS allowed_details
 FROM public.user_profiles p WHERE auth.uid() IS NOT NULL AND (p_user_id IS NULL OR p.user_id=p_user_id)
 AND (p_search IS NULL OR (p.user_id<>auth.uid() AND coalesce(p.display_name,'') ILIKE '%'||p_search||'%')))
 SELECT p.user_id,p.display_name,p.avatar_url,p.online_status,p.is_public,
 CASE WHEN allowed_details THEN p.about_me END,CASE WHEN allowed_details THEN p.activities END,
 CASE WHEN allowed_details THEN p.hobbies END,CASE WHEN allowed_details THEN p.interests END,
 CASE WHEN allowed_details THEN p.entertainment END,CASE WHEN allowed_details THEN p.work_education END
 FROM projected p ORDER BY p.display_name NULLS LAST,p.user_id LIMIT 20 $$;
CREATE FUNCTION public.get_social_profiles(p_search text DEFAULT NULL,p_user_id uuid DEFAULT NULL)
RETURNS TABLE(user_id uuid,display_name text,avatar_url text,online_status text,is_public boolean,about_me text,activities text[],hobbies text[],interests text[],entertainment text,work_education text)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path=pg_catalog AS $$ SELECT * FROM sbl_private.get_social_profiles(p_search,p_user_id) $$;
CREATE FUNCTION sbl_private.get_social_leaderboard(p_limit integer DEFAULT 10,p_order_by text DEFAULT 'level')
RETURNS TABLE(user_id uuid,level integer,xp integer,total_entries integer,longest_streak integer,title text,user_profiles jsonb)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog AS $$
 SELECT g.user_id,g.level,g.xp,g.total_entries,g.longest_streak,g.title,jsonb_build_object('display_name',p.display_name,'avatar_url',p.avatar_url)
 FROM public.user_progression g JOIN public.user_profiles p ON p.user_id=g.user_id
 WHERE auth.uid() IS NOT NULL AND (g.user_id=auth.uid() OR p.is_public OR EXISTS(SELECT 1 FROM public.friendships f WHERE f.status='accepted' AND
 ((f.requester_id=auth.uid() AND f.addressee_id=g.user_id) OR (f.addressee_id=auth.uid() AND f.requester_id=g.user_id))))
 ORDER BY CASE WHEN p_order_by='xp' THEN g.xp WHEN p_order_by='total_entries' THEN g.total_entries WHEN p_order_by='longest_streak' THEN g.longest_streak ELSE g.level END DESC,g.user_id
 LIMIT greatest(1,least(coalesce(p_limit,10),100)) $$;
CREATE FUNCTION public.get_social_leaderboard(p_limit integer DEFAULT 10,p_order_by text DEFAULT 'level')
RETURNS TABLE(user_id uuid,level integer,xp integer,total_entries integer,longest_streak integer,title text,user_profiles jsonb)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path=pg_catalog AS $$ SELECT * FROM sbl_private.get_social_leaderboard(p_limit,p_order_by) $$;
REVOKE ALL ON FUNCTION public.get_social_profiles(text,uuid),public.get_social_leaderboard(integer,text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.get_social_profiles(text,uuid),public.get_social_leaderboard(integer,text),sbl_private.get_social_profiles(text,uuid),sbl_private.get_social_leaderboard(integer,text) TO authenticated;


REVOKE ALL ON ALL FUNCTIONS IN SCHEMA sbl_private FROM PUBLIC,anon;

NOTIFY pgrst, 'reload schema';

COMMIT;
