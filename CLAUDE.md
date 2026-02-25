# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sandbox Life is a reflective journaling React application that uses symbolic icon-based prompts to guide users through three journaling practices: daily journals, book journeys, and thought-of-the-day entries.

**NEW: D&D-Themed Progression System (v2.0)**
- Icon unlock/progression system with XP, levels 1-100, and 16 D&D-themed titles
- 34 total icons across journal types (Common → Legendary rarity)
- 19 achievements (Journal, Streak, Social, Milestone categories)
- Social features integrated with D&D theming (friends show level & title)
- Automatic progression tracking via database triggers
- See `SYSTEM_DESIGN.md` for complete system architecture

## Commands

All commands are run from the `sandboxlifebeta/` directory:

```bash
npm run dev      # Start Vite dev server (localhost:5173)
npm run build    # Production build
npm run lint     # ESLint with zero-warning policy
npm run preview  # Preview production build
```

## Architecture

### Tech Stack
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Routing**: React Router v6 with dynamic `:userId` params
- **UI Libraries**: Headless UI, Heroicons, RSuite

### Directory Structure
```
sandboxlifebeta/src/
├── pages/           # Route components (11 pages)
├── components/      # Reusable UI components (14 files)
├── constants/       # Static data (questions.jsx, formFields.jsx)
├── utils/           # supabase.jsx (DB ops), helpers.jsx (utilities)
└── assets/          # Icons organized by journal type
```

### Key Patterns

**Multi-step Form Flow**: Journal pages use `currentStep` state to progress through:
1. Icon selection (`IconSelectionWindow`)
2. Journal entry (`JournalEntrySection`)
3. Optional wisdom reflection (`PearlsOfWisdomWindow`)

**Database Schema** (`user_journal_entries` table):
- `user_id`, `journal_type`, `journal_id` (uuid), `journal_icon`, `journal_meaning`, `journal_entry`, `wisdom_message`, `created_at`

**Authentication**: Supabase Auth with `user_id` stored in localStorage. Protected routes include userId in URL params.

### Routes
- `/` - Login
- `/signup` - Signup
- `/home/:userId` - Home (recent entries + thought of day)
- `/my-book/:userId` - Book journal entries
- `/my-calendar/:userId` - Calendar view
- `/bookjourney`, `/dailyjournal`, `/thoughtoftheday` - Journal entry flows
- `/profile/:userId`, `/settings/:userId`, `/chat/:userId` - User pages

### Tailwind Custom Theme
Custom colors defined in `tailwind.config.js`:
- `bgpapyrus`: #f5f5dc (main background)
- `lightpapyrus`: #fafaf0
- `darkpapyrus`: #e5e5c7
- `red`: #9B1D1E (accent)

Custom fonts: Graphik (sans), Merriweather (serif)

### Supabase Operations
All database functions are in `src/utils/supabase.jsx`:
- `insertJournalEntry()` - Create entry
- `fetchTopUserRecords()` - Get 6 most recent (excludes thought_of_the_day)
- `fetchEntries()` - Get entries by type with limit
- `fetchDailyEntryCount()` - Count today's entries (used for 5/day limit)
- `fetchAllEntries()` - Get entries in date range
- `fetchWeeklyData()` - Get last 5 entries chronologically

**NEW Progression Functions** (`src/utils/progression.jsx`):
- `getUserProgression(userId)` - Get level, XP, title, streak
- `awardXP(userId, amount)` - Award XP (auto-called by trigger)
- `getIconsForJournal(userId, type)` - Get icons with unlock status
- `getUserAchievements(userId)` - Get earned achievements
- `checkAchievements(userId)` - Check and award new achievements
- `getLeaderboard(limit, orderBy)` - Top users
- See `SYSTEM_DESIGN.md` for complete API reference

**Social Functions Enhanced** (`src/utils/social.js`):
- `getFriends(userId)` - NOW returns friends with `level` & `title`
- `searchUsers(query)` - NOW returns users with `level` & `title`
- All other social functions unchanged (messaging, conversations, etc.)

### Journal Question Data
`src/constants/questions.jsx` contains icon themes with associated questions:
- **Book Journal**: 18 themes (Shield, Snake, Treasure, etc.) with multiple questions each
- **Daily Journal**: 24 themes with single or array questions
- **Thought of the Day**: Single daily reflection

## Deployment
- Hosted on Vercel with SPA rewrites configured in `vercel.json`
