# DashboardV2 Completion Plan - Menu Section Pages

## Overview

The DashboardV2 game mode is functional for journal entry flows, but the menu navigation pages (Profile, Settings, Friends, Inbox, MyBook) currently force-disable game mode. This plan covers converting these pages to support D&D theming while maintaining classic mode compatibility.

## Current State

### ✅ Done (Game Mode Enabled)
- `DashboardV2.jsx` - Game mode hub with 3D cards, quadrants
- `DailyJournal.jsx` - Uses QuestLayout, conditional theming
- `BookJourney.jsx` - Uses QuestLayout, conditional theming
- `ThoughtOfTheDay.jsx` - Uses QuestLayout, conditional theming
- `MyCalendar.jsx` - Has game mode detection, partial theming
- `Menu.jsx` - Dual theme support via `isDnDTheme` prop
- `GameModeContext.jsx` - State management for game mode

### ❌ Not Done (Force Classic Mode)
These pages call `disableGameMode()` on mount:
1. `ProfilePage.jsx` - User profile view/edit
2. `SettingsPage.jsx` - App settings
3. `FriendsPage.jsx` - Friend list & requests
4. `InboxPage.jsx` - Conversation list
5. `MyBook.jsx` - Book journal entries list
6. `ConversationPage.jsx` - Individual chat view
7. `UserProfilePage.jsx` - View other users' profiles

---

## Implementation Strategy

### Phase 1: Create GamePageLayout Component
Create a shared layout wrapper for non-journal pages (similar to QuestLayout but for navigation pages).

**File:** `src/components/game/GamePageLayout.jsx`

**Features:**
- Detects game mode via `useGameMode()` hook
- D&D theme: Dark background, golden accents, medieval styling
- Classic theme: Papyrus background, existing styling
- Consistent header with back navigation
- Page title with icon support

### Phase 2: Convert Menu Section Pages
Convert each page to use conditional theming instead of forcing classic mode.

**Priority Order:**
1. MyBook - Most used, list view pattern
2. FriendsPage - Social features, card-based
3. InboxPage - Conversation list
4. ProfilePage - User profile
5. SettingsPage - App settings
6. ConversationPage - Chat interface
7. UserProfilePage - View other profiles

### Phase 3: Polish & Integration
- Ensure navigation flows work seamlessly
- Test all paths between game mode and classic mode
- Add missing D&D-themed UI elements

---

## Detailed Implementation

### Phase 1: GamePageLayout Component

```jsx
// src/components/game/GamePageLayout.jsx
// Wrapper for non-journal pages supporting dual themes

Props:
- title: string (page title)
- icon: string (emoji or icon)
- children: ReactNode
- showBackButton: boolean (default true)
- backRoute: string (optional, defaults to dashboard-v2)

Behavior:
- If isGameMode: Dark theme with golden accents
- If !isGameMode: Transparent wrapper (existing styling)
```

**D&D Theme Styling:**
- Background: `bg-[#0a0a0a]` with texture overlay
- Header: Dark slate with golden border
- Text: `text-white` primary, `text-yellow-500` accents
- Cards: `bg-slate-800/60 border-yellow-500/20`
- Back button: Returns to `/dashboard-v2/:userId`

**Classic Theme:**
- Returns children unwrapped (existing behavior)
- Or minimal wrapper with papyrus background

---

### Phase 2A: Convert MyBook.jsx

**Current:** Forces classic mode, papyrus theme
**Target:** Support both themes via GamePageLayout

**Changes:**
1. Remove `disableGameMode()` call
2. Wrap content in `<GamePageLayout title="Tome of Tales" icon="📖">`
3. Add conditional styling for entry cards
4. Update back navigation based on mode

**D&D Theme Elements:**
- Title: "📖 Tome of Tales" (instead of "My Book")
- Entry cards: Dark slate with golden borders
- Empty state: Medieval-themed message
- Pagination: Dark buttons with golden text

---

### Phase 2B: Convert FriendsPage.jsx

**Current:** Forces classic mode
**Target:** Support both themes

**Changes:**
1. Remove `disableGameMode()` call
2. Wrap in `<GamePageLayout title="Party Members" icon="👥">`
3. Conditional styling for friend cards
4. Update AddFriend and FriendRequests components

**D&D Theme Elements:**
- Title: "👥 Party Members" (instead of "Friends")
- Friend cards: Show level & D&D title prominently
- Request cards: Golden border accents
- Search: Dark input with golden focus ring

---

### Phase 2C: Convert InboxPage.jsx

**Current:** Forces classic mode
**Target:** Support both themes

**Changes:**
1. Remove `disableGameMode()` call
2. Wrap in `<GamePageLayout title="Missives" icon="📬">`
3. Conditional styling for conversation items
4. Update ConversationItem component

**D&D Theme Elements:**
- Title: "📬 Missives" (instead of "Inbox")
- Global chat: "🍺 The Tavern"
- Conversation items: Dark cards with golden unread badges
- New message button: Golden accent

---

### Phase 2D: Convert ProfilePage.jsx

**Current:** Forces classic mode, RSuite components removed
**Target:** Support both themes

**Changes:**
1. Remove `disableGameMode()` call
2. Wrap in `<GamePageLayout title="Character Profile" icon="👤">`
3. Conditional styling for profile sections
4. Show D&D title and level prominently in game mode

**D&D Theme Elements:**
- Title: "👤 Character Profile"
- Avatar: Golden border with level badge
- Stats: XP bar, streak fire, achievement count
- Bio section: Dark card with golden accents

---

### Phase 2E: Convert SettingsPage.jsx

**Current:** Forces classic mode
**Target:** Support both themes

