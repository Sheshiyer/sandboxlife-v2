# Social Features Plan: Chat, Friends & Messaging

## Overview

Transform the current global chat room into a full social experience with friends, 1:1 messaging, and group conversations while preserving the existing chat room functionality.

---

## Phase 1: Database Schema Design

### New Tables Required

#### 1. `friendships` - Track friend relationships
```sql
CREATE TABLE friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  addressee_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(requester_id, addressee_id)
);

-- Indexes
CREATE INDEX idx_friendships_requester ON friendships(requester_id);
CREATE INDEX idx_friendships_addressee ON friendships(addressee_id);
CREATE INDEX idx_friendships_status ON friendships(status);
```

#### 2. `conversations` - Track chat threads (1:1, groups, global)
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('direct', 'group', 'global')),
  name TEXT, -- For group conversations
  avatar_url TEXT, -- For group avatar
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message_at TIMESTAMP WITH TIME ZONE
);

-- Create the global chat room
INSERT INTO conversations (id, type, name) 
VALUES ('00000000-0000-0000-0000-000000000001', 'global', 'Global Chat Room');
```

#### 3. `conversation_participants` - Track who's in each conversation
```sql
CREATE TABLE conversation_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_read_at TIMESTAMP WITH TIME ZONE,
  notifications_enabled BOOLEAN DEFAULT TRUE,
  UNIQUE(conversation_id, user_id)
);

CREATE INDEX idx_conv_participants_user ON conversation_participants(user_id);
CREATE INDEX idx_conv_participants_conv ON conversation_participants(conversation_id);
```

#### 4. `messages` - Updated to support conversations
```sql
-- Update existing messages table or create new one
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'system')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  edited_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_messages_conversation ON chat_messages(conversation_id, created_at DESC);
CREATE INDEX idx_messages_sender ON chat_messages(sender_id);
```

#### 5. `user_profiles` - Extend for social features
```sql
-- Add columns to existing user_profiles table
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT FALSE;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS online_status TEXT DEFAULT 'offline';
```

---

## Phase 2: Row Level Security (RLS) Policies

```sql
-- Friendships: Users can see their own friendships
CREATE POLICY "Users can view own friendships" ON friendships
  FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

CREATE POLICY "Users can send friend requests" ON friendships
  FOR INSERT WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update own friendships" ON friendships
  FOR UPDATE USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

-- Conversations: Users can see conversations they're part of
CREATE POLICY "Users can view own conversations" ON conversations
  FOR SELECT USING (
    type = 'global' OR
    id IN (SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid())
  );

-- Messages: Users can see messages in their conversations
CREATE POLICY "Users can view messages in conversations" ON chat_messages
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM conversations WHERE type = 'global'
      UNION
      SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages to conversations" ON chat_messages
  FOR INSERT WITH CHECK (
    conversation_id IN (
      SELECT id FROM conversations WHERE type = 'global'
      UNION
      SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid()
    )
  );
