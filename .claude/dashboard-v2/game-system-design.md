# Sandbox Life Chronicles - Complete Game System Design

## Overview
This document outlines a cohesive gamification system that integrates all existing Sandbox Life features (journaling, icons, chat, friends, collections) into an immersive D&D-themed experience.

## Core Progression System

### 1. Experience & Leveling
```
XP Sources:
- Complete a journal entry: +50 XP
- Daily login: +10 XP (Mana bonus)
- 7-day streak: +100 XP bonus
- First entry with new icon: +25 XP
- Help a friend (reply to shared entry): +15 XP
- Complete a "Quest" (themed challenge): +75 XP
```

**Level Thresholds:**
| Level | Title | XP Required | Unlock |
|-------|-------|-------------|--------|
| 1 | Novice Scribe | 0 | Set A icons (16 daily, 16 book) |
| 5 | Apprentice | 500 | Chat access, friend requests |
| 10 | Journeyman | 1500 | Set B icons unlock |
| 15 | Chronicler | 3000 | Custom avatar frames |
| 20 | Sage | 5000 | Create group conversations |
| 25 | Loremaster | 8000 | Premium icon effects |
| 30 | Archmage | 12000 | All features unlocked |

### 2. Icon Unlock System

**Icon Packs (Collections):**
```javascript
const ICON_PACKS = {
  setA: {
    name: "Mariner's Codex",
    description: "The foundational icons of the sea-faring tradition",
    unlockLevel: 1,
    icons: [...book_journal_questions, ...daily_journal_questions],
    theme: "nautical"
  },
  setB: {
    name: "Bestiary of Wonders", 
    description: "Mythical creatures and objects of power",
    unlockLevel: 10,
    icons: [...iconsv2_questions],
    theme: "fantasy"
  },
  setC: {
    name: "Celestial Archives",
    description: "Coming soon - Unlock at Level 20",
    unlockLevel: 20,
    icons: [], // Future expansion
    theme: "cosmic",
    isLocked: true
  }
};
```

**Individual Icon Mastery:**
- Each icon has mastery levels (1-5 stars)
- Use an icon 5 times → 1 star
- Use an icon 25 times → 5 stars (Mastered)
- Mastered icons get special visual effects (glow, animation)

### 3. Social Integration ("The Tavern")

**Guild System (Friend Groups):**
```
Tavern Features:
├── Global Tavern (public chat - existing)
├── Private Tables (DM conversations - existing)
├── Guilds (group conversations - existing)
└── Quest Board (shared challenges - NEW)
```

**D&D Themed Social Actions:**
| Classic Feature | D&D Name | Location |
|-----------------|----------|----------|
| Add Friend | Send Ally Request | Tavern |
| Accept Friend | Accept into Party | Tavern |
| Send Message | Send Raven | Inbox → "Rookery" |
| Group Chat | Guild Hall | Conversations |
| View Profile | Inspect Adventurer | Player Cards |

### 4. Quest System (Challenges)

**Daily Quests:**
```javascript
const DAILY_QUESTS = [
  { id: 'morning_reflection', name: 'Dawn Meditation', task: 'Write a Thought of the Day before noon', xp: 30 },
  { id: 'deep_dive', name: 'Deep Dive', task: 'Write 200+ words in one entry', xp: 40 },
  { id: 'icon_explorer', name: 'Icon Explorer', task: 'Use an icon you haven\'t used in 7 days', xp: 25 },
];
```

**Weekly Quests:**
```javascript
const WEEKLY_QUESTS = [
  { id: 'streak_keeper', name: 'Streak Keeper', task: 'Journal 5 days this week', xp: 100 },
  { id: 'social_butterfly', name: 'Social Butterfly', task: 'Send 3 messages to friends', xp: 50 },
  { id: 'quadrant_balance', name: 'Quadrant Balance', task: 'Write in all 4 quadrants', xp: 75 },
];
```

## UI Components Needed

### 1. GameHUD (Header Enhancement)
```jsx
<GameHUD>
  <XPBar level={15} currentXP={2350} nextLevelXP={3000} />
  <ManaCounter value={120} streak={7} />
  <QuestTracker activeQuests={3} />
  <SocialBadge unreadMessages={2} pendingRequests={1} />
</GameHUD>
```

