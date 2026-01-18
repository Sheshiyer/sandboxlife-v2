# Dashboard V2: The Adventurer's Guide

**Version 2.0 - Complete Adventure Mode**

Welcome to **Dashboard V2**, the immersive "Adventure Mode" for SandboxLife. This interface transforms your journaling experience from a standard productivity tool into a fantasy role-playing adventure inspired by Dungeons & Dragons.

This guide serves as your **Player's Handbook**, walking you through the features, mechanics, and journey of using the Adventurer's Dashboard.

---

## What is Dashboard V2?

Dashboard V2 is a complete visual and functional overhaul designed to make self-reflection feel like an epic quest. Instead of lists and calendars, you interact with:
- **3D Floating Cards**: Your entries represented as magical artifacts
- **The Quadrants**: A holistic view of your well-being (Mind, Body, Spirit, Heart)
- **The Quest Board**: Daily and weekly challenges with XP rewards
- **The Inventory**: Browse all collectible icons, achievements, and titles
- **The Map**: A timeline of your journey visualized as a path (Coming Soon)
- **The Tavern**: A social hub for connecting with other adventurers

---

## Getting Started

### Accessing the Realm
1. **Toggle Mode**: Look for the **"Adventure Mode"** toggle on the Home page or in the sidebar
2. **Enter the Dashboard**: Navigate to Dashboard V2 at `/dashboard-v2/:userId`
3. **Game Menu**: Access QUESTS, INVENTORY, and MAP from the navigation header
4. **Classic View**: Return to the standard view via the mode toggle on Home

---

## Game Menu Navigation

The Dashboard V2 header contains three navigation items:

| Menu Item | Route | Status | Description |
|-----------|-------|--------|-------------|
| QUESTS | `/quests/:userId` | Active | Daily and weekly challenges |
| INVENTORY | `/inventory/:userId` | Active | All collectible items |
| MAP | `/map/:userId` | Coming Soon | Journey timeline visualization |

---

## Core Concepts

### 1. The Four Domains (Quadrants)
Your journal entries are automatically sorted into four elemental domains based on their meaning:

- **MIND (Blue/Air)**: Logic, knowledge, planning, and mental clarity
  - *Icons*: Compass, Key, Book, Quill
- **BODY (Red/Earth)**: Physical health, action, vitality, and boundaries
  - *Icons*: Sword, Shield, Apple, Mountain
- **SPIRIT (Purple/Void)**: Growth, transformation, inner peace, and purpose
  - *Icons*: Lotus, Butterfly, Star, Lantern
- **HEART (Green/Nature)**: Emotions, relationships, love, and connection
  - *Icons*: Rose, Heart, Hands, Anchor

### 2. XP & Leveling
- **XP (Experience Points)**: Gained with every entry (+20 XP base)
- **Streak Bonuses**: 3-day streak (+5 XP), 7+ day streak (+15 XP)
- **Quest XP**: Complete daily/weekly quests for bonus XP (15-150)
- **Leveling**: As you gain XP, you level up (1-100) and earn new **Titles**
- **XP Formula**: `100 x level^1.5` required for next level

### 3. D&D Titles
16 themed titles mark your progression:

| Level Range | Example Titles |
|-------------|----------------|
| 1-14 | Wanderer, Apprentice Scribe, Journeyman |
| 15-29 | Chronicler, Lorekeeper, Sage |
| 30-49 | Archivist, Mystic, Oracle, Grand Scribe |
| 50-79 | Master Chronicler, Archmage of Reflection |
| 80-99 | Legendary Loremaster, Mythic Sage |
| 100 | Ascended Author |

---

## User Journey: A Walkthrough

Follow these steps to master the Adventurer's path.

### Step 1: The Hub (Dashboard)
Upon entering, you see the **Quadrants Board**.
- **Recent Cards**: Your last 4 entries float in 3D space within their respective quadrants
- **Interact**: Hover over a card to see details. Click to flip it and see your entry
- **HUD**: The top bar shows your current **Level**, **Title**, and **XP Progress**

### Step 2: The Quest Board
Complete challenges for bonus XP:
1. Click **QUESTS** in the game navigation
2. **Daily Quests (3)**: Daily Chronicle, Versatile Scribe, Flame Keeper
3. **Weekly Quests (3)**: Weekly Chronicler, Icon Explorer, Wordsmith
4. **Claim Rewards**: When progress reaches 100%, click "Claim" for XP

### Step 3: The Inventory
Browse your collectibles:
1. Click **INVENTORY** in the game navigation
2. **Icons Tab**: View all 34 icons with unlock status and requirements
3. **Achievements Tab**: Track progress on 19 achievements
4. **Titles Tab**: See all 16 D&D titles and level requirements
5. **Filters**: Filter by rarity or show only unlocked items

### Step 4: Writing a New Entry
To write a new entry:
1. Click the **Gold Action Button** or navigate to a journal type
2. **Select a Sigil**: Choose an icon from the carousel
3. **The Prompt**: A question reveals based on your chosen sigil
4. **Inscribe**: Write your reflection in the text area
5. **Seal Entry**: Save to earn XP, update streaks, and trigger unlocks

### Step 5: The Party (Social)
Adventure is better with friends.
1. Open the **Menu** and select **"Party Members"** (Friends)
2. **Recruit**: Search for other users to add to your party
3. **Inspect**: View their profiles to see their **Level**, **Title**, and **Avatar**
4. **The Tavern**: Visit the **"Missives"** (Inbox) for global and private chat

---

## Quest System Details

### Daily Quests (Reset at Midnight UTC)

| Quest | Requirement | XP Reward |
|-------|-------------|-----------|
| Daily Chronicle | Write 1 entry today | 25 XP |
| Versatile Scribe | Use 2 different journal types | 50 XP |
| Flame Keeper | Maintain your streak | 15 XP |

### Weekly Quests (Reset Monday Midnight UTC)

| Quest | Requirement | XP Reward |
|-------|-------------|-----------|
| Weekly Chronicler | Write 5 entries this week | 100 XP |
| Icon Explorer | Use 3 different icons | 75 XP |
| Wordsmith | Write 500 words total | 150 XP |

---

## Inventory System Details

### Icon Rarity Tiers

| Rarity | Color | Visual Effect |
|--------|-------|---------------|
| Common | Gray | Subtle shadow |
| Uncommon | Green | Soft glow |
| Rare | Blue | Medium glow |
| Epic | Purple | Strong glow |
| Legendary | Gold | Animated shimmer |

### Icon Distribution

| Journal Type | Total | Default | Unlockable |
|--------------|-------|---------|------------|
| Book Journal | 14 | 3 | 11 |
| Daily Journal | 13 | 3 | 10 |
| Thought of the Day | 7 | 2 | 5 |

### Unlock Mechanisms
1. **Default**: Available immediately (8 total across all types)
2. **Level-based**: Unlock at specific character levels
3. **Entry-based**: Unlock after writing X entries
4. **Streak-based**: Unlock by maintaining daily streaks

---

## Technical Note on Artifacts (Icons)

The system uses a robust **Icon Resolver**. Whether your journal entries are from the ancient times (2024) or the current era (2026), the system automatically detects the correct visual asset (Sigil) to display, ensuring your history is never lost or broken.

---

## Related Documentation

- **Complete Technical Guide**: See `docs/DASHBOARD_V2_COMPLETE_GUIDE.md`
- **Super Admin Walkthrough**: See `docs/SUPER_ADMIN_WALKTHROUGH.md`
- **System Architecture**: See `.claude/SYSTEM_DESIGN.md`

---

*"Your story is the most powerful magic you possess. Write it well."*
