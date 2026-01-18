# Dashboard V2 - Complete Adventure Mode Guide

## The D&D-Themed Journaling Experience

**Document Version:** 1.0  
**Last Updated:** January 18, 2026  
**Target Audience:** Developers, QA, Product Team

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Dashboard V2 Main Page](#dashboard-v2-main-page)
4. [Quest System Deep Dive](#quest-system-deep-dive)
5. [Inventory System Deep Dive](#inventory-system-deep-dive)
6. [Progression Engine](#progression-engine)
7. [Database Schema](#database-schema)
8. [Backend Automation](#backend-automation)
9. [Frontend Components](#frontend-components)
10. [API Reference](#api-reference)
11. [Testing Guide](#testing-guide)
12. [Future Roadmap](#future-roadmap)

---

## Overview

Dashboard V2, internally known as "Adventure Mode," transforms the traditional journaling experience into a gamified adventure inspired by Dungeons & Dragons and classic RPGs. Users earn experience points (XP) for writing journal entries, level up through 100 character levels, unlock collectible icons, complete daily and weekly quests, and earn achievements for their dedication.

### Design Philosophy

The Adventure Mode system is built on three core principles:

1. **Intrinsic Motivation Enhancement** - Gamification elements amplify the inherent value of journaling without replacing it. Users still write meaningful reflections; they just get rewarded for consistency.

2. **Progressive Disclosure** - New features unlock as users advance, preventing overwhelm for newcomers while providing depth for veterans. A Level 1 user sees basic features; a Level 50 user has access to rare icons and challenging achievements.

3. **Social Connection** - The D&D theming creates a shared language among users. "I'm a Level 25 Sage" means something to other chroniclers. Leaderboards and friend systems foster healthy competition and community.

### Key Features Summary

| Feature | Description | Status |
|---------|-------------|--------|
| XP & Leveling | 100 levels with exponential XP curve | ✅ Complete |
| D&D Titles | 16 themed titles from Wanderer to Ascended Author | ✅ Complete |
| Quest Board | 3 daily + 3 weekly quests with XP rewards | ✅ Complete |
| Inventory | Browse all icons, achievements, titles | ✅ Complete |
| Icon Unlocks | 34 icons across 5 rarity tiers | ✅ Complete |
| Achievements | 19 achievements across 4 categories | ✅ Complete |
| Auto-Progression | Database triggers handle all updates | ✅ Complete |
| Journey Map | Enhanced timeline visualization | 🚧 Coming Soon |

---

## Architecture

### System Flow

```
User Writes Entry
        ↓
[user_journal_entries INSERT]
        ↓
    ┌───┴───────────────────────────────────┐
    ↓                   ↓                   ↓
trigger_update     trigger_check       trigger_check
_progression       _achievements       _icon_unlocks
    ↓                   ↓                   ↓
award_xp()         Award earned        Unlock qualified
+ Update streak    achievements        icons
    ↓                   ↓                   ↓
Level up if        Grant bonus XP      Record in
threshold met      for achievements    user_unlocked_icons
    ↓
Update title
if level changed
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React 18 + Vite | UI rendering |
| Styling | Tailwind CSS | Utility-first CSS |
| Animation | Framer Motion | Smooth transitions |
| State | React Context | Global state management |
| Backend | Supabase | PostgreSQL + Auth + Realtime |
| Scheduling | pg_cron | Quest reset automation |

### File Structure

```
src/
├── pages/
│   ├── DashboardV2.jsx      # Main adventure dashboard
│   ├── QuestsPage.jsx       # Quest board
│   └── InventoryPage.jsx    # Collectibles browser
├── components/
│   └── game/
│       ├── GameLayout.jsx    # Navigation header
│       ├── QuestCard.jsx     # Quest display
│       ├── InventoryItem.jsx # Item card
│       └── ItemDetailModal.jsx # Item details
├── utils/
│   ├── progression.jsx      # XP/level utilities
│   ├── quests.js           # Quest logic
│   └── inventory.js        # Inventory queries
└── context/
    └── GameModeContext.jsx  # Adventure mode toggle
```

---

## Dashboard V2 Main Page

### Route
`/dashboard-v2/:userId`

### Visual Design

The Dashboard V2 follows a dark fantasy aesthetic:
- **Background**: Deep black (#0a0a0a) with subtle texture overlay
- **Accent Color**: Gold/Yellow (#fbbf24) for highlights and XP
- **Typography**: Serif fonts for headers (fantasy feel), sans-serif for body
- **Cards**: Semi-transparent with blur backdrop effect

### Main Sections

#### 1. Header Bar
- **Left**: Menu toggle button
- **Center**: Game navigation (QUESTS, INVENTORY, MAP)
- **Right**: User level badge

#### 2. Hero Section
- Large character level display
- Current D&D title with decorative styling
- XP progress bar toward next level
- Streak counter with flame icon

#### 3. Quick Actions
- Write new entry buttons (Book, Daily, Thought)
- Each styled as fantasy-themed cards

#### 4. Recent Activity
- Last 5 journal entries
- Icon previews and entry timestamps
- Quick navigation to full entry

#### 5. Achievement Showcase
- Latest unlocked achievements
- Progress toward next achievement
- Link to full achievement list

### Game Menu Navigation

The header contains three navigation items:

| Menu Item | Route | Status | Description |
|-----------|-------|--------|-------------|
| ⚔️ QUESTS | `/quests/:userId` | Active | Daily and weekly challenges |
| 🎒 INVENTORY | `/inventory/:userId` | Active | All collectible items |
| 🗺️ MAP | `/map/:userId` | Disabled | Journey timeline (Coming Soon) |

Active items navigate to their respective pages. Disabled items show a "Coming Soon" tooltip.

---

## Quest System Deep Dive

### Design Goals

The quest system provides:
1. **Short-term Goals** - Daily quests give immediate targets
2. **Medium-term Goals** - Weekly quests require sustained effort
3. **Bonus XP** - Rewards beyond base entry XP
4. **Variety Encouragement** - Quests promote using different journal types and icons

### Quest Definitions

#### Daily Quests (Reset at Midnight UTC)

**📜 Daily Chronicle**
- Requirement: Write 1 journal entry today
- XP Reward: 25
- Calculation: Count entries with `created_at >= today`
- Difficulty: Easy - ensures daily engagement

**🎭 Versatile Scribe**
- Requirement: Use 2 different journal types today
- XP Reward: 50
- Calculation: Count distinct `journal_type` values from today's entries
- Difficulty: Medium - encourages variety

**🔥 Flame Keeper**
- Requirement: Maintain journaling streak
- XP Reward: 15
- Calculation: Check if user has written today (based on `last_entry_date`)
- Difficulty: Easy - rewards consistency

#### Weekly Quests (Reset Monday Midnight UTC)

**📚 Weekly Chronicler**
- Requirement: Write 5 entries this week
- XP Reward: 100
- Calculation: Count entries with `created_at >= start_of_week`
- Difficulty: Medium - about one entry per weekday

**🗺️ Icon Explorer**
- Requirement: Use 3 different icons this week
- XP Reward: 75
- Calculation: Count distinct `journal_id` values from this week's entries
- Difficulty: Medium - encourages icon variety

**✍️ Wordsmith**
- Requirement: Write 500 words total this week
- XP Reward: 150
- Calculation: Sum word count of all entries this week
- Difficulty: Hard - requires substantial writing

### Quest Progress Calculation

Progress is calculated in real-time by querying `user_journal_entries`:

```javascript
// From src/utils/quests.js

async function calculateQuestProgress(userId) {
  const startOfDay = getStartOfDay();   // Midnight UTC today
  const startOfWeek = getStartOfWeek(); // Monday midnight UTC
  
  // Fetch entries for both periods
  const todayEntries = await fetchEntries(userId, startOfDay);
  const weekEntries = await fetchEntries(userId, startOfWeek);
  
  // Calculate each quest type
  for (quest of quests) {
    switch (quest.requirement_type) {
      case 'entries_count':
        progress = entries.length;
        break;
      case 'journal_types':
        progress = new Set(entries.map(e => e.journal_type)).size;
        break;
      case 'icons_used':
        progress = new Set(entries.map(e => e.journal_id)).size;
        break;
      case 'word_count':
        progress = entries.reduce((sum, e) => 
          sum + countWords(e.journal_entry), 0);
        break;
    }
  }
}
```

### Claiming Rewards

When a user claims a completed quest:

1. **Verify Completion** - Recalculate progress to confirm quest is complete
2. **Check Not Claimed** - Ensure quest hasn't been claimed this period
3. **Record Claim** - Insert/update `user_quest_progress` record
4. **Award XP** - Call `award_xp()` database function
5. **Handle Level-Up** - If XP causes level-up, return new level/title
6. **Show Feedback** - Display toast notification with XP gained

### Quest Reset Automation

Two pg_cron jobs handle automatic resets:

```sql
-- Daily reset at midnight UTC
SELECT cron.schedule('reset-daily-quests', '0 0 * * *', 
  'SELECT reset_daily_quests();');

-- Weekly reset on Monday at midnight UTC  
SELECT cron.schedule('reset-weekly-quests', '0 0 * * 1',
  'SELECT reset_weekly_quests();');
```

The reset functions clear claimed records older than the current period:

```sql
CREATE FUNCTION reset_daily_quests() RETURNS void AS $$
BEGIN
  DELETE FROM user_quest_progress 
  WHERE quest_key IN (
    SELECT quest_key FROM quest_definitions WHERE quest_type = 'daily'
  ) AND reset_at < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;
```

---

## Inventory System Deep Dive

### Design Goals

The inventory system provides:
1. **Collection Overview** - See all possible items at a glance
2. **Progress Tracking** - Know what's unlocked vs locked
3. **Goal Setting** - See requirements for locked items
4. **Rarity Appreciation** - Visual distinction for rare items

### Inventory Categories

#### Icons (34 total)

Icons are the visual symbols users select when writing journal entries. They're distributed across journal types:

| Journal Type | Total Icons | Default | Unlockable |
|--------------|-------------|---------|------------|
| Book | 14 | 3 | 11 |
| Daily | 13 | 3 | 10 |
| Thought | 7 | 2 | 5 |

**Unlock Methods:**
- **Default**: Available immediately (8 total across all types)
- **Level-based**: Unlock at specific character levels
- **Entry-based**: Unlock after writing X entries of that journal type
- **Streak-based**: Unlock by maintaining X-day streaks

#### Achievements (19 total)

Achievements are one-time awards for reaching milestones:

| Category | Count | Focus |
|----------|-------|-------|
| Journal | 6 | Total entries written |
| Streak | 6 | Consecutive day streaks |
| Social | 3 | Friend connections |
| Milestone | 4 | Level thresholds |

Each achievement awards bonus XP when earned, from 50 XP (Common) to 5,000 XP (Legendary).

#### Titles (16 total)

Titles are D&D-themed ranks that display next to the user's name:

| Level Range | Example Titles |
|-------------|----------------|
| 1-14 | Wanderer, Apprentice Scribe, Journeyman |
| 15-29 | Chronicler, Lorekeeper, Sage |
| 30-49 | Archivist, Mystic, Oracle, Grand Scribe |
| 50-79 | Master Chronicler, Archmage of Reflection |
| 80-99 | Legendary Loremaster, Mythic Sage, Eternal Chronicler |
| 100 | Ascended Author |

### Rarity System

All items have a rarity tier affecting visual presentation:

| Rarity | Color | Border | Glow Effect |
|--------|-------|--------|-------------|
| Common | Gray (#6b7280) | Subtle | None |
| Uncommon | Green (#22c55e) | Solid | Soft green |
| Rare | Blue (#3b82f6) | Solid | Medium blue |
| Epic | Purple (#a855f7) | Thick | Strong purple |
| Legendary | Gold (#eab308) | Animated | Pulsing gold |

### Inventory Page Layout

```
┌─────────────────────────────────────────────────────────┐
│  ← Back to HQ              🎒 INVENTORY                 │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────┐   │
│  │ Collection Progress: 28/69 items (40%)           │   │
│  │ ████████████░░░░░░░░░░░░░░░░░░░░░                │   │
│  └──────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────┤
│  [Icons]  [Achievements]  [Titles]    ☑ Show Unlocked   │
├─────────────────────────────────────────────────────────┤
│  Filter: [All] [Common] [Uncommon] [Rare] [Epic] [Leg]  │
├─────────────────────────────────────────────────────────┤
│  ┌────┐  ┌────┐  ┌────┐  ┌────┐  ┌────┐  ┌────┐        │
│  │ 🛡️ │  │ 🐍 │  │ 💎 │  │ 🔒 │  │ 🔒 │  │ 🔒 │        │
│  │ ✓  │  │ ✓  │  │ ✓  │  │Lv5 │  │Lv8 │  │Lv12│        │
│  └────┘  └────┘  └────┘  └────┘  └────┘  └────┘        │
│                                                         │
│  ... more items ...                                     │
└─────────────────────────────────────────────────────────┘
```

### Item Detail Modal

Clicking any item opens a detailed modal:

**For Icons:**
- Large icon preview
- Icon name and rarity badge
- Journal type indicator
- Unlock status (locked/unlocked)
- Unlock requirement (e.g., "Reach Level 12")
- Unlock date if earned

**For Achievements:**
- Achievement icon/badge
- Name and description
- Category and rarity
- XP reward amount
- Earned date if completed
- Progress toward completion if in progress

**For Titles:**
- Title with fantasy styling
- Level requirement
- Flavor text description
- Current/locked status

---

## Progression Engine

### XP Award Calculation

Base XP per entry: **20 XP**

Streak bonuses:
- 3-6 day streak: **+5 XP** (total: 25 XP)
- 7+ day streak: **+15 XP** (total: 35 XP)

Additional XP sources:
- Quest completion: 15-150 XP
- Achievement unlock: 50-5,000 XP

### Level-Up Formula

XP required for next level:
```
XP_needed = 100 × current_level^1.5
```

Example progression:

| Level | XP to Next | Cumulative XP | Title |
|-------|------------|---------------|-------|
| 1 | 141 | 0 | Wanderer |
| 5 | 559 | 1,041 | Apprentice Scribe |
| 10 | 1,162 | 4,147 | Journeyman |
| 25 | 3,227 | 27,063 | Sage |
| 50 | 9,653 | 117,851 | Master Chronicler |
| 100 | N/A | 513,883 | Ascended Author |

### Streak Tracking

Streaks are calculated based on `last_entry_date`:

```sql
-- In update_progression_on_entry()
IF last_date IS NULL OR last_date < today - 1 THEN
  -- Streak broken or first entry
  current_streak := 1;
ELSIF last_date = today - 1 THEN
  -- Consecutive day, increment streak
  current_streak := current_streak + 1;
ELSIF last_date = today THEN
  -- Same day, streak unchanged
  -- (no increment, already wrote today)
END IF;
```

---

## Database Schema

### Core Tables

#### user_progression
```sql
CREATE TABLE user_progression (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  total_entries INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_entry_date DATE,
  title TEXT DEFAULT 'Wanderer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);
```

#### quest_definitions
```sql
CREATE TABLE quest_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quest_key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  quest_type TEXT CHECK (quest_type IN ('daily', 'weekly', 'special')),
  requirement_type TEXT CHECK (requirement_type IN (
    'entries_count', 'journal_types', 'word_count', 
    'icons_used', 'streak_maintain'
  )),
  requirement_value INTEGER NOT NULL,
  xp_reward INTEGER NOT NULL,
  icon_emoji TEXT DEFAULT '⚔️',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### user_quest_progress
```sql
CREATE TABLE user_quest_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  quest_key TEXT NOT NULL REFERENCES quest_definitions(quest_key),
  progress INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  is_claimed BOOLEAN DEFAULT FALSE,
  reset_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, quest_key, reset_at)
);
```

#### icon_unlock_requirements
```sql
CREATE TABLE icon_unlock_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon_uuid TEXT UNIQUE NOT NULL,
  icon_name TEXT NOT NULL,
  journal_type TEXT CHECK (journal_type IN ('book', 'daily', 'thought')),
  unlock_type TEXT CHECK (unlock_type IN (
    'default', 'level', 'entries', 'streak', 'achievement'
  )),
  unlock_value INTEGER DEFAULT 0,
  rarity TEXT CHECK (rarity IN (
    'common', 'uncommon', 'rare', 'epic', 'legendary'
  )),
  is_default BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### user_unlocked_icons
```sql
CREATE TABLE user_unlocked_icons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  icon_uuid TEXT NOT NULL,
  unlock_method TEXT,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, icon_uuid)
);
```

---

## Backend Automation

### Database Triggers

Three triggers fire on every journal entry insert:

#### 1. update_progression_on_entry()
```sql
CREATE TRIGGER trigger_update_progression
AFTER INSERT ON user_journal_entries
FOR EACH ROW EXECUTE FUNCTION update_progression_on_entry();
```

**Actions:**
- Calculate streak status
- Award base XP (20) + streak bonus
- Update total_entries
- Update streak_days and longest_streak
- Call award_xp() for level processing

#### 2. check_and_award_achievements()
```sql
CREATE TRIGGER trigger_check_achievements
AFTER INSERT ON user_journal_entries
FOR EACH ROW EXECUTE FUNCTION check_and_award_achievements();
```

**Actions:**
- Query all active achievements
- Check each achievement's requirements
- For newly qualified achievements:
  - Insert into user_achievements
  - Award achievement's XP bonus

#### 3. check_icon_unlocks()
```sql
CREATE TRIGGER trigger_check_icon_unlocks
AFTER INSERT ON user_journal_entries
FOR EACH ROW EXECUTE FUNCTION check_icon_unlocks();
```

**Actions:**
- Query all non-default icons
- Check level-based unlocks
- Check entry-based unlocks
- Check streak-based unlocks
- Insert newly unlocked icons

### Cron Jobs

| Job Name | Schedule | Function |
|----------|----------|----------|
| reset-daily-quests | `0 0 * * *` | reset_daily_quests() |
| reset-weekly-quests | `0 0 * * 1` | reset_weekly_quests() |

---

## Frontend Components

### GameLayout.jsx
Navigation wrapper for all game pages.

**Props:** None (uses useParams for userId)

**Features:**
- Menu toggle button
- Game navigation items (QUESTS, INVENTORY, MAP)
- Active state highlighting
- "Coming Soon" indicators for disabled items

### QuestCard.jsx
Displays a single quest with progress.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| quest | object | Quest data with progress |
| onClaim | function | Claim callback |
| isClaimLoading | boolean | Loading state |

**Visual States:**
- In Progress: Gray progress bar
- Completed: Green progress bar, active claim button
- Claimed: Grayed out with "Claimed" badge

### InventoryItem.jsx
Displays a collectible item card.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| item | object | Item data |
| type | string | 'icon', 'achievement', or 'title' |
| onClick | function | Click handler |

**Visual States:**
- Locked: Grayscale, lock icon overlay
- Unlocked: Full color, rarity glow

### ItemDetailModal.jsx
Detailed view of an inventory item.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| item | object | Item data |
| type | string | Item type |
| isOpen | boolean | Modal visibility |
| onClose | function | Close handler |

---

## API Reference

### Quests API (src/utils/quests.js)

#### getQuestsWithProgress(userId)
Returns all quests with calculated progress.

**Returns:**
```javascript
{
  success: boolean,
  data: {
    dailyQuests: Quest[],
    weeklyQuests: Quest[],
    stats: {
      dailyCompleted: number,
      dailyTotal: number,
      weeklyCompleted: number,
      weeklyTotal: number,
      totalXpAvailable: number,
      xpClaimed: number
    }
  }
}
```

#### claimQuestReward(userId, questKey)
Claims a completed quest's reward.

**Returns:**
```javascript
{
  success: boolean,
  data: {
    xpAwarded: number,
    levelUp: boolean,
    newLevel: number | null,
    newTitle: string | null
  }
}
```

### Inventory API (src/utils/inventory.js)

#### getIconInventory(userId)
Returns all icons with unlock status.

#### getAchievementInventory(userId)
Returns all achievements with earned status.

#### getTitleInventory(userId)
Returns all titles with unlock status.

#### getInventoryStats(userId)
Returns collection statistics.

---

## Testing Guide

### Manual Testing Checklist

#### Quest System
- [ ] Daily quests show correct progress
- [ ] Weekly quests show correct progress
- [ ] Completed quests enable claim button
- [ ] Claiming quest awards correct XP
- [ ] Level-up triggers on sufficient XP
- [ ] Claimed quests show "Claimed" state
- [ ] Time until reset displays correctly

#### Inventory System
- [ ] All 34 icons display
- [ ] All 19 achievements display
- [ ] All 16 titles display
- [ ] Locked/unlocked states correct
- [ ] Rarity filters work
- [ ] "Show unlocked only" filter works
- [ ] Item detail modal opens
- [ ] Collection stats accurate

#### Progression System
- [ ] Writing entry awards 20 XP
- [ ] Streak bonus applied correctly
- [ ] Level-up occurs at threshold
- [ ] Title updates on level-up
- [ ] Achievements auto-award
- [ ] Icons auto-unlock

### Test Accounts

| Account | Level | Purpose |
|---------|-------|---------|
| Super Admin | 10 | Full feature testing |
| New User | 1 | Onboarding flow testing |
| Power User | 50+ | High-level features |

---

## Future Roadmap

### Phase 4: Journey Map (Coming Soon)
- Enhanced timeline visualization
- Milestone markers for level-ups
- Achievement earned markers
- Monthly/seasonal groupings
- Journey statistics sidebar

### Phase 5: Social Enhancements
- Party quests (group challenges)
- Guild system
- Friend activity feed
- Shared achievements

### Phase 6: Advanced Gamification
- Special event quests
- Seasonal icons
- Limited-time achievements
- Prestige system (rebirth at 100)

---

## Conclusion

Dashboard V2 transforms Sandbox Life from a simple journaling app into an engaging adventure. The combination of quests, inventory, achievements, and progression creates multiple feedback loops that encourage consistent journaling while making the experience genuinely fun.

The backend automation ensures users never miss rewards - every entry automatically triggers XP awards, achievement checks, and icon unlocks. The frontend provides beautiful, intuitive interfaces for exploring progress and setting goals.

May your chronicles be legendary!

---

*Dashboard V2 Complete Guide - Version 1.0*  
*Last Updated: January 18, 2026*
