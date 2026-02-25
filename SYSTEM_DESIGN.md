# Sandbox Life - Full System Design Documentation

## 🎯 Overview

Sandbox Life is a D&D-themed journaling application that gamifies self-reflection through an icon unlock progression system and social features integrated into a fantasy adventure narrative.

## 📊 Core System Architecture

### 1. Icon Unlock & Progression System

#### 🎲 D&D Leveling System

**Experience Points (XP) System:**
- Base XP per journal entry: **20 XP**
- Streak bonuses:
  - 3-day streak: +5 XP
  - 7+ day streak: +15 XP
- Achievement XP rewards: 50-5000 XP (varies by rarity)

**Level Progression Formula:**
```javascript
XP Required = 100 × (level^1.5)

Example:
- Level 1 → 2: 141 XP
- Level 5 → 6: 549 XP
- Level 10 → 11: 1,162 XP
- Level 25 → 26: 3,227 XP
- Level 50 → 51: 9,653 XP
- Level 99 → 100: 32,863 XP
```

**D&D Themed Titles (16 Milestone Levels):**
| Level | Title | Description |
|-------|-------|-------------|
| 1 | Wanderer | A new adventurer beginning their journey |
| 5 | Apprentice Scribe | Learning the ways of the written word |
| 10 | Journeyman | Gaining experience in the art of reflection |
| 15 | Chronicler | Documenting experiences with skill |
| 20 | Lorekeeper | Preserving stories and wisdom |
| 25 | Sage | A scholar of personal insight |
| 30 | Archivist | Master of organized thought |
| 35 | Mystic | Touching deeper truths through writing |
| 40 | Oracle | Seeing patterns in life's tapestry |
| 45 | Grand Scribe | A legendary writer of one's own tale |
| 50 | Master Chronicler | Elite keeper of personal history |
| 60 | Archmage of Reflection | Wielding profound self-awareness |
| 70 | Legendary Loremaster | A beacon of wisdom and insight |
| 80 | Mythic Sage | Transcendent understanding of self |
| 90 | Eternal Chronicler | Immortalized through words |
| 100 | Ascended Author | The ultimate master of self-narrative |

#### 🎨 Icon Unlock System

**Unlock Mechanisms:**
1. **Default Unlock** - Available from day 1 (3 per journal type)
2. **Level-Based** - Unlock at specific level milestones
3. **Entry-Based** - Unlock after writing X entries
4. **Streak-Based** - Unlock by maintaining daily streaks
5. **Achievement-Based** - Unlock via special accomplishments

**Rarity Tiers:**
- **Common** (Gray): Easy to unlock, starter icons
- **Uncommon** (Green): Mid-tier, requires dedication
- **Rare** (Blue): Challenging, shows commitment
- **Epic** (Purple): Elite, for dedicated chroniclers
- **Legendary** (Gold): Ultimate icons, massive achievements

**Icon Distribution by Journal Type:**

**Book Journal Icons (14 total):**
| Icon | Rarity | Unlock Type | Requirement | Theme |
|------|--------|-------------|-------------|-------|
| Shield | Common | Default | Start | Protection |
| Snake | Common | Default | Start | Growth |
| Treasure | Common | Default | Start | Discovery |
| Sword | Common | Level | Level 3 | Courage |
| Star | Uncommon | Level | Level 5 | Guidance |
| Anchor | Uncommon | Entries | 10 entries | Stability |
| Rose | Uncommon | Level | Level 8 | Beauty |
| Key | Rare | Entries | 20 entries | Potential |
| Lighthouse | Rare | Level | Level 12 | Wisdom |
| Compass | Rare | Entries | 30 entries | Direction |
| Dragon | Epic | Level | Level 20 | Power |
| Phoenix | Epic | Entries | 50 entries | Rebirth |
| Crystal | Legendary | Level | Level 30 | Clarity |
| Infinity | Legendary | Entries | 100 entries | Eternal Wisdom |

**Daily Journal Icons (13 total):**
| Icon | Rarity | Unlock Type | Requirement | Theme |
|------|--------|-------------|-------------|-------|
| Apple | Common | Default | Start | Simple Beginnings |
| Bird | Common | Default | Start | Freedom |
| Leaf | Common | Default | Start | Growth |
| Shell | Common | Level | Level 2 | Protection |
| Butterfly | Uncommon | Streak | 3 days | Transformation |
| Lotus | Uncommon | Level | Level 6 | Purity |
| Moon | Rare | Streak | 7 days | Cycles |
| Sun | Rare | Level | Level 10 | Vitality |
| Mountain | Rare | Streak | 14 days | Endurance |
| Ocean | Epic | Level | Level 15 | Depth |
| Phoenix | Epic | Streak | 30 days | Ultimate Rebirth |
| Galaxy | Legendary | Level | Level 25 | Infinite Possibility |
| Aurora | Legendary | Streak | 60 days | Natural Wonder |