```

---

## Phase 3: UI/UX Architecture

### Route Structure
```
/inbox/:userId                    → Inbox (conversation list)
/inbox/:userId/global             → Global Chat Room (existing behavior)
/inbox/:userId/chat/:conversationId → 1:1 or Group conversation
/friends/:userId                  → Friends list
/friends/:userId/requests         → Friend requests
/profile/:userId                  → Own profile (editable)
/user/:profileId                  → View other user's profile (read-only)
```

### Component Architecture

```
src/
├── pages/
│   ├── InboxPage.jsx             # Main inbox with conversation list
│   ├── ConversationPage.jsx      # Individual conversation view
│   ├── FriendsPage.jsx           # Friends list & management
│   └── ProfilePage.jsx           # Refactored profile page
│
├── components/
│   ├── chat/
│   │   ├── ConversationList.jsx  # List of all conversations
│   │   ├── ConversationItem.jsx  # Single conversation preview
│   │   ├── MessageList.jsx       # Messages in a conversation
│   │   ├── MessageBubble.jsx     # Individual message
│   │   ├── MessageInput.jsx      # Compose message
│   │   └── ChatHeader.jsx        # Conversation header with info
│   │
│   ├── friends/
│   │   ├── FriendsList.jsx       # List of friends
│   │   ├── FriendCard.jsx        # Friend card with actions
│   │   ├── FriendRequests.jsx    # Pending requests
│   │   ├── AddFriend.jsx         # Search & add friends
│   │   └── UserSearch.jsx        # Search users component
│   │
│   └── profile/
│       ├── ProfileHeader.jsx     # Avatar, name, status
│       ├── ProfileStats.jsx      # Entry counts, friends count
│       └── ProfileActions.jsx    # Edit, Add Friend buttons
```

---

## Phase 4: Implementation Roadmap

### Sprint 1: Database & Foundation (Week 1)
- [ ] Create SQL migration files for all new tables
- [ ] Set up RLS policies
- [ ] Create Supabase functions for friend management
- [ ] Migrate existing messages to new schema

### Sprint 2: Friends System (Week 2)
- [ ] Create FriendsPage with friend list
- [ ] Implement user search functionality
- [ ] Add friend request sending/accepting/declining
- [ ] Create friend request notifications badge

### Sprint 3: Messaging System (Week 3)
- [ ] Create InboxPage with conversation list
- [ ] Refactor ChatRoomPage → ConversationPage
- [ ] Implement 1:1 conversation creation
- [ ] Set up real-time message subscriptions
- [ ] Add unread message counts

### Sprint 4: Profile & Polish (Week 4)
- [ ] Refactor ProfilePage (remove RSuite, use Tailwind)
- [ ] Add public profile view for other users
- [ ] Implement online status indicators
- [ ] Add notification system for friend requests
- [ ] Mobile responsive improvements

---

## Phase 5: API Functions (supabase.jsx)

```javascript
// Friend Management
export async function sendFriendRequest(addresseeId)
export async function acceptFriendRequest(friendshipId)
export async function declineFriendRequest(friendshipId)
export async function removeFriend(friendshipId)
export async function blockUser(userId)
export async function getFriends(userId)
export async function getPendingRequests(userId)
export async function searchUsers(query)

// Conversation Management
export async function createDirectConversation(participantId)
export async function createGroupConversation(name, participantIds)
export async function getConversations(userId)
export async function getConversationMessages(conversationId, limit, offset)

// Messaging
export async function sendMessage(conversationId, content)
export async function markAsRead(conversationId)
export async function deleteMessage(messageId)
export async function editMessage(messageId, newContent)

