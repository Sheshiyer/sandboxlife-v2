# Dashboard V2 - Game Menu Implementation Plan

## Overview

The Dashboard V2 has three non-functional menu items in the header HUD: **QUESTS**, **INVENTORY**, and **MAP**. This plan outlines the implementation strategy for each feature, transforming them into fully functional pages that enhance the D&D-themed journaling experience.

---

## Current State Analysis

### Existing Components
- `GameLayout.jsx` - Main layout wrapper with HUD header
- `DashboardV2.jsx` - Main dashboard with Board and Map views
- `TimelineMap.jsx` - Timeline view of journal entries
- `QuadrantsBoard.jsx` - 4-quadrant board view for entries
- `Card3D.jsx` - Card component for displaying entries
- `PlayerChoiceModal.jsx` - Modal for selecting journal type

### Database Tables Available
- `user_progression` - Level, XP, streaks, title
- `achievements` / `user_achievements` - Achievement tracking
- `icon_unlock_requirements` / `user_unlocked_icons` - Icon collection
- `user_journal_entries` - All journal entries
- `friendships` - Friend relationships
- `conversations` / `chat_messages` - Messaging system

---

## Feature 1: QUESTS Page

### Concept
Transform daily journaling goals into "quests" that users can complete for bonus XP and rewards.

### Quest Types

| Quest Type | Description | XP Reward | Refresh |
|------------|-------------|-----------|---------|
| **Daily Quest** | Write 1 entry today | 25 XP | Daily |
| **Variety Quest** | Write entries in 2+ journal types today | 50 XP | Daily |
| **Streak Quest** | Maintain your current streak | 15 XP | Daily |
| **Weekly Challenge** | Write 5 entries this week | 100 XP | Weekly |
| **Explorer Quest** | Use 3 different icons this week | 75 XP | Weekly |
| **Reflection Quest** | Write 500+ words total this week | 150 XP | Weekly |

### UI Components Needed

```
src/
├── pages/
│   └── QuestsPage.jsx           # Main quests page
├── components/
│   └── game/
│       ├── QuestCard.jsx        # Individual quest display
│       ├── QuestProgress.jsx    # Progress bar component
│       └── QuestReward.jsx      # Reward claim animation
└── utils/
    └── quests.js                # Quest logic & API calls
```

### Database Schema Addition

```sql
-- Quest definitions
CREATE TABLE quest_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quest_key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  quest_type TEXT CHECK (quest_type IN ('daily', 'weekly', 'special')),
  requirement_type TEXT CHECK (requirement_type IN ('entries_count', 'journal_types', 'word_count', 'icons_used', 'streak_maintain')),
  requirement_value INTEGER NOT NULL,
  xp_reward INTEGER NOT NULL,
  icon_emoji TEXT DEFAULT '⚔️',
  is_active BOOLEAN DEFAULT TRUE
);

-- User quest progress
CREATE TABLE user_quest_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_key TEXT NOT NULL REFERENCES quest_definitions(quest_key),
  progress INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  is_claimed BOOLEAN DEFAULT FALSE,
  reset_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, quest_key, reset_at)
);
```

### Page Layout Design

```
┌─────────────────────────────────────────────────────┐
│ ⚔️ QUEST BOARD                         [Back to HQ] │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────┐  DAILY QUESTS  ┌─────────────┐   │
│  │ ⚔️ Daily    │                │ 🗡️ Variety  │   │
│  │ Entry       │                │ Quest       │   │
│  │ ████████░░  │                │ ░░░░░░░░░░  │   │
│  │ 1/1 ✓      │                │ 0/2         │   │
│  │ [Claim 25XP]│                │ [In Progress]│   │
│  └─────────────┘                └─────────────┘   │
│                                                     │
│  ┌─────────────┐  WEEKLY CHALLENGES               │
│  │ 📜 Weekly   │  ┌─────────────┐                 │
│  │ Writer      │  │ 🗺️ Explorer │                 │
│  │ ████░░░░░░  │  │ ██░░░░░░░░  │                 │
│  │ 2/5         │  │ 1/3         │                 │
│  └─────────────┘  └─────────────┘                 │
│                                                     │
│  ┌───────────────────────────────────────────┐     │
│  │ 🏆 COMPLETED QUESTS THIS WEEK: 3          │     │
│  │ Total XP Earned: 175 XP                   │     │
│  └───────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────┘
```

### Implementation Tasks

1. [ ] Create `quest_definitions` and `user_quest_progress` tables
2. [ ] Create database trigger to update quest progress on journal entry
3. [ ] Create `src/utils/quests.js` with API functions
4. [ ] Create `QuestCard.jsx` component
5. [ ] Create `QuestProgress.jsx` component  
6. [ ] Create `QuestsPage.jsx` page
7. [ ] Add route `/quests/:userId` to App.jsx
8. [ ] Update `GameLayout.jsx` to navigate to quests page
9. [ ] Add quest completion toast notifications
10. [ ] Create quest reset cron job (daily/weekly)

