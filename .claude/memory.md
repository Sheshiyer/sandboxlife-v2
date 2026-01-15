# PROJECT MEMORY

## Overview
SandboxLife Beta is a reflective journaling React app that uses symbolic icon prompts for daily journals, book journals, and thought-of-the-day entries.

## Current Architecture Notes
- **Routing**: `src/App.jsx` defines classic dashboard (`/home/:userId`), dashboard v2 (`/dashboard-v2/:userId`), journaling flows, calendar, and Set B collection (`/set-b-collection/:userId`).
- **Supabase**: Client is configured directly in `src/utils/supabase.jsx` with hardcoded URL/key.
- **Entry Dates**: JournalEntrySection includes an entry date picker; selected date is stored as `created_at` (no separate entry date field).

## Icon Sets
- **V1 icons**: `daily_journal_questions` and `book_journal_questions` use Supabase signed URLs.
- **V2 icons (Set B)**: Local JPG assets under `src/assets/iconsv2` exposed via `iconsv2_questions`.
- **Set B preview**: `SetBPreviewCard` on Home links to `SetBCollection` for preview-only browsing.

## Dashboard v2 Status (MVP)
- `DashboardV2.jsx` provides a card-first shell with search, filter chips, skeletons, and focus mode UI.
- Data helpers live in `src/utils/dashboardV2.js`.
- Context provider exists in `src/context/DashboardV2Context.jsx` but is not yet wired into `DashboardV2.jsx`.
- Focus mode toggle is wired; next/prev handlers are placeholders.

## Key Files
- Icon data: `src/constants/questions.jsx`
- Entry creation: `src/components/IconSelectionWindow.jsx`, `src/components/JournalEntrySection.jsx`
- Calendar views: `src/components/CalendarDateHeader.jsx`, `src/pages/MyCalendar.jsx`
- Supabase helpers: `src/utils/supabase.jsx`

---

Keep this file current with actual implementation and avoid logging aspirational features as completed.