**Thought of the Day Icons (7 total):**
| Icon | Rarity | Unlock Type | Requirement | Theme |
|------|--------|-------------|-------------|-------|
| Candle | Common | Default | Start | Spark of Wisdom |
| Book | Common | Default | Start | Knowledge |
| Quill | Uncommon | Entries | 5 thoughts | Writer's Tool |
| Scroll | Rare | Entries | 15 thoughts | Ancient Wisdom |
| Lantern | Rare | Level | Level 7 | Guiding Light |
| Crown | Epic | Entries | 30 thoughts | Master Reflection |
| Constellation | Legendary | Level | Level 18 | Connected Wisdom |

### 2. Achievement System

**Achievement Categories:**
1. **Journal** - Writing milestones
2. **Streak** - Consistency rewards
3. **Social** - Friend interactions
4. **Milestone** - Level achievements
5. **Special** - Unique accomplishments

**Complete Achievement List:**

**Journal Achievements (6):**
| Key | Name | Requirement | XP Reward | Rarity |
|-----|------|-------------|-----------|--------|
| first_entry | First Steps | 1 entry | 50 | Common |
| entries_10 | Dedicated Writer | 10 entries | 100 | Common |
| entries_50 | Prolific Chronicler | 50 entries | 300 | Uncommon |
| entries_100 | Century Club | 100 entries | 500 | Rare |
| entries_250 | Legendary Scribe | 250 entries | 1,000 | Epic |
| entries_500 | Ascended Author | 500 entries | 2,000 | Legendary |

**Streak Achievements (6):**
| Key | Name | Requirement | XP Reward | Rarity |
|-----|------|-------------|-----------|--------|
| streak_3 | Habit Forming | 3-day streak | 75 | Common |
| streak_7 | Week Warrior | 7-day streak | 150 | Uncommon |
| streak_14 | Fortnight Fighter | 14-day streak | 300 | Rare |
| streak_30 | Monthly Master | 30-day streak | 600 | Epic |
| streak_60 | Unbreakable | 60-day streak | 1,200 | Legendary |
| streak_100 | Eternal Flame | 100-day streak | 2,500 | Legendary |

**Social Achievements (3):**
| Key | Name | Requirement | XP Reward | Rarity |
|-----|------|-------------|-----------|--------|
| first_friend | Companion Found | 1 friend | 50 | Common |
| friends_5 | Social Circle | 5 friends | 150 | Uncommon |
| friends_10 | Popular Chronicler | 10 friends | 300 | Rare |

**Milestone Achievements (4):**
| Key | Name | Requirement | XP Reward | Rarity |
|-----|------|-------------|-----------|--------|
| level_10 | Journeyman Achievement | Reach level 10 | 200 | Uncommon |
| level_25 | Sage Achievement | Reach level 25 | 500 | Rare |
| level_50 | Master Achievement | Reach level 50 | 1,500 | Epic |
| level_100 | Ascension | Reach level 100 | 5,000 | Legendary |

### 3. Social Features (D&D Party System)

#### 🤝 Friend System ("Party Members")

**Friendship Workflow:**
1. **Search** - Find other chroniclers by display name
2. **Send Request** - Invite them to your party
3. **Accept/Decline** - They respond to your invitation
4. **Party View** - See friends with their levels & titles

**Friend Display Enhancement:**
- Shows friend's **D&D title** (e.g., "Sage", "Lorekeeper")
- Shows friend's **level** (e.g., Level 25)
- Visual distinction for high-level friends (Epic/Legendary borders)

**Block System:**
- Prevents unwanted interactions
- Hides user from search results
- Removes existing friendship

#### 💬 Messaging System ("Guild Chat")

**Conversation Types:**
1. **Global Chat Room** - "The Tavern" (all users)
2. **Direct Messages** - Private 1-on-1 conversations
3. **Group Chats** - Multi-person parties

**Message Features:**
- Real-time updates (Supabase subscriptions)
- Message editing (shows "edited" indicator)
- Soft delete (preserves message but hides content)
- Unread count badges
- Last read tracking

**D&D Themed UI Elements:**
- Global chat styled as "The Tavern"
- Direct messages as "Private Missives"
- User titles displayed next to names in chat
- Level badges on avatars

