-- Social Features Migration
-- Adds friendships, conversations, and messaging support

-- ============================================
-- 1. Extend user_profiles table
-- ============================================
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT FALSE;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS online_status TEXT DEFAULT 'offline' CHECK (online_status IN ('online', 'away', 'offline'));

-- ============================================
-- 2. Friendships table
-- ============================================
CREATE TABLE IF NOT EXISTS friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  addressee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(requester_id, addressee_id),
  CHECK (requester_id != addressee_id)
);

CREATE INDEX IF NOT EXISTS idx_friendships_requester ON friendships(requester_id);
CREATE INDEX IF NOT EXISTS idx_friendships_addressee ON friendships(addressee_id);
CREATE INDEX IF NOT EXISTS idx_friendships_status ON friendships(status);
CREATE INDEX IF NOT EXISTS idx_friendships_composite ON friendships(requester_id, addressee_id, status);

-- ============================================
-- 3. Conversations table
-- ============================================
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('direct', 'group', 'global')),
  name TEXT,
  avatar_url TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_conversations_type ON conversations(type);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON conversations(last_message_at DESC);

-- Create the global chat room (fixed UUID for consistency)
INSERT INTO conversations (id, type, name, created_at)
VALUES ('00000000-0000-0000-0000-000000000001', 'global', 'Global Chat Room', NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 4. Conversation participants table
-- ============================================
CREATE TABLE IF NOT EXISTS conversation_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_read_at TIMESTAMP WITH TIME ZONE,
  notifications_enabled BOOLEAN DEFAULT TRUE,
  UNIQUE(conversation_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_conv_participants_user ON conversation_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_conv_participants_conv ON conversation_participants(conversation_id);

-- ============================================
-- 5. Chat messages table
-- ============================================
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'system')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  edited_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON chat_messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON chat_messages(sender_id);

-- ============================================
-- 6. Migrate existing messages to new schema
-- ============================================
-- Copy existing messages from old 'messages' table to chat_messages
INSERT INTO chat_messages (conversation_id, sender_id, content, created_at)
SELECT 
  '00000000-0000-0000-0000-000000000001'::uuid,
  user_id,
  content,
  created_at
FROM messages
WHERE NOT EXISTS (
  SELECT 1 FROM chat_messages WHERE conversation_id = '00000000-0000-0000-0000-000000000001'
)
ON CONFLICT DO NOTHING;

-- ============================================
-- 7. Update triggers
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_friendships_updated_at ON friendships;
CREATE TRIGGER update_friendships_updated_at
  BEFORE UPDATE ON friendships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_conversations_updated_at ON conversations;
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update conversation last_message_at when new message is inserted
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_conversation_last_message_trigger ON chat_messages;
CREATE TRIGGER update_conversation_last_message_trigger
  AFTER INSERT ON chat_messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_last_message();

-- ============================================
-- 8. Row Level Security (RLS)
-- ============================================

-- Enable RLS on all new tables
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Friendships policies
DROP POLICY IF EXISTS "Users can view own friendships" ON friendships;
CREATE POLICY "Users can view own friendships" ON friendships
  FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

DROP POLICY IF EXISTS "Users can send friend requests" ON friendships;
CREATE POLICY "Users can send friend requests" ON friendships
  FOR INSERT WITH CHECK (auth.uid() = requester_id);

DROP POLICY IF EXISTS "Users can update own friendships" ON friendships;
CREATE POLICY "Users can update own friendships" ON friendships
  FOR UPDATE USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

DROP POLICY IF EXISTS "Users can delete own friendships" ON friendships;
CREATE POLICY "Users can delete own friendships" ON friendships
  FOR DELETE USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

-- Conversations policies
DROP POLICY IF EXISTS "Users can view conversations" ON conversations;
CREATE POLICY "Users can view conversations" ON conversations
  FOR SELECT USING (
    type = 'global' OR
    id IN (SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can create conversations" ON conversations;
CREATE POLICY "Users can create conversations" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = created_by OR type = 'global');

-- Conversation participants policies
DROP POLICY IF EXISTS "Users can view conversation participants" ON conversation_participants;
CREATE POLICY "Users can view conversation participants" ON conversation_participants
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM conversations WHERE type = 'global'
      UNION
      SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can join conversations" ON conversation_participants;
CREATE POLICY "Users can join conversations" ON conversation_participants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can leave conversations" ON conversation_participants;
CREATE POLICY "Users can leave conversations" ON conversation_participants
  FOR DELETE USING (auth.uid() = user_id);

-- Chat messages policies
DROP POLICY IF EXISTS "Users can view messages" ON chat_messages;
CREATE POLICY "Users can view messages" ON chat_messages
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM conversations WHERE type = 'global'
      UNION
      SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can send messages" ON chat_messages;
CREATE POLICY "Users can send messages" ON chat_messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    conversation_id IN (
      SELECT id FROM conversations WHERE type = 'global'
      UNION
      SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can edit own messages" ON chat_messages;
CREATE POLICY "Users can edit own messages" ON chat_messages
  FOR UPDATE USING (auth.uid() = sender_id);

DROP POLICY IF EXISTS "Users can delete own messages" ON chat_messages;
CREATE POLICY "Users can delete own messages" ON chat_messages
  FOR DELETE USING (auth.uid() = sender_id);

-- ============================================
-- 9. Helper functions for friends
-- ============================================

-- Get friends for a user
CREATE OR REPLACE FUNCTION get_friends(p_user_id UUID)
RETURNS TABLE (
  friendship_id UUID,
  friend_id UUID,
  friend_email TEXT,
  friend_display_name TEXT,
  friend_avatar_url TEXT,
  friend_online_status TEXT,
  friendship_created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get pending friend requests for a user
CREATE OR REPLACE FUNCTION get_pending_requests(p_user_id UUID)
RETURNS TABLE (
  friendship_id UUID,
  requester_id UUID,
  requester_email TEXT,
  requester_display_name TEXT,
  requester_avatar_url TEXT,
  requested_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.id AS friendship_id,
    f.requester_id,
    u.email AS requester_email,
    up.display_name AS requester_display_name,
    up.avatar_url AS requester_avatar_url,
    f.created_at AS requested_at
  FROM friendships f
  JOIN auth.users u ON u.id = f.requester_id
  LEFT JOIN user_profiles up ON up.user_id = f.requester_id
  WHERE f.addressee_id = p_user_id
    AND f.status = 'pending';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get or create direct conversation between two users
CREATE OR REPLACE FUNCTION get_or_create_direct_conversation(p_user1_id UUID, p_user2_id UUID)
RETURNS UUID AS $$
DECLARE
  v_conversation_id UUID;
BEGIN
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
$$ LANGUAGE plpgsql SECURITY DEFINER;
