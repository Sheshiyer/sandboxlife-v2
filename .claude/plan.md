# SandboxLife Development Guidelines

## Commands
```bash
npm run dev      # Dev server (localhost:5173)
npm run build    # Production build
npm run lint     # ESLint (zero warnings)
npm run preview  # Preview prod build
```

## Key File Locations
| Task | File |
|------|------|
| Icon/Question data | src/constants/questions.jsx |
| Database operations | src/utils/supabase.jsx |
| Icon selection UI | src/components/IconSelectionWindow.jsx |
| Journal entry form | src/components/JournalEntrySection.jsx |
| Daily journal page | src/pages/DailyJournal.jsx |
| Book journal page | src/pages/BookJourney.jsx |
| Dashboard v2 | src/pages/DashboardV2.jsx |
| Set B preview | src/pages/SetBCollection.jsx |

## Core Patterns

### Multi-step Form Flow
```
currentStep: 1 → IconSelectionWindow → 2 → JournalEntrySection → 3 → PearlsOfWisdomWindow (book only)
```

### Database Insert
```javascript
insertJournalEntry(userId, journalType, journalId, journalIcon, journalMeaning, journalEntry, wisdomMessage, createdAt)
```

### UUID Conventions
- Daily: `d_[name]` (e.g., d_butterfly)
- Book: `b_[name]` (e.g., b_shield)
- Thought: `t_[name]` (converted from d_)

## Critical Rules
- Daily journal limit: 5 entries/day (enforced in DailyJournal.jsx)
- Tailwind colors: bgpapyrus (#f5f5dc), lightpapyrus (#fafaf0), darkpapyrus (#e5e5c7), red (#9B1D1E)
- Icon storage: Supabase bucket "new_icons" with signed URLs (v1), local JPGs in `src/assets/iconsv2` (v2)
- RLS enabled: Users can only access their own entries
- Entry date: JournalEntrySection lets users select a date, stored as `created_at`

## Icon Update Checklist
1. Create SVG, upload to Supabase storage
2. Generate signed URL (1 year expiry)
3. Add to questions.jsx with unique UUID
4. Test icon display → selection → save → retrieval

## Iconsv2 Checklist (Set B)
1. Add JPG asset to `src/assets/iconsv2`
2. Import and append to `iconsv2_questions`
3. Verify Set B preview card and collection view

## Common Queries
```javascript
// Fetch recent entries
fetchTopUserRecords(userId) // → 6 most recent (excludes thought_of_the_day)

// Count today's entries
fetchDailyEntryCount(userId, entryDate) // → number

// Fetch by type
fetchEntries(userId, journalType, limit)

// Fetch date range
fetchAllEntries(userId, startDay, lastDay)
```

## Detailed Docs
See `steering/` folder for comprehensive guides:
- component-integration-guide.md - React patterns & props
- database-schema-guide.md - SQL, queries, RLS
- icon-management-system.md - Icon system architecture
- icon-update-workflow.md - Step-by-step update process
- supabase-configuration-guide.md - Backend setup