### 2. TavernPanel (Social Hub)
```jsx
<TavernPanel>
  <TabNavigation tabs={['Party', 'Rookery', 'Guild Hall', 'Quest Board']} />
  <FriendsList /> {/* Existing */}
  <ConversationList /> {/* Existing */}
  <QuestList /> {/* New */}
</TavernPanel>
```

### 3. IconCollectionModal
```jsx
<IconCollectionModal>
  <PackSelector packs={['setA', 'setB', 'setC']} />
  <IconGrid 
    icons={currentPackIcons}
    masteryLevels={userMasteryData}
    lockedIcons={lockedByLevel}
  />
  <IconDetail selectedIcon={icon} stats={usageStats} />
</IconCollectionModal>
```

### 4. PlayerCard (Profile Enhancement)
```jsx
<PlayerCard userId={id}>
  <AvatarWithFrame avatar={url} frame={unlockedFrame} level={15} />
  <PlayerTitle title="Chronicler" />
  <StatBar label="Entries" value={247} />
  <StatBar label="Streak" value={12} icon="🔥" />
  <MasteredIcons icons={top5MasteredIcons} />
  <ActionButtons onMessage={} onViewProfile={} />
</PlayerCard>
```

## Database Schema Additions

```sql
-- User progression
CREATE TABLE user_progression (
  user_id UUID PRIMARY KEY REFERENCES auth.users,
  total_xp INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_entry_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Icon mastery tracking
CREATE TABLE icon_mastery (
  user_id UUID REFERENCES auth.users,
  icon_uuid VARCHAR(50),
  use_count INTEGER DEFAULT 0,
  mastery_level INTEGER DEFAULT 0,
  first_used_at TIMESTAMPTZ,
  last_used_at TIMESTAMPTZ,
  PRIMARY KEY (user_id, icon_uuid)
);

-- Quest progress
CREATE TABLE quest_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users,
  quest_id VARCHAR(50),
  quest_type VARCHAR(20), -- 'daily', 'weekly', 'special'
  progress INTEGER DEFAULT 0,
  target INTEGER,
  completed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unlocked content
CREATE TABLE user_unlocks (
  user_id UUID REFERENCES auth.users,
  unlock_type VARCHAR(30), -- 'icon_pack', 'avatar_frame', 'feature'
  unlock_id VARCHAR(50),
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, unlock_type, unlock_id)
);
```

## Navigation Structure

```
Dashboard V2 (The Chronicles)
├── Board View (QuadrantsBoard) - Journal entries as cards
├── Map View (TimelineMap) - Journey timeline
├── Tavern (Social Hub) - NEW
│   ├── Party (Friends list)
│   ├── Rookery (Messages/Inbox)
│   ├── Guild Hall (Group chats)
│   └── Quest Board (Challenges)
├── Library (Collections) - NEW
│   ├── My Icons (Unlocked)
│   ├── Set A - Mariner's Codex
│   ├── Set B - Bestiary (if unlocked)
│   └── Coming Soon packs
└── Profile (Player Card)
    ├── Stats & Achievements
    ├── Mastered Icons
    └── Settings
```

## Implementation Priority

### Phase 1: Foundation (Current Sprint)
- [x] Fix TimelineMap to use actual icons
- [ ] Add XP/Level display to GameHUD
- [ ] Create progression utility functions
- [ ] Update Card3D to show mastery indicators

### Phase 2: Icon System
- [ ] Create IconCollectionModal component
- [ ] Add mastery tracking to journal submission
- [ ] Show locked/unlocked state in icon selection
- [ ] Add mastery badges to cards

### Phase 3: Social Integration
- [ ] Restyle InboxPage as "Rookery"
- [ ] Restyle FriendsPage as "Party"
- [ ] Add TavernPanel to Dashboard V2
- [ ] Create PlayerCard component

### Phase 4: Quest System
- [ ] Create quest_progress table
- [ ] Build QuestTracker component
- [ ] Implement daily/weekly quest rotation
- [ ] Add quest completion celebrations

## Revenue/Monetization Hooks

1. **Icon Packs** - Premium themed packs (purchase to unlock early)
2. **Avatar Frames** - Cosmetic frames for profile
3. **XP Boosters** - 2x XP for a week
4. **Guild Features** - Premium guild customization
5. **Early Access** - Preview upcoming icon sets

---

*This design maintains the existing functionality while adding progressive unlocks, social features, and gamification to increase engagement and provide monetization opportunities.*