#### 🏆 Leaderboard ("Hall of Fame")

**Ranking Categories:**
1. **Level** - Highest character levels
2. **Total XP** - Most experience earned
3. **Total Entries** - Most journal entries written
4. **Longest Streak** - Best consistency

**Display Format:**
```
Rank | Avatar | Name | Title | Level | Stats
-----|--------|------|-------|-------|------
  1  | [img]  | Alex | Sage  |  25   | 3,500 XP
  2  | [img]  | Sam  | Chronicler | 15 | 1,800 XP
```

### 4. Database Schema

#### Core Tables

**user_progression**
```sql
- user_id (UUID, FK to auth.users)
- level (INTEGER, 1-100)
- xp (INTEGER, current XP)
- total_entries (INTEGER)
- streak_days (INTEGER, current streak)
- longest_streak (INTEGER)
- last_entry_date (DATE)
- title (TEXT, D&D title)
- created_at, updated_at
```

**icon_unlock_requirements**
```sql
- id (UUID)
- icon_uuid (TEXT, unique)
- icon_name (TEXT)
- journal_type (ENUM: book/daily/thought)
- unlock_type (ENUM: default/level/entries/streak/achievement)
- unlock_value (INTEGER)
- is_default (BOOLEAN)
- rarity (ENUM: common/uncommon/rare/epic/legendary)
- description (TEXT)
```

**user_unlocked_icons**
```sql
- id (UUID)
- user_id (FK to auth.users)
- icon_uuid (FK to icon_unlock_requirements)
- unlocked_at (TIMESTAMP)
- unlock_method (TEXT)
- UNIQUE(user_id, icon_uuid)
```

**achievements**
```sql
- id (UUID)
- achievement_key (TEXT, unique)
- name (TEXT)
- description (TEXT)
- category (ENUM)
- icon_url (TEXT)
- xp_reward (INTEGER)
- rarity (ENUM)
- requirement_type (ENUM)
- requirement_value (INTEGER)
```

**user_achievements**
```sql
- id (UUID)
- user_id (FK to auth.users)
- achievement_key (FK to achievements)
- earned_at (TIMESTAMP)
- progress_data (JSONB)
- UNIQUE(user_id, achievement_key)
```

**friendships**
```sql
- id (UUID)
- requester_id (FK to auth.users)
- addressee_id (FK to auth.users)
- status (ENUM: pending/accepted/blocked)
- created_at, updated_at
- UNIQUE(requester_id, addressee_id)
```

**conversations**
```sql
- id (UUID)
- type (ENUM: direct/group/global)
- name (TEXT, for groups)
- avatar_url (TEXT)
- created_by (FK to auth.users)
- last_message_at (TIMESTAMP)
- created_at, updated_at
```

**chat_messages**
```sql
- id (UUID)
- conversation_id (FK to conversations)
- sender_id (FK to auth.users)
- content (TEXT)
- message_type (ENUM: text/image/system)
- created_at, edited_at, deleted_at
```

**level_titles**
```sql
- level (INTEGER, primary key, 1-100)
- title (TEXT, D&D themed title)
- description (TEXT)
```

### 5. Automatic Triggers & Functions

#### 📝 On Journal Entry Insert

**Trigger:** `update_progression_on_entry()`

**Actions:**
1. Award base 20 XP per entry
2. Update entry count
3. Calculate and update streak
4. Award streak bonus XP (if applicable)
5. Call `award_xp()` with total XP
6. Call `check_icon_unlocks()`
7. For new users: Initialize progression & unlock defaults

**Streak Logic:**
```javascript
if (lastEntryDate === today) {
  // Same day, no update
} else if (lastEntryDate === yesterday) {
  // Consecutive day
  streak += 1
  if (streak >= 7) bonusXP = 15
  else if (streak >= 3) bonusXP = 5
} else {
  // Streak broken
  streak = 1
}
```

#### ⬆️ Level Up Processing

**Function:** `award_xp(user_id, xp_amount)`

**Returns:**
- `new_level` (INTEGER)
- `new_xp` (INTEGER) - Remaining XP after level ups
- `leveled_up` (BOOLEAN) - True if level increased
- `new_title` (TEXT) - Updated D&D title

**Process:**
1. Add XP to current total
2. Calculate XP needed for next level
3. Loop while XP >= needed AND level < 100:
   - Increment level
   - Subtract needed XP
   - Set `leveled_up = true`
4. Fetch new title from `level_titles`
5. Update `user_progression`

#### 🔓 Icon Unlock Checking