**Changes:**
1. Remove `disableGameMode()` call
2. Wrap in `<GamePageLayout title="Guild Settings" icon="⚙️">`
3. Conditional styling for settings sections
4. Toggle switches with golden accents

**D&D Theme Elements:**
- Title: "⚙️ Guild Settings"
- Sections: Dark cards with golden headers
- Toggles: Golden active state
- Buttons: Dark slate with golden borders

---

### Phase 2F: Convert ConversationPage.jsx

**Current:** Not game mode aware
**Target:** Support both themes

**Changes:**
1. Add `useGameMode()` hook
2. Wrap in `<GamePageLayout>` or inline conditional
3. Conditional styling for messages
4. Dark theme for chat interface

**D&D Theme Elements:**
- Header: Show user's D&D title
- Messages: Dark bubbles with golden accents for own messages
- Input: Dark with golden focus ring
- System messages: Medieval styled

---

### Phase 2G: Convert UserProfilePage.jsx

**Current:** Not game mode aware
**Target:** Support both themes

**Changes:**
1. Add `useGameMode()` hook
2. Wrap in `<GamePageLayout title="Adventurer Profile" icon="🗡️">`
3. Show other user's D&D level/title
4. Action buttons (Message, Add Friend) with game styling

---

## Component Updates Required

### Sub-components Needing Dual Theme Support

1. **FriendCard.jsx**
   - Add `isDnDTheme` prop or use context
   - Dark card variant with golden border
   - Level badge styling

2. **AddFriend.jsx**
   - Dark search input
   - Golden button accents
   - Search results with D&D styling

3. **FriendRequests.jsx**
   - Dark request cards
   - Accept/Decline buttons with game styling

4. **ConversationItem.jsx**
   - Dark card variant
   - Golden unread badge
   - Level indicator

5. **MessageBubble.jsx**
   - Dark theme variant
   - Own messages: Golden accent
   - Other messages: Slate

6. **MessageInput.jsx**
   - Dark input field
   - Golden send button

---

## Navigation Flow Updates

### From DashboardV2 Menu
When user clicks menu item from DashboardV2:
- Game mode stays ENABLED
- Page renders in D&D theme
- Back button returns to DashboardV2

### From Classic Home Menu
When user clicks menu item from Home:
- Game mode stays DISABLED
- Page renders in classic theme
- Back button returns to Home

### Menu "Home" Behavior
- In game mode: Go to `/dashboard-v2/:userId`
- In classic mode: Go to `/home/:userId`
- Or: Add explicit "Classic View" / "Game View" options

---

## File Checklist

### New Files to Create
- [ ] `src/components/game/GamePageLayout.jsx`

### Files to Modify
- [ ] `src/pages/MyBook.jsx`
- [ ] `src/pages/FriendsPage.jsx`
- [ ] `src/pages/InboxPage.jsx`
- [ ] `src/pages/ProfilePage.jsx`
- [ ] `src/pages/SettingsPage.jsx`
- [ ] `src/pages/ConversationPage.jsx`
- [ ] `src/pages/UserProfilePage.jsx`
- [ ] `src/components/friends/FriendCard.jsx`
- [ ] `src/components/friends/AddFriend.jsx`
- [ ] `src/components/friends/FriendRequests.jsx`
- [ ] `src/components/chat/ConversationItem.jsx`
- [ ] `src/components/chat/MessageBubble.jsx`
- [ ] `src/components/chat/MessageInput.jsx`

---

## Testing Checklist

### Navigation Tests
- [ ] DashboardV2 → Menu → MyBook → Back → DashboardV2
- [ ] DashboardV2 → Menu → Friends → Back → DashboardV2
- [ ] DashboardV2 → Menu → Inbox → Conversation → Back → DashboardV2
- [ ] DashboardV2 → Menu → Profile → Back → DashboardV2
- [ ] DashboardV2 → Menu → Settings → Back → DashboardV2
- [ ] Home → Menu → MyBook → Back → Home (classic theme)
- [ ] Home → Menu → Friends → Back → Home (classic theme)

### Theme Consistency Tests
- [ ] All pages render correctly in game mode
- [ ] All pages render correctly in classic mode
- [ ] Menu theme matches current page theme
- [ ] No flash of wrong theme on navigation

### Functional Tests
- [ ] Friend requests work in game mode
- [ ] Conversations work in game mode
- [ ] Profile edit works in game mode
- [ ] Settings save works in game mode
- [ ] Book entries display in game mode

---

## Estimated Effort

| Task | Complexity | Est. Time |
|------|------------|-----------|
| GamePageLayout component | Medium | 30 min |
| MyBook conversion | Low | 20 min |
| FriendsPage conversion | Medium | 30 min |
| InboxPage conversion | Medium | 25 min |
| ProfilePage conversion | Medium | 30 min |
| SettingsPage conversion | Low | 20 min |
| ConversationPage conversion | Medium | 25 min |
| UserProfilePage conversion | Low | 15 min |
| Sub-component updates | Medium | 45 min |
| Testing & polish | Medium | 30 min |
| **Total** | | **~4.5 hours** |

---

## Success Criteria

1. ✅ All menu pages work in both game mode and classic mode
2. ✅ Navigation from DashboardV2 maintains game mode
3. ✅ Navigation from Home maintains classic mode
4. ✅ Back buttons return to correct dashboard
5. ✅ Theme is consistent throughout navigation flow
6. ✅ No regressions in existing functionality
7. ✅ D&D titles and levels display in social pages

---

**Status:** Ready for Implementation
**Created:** January 15, 2026
**Priority:** High - Completes DashboardV2 feature set