---

## Feature 2: INVENTORY Page

### Concept
A collection gallery showing all unlocked icons, achievements, and collectibles. Users can view their "loot" and see what they still need to unlock.

### Inventory Categories

| Category | Items | Source |
|----------|-------|--------|
| **Icons** | 34 journal icons | `icon_unlock_requirements` + `user_unlocked_icons` |
| **Achievements** | 19 achievements | `achievements` + `user_achievements` |
| **Titles** | 16 D&D titles | `level_titles` + current level |
| **Badges** | Streak badges, special badges | Derived from progression |

### UI Components Needed

```
src/
├── pages/
│   └── InventoryPage.jsx        # Main inventory page
├── components/
│   └── game/
│       ├── InventoryGrid.jsx    # Grid display for items
│       ├── InventoryItem.jsx    # Single item card
│       ├── ItemDetailModal.jsx  # Item detail popup
│       ├── RarityFilter.jsx     # Filter by rarity
│       └── CategoryTabs.jsx     # Category navigation
└── utils/
    └── inventory.js             # Inventory data fetching
```

### Page Layout Design

```
┌─────────────────────────────────────────────────────┐
│ 🎒 INVENTORY                           [Back to HQ] │
├─────────────────────────────────────────────────────┤
│ [Icons] [Achievements] [Titles] [Badges]            │
│ Filter: [All ▼] [Common] [Uncommon] [Rare] [Epic]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐       │
│  │ 🛡️ │ │ 🐍 │ │ 💎 │ │ ⚔️ │ │ ⭐ │ │ 🔒 │       │
│  │    │ │    │ │    │ │    │ │    │ │    │       │
│  │ ✓  │ │ ✓  │ │ ✓  │ │ ✓  │ │ ✓  │ │ Lv15│       │
│  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘       │
│                                                     │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐       │
│  │ 🔒 │ │ 🔒 │ │ 🔒 │ │ 🔒 │ │ 🔒 │ │ 🔒 │       │
│  │    │ │    │ │    │ │    │ │    │ │    │       │
│  │50en│ │Lv20│ │30d │ │Lv30│ │100e│ │60d │       │
│  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘       │
│                                                     │
├─────────────────────────────────────────────────────┤
│ Collection Progress: 12/34 Icons (35%)             │
│ ████████████░░░░░░░░░░░░░░░░░░░░                   │
└─────────────────────────────────────────────────────┘
```

### Item Detail Modal

```
┌────────────────────────────────────┐
│         ⚔️ SWORD OF COURAGE        │
│              [RARE]                │
├────────────────────────────────────┤
│                                    │
│            [Icon Image]            │
│                                    │
│  "A symbol of courage and         │
│   decisive action"                 │
│                                    │
│  Journal Type: Book Journal        │
│  Unlock: Reach Level 3             │
│  Status: ✓ UNLOCKED                │
│                                    │
│  Unlocked on: Jan 15, 2026         │
│                                    │
│              [Close]               │
└────────────────────────────────────┘
```

### Implementation Tasks

1. [ ] Create `src/utils/inventory.js` with data fetching
2. [ ] Create `InventoryItem.jsx` component
3. [ ] Create `InventoryGrid.jsx` component
4. [ ] Create `ItemDetailModal.jsx` component
5. [ ] Create `RarityFilter.jsx` component
6. [ ] Create `CategoryTabs.jsx` component
7. [ ] Create `InventoryPage.jsx` page
8. [ ] Add route `/inventory/:userId` to App.jsx
9. [ ] Update `GameLayout.jsx` to navigate to inventory
10. [ ] Add item unlock animation/celebration

---

## Feature 3: MAP Page (Enhanced)

### Concept
An interactive world map showing the user's journaling journey. The existing `TimelineMap.jsx` will be enhanced and moved to a dedicated page with additional features.

### Map Features

| Feature | Description |
|---------|-------------|
| **Journey Timeline** | Vertical timeline of all entries |
| **Region Zones** | Group entries by month/season |
| **Milestone Markers** | Show level-ups and achievements |
| **Friend Markers** | Show friends' recent activity |
| **Statistics Panel** | Journey stats and insights |

### UI Components Needed

```
src/
├── pages/
│   └── JourneyMapPage.jsx       # Full map page
├── components/
│   └── game/
│       ├── WorldMap.jsx         # Enhanced map component
│       ├── MapRegion.jsx        # Month/season region
│       ├── MilestoneMarker.jsx  # Achievement markers
│       ├── JourneyStats.jsx     # Statistics sidebar
│       └── MapFilters.jsx       # Filter controls
└── utils/
    └── journeyMap.js            # Map data processing
```

### Page Layout Design

