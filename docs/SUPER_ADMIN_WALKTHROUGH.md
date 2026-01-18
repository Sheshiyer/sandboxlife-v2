# Sandbox Life - Super Admin Walkthrough & Feature Guide

## Version 2.0 - Adventure Mode Edition

**Document Version:** 2.0  
**Last Updated:** January 18, 2026  
**Status:** Production Ready

---

## Table of Contents

1. [Introduction](#introduction)
2. [Super Admin Account Details](#super-admin-account-details)
3. [Getting Started](#getting-started)
4. [New Features Overview](#new-features-overview)
5. [Adventure Mode Progression System](#adventure-mode-progression-system)
6. [Quest System](#quest-system)
7. [Inventory System](#inventory-system)
8. [Icon Unlock System](#icon-unlock-system)
9. [Achievement System](#achievement-system)
10. [Social Features](#social-features)
11. [Dashboard Walkthrough](#dashboard-walkthrough)
12. [Journal Entry Flow](#journal-entry-flow)
13. [Backend Automation](#backend-automation)
14. [Technical Implementation Details](#technical-implementation-details)
15. [Troubleshooting](#troubleshooting)

---

## Introduction

Welcome to Sandbox Life Version 2.0, codenamed "Adventure Mode Edition." This major update transforms the journaling experience into an engaging, gamified adventure inspired by tabletop role-playing games. Users now progress through levels, unlock exclusive icons, earn achievements, complete quests, and connect with fellow chroniclers in a rich social environment.

This document serves as a comprehensive walkthrough for the Super Admin account, providing detailed explanations of all new features, upgrades, and system enhancements implemented in this version. Whether you're testing the platform, onboarding new team members, or exploring the full capabilities of Sandbox Life, this guide will take you through every aspect of the updated system.

The Super Admin account has been pre-configured with sample data to demonstrate all features without requiring you to build up progression from scratch. This allows for immediate exploration of advanced features that would otherwise require weeks of consistent journaling to unlock.

---

## Super Admin Account Details

### Login Credentials

| Field | Value |
|-------|-------|
| **Email** | valoreventuresweb@gmail.com |
| **Password** | Sandboxlife@2026 |
| **Account Type** | Super Admin |
| **User ID** | 80eaff5f-c0c1-4be4-ba58-c42e829a202a |

### Pre-Configured Account Status

The Super Admin account comes pre-loaded with the following progression data to facilitate comprehensive testing and demonstration:

| Attribute | Value | Description |
|-----------|-------|-------------|
| **Level** | 10 | Journeyman rank in the Adventure Mode hierarchy |
| **Title** | Journeyman | D&D-themed title displayed throughout the application |
| **XP** | 500 | Current experience points toward next level |
| **Total Entries** | 20 | Number of journal entries in the account |
| **Current Streak** | 5 days | Active journaling streak |
| **Longest Streak** | 5 days | Personal best streak record |
| **Unlocked Icons** | 8 | Default icons unlocked for immediate use |

### Sample Journal Entries

The account includes 20 pre-loaded journal entries spanning all three journal types:
- **Thought of the Day** entries featuring various symbolic icons
- **Daily Journal** entries with reflection prompts
- **Book Journal** entries with wisdom messages

These entries were sourced from an existing power user account (vanessa@sandboxlife.com) to provide realistic, varied content for demonstration purposes.

---

## Getting Started

### Step 1: Accessing the Application

1. Navigate to the Sandbox Life application URL (localhost:5173 for development)
2. You will be presented with the login/signup screen
3. Click on "Sign In" or navigate to the login form

### Step 2: Logging In

1. Enter the Super Admin email: `valoreventuresweb@gmail.com`
2. Enter the password: `Sandboxlife@2026`
3. Click the "Sign In" button
4. Upon successful authentication, you will be redirected to the home dashboard

### Step 3: Exploring the Home Dashboard

After logging in, the home dashboard displays:
- Your current level and D&D title prominently displayed
- Recent journal entries in a horizontally scrollable strip
- Quick access navigation to all journal types
- Progress indicators showing XP advancement
- Toggle to switch between Classic and Adventure Mode dashboards

### Step 4: Accessing Dashboard V2 (Adventure Mode)

1. On the Home page, locate the mode toggle at the bottom
2. Switch to "Adventure Mode" / "Game Mode"
3. You'll be redirected to the D&D-themed Dashboard V2
4. Access the game menu: **QUESTS**, **INVENTORY**, **MAP**

---

## New Features Overview

Version 2.0 introduces a comprehensive suite of new features designed to transform journaling from a solitary practice into an engaging, rewarding adventure. Here's what's new:

### Core Additions

1. **Adventure Mode Progression System** - A complete leveling system with 100 levels and 16 unique D&D-themed titles
2. **Quest System** - Daily and weekly challenges with XP rewards
3. **Inventory System** - View and track all collectible items (icons, achievements, titles)
4. **Icon Unlock System** - 34 collectible icons across 5 rarity tiers that unlock through various achievements
5. **Achievement System** - 19 achievements rewarding different aspects of journaling dedication
6. **Enhanced Social Features** - Friend system, global chat ("The Tavern"), and direct messaging
7. **Leaderboards** - Competitive rankings across multiple categories
8. **Streak Tracking** - Daily streak monitoring with bonus XP rewards
9. **Automated Backend** - Database triggers handle all progression automatically

### Database Enhancements

The following new database tables power these features:
- `user_progression` - Tracks level, XP, streaks, and titles
- `icon_unlock_requirements` - Defines all 34 unlockable icons
- `user_unlocked_icons` - Records which icons each user has unlocked
- `achievements` - Defines the 19 available achievements
- `user_achievements` - Tracks earned achievements per user
- `level_titles` - Maps levels to D&D-themed titles
- `quest_definitions` - Defines daily and weekly quests
- `user_quest_progress` - Tracks quest completion and claims

---

## Adventure Mode Progression System

### Experience Points (XP) System

The XP system rewards consistent journaling with tangible progression:

| Action | XP Reward |
|--------|-----------|
| Base XP per journal entry | 20 XP |
| 3-day streak bonus | +5 XP |
| 7+ day streak bonus | +15 XP |
| Daily Quest completion | 15-50 XP |
| Weekly Quest completion | 75-150 XP |
| Achievement unlocks | 50 - 5,000 XP (varies by rarity) |

### Level Progression Formula

Levels follow an exponential growth curve to maintain engagement:

```
XP Required for Next Level = 100 × (current_level ^ 1.5)
```

**Example Level Requirements:**
- Level 1 → 2: 141 XP
- Level 5 → 6: 549 XP
- Level 10 → 11: 1,162 XP
- Level 25 → 26: 3,227 XP
- Level 50 → 51: 9,653 XP
- Level 99 → 100: 32,863 XP

### D&D-Themed Titles

As users progress, they earn prestigious titles inspired by fantasy role-playing games:

| Level | Title | Flavor Text |
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

The Super Admin account is currently at **Level 10 (Journeyman)**, demonstrating mid-tier progression while leaving room to experience level-up mechanics.

---

## Quest System

### Overview

The Quest System provides daily and weekly challenges that reward consistent journaling behavior. Quests refresh automatically and provide bonus XP beyond standard entry rewards.

### Daily Quests (3 total)

Daily quests reset at midnight UTC every day:

| Quest | Description | Requirement | XP Reward |
|-------|-------------|-------------|-----------|
| 📜 Daily Chronicle | Write at least one journal entry today | 1 entry | 25 XP |
| 🎭 Versatile Scribe | Write entries in 2 different journal types today | 2 types | 50 XP |
| 🔥 Flame Keeper | Maintain your journaling streak | Write today | 15 XP |

### Weekly Quests (3 total)

Weekly quests reset at midnight UTC every Monday:

| Quest | Description | Requirement | XP Reward |
|-------|-------------|-------------|-----------|
| 📚 Weekly Chronicler | Write 5 journal entries this week | 5 entries | 100 XP |
| 🗺️ Icon Explorer | Use 3 different icons this week | 3 icons | 75 XP |
| ✍️ Wordsmith | Write 500 words total this week | 500 words | 150 XP |

### Quest Progress Calculation

Quest progress is calculated in real-time based on:
- **entries_count**: Number of journal entries in the period
- **journal_types**: Unique journal types used (book, daily, thought)
- **icons_used**: Unique icons selected for entries
- **word_count**: Total words written across all entries
- **streak_maintain**: Whether user has written today

### Claiming Rewards

1. Navigate to the Quests page (⚔️ QUESTS in Dashboard V2)
2. Complete the quest requirements
3. When progress reaches 100%, the "Claim" button activates
4. Click "Claim" to receive XP reward
5. XP is awarded via the `award_xp()` database function
6. If the XP causes a level-up, a celebration toast appears

### Quest Reset Schedule

| Quest Type | Reset Time | Cron Schedule |
|------------|------------|---------------|
| Daily | Midnight UTC | `0 0 * * *` |
| Weekly | Monday Midnight UTC | `0 0 * * 1` |

---

## Inventory System

### Overview

The Inventory System provides a centralized view of all collectible items a user can earn. It displays icons, achievements, and titles with their unlock status.

### Accessing Inventory

1. Navigate to Dashboard V2
2. Click **🎒 INVENTORY** in the game menu
3. Browse through three category tabs

### Inventory Categories

#### Icons Tab
- Displays all 34 collectible icons
- Shows locked/unlocked status with visual indicators
- Filterable by rarity (Common, Uncommon, Rare, Epic, Legendary)
- Filterable by journal type (Book, Daily, Thought)
- Toggle to show only unlocked icons
- Click any icon to see detailed unlock requirements

#### Achievements Tab
- Displays all 19 achievements
- Shows earned/unearned status
- Grouped by category (Journal, Streak, Social, Milestone)
- Shows XP reward for each achievement
- Displays earned date for completed achievements

#### Titles Tab
- Displays all 16 D&D-themed titles
- Shows current title vs locked titles
- Displays level requirement for each
- Visual indication of current equipped title

### Inventory Statistics

The Inventory page header shows:
- Total items collected vs total available
- Collection percentage progress bar
- Breakdown by category
- Breakdown by rarity tier

---

## Icon Unlock System

### Overview

The icon unlock system adds a collectible element to journaling. Each journal type features unique icons that users unlock through various achievements:

### Rarity Tiers

Icons are categorized into five rarity tiers, each with distinctive visual styling:

| Rarity | Color | Unlock Difficulty | Visual Treatment |
|--------|-------|-------------------|------------------|
| **Common** | Gray | Easy - starter icons | Subtle shadow |
| **Uncommon** | Green | Moderate - requires dedication | Soft glow |
| **Rare** | Blue | Challenging - shows commitment | Medium glow |
| **Epic** | Purple | Elite - for dedicated chroniclers | Strong glow |
| **Legendary** | Gold | Ultimate - massive achievements | Animated shimmer |

### Icon Distribution

**Book Journal Icons (14 total):**
- 3 Default (Common): Shield, Snake, Treasure
- 4 Level-based: Sword (Lv3), Star (Lv5), Rose (Lv8), Lighthouse (Lv12), Dragon (Lv20), Crystal (Lv30)
- 4 Entry-based: Anchor (10 entries), Key (20), Compass (30), Phoenix (50), Infinity (100)

**Daily Journal Icons (13 total):**
- 3 Default (Common): Apple, Bird, Leaf
- 5 Level-based: Shell (Lv2), Lotus (Lv6), Sun (Lv10), Ocean (Lv15), Galaxy (Lv25)
- 5 Streak-based: Butterfly (3-day), Moon (7-day), Mountain (14-day), Phoenix (30-day), Aurora (60-day)

**Thought of the Day Icons (7 total):**
- 2 Default (Common): Candle, Book
- 2 Level-based: Lantern (Lv7), Constellation (Lv18)
- 3 Entry-based: Quill (5 thoughts), Scroll (15), Crown (30)

### Unlock Mechanisms

1. **Default Unlock** - Three icons per journal type available immediately upon registration
2. **Level-Based** - Icons that unlock when reaching specific level milestones
3. **Entry-Based** - Icons that unlock after writing a certain number of entries
4. **Streak-Based** - Icons that unlock by maintaining daily journaling streaks
5. **Achievement-Based** - Special icons tied to specific accomplishments

### Super Admin Unlocked Icons (8 default)

| Icon | Journal Type | Rarity |
|------|--------------|--------|
| Shield | Book | Common |
| Snake | Book | Common |
| Treasure | Book | Common |
| Apple | Daily | Common |
| Bird | Daily | Common |
| Leaf | Daily | Common |
| Candle | Thought | Common |
| Book | Thought | Common |

---

## Achievement System

### Achievement Categories

Achievements are organized into four categories, each rewarding different aspects of the journaling experience:

### Journal Achievements (6 total)

| Achievement | Requirement | XP Reward | Rarity |
|-------------|-------------|-----------|--------|
| First Steps | Write 1 entry | 50 XP | Common |
| Dedicated Writer | Write 10 entries | 100 XP | Common |
| Prolific Chronicler | Write 50 entries | 300 XP | Uncommon |
| Century Club | Write 100 entries | 500 XP | Rare |
| Legendary Scribe | Write 250 entries | 1,000 XP | Epic |
| Ascended Author | Write 500 entries | 2,000 XP | Legendary |

### Streak Achievements (6 total)

| Achievement | Requirement | XP Reward | Rarity |
|-------------|-------------|-----------|--------|
| Habit Forming | 3-day streak | 75 XP | Common |
| Week Warrior | 7-day streak | 150 XP | Uncommon |
| Fortnight Fighter | 14-day streak | 300 XP | Rare |
| Monthly Master | 30-day streak | 600 XP | Epic |
| Unbreakable | 60-day streak | 1,200 XP | Legendary |
| Eternal Flame | 100-day streak | 2,500 XP | Legendary |

### Social Achievements (3 total)

| Achievement | Requirement | XP Reward | Rarity |
|-------------|-------------|-----------|--------|
| Companion Found | Add 1 friend | 50 XP | Common |
| Social Circle | Add 5 friends | 150 XP | Uncommon |
| Popular Chronicler | Add 10 friends | 300 XP | Rare |

### Milestone Achievements (4 total)

| Achievement | Requirement | XP Reward | Rarity |
|-------------|-------------|-----------|--------|
| Journeyman Achievement | Reach Level 10 | 200 XP | Uncommon |
| Sage Achievement | Reach Level 25 | 500 XP | Rare |
| Master Achievement | Reach Level 50 | 1,500 XP | Epic |
| Ascension | Reach Level 100 | 5,000 XP | Legendary |

---

## Social Features

### Friend System ("Party Members")

The friend system allows users to connect with fellow chroniclers:

1. **Search** - Find other users by display name
2. **Send Request** - Invite them to join your party
3. **Accept/Decline** - Respond to incoming friend requests
4. **Party View** - See friends with their levels and D&D titles

Friends display enhanced information including:
- Current level and title
- Online status (online, away, offline)
- Visual distinction for high-level friends with Epic/Legendary borders

### Global Chat ("The Tavern")

The Tavern is the global chat room where all Sandbox Life users can interact:
- Real-time messaging with Supabase subscriptions
- User titles displayed next to names
- Level badges on avatars
- System messages for important events

### Direct Messaging ("Private Missives")

Private one-on-one conversations between friends:
- Message editing with "edited" indicator
- Soft delete functionality
- Unread count badges
- Last read tracking

### Leaderboards ("Hall of Fame")

Competitive rankings across multiple categories:
- **Level** - Highest character levels
- **Total XP** - Most experience earned
- **Total Entries** - Most prolific writers
- **Longest Streak** - Best consistency records

---

## Dashboard Walkthrough

### Classic Dashboard

The traditional dashboard provides:
- Recent entries display in horizontal strip
- Quick navigation cards for each journal type
- Custom month/year activity picker
- Profile and settings links

### Adventure Mode Dashboard (Dashboard V2)

The gamified dashboard features:
- Prominent level and title display
- XP progress bar with visual feedback
- Streak counter with fire animation
- Achievement showcase
- Icon gallery preview
- Leaderboard widget
- Party member status

**Game Menu Navigation:**
- **⚔️ QUESTS** - View and complete daily/weekly quests
- **🎒 INVENTORY** - Browse all collectible items
- **🗺️ MAP** - Journey timeline (Coming Soon)

Access Dashboard V2 via `/dashboard-v2/:userId` route or toggle on Home page.

---

## Journal Entry Flow

### Creating a New Entry

1. **Select Journal Type** - Choose between Book Journal, Daily Journal, or Thought of the Day
2. **Icon Selection** - Browse available icons in the carousel picker (locked icons show unlock requirements)
3. **Write Entry** - Compose your reflection in the text editor
4. **Wisdom Message** (Book Journal only) - Add optional wisdom/insights
5. **Save** - Submit the entry to trigger all automatic progression

### Automatic Progression Updates (Database Triggers)

Upon saving an entry, three database triggers fire automatically:

1. **`trigger_update_progression`** → `update_progression_on_entry()`
   - Awards 20 base XP
   - Checks and updates streak status
   - Awards streak bonus XP (3-day: +5, 7-day: +15)
   - Updates total_entries count
   - Calls `award_xp()` which handles level-ups

2. **`trigger_check_achievements`** → `check_and_award_achievements()`
   - Evaluates all 19 achievement conditions
   - Awards any newly qualified achievements
   - Grants achievement XP bonuses

3. **`trigger_check_icon_unlocks`** → `check_icon_unlocks()`
   - Evaluates level-based icon unlocks
   - Evaluates entry-based icon unlocks
   - Evaluates streak-based icon unlocks
   - Records newly unlocked icons

---

## Backend Automation

### Database Triggers

The progression system operates through PostgreSQL triggers that fire automatically on journal entry insert:

| Trigger | Function | Purpose |
|---------|----------|---------|
| `trigger_update_progression` | `update_progression_on_entry()` | Awards XP, updates streaks, counts entries |
| `trigger_check_achievements` | `check_and_award_achievements()` | Evaluates and awards achievements |
| `trigger_check_icon_unlocks` | `check_icon_unlocks()` | Unlocks icons based on progress |

### Database Functions

| Function | Purpose |
|----------|---------|
| `calculate_xp_for_level(level)` | Returns XP needed: `100 × level^1.5` |
| `award_xp(user_id, amount)` | Awards XP, handles level-ups, updates titles |
| `reset_daily_quests()` | Clears expired daily quest claims |
| `reset_weekly_quests()` | Clears expired weekly quest claims |

### Cron Jobs (pg_cron)

| Job | Schedule | Purpose |
|-----|----------|---------|
| `reset-daily-quests` | `0 0 * * *` (midnight UTC) | Clear daily quest progress |
| `reset-weekly-quests` | `0 0 * * 1` (Monday midnight) | Clear weekly quest progress |

### Row Level Security (RLS)

All tables implement RLS policies:

**Public Read Tables:**
- `icon_unlock_requirements` - Anyone can view
- `achievements` - Anyone can view
- `level_titles` - Anyone can view
- `quest_definitions` - Anyone can view

**User-Specific Tables:**
- `user_progression` - Users view own only
- `user_unlocked_icons` - Users view own only
- `user_achievements` - Users view own only
- `user_quest_progress` - Users view/insert/update own only

---

## Technical Implementation Details

### Frontend Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/dashboard-v2/:userId` | DashboardV2 | Adventure Mode dashboard |
| `/inventory/:userId` | InventoryPage | Collectibles browser |
| `/quests/:userId` | QuestsPage | Quest board |

### Utility Modules

**`src/utils/progression.jsx`:**
- `getUserProgression(userId)` - Fetch progression data
- `awardXP(userId, amount)` - Award experience points
- `getIconsForJournal(userId, journalType)` - Get icons with unlock status
- `getUserAchievements(userId)` - Fetch earned achievements
- `getLeaderboard(limit, orderBy)` - Fetch rankings

**`src/utils/inventory.js`:**
- `getIconInventory(userId)` - All icons with unlock status
- `getAchievementInventory(userId)` - All achievements with earned status
- `getTitleInventory(userId)` - All titles with unlock status
- `getInventoryStats(userId)` - Collection statistics
- `getRarityStyles(rarity)` - Visual styling for rarity tiers

**`src/utils/quests.js`:**
- `getQuestsWithProgress(userId)` - Full quest data with progress
- `calculateQuestProgress(userId)` - Real-time progress calculation
- `claimQuestReward(userId, questKey)` - Claim and award XP
- `getQuestTypeStyles(type)` - Visual styling for quest types

### Components

**Game Components (`src/components/game/`):**
- `GameLayout.jsx` - Navigation header for game pages
- `InventoryItem.jsx` - Item card for icons/achievements/titles
- `ItemDetailModal.jsx` - Detailed item information popup
- `QuestCard.jsx` - Quest display with progress bar

---

## Troubleshooting

### Common Issues

**Issue: Level not updating after entry**
- Solution: Check that the `trigger_update_progression` trigger is enabled
- Verify user_progression record exists for the user
- Check database logs for trigger errors

**Issue: Icons showing as locked when they should be unlocked**
- Solution: Verify user_unlocked_icons has records for the user
- Check icon_unlock_requirements has correct unlock_value
- Manually run `check_icon_unlocks()` if needed

**Issue: Streak not incrementing**
- Solution: Ensure entries are being created on consecutive calendar days
- Check that last_entry_date is updating correctly
- Verify timezone handling (system uses UTC)

**Issue: Achievement not awarding**
- Solution: Verify achievement exists in achievements table with is_active=true
- Check that trigger_check_achievements is enabled
- Verify requirement_value matches expected threshold

**Issue: Quest progress not updating**
- Solution: Quest progress is calculated real-time from entries
- Ensure journal entries have correct created_at timestamps
- Check quest_definitions has correct requirement_type

**Issue: Quest claim failing**
- Solution: Verify user has completed quest requirements
- Check RLS policies allow insert/update on user_quest_progress
- Verify award_xp function exists and has correct permissions

### Database Health Check

Run these queries to verify system integrity:

```sql
-- Check triggers exist
SELECT trigger_name FROM information_schema.triggers 
WHERE event_object_table = 'user_journal_entries';

-- Check functions exist
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public' AND routine_type = 'FUNCTION';

-- Check cron jobs
SELECT jobname, schedule FROM cron.job;

-- Check RLS policies
SELECT tablename, policyname FROM pg_policies 
WHERE schemaname = 'public';
```

### Support Contacts

For technical issues or feature requests, contact the development team through the appropriate channels established by your organization.

---

## Conclusion

Sandbox Life Version 2.0 represents a significant evolution of the journaling platform, transforming personal reflection into an engaging adventure. The Super Admin account provides full access to test and demonstrate all features, from the foundational progression system to quests and the inventory browser.

By combining meaningful self-reflection with rewarding progression mechanics, Sandbox Life encourages consistent journaling habits while building a community of dedicated chroniclers. The D&D-themed presentation adds whimsy and motivation, turning each journal entry into a step forward on an epic personal journey.

Welcome to your adventure, Journeyman. May your chronicles be legendary.

---

*Document prepared for Sandbox Life v2.0 - Adventure Mode Edition*  
*Super Admin Account Configuration Date: January 18, 2026*  
*Last Updated: January 18, 2026*
