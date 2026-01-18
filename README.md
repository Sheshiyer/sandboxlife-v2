# SandboxLife Beta

**Version 2.0 - Adventure Mode Edition**

SandboxLife is a reflective journaling application that gamifies self-reflection through a D&D-inspired progression system, quest challenges, and social features. It offers a unique "Adventure Mode" that transforms your journaling journey into an immersive fantasy adventure.

## Features

### Core Journaling
- **Daily Journal**: Quick daily reflections with icon themes (5 entries/day limit)
- **Book Journal**: Long-form entries with icon themes and optional wisdom step
- **Thought of the Day**: Brief status updates and reflections
- **Back-dated Entries**: Entry date picker for calendar views

### Adventure Mode Gamification System
- **XP & Leveling**: Earn 20 XP per entry + streak bonuses. Levels 1-100 with exponential scaling
- **16 D&D Titles**: From "Wanderer" (Lv1) to "Ascended Author" (Lv100)
- **34 Unlockable Icons**: Common → Legendary rarity across 5 tiers
- **19 Achievements**: Journal, Streak, Social, and Milestone categories (50-5000 XP rewards)
- **Streak System**: 3-day (+5 XP) and 7-day (+15 XP) streak bonuses

### Quest System (New in v2.0)
- **Daily Quests (3)**: Daily Chronicle, Versatile Scribe, Flame Keeper (15-50 XP)
- **Weekly Quests (3)**: Weekly Chronicler, Icon Explorer, Wordsmith (75-150 XP)
- **Auto-Reset**: Daily quests reset at midnight UTC, weekly on Monday
- **Progress Tracking**: Real-time progress calculation from journal entries

### Inventory System (New in v2.0)
- **Icons Browser**: View all 34 icons with unlock status and requirements
- **Achievements Gallery**: Track progress on 19 achievements across 4 categories
- **Title Collection**: See all 16 D&D titles with level requirements
- **Rarity Filtering**: Filter items by Common, Uncommon, Rare, Epic, Legendary

### Social Features
- **Friends ("Party Members")**: Connect with other users, see their level and title
- **Messaging**: Direct messages, group chats, and global chat ("The Tavern")
- **Leaderboard ("Hall of Fame")**: Compete by level, XP, entries, or streak

### Adventure Mode Dashboard (Dashboard V2)
*An immersive fantasy interface for your journaling experience.*
- **Dark Fantasy Aesthetic**: Deep black backgrounds with gold accents
- **Game Navigation**: QUESTS, INVENTORY, MAP menu system
- **Hero Section**: Prominent level/title display with XP progress bar
- **Quadrant Board**: 3D cards organizing entries by Mind, Body, Spirit, Heart
- **Timeline Map**: Visual journey of entries as a winding path (Coming Soon)
- **Walkthrough**: See [DASHBOARD_V2_WALKTHROUGH.md](./DASHBOARD_V2_WALKTHROUGH.md) for the player's guide

### Set B Collection
- **Set B Preview**: Icon gallery preview for iconsv2 set

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Routing**: React Router v6 with dynamic `:userId` params
- **UI**: Headless UI, Heroicons, RSuite, Framer Motion, React Toastify
- **State**: React Context API (GameMode, Accessibility, Dashboard)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Create production build |
| `npm run lint` | Run ESLint (zero warnings policy) |
| `npm run preview` | Preview production build locally |

## Project Structure

```
src/
├── pages/               # 22 route pages
│   ├── Home.jsx         # Main dashboard with mode toggle
│   ├── DashboardV2.jsx  # Adventure mode dashboard
│   ├── QuestsPage.jsx   # Quest board
│   ├── InventoryPage.jsx # Collectibles browser
│   └── ...              # Journal, profile, social pages
├── components/          # 70+ components organized by feature
│   ├── dashboard/       # Classic dashboard cards
│   ├── game/            # Adventure mode (GameLayout, QuestCard, InventoryItem)
│   ├── progression/     # ProgressionCard, LevelUpModal
│   ├── friends/         # FriendCard, AddFriend, FriendRequests
│   ├── chat/            # MessageBubble, MessageInput
│   ├── navigation/      # Sidebar, NavCard
│   ├── layouts/         # DashboardLayout, GridLayout
│   └── ui/              # Button, Card, Badge, Avatar, ActivityPicker
├── constants/           # questions.jsx (icon themes & questions)
├── context/             # AccessibilityContext, GameModeContext
├── utils/
│   ├── supabase.jsx     # Core DB operations
│   ├── progression.jsx  # XP, levels, icons, achievements
│   ├── quests.js        # Quest progress and claims
│   ├── inventory.js     # Collectibles queries
│   └── social.js        # Friends, messaging, leaderboard
└── assets/              # Icons (book_journal/, daily_journal/, iconsv2/)
```

