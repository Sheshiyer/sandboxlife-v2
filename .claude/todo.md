# PROJECT TODO - DashboardV2 Completion

## Current Sprint: Menu Section Pages Game Mode Integration

**Plan:** See `DASHBOARDV2_COMPLETION_PLAN.md` for full details

---

## Phase 1: Core Infrastructure

### In Progress
- [ ] Create GamePageLayout component (`src/components/game/GamePageLayout.jsx`)
  - Wrapper for non-journal pages with dual theme support
  - Props: title, icon, children, showBackButton, backRoute
  - D&D theme: Dark bg, golden accents
  - Classic theme: Transparent/papyrus

---

## Phase 2: Page Conversions

### Pages to Convert (Priority Order)

- [ ] **MyBook.jsx** - Book entries list
  - Remove `disableGameMode()` call
  - Wrap in GamePageLayout (title: "Tome of Tales", icon: "📖")
  - Conditional styling for entry cards
  - Update back navigation

- [ ] **FriendsPage.jsx** - Friend list & requests
  - Remove `disableGameMode()` call
  - Wrap in GamePageLayout (title: "Party Members", icon: "👥")
  - Update FriendCard, AddFriend, FriendRequests components
  - Show D&D level/title on friend cards

- [ ] **InboxPage.jsx** - Conversation list
  - Remove `disableGameMode()` call
  - Wrap in GamePageLayout (title: "Missives", icon: "📬")
  - Update ConversationItem component
  - Global chat → "The Tavern" in game mode

- [ ] **ProfilePage.jsx** - User profile
  - Remove `disableGameMode()` call
  - Wrap in GamePageLayout (title: "Character Profile", icon: "👤")
  - Show D&D title, level, XP bar in game mode
  - Conditional styling for sections

- [ ] **SettingsPage.jsx** - App settings
  - Remove `disableGameMode()` call
  - Wrap in GamePageLayout (title: "Guild Settings", icon: "⚙️")
  - Golden toggle accents in game mode

- [ ] **ConversationPage.jsx** - Individual chat
  - Add `useGameMode()` hook
  - Conditional theming for messages
  - Update MessageBubble, MessageInput

- [ ] **UserProfilePage.jsx** - View other users
  - Add `useGameMode()` hook
  - Wrap in GamePageLayout (title: "Adventurer Profile", icon: "🗡️")
  - Show user's D&D level/title

---

## Phase 3: Sub-component Updates

- [ ] **FriendCard.jsx** - Dark card variant, level badge
- [ ] **AddFriend.jsx** - Dark search input, golden buttons
- [ ] **FriendRequests.jsx** - Dark request cards
- [ ] **ConversationItem.jsx** - Dark variant, golden unread badge
- [ ] **MessageBubble.jsx** - Dark theme, golden own messages
- [ ] **MessageInput.jsx** - Dark input, golden send button

---

## Phase 4: Testing & Polish

- [ ] Navigation flow tests (DashboardV2 ↔ pages ↔ back)
- [ ] Classic mode flow tests (Home ↔ pages ↔ back)
- [ ] Theme consistency across all pages
- [ ] No regressions in existing functionality
- [ ] Mobile responsive testing

---

## Completed

- [x] DashboardV2 game mode hub
- [x] Journal entry flows (Daily, Book, Thought) with QuestLayout
- [x] GameModeContext state management
- [x] Menu dual-theme support
- [x] MyCalendar partial game mode support
- [x] 3D card system with rarity
- [x] Quadrants board layout
- [x] PlayerChoiceModal for new entries

---

## Backlog (Future)

- [ ] Inventory system (GameLayout header button)
- [ ] Quest tracking system
- [ ] Achievement display in game mode
- [ ] Leaderboard in game mode
- [ ] Progression/XP display integration
- [ ] Sound effects for game mode
- [ ] Animated transitions

---

## Notes

- All pages should preserve game mode when navigating FROM DashboardV2
- All pages should preserve classic mode when navigating FROM Home
- Back buttons should return to the correct dashboard based on mode
- Menu "Home" should go to appropriate dashboard based on current mode