**Function:** `check_icon_unlocks(user_id)`

**Returns:**
- `newly_unlocked_icons` (TEXT[]) - Array of newly unlocked icon UUIDs

**Process:**
1. Get user's level, total_entries, streak_days
2. Find all **level-based** icons where `unlock_value <= user_level` and not yet unlocked
3. Find all **entries-based** icons where `unlock_value <= total_entries` and not yet unlocked
4. Find all **streak-based** icons where `unlock_value <= streak_days` and not yet unlocked
5. Insert into `user_unlocked_icons`
6. Return array of newly unlocked icons

#### 💬 Message Timestamp Update

**Trigger:** `update_conversation_last_message()`

**Action:**
- On new message insert, update parent conversation's `last_message_at`

### 6. Frontend Integration

#### Utility Functions

**progression.jsx:**
```javascript
// Core functions
getUserProgression(userId) // Get full progression data
awardXP(userId, amount) // Award XP (calls DB function)
calculateXPForLevel(level) // Calculate XP requirement

// Icon functions
getIconRequirements(journalType) // Get all icon definitions
getUserUnlockedIcons(userId, journalType) // Get user's unlocks
isIconUnlocked(userId, iconUuid) // Check single icon
getIconsForJournal(userId, journalType) // Icons with unlock status
checkIconUnlocks(userId) // Trigger unlock check

// Achievement functions
getAchievements(category) // Get all achievements
getUserAchievements(userId) // Get user's earned achievements
checkAchievements(userId) // Check and award new achievements

// Leaderboard functions
getLeaderboard(limit, orderBy) // Top users
getUserRank(userId) // Current user's rank

// Helper functions
getRarityColor(rarity) // CSS classes for rarity
getRarityBadgeStyle(rarity) // Badge styling
formatUnlockRequirement(icon) // Human-readable requirement
```

**social.js (Enhanced):**
```javascript
// Friend functions now include progression data:
getFriends(userId) // Returns friends with level & title
searchUsers(query) // Returns users with level & title

// All other social functions unchanged
sendFriendRequest(addresseeId)
acceptFriendRequest(friendshipId)
declineFriendRequest(friendshipId)
removeFriend(friendshipId)
blockUser(userId)
getPendingRequests(userId)
getFriendshipStatus(userId, otherUserId)

// Messaging functions
getConversations(userId)
getMessages(conversationId)
sendMessage(conversationId, content)
editMessage(messageId, newContent)
deleteMessage(messageId)
markConversationAsRead(conversationId)
getUnreadCount(userId)

// Real-time subscriptions
subscribeToConversation(conversationId, onMessage)
subscribeToFriendRequests(userId, onRequest)
subscribeToConversationList(userId, onChange)

// Online status
updateOnlineStatus(status) // 'online', 'away', 'offline'
```

#### UI Components Needed

**Progression Components:**
1. `ProgressionCard.jsx` - User's level, XP bar, title
2. `LevelUpModal.jsx` - Celebration when leveling up
3. `IconGallery.jsx` - Grid of icons (locked/unlocked)
4. `IconUnlockModal.jsx` - Celebration when unlocking icon
5. `AchievementBadge.jsx` - Single achievement display
6. `AchievementPanel.jsx` - List of all achievements
7. `LeaderboardCard.jsx` - Leaderboard display
8. `StreakCounter.jsx` - Current streak with fire emoji

**Social Components (Already Exist, Enhance):**
- `FriendCard.jsx` - Add level & title display
- `AddFriend.jsx` - Show level & title in search results
- `ConversationItem.jsx` - Add level badge to avatars
- `MessageBubble.jsx` - Add title next to sender name

### 7. User Experience Flow

#### New User Journey

**Day 1:**
1. Sign up → Auto-create progression (Level 1, Wanderer)
2. Auto-unlock 3 default icons per journal type
3. Write first entry → +20 XP, "First Steps" achievement (+50 XP)
4. Total: 70 XP (halfway to Level 2 at 141 XP)
5. See "Icons Unlocked!" notification

**Day 2-3:**
1. Write entry each day → +20 XP each
2. Day 3 entry → 3-day streak bonus (+5 XP)
3. Unlock "Habit Forming" achievement (+75 XP)
4. Likely hit Level 2 → Unlock "Shell" icon (daily journal)
5. See "Level Up!" modal with new title

**Week 1:**
1. Maintain 7-day streak → "Week Warrior" (+150 XP)
2. Unlock streak-based icons (Butterfly, Moon)
3. Reach Level 3-5 → Unlock level-based icons
4. Total: ~500+ XP, Level 5 (Apprentice Scribe)