## Journal Entry Flow

1. **Icon Selection**: Choose a symbolic icon from the carousel.
2. **Journal Entry**: Write reflection based on the icon's trigger questions.
3. **Wisdom (Book only)**: Add pearls of wisdom insights.
4. **Save**: Entry saved to Supabase with icon metadata.

## Icon Sets

- **V1 icons**: Local PNG assets in `src/assets/icons` (Migrated from Supabase URLs to ensure permanent stability).
- **V2 icons (Set B)**: Local JPG assets in `src/assets/iconsv2`.
- **Icon Resolver**: A centralized utility (`src/utils/iconResolver.js`) guarantees correct icon display across the app by mapping entry meanings to local assets, fixing broken legacy URLs automatically.
- **Set B preview**: `SetBCollection` uses `iconsv2_questions` for a preview-only gallery.

## Progression System Details

### Icon Distribution
| Journal Type | Total Icons | Default | Unlockable |
|--------------|-------------|---------|------------|
| Book Journal | 14 | 3 | 11 |
| Daily Journal | 13 | 3 | 10 |
| Thought of the Day | 7 | 2 | 5 |

### Unlock Mechanisms
1. **Default** - Available at start (3 per journal type)
2. **Level-Based** - Unlock at level milestones
3. **Entry-Based** - Unlock after X entries
4. **Streak-Based** - Unlock by maintaining daily streaks
5. **Achievement-Based** - Unlock via special accomplishments

### Rarity Tiers
- **Common** (Gray): Starter icons
- **Uncommon** (Green): Mid-tier, requires dedication
- **Rare** (Blue): Challenging, shows commitment
- **Epic** (Purple): Elite, for dedicated chroniclers
- **Legendary** (Gold): Ultimate icons with shimmer effect

### Key Utilities
```javascript
// progression.jsx
getUserProgression(userId)       // Level, XP, title, streak
getIconsForJournal(userId, type) // Icons with unlock status
getUserAchievements(userId)      // Earned achievements
getLeaderboard(limit, orderBy)   // Top users

// quests.js
getQuestsWithProgress(userId)    // All quests with progress
claimQuestReward(userId, key)    // Claim completed quest

// inventory.js
getIconInventory(userId)         // All icons with unlock status
getAchievementInventory(userId)  // All achievements with earned status
getTitleInventory(userId)        // All titles with level requirements
getInventoryStats(userId)        // Collection statistics

// social.js
getFriends(userId)               // Returns friends with level & title
searchUsers(query)               // Returns users with level & title
```

See `.claude/SYSTEM_DESIGN.md` for complete system architecture.
See `docs/DASHBOARD_V2_COMPLETE_GUIDE.md` for full Adventure Mode documentation.

## Configuration

### Tailwind Theme

Custom colors defined in `tailwind.config.js`:
- `bgpapyrus`: #f5f5dc (main background)
- `lightpapyrus`: #fafaf0
- `darkpapyrus`: #e5e5c7
- `red`: #9B1D1E (accent)

### Supabase

The app currently uses hardcoded Supabase URL/key in `src/utils/supabase.jsx`. If you move these to environment variables later, update this file and the deployment configuration accordingly.

## Development Documentation

See `.claude/` for detailed development guides:

| Document | Purpose |
|----------|---------|
| `SYSTEM_DESIGN.md` | Complete D&D progression system architecture (22KB) |
| `IMPLEMENTATION_COMPLETE.md` | v2.0 feature status and deployment readiness |
| `steering/README.md` | Index for all technical steering docs |
| `plan.md` | Quick reference for development |
| `todo.md` | Current pending tasks |

### Steering Guides (`.claude/steering/`)
- `icon-management-system.md` - Icon/question architecture
- `database-schema-guide.md` - Tables, RLS, queries
- `component-integration-guide.md` - React patterns & data flow
- `supabase-configuration-guide.md` - Backend setup

## Contributing (Docs-First)

Keep documentation aligned with the current codebase. If you change flows, routes, or data shapes, update the relevant steering docs so AI agents and humans can index the latest behavior.

- **Primary index**: `.claude/steering/README.md`
- **Steering docs**: `.claude/steering/*.md`
- **Project notes**: `.claude/plan.md`, `.claude/todo.md`, `.claude/memory.md`

## Deployment

Deployed on Vercel with SPA routing configured in `vercel.json`.

## License

Private