```
┌─────────────────────────────────────────────────────┐
│ 🗺️ JOURNEY MAP                        [Back to HQ] │
├─────────────────────────────────────────────────────┤
│ Filters: [All Types ▼] [All Time ▼] [Show Milestones]│
├───────────────────────────────────┬─────────────────┤
│                                   │ 📊 JOURNEY STATS│
│    🏁 Start of Journey           │                 │
│         │                         │ Total Entries:  │
│    ○────┼────○  Jan 2026         │ 127             │
│    │    │    │                   │                 │
│    │   ⭐   │  Level 5!          │ Days Active:    │
│    │    │    │                   │ 45              │
│    ○────┼────○                   │                 │
│    │    │    │                   │ Longest Streak: │
│    │    │    │                   │ 14 days         │
│    ○────┼────○  Feb 2026         │                 │
│    │    │    │                   │ Favorite Icon:  │
│    │   🏆   │  Century Club!     │ 🦋 Butterfly    │
│    │    │    │                   │                 │
│    ○────┼────○                   │ Words Written:  │
│    │    │    │                   │ 12,450          │
│    │    │    │                   │                 │
│    ▼    ▼    ▼  Today            │ [View Details]  │
│                                   │                 │
└───────────────────────────────────┴─────────────────┘
```

### Implementation Tasks

1. [ ] Create `src/utils/journeyMap.js` for data processing
2. [ ] Enhance `TimelineMap.jsx` or create new `WorldMap.jsx`
3. [ ] Create `MapRegion.jsx` for month groupings
4. [ ] Create `MilestoneMarker.jsx` for achievements/level-ups
5. [ ] Create `JourneyStats.jsx` sidebar component
6. [ ] Create `MapFilters.jsx` filter controls
7. [ ] Create `JourneyMapPage.jsx` page
8. [ ] Add route `/map/:userId` to App.jsx
9. [ ] Update `GameLayout.jsx` to navigate to map
10. [ ] Add smooth scroll and zoom functionality

---

## Updated GameLayout.jsx Navigation

```jsx
// Updated navigation section in GameLayout.jsx
const GameLayout = ({ children, mana = 0, toggleMenu, userId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    { label: 'QUESTS', path: `/quests/${userId}`, icon: '⚔️' },
    { label: 'INVENTORY', path: `/inventory/${userId}`, icon: '🎒' },
    { label: 'MAP', path: `/map/${userId}`, icon: '🗺️' },
  ];
  
  const isActive = (path) => location.pathname === path;

  return (
    // ... existing layout
    <div className="flex gap-6 text-sm font-semibold tracking-wider">
      {navItems.map(item => (
        <button
          key={item.label}
          onClick={() => navigate(item.path)}
          className={clsx(
            "hover:text-white cursor-pointer transition-colors",
            isActive(item.path) ? "text-yellow-400" : "text-slate-400"
          )}
        >
          <span className="mr-1">{item.icon}</span>
          {item.label}
        </button>
      ))}
    </div>
    // ...
  );
};
```

---

## Route Updates (App.jsx)

```jsx
// Add these routes to App.jsx
import QuestsPage from "./pages/QuestsPage";
import InventoryPage from "./pages/InventoryPage";
import JourneyMapPage from "./pages/JourneyMapPage";

// Inside Routes component
<Route path="/quests/:userId" element={<ProtectedRoute><QuestsPage /></ProtectedRoute>} />
<Route path="/inventory/:userId" element={<ProtectedRoute><InventoryPage /></ProtectedRoute>} />
<Route path="/map/:userId" element={<ProtectedRoute><JourneyMapPage /></ProtectedRoute>} />
```

---

## Implementation Priority

### Phase 1 - Inventory (Easiest, Most Data Available)
**Estimated Time: 2-3 hours**
- All data already exists in database
- Just need UI to display existing unlocks
- High visual impact with icon gallery

### Phase 2 - Journey Map (Medium, Enhancement of Existing)  
**Estimated Time: 3-4 hours**
- Builds on existing TimelineMap component
- Adds statistics and filtering
- Creates dedicated full-page experience

### Phase 3 - Quests (Most Complex, New System)
**Estimated Time: 4-6 hours**
- Requires new database tables
- Needs quest tracking logic
- Requires progress update triggers
- Most rewarding feature for engagement

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Page Load Time | < 2 seconds |
| User Engagement | 50% of game mode users visit new pages |
| Quest Completion | 30% daily quest completion rate |
| Icon Collection | Users view inventory 2x per week |

---

## Future Enhancements

1. **Quest Chains** - Multi-part quests that tell a story
2. **Seasonal Events** - Limited-time icons and achievements
3. **Trading Cards** - Share achievement cards with friends
4. **Guild Quests** - Collaborative quests with friends
5. **Boss Battles** - Weekly reflection challenges
6. **Pet Companions** - Unlock companions with streaks

---

*Plan Version: 1.0*  
*Created: January 18, 2026*  
*Status: Ready for Implementation*