**Month 1:**
1. 30-day streak → "Monthly Master" (+600 XP)
2. 30+ entries → Unlock entry-based icons
3. Add friends → Social achievements
4. Reach Level 10+ (Journeyman)
5. Access to rare icons

#### Veteran User Goals

**Short-term (1-3 months):**
- Reach Level 25 (Sage)
- Unlock all rare icons
- Maintain 30+ day streak
- Build friend network

**Long-term (6-12 months):**
- Reach Level 50 (Master Chronicler)
- Unlock all epic icons
- 100-day streak
- Top 10 leaderboard

**Ultimate Goals:**
- Reach Level 100 (Ascended Author)
- Unlock all legendary icons
- 500+ entries
- #1 on leaderboard

### 8. Visual Design Guidelines

#### Rarity Color Scheme

**Common (Gray):**
- Border: `border-slate-400`
- Text: `text-slate-700`
- Background: `bg-slate-50`
- Badge: Gray with subtle shadow

**Uncommon (Green):**
- Border: `border-green-500`
- Text: `text-green-700`
- Background: `bg-green-50`
- Badge: Green with soft glow

**Rare (Blue):**
- Border: `border-blue-500`
- Text: `text-blue-700`
- Background: `bg-blue-50`
- Badge: Blue with medium glow

**Epic (Purple):**
- Border: `border-purple-500`
- Text: `text-purple-700`
- Background: `bg-purple-50`
- Badge: Purple with strong glow

**Legendary (Gold):**
- Border: `border-amber-500`
- Text: `text-amber-700`
- Background: `bg-amber-50`
- Badge: Gold with intense glow + shadow
- Special: Animated shimmer effect

#### D&D Themed UI Elements

**Papyrus Background:**
- Main: `bg-bgpapyrus` (#f5f5dc)
- Light: `bg-lightpapyrus` (#fafaf0)
- Dark: `bg-darkpapyrus` (#e5e5c7)

**Medieval Accents:**
- Accent: `bg-red` (#9B1D1E) - Deep crimson
- Fonts: Merriweather (serif), Graphik (sans)
- Icon style: Hand-drawn, fantasy aesthetic
- Borders: Subtle aged/weathered effect

**Progress Bar:**
- XP bar: Gold gradient fill
- Background: Dark papyrus
- Border: Ornate, medieval style

**Level Badge:**
- Shape: Shield or banner
- Font: Bold serif
- Color: Rarity-based

### 9. Migration & Deployment

**Migration Files:**
1. `20260115000000_social_features.sql` (Already exists)
2. `20260115010000_icon_progression_system.sql` (New)

**Deployment Order:**
1. Run migrations on Supabase
2. Deploy utility functions (progression.jsx)
3. Update social.js with D&D enhancements
4. Build/test UI components
5. Deploy to production

**Verification Steps:**
1. Check all tables created
2. Verify default icons inserted
3. Test trigger on journal entry
4. Test level up function
5. Test icon unlock function
6. Test achievement checking
7. Test friend progression display

### 10. Future Enhancements

**Planned Features:**
- [ ] Daily quests (bonus XP challenges)
- [ ] Seasonal events (limited-time icons)
- [ ] Guild/team system (group challenges)
- [ ] Icon crafting (combine icons)
- [ ] Custom avatar frames (unlock with achievements)
- [ ] Trading cards (share achievements)
- [ ] Boss battles (weekly reflection challenges)
- [ ] Pet companions (loyal streak rewards)
- [ ] Realm exploration (unlock new journal areas)
- [ ] PvP: Most reflective entries (community voting)

---

## 🚀 Quick Start Guide

**For Developers:**
```bash
# 1. Run migrations
cd sandboxlifebeta
# Apply migrations via Supabase dashboard or CLI

# 2. Test progression system
import { getUserProgression } from './utils/progression'
const result = await getUserProgression(userId)

# 3. Test icon unlocks
import { getIconsForJournal } from './utils/progression'
const icons = await getIconsForJournal(userId, 'book_journal')

# 4. Test social with D&D
import { getFriends } from './utils/social'
const friends = await getFriends(userId) // Now includes level & title
```

**For Users:**
1. Write your first journal entry
2. Watch your XP bar fill up
3. Level up to unlock new icons
4. Maintain streaks for bonus rewards
5. Add friends to see their D&D titles
6. Compete on the leaderboard
7. Collect all legendary icons!

---

**System Version:** 2.0.0  
**Last Updated:** January 15, 2026  
**Status:** Ready for Implementation ✅