// Real-time Subscriptions
export function subscribeToConversation(conversationId, callback)
export function subscribeToFriendRequests(userId, callback)
```

---

## Phase 6: UI Mockups

### Inbox Page Layout
```
┌─────────────────────────────────────┐
│ TopBar (with notification badge)    │
├─────────────────────────────────────┤
│ Breadcrumb: Dashboard > Inbox       │
├─────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────────┐ │
│ │ Sidebar     │ │ Conversation    │ │
│ │             │ │ List            │ │
│ │ • Global    │ │                 │ │
│ │ • Friends   │ │ [Avatar] Name   │ │
│ │ • Groups    │ │   Last message  │ │
│ │             │ │   2m ago        │ │
│ │ + New Chat  │ │                 │ │
│ │             │ │ [Avatar] Name   │ │
│ │             │ │   Last message  │ │
│ └─────────────┘ └─────────────────┘ │
└─────────────────────────────────────┘
```

### Conversation View
```
┌─────────────────────────────────────┐
│ TopBar                              │
├─────────────────────────────────────┤
│ ← Back  [Avatar] User Name  •Online │
├─────────────────────────────────────┤
│                                     │
│      [Their message bubble]         │
│                          10:30 AM   │
│                                     │
│           [My message bubble]       │
│ 10:32 AM                            │
│                                     │
│      [Their message bubble]         │
│                          10:35 AM   │
│                                     │
├─────────────────────────────────────┤
│ [    Type a message...    ] [Send]  │
└─────────────────────────────────────┘
```

### Friends Page
```
┌─────────────────────────────────────┐
│ TopBar                              │
├─────────────────────────────────────┤
│ Breadcrumb: Dashboard > Friends     │
├─────────────────────────────────────┤
│ [🔍 Search users...]    [Add Friend]│
├─────────────────────────────────────┤
│ Pending Requests (2)            ▼   │
│ ┌─────────────────────────────────┐ │
│ │ [Avatar] John Doe               │ │
│ │ [Accept] [Decline]              │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ My Friends (15)                     │
│ ┌───────┐ ┌───────┐ ┌───────┐       │
│ │Avatar │ │Avatar │ │Avatar │       │
│ │ Name  │ │ Name  │ │ Name  │       │
│ │Online │ │Offline│ │Online │       │
│ │[Chat] │ │[Chat] │ │[Chat] │       │
│ └───────┘ └───────┘ └───────┘       │
└─────────────────────────────────────┘
```

---

## Phase 7: Profile Page Refactor

### Current Issues
- Uses RSuite components (Panel, Form, Grid, etc.)
- Heavy UI library dependency
- Inconsistent with rest of app styling
- Missing social features (friend count, public profile)

### New Profile Page Structure
```jsx
// Sections to include:
1. Profile Header (avatar, display name, online status)
2. Stats Bar (journal entries, friends, member since)
3. About Section (bio, interests, hobbies)
4. Contact Info (email, website - visibility controlled)
5. Activity Feed (recent journal entries - if public)
6. Action Buttons (Edit Profile, Add Friend, Message)
```

### Design Tokens
- Use existing Tailwind classes (bg-bgpapyrus, text-slate-*, etc.)
- Consistent with Settings page styling
- Mobile-first responsive design

---

## Phase 8: Technical Considerations

### Real-time Subscriptions
```javascript
// Subscribe to new messages
const subscription = supabase
  .channel(`conversation:${conversationId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'chat_messages',
    filter: `conversation_id=eq.${conversationId}`
  }, handleNewMessage)
  .subscribe();
```

### Notification System
- Use browser Notification API for desktop
- Badge counts in TopBar
- Unread message indicators

### Performance
- Paginate message history (load 50 at a time)
- Cache conversation list
- Debounce user search
- Lazy load avatars

---

## Phase 9: Migration Strategy

### Step 1: Database Migration
1. Create new tables alongside existing `messages` table
2. Migrate existing messages to `chat_messages` with global conversation ID
3. Keep old table temporarily for rollback

### Step 2: Feature Flags
```javascript
const FEATURES = {
  FRIENDS_ENABLED: true,
  DIRECT_MESSAGES_ENABLED: true,
  GROUP_CHAT_ENABLED: false, // Phase 2
};
```

### Step 3: Gradual Rollout
1. Deploy database changes
2. Enable friends feature
3. Enable 1:1 messaging
4. Deprecate old chat route
5. Add group chat (future)

---

## Files to Create/Modify

### New Files
- `supabase/migrations/20260115_social_features.sql`
- `src/pages/InboxPage.jsx`
- `src/pages/FriendsPage.jsx`
- `src/pages/ConversationPage.jsx`
- `src/components/chat/ConversationList.jsx`
- `src/components/chat/MessageBubble.jsx`
- `src/components/chat/MessageInput.jsx`
- `src/components/friends/FriendsList.jsx`
- `src/components/friends/AddFriend.jsx`
- `src/components/friends/FriendRequests.jsx`
- `src/utils/social.js` (social API functions)

### Modified Files
- `src/App.jsx` (new routes)
- `src/pages/ProfilePage.jsx` (refactor)
- `src/components/Menu.jsx` (add Friends, Inbox links)
- `src/components/TopBar.jsx` (notification badge)
- `src/utils/supabase.jsx` (new functions)

---

## Estimated Timeline

| Phase | Description | Duration |
|-------|-------------|----------|
| 1 | Database Schema & Migrations | 2-3 days |
| 2 | Friends System | 3-4 days |
| 3 | Messaging System | 4-5 days |
| 4 | Profile Refactor | 2-3 days |
| 5 | Polish & Testing | 2-3 days |
| **Total** | | **~2-3 weeks** |

---

## Success Metrics

- [ ] Users can add friends by searching
- [ ] Users can accept/decline friend requests
- [ ] Users can start 1:1 conversations with friends
- [ ] Global chat room preserved and functional
- [ ] Real-time message delivery < 500ms
- [ ] Profile page renders without RSuite dependency
- [ ] Mobile responsive across all new pages
- [ ] Unread message counts accurate
- [ ] No regression in existing features
