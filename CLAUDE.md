# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sandbox Life is a reflective journaling React application using symbolic icon-based prompts to guide users through three journaling practices: daily journals, book journeys, and thought-of-the-day entries.

**D&D-Themed Progression System (v2.0)**
- **XP System**: 20 XP/entry + streak bonuses (3-day: +5, 7-day: +15). Formula: `100 × level^1.5`
- **Levels 1-100**: 16 D&D titles from "Wanderer" (Lv1) to "Ascended Author" (Lv100)
- **34 Icons**: 14 Book + 13 Daily + 7 Thought, across 5 rarity tiers (Common → Legendary)
- **19 Achievements**: Journal (6), Streak (6), Social (3), Milestone (4) - awards 50-5000 XP
- **Social**: Friends show level & title, "The Tavern" global chat, leaderboards
- **Automatic**: Database triggers award XP, check unlocks, update streaks on entry insert
- See `.claude/SYSTEM_DESIGN.md` for complete architecture (22KB)

## Commands

```bash
npm run dev      # Start Vite dev server (localhost:5173)
npm run build    # Production build
npm run lint     # ESLint with zero-warning policy
npm run preview  # Preview production build
```

## Architecture

### Tech Stack
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Routing**: React Router v6 with dynamic `:userId` params
- **UI Libraries**: Headless UI, Heroicons, RSuite, Framer Motion
- **State**: React Context API (no Redux)

### Directory Structure
```
src/
├── pages/           # 20 route components
├── components/      # 60+ components organized by feature
│   ├── dashboard/   # Classic dashboard cards
│   ├── game/        # D&D game mode components
│   ├── layouts/     # Layout wrappers
│   ├── navigation/  # Sidebar, nav cards
│   ├── progression/ # Level/XP display
│   ├── friends/     # Social components
│   ├── chat/        # Messaging components
│   └── ui/          # Base UI (Button, Card, Badge, etc.)
├── constants/       # questions.jsx (980 lines of icon themes/questions)
├── context/         # AccessibilityContext, GameModeContext, DashboardV2Context
├── utils/           # supabase.jsx, progression.jsx, social.js
└── assets/          # Icons (book_journal/, daily_journal/, iconsv2/)
```

### Key Patterns

**Multi-step Form Flow**: Journal pages use `currentStep` state to progress through:
1. Icon selection (`IconSelectionWindow`) - carousel-based picker
2. Journal entry (`JournalEntrySection`) - text input
3. Optional wisdom reflection (`PearlsOfWisdomWindow`) - Book journal only
4. Save triggers XP award via database trigger, then redirects to home

**Context Providers** (wrapped in App.jsx):
```jsx
<AccessibilityProvider>     // fontSize, highContrast, reducedMotion (localStorage)
  <GameModeProvider>        // isGameMode toggle for D&D dashboard
    <Context.Provider>      // Global state
```

**Authentication**: Supabase Auth with `userId` stored in localStorage. All protected routes include `:userId` param.

### Routes
**Public**: `/`, `/signup`

**Protected** (all require `:userId`):
- `/home/:userId` - Home dashboard
- `/my-book/:userId`, `/my-calendar/:userId` - Entry views
- `/profile/:userId`, `/settings/:userId` - User pages
- `/chat/:userId`, `/inbox/:userId`, `/friends/:userId` - Social
- `/dashboard-v2/:userId` - D&D game mode dashboard
- `/set-b-collection/:userId` - Icon gallery preview

**Forms** (redirect from nav):
- `/bookjourney`, `/dailyjournal`, `/thoughtoftheday`

### Tailwind Custom Theme
Colors in `tailwind.config.js`:
- `bgpapyrus: #f5f5dc`, `lightpapyrus: #fafaf0`, `darkpapyrus: #e5e5c7`
- `red: #9B1D1E` (accent)
- `primary.green: #6FCF97`, `accent.orange: #F2994A`

### Database Schema (Key Tables)
| Table | Purpose |
|-------|---------|
| `user_journal_entries` | Journal entries with icon, meaning, wisdom |
| `user_progression` | Level (1-100), XP, streak_days, longest_streak, title |
| `user_profiles` | Display name, online status, last_seen_at |
| `friendships` | Friend relationships (pending/accepted/blocked) |
| `conversations`, `messages` | Chat system (direct, group, global) |
| `icon_unlock_requirements` | 34 icon definitions with unlock_type, unlock_value, rarity |
| `user_unlocked_icons` | Per-user unlocks with unlock_method |
| `achievements`, `user_achievements` | 19 achievements with XP rewards |

**Database Triggers** (auto-execute on journal entry):
1. `update_progression_on_entry()` - Awards 20 XP, updates streak, checks unlocks
2. `award_xp()` RPC - Handles level-up logic and title updates
3. `check_icon_unlocks()` - Unlocks icons based on level/entries/streak

### Utility Modules
**`src/utils/supabase.jsx`**: Core database operations
- `insertJournalEntry()`, `fetchTopUserRecords()`, `fetchEntries()`
- `fetchDailyEntryCount()` - enforces 5/day limit
- `fetchAllEntries()`, `fetchWeeklyData()`

**`src/utils/progression.jsx`**: D&D system
- `getUserProgression()`, `awardXP()`, `getIconsForJournal()`
- `getUserAchievements()`, `checkAchievements()`, `getLeaderboard()`

**`src/utils/social.js`**: Social features
- `getFriends()`, `searchUsers()` - returns users with `level` & `title`
- `sendFriendRequest()`, `acceptFriendRequest()`, `blockUser()`
- `getConversations()`, `sendMessage()`, `getMessages()`

### Icon Sets
- **V1**: Signed Supabase URLs in `daily_journal_questions`, `book_journal_questions`
- **V2 (Set B)**: Local JPG assets in `src/assets/iconsv2/` exported as `iconsv2_questions`

## Documentation

**Core Docs** (`.claude/`):
- `SYSTEM_DESIGN.md` - Complete D&D progression architecture (XP, levels, icons, achievements)
- `IMPLEMENTATION_COMPLETE.md` - v2.0 feature status

**Steering Guides** (`.claude/steering/`):
- `icon-management-system.md` - Icon architecture
- `database-schema-guide.md` - Tables, RLS, queries
- `component-integration-guide.md` - React component flow
- `supabase-configuration-guide.md` - Backend setup
- `icon-update-workflow.md` - Update procedures

## Deployment
Hosted on Vercel with SPA rewrites in `vercel.json`.
