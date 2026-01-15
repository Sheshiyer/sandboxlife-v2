# Dashboard v2 Tasks (Current)

## Implemented (MVP)
- [x] Dashboard v2 route (`/dashboard-v2/:userId`) and toggle in classic dashboard
- [x] Dashboard v2 page shell with search + filters UI
- [x] Read-only Supabase helpers (`src/utils/dashboardV2.js`)
- [x] Skeleton loading components (`src/components/Skeletons.jsx`)
- [x] Focus mode UI shell + toggle (`FocusMode.jsx`, `FocusModeToggle.jsx`)
- [x] Next Up + Recent Activity modules (UI shell)
- [x] Dashboard v2 context provider (not yet wired into DashboardV2.jsx)

## Pending
- [ ] Wire DashboardV2Context into `DashboardV2.jsx`
- [ ] Implement focus mode navigation and active index handling
- [ ] Connect search/filter state to real data queries (beyond client-side filtering)
- [ ] Add accessibility tooling (contrast, text size, keyboard shortcuts)
- [ ] Expand tests beyond export/utility coverage

---

This file tracks the current MVP scope. Avoid listing components that do not exist in the repo.
