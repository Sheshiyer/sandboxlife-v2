# DnD Card Game Requirements Document

## Introduction
This specification defines the requirements for transforming the `DashboardV2` into **"The Chronicles"** - an immersive, gamified journal dashboard. The goal is to maximize user engagement through high-quality visual feedback (juice), RPG metaphors, and 3D interactivity while preserving the existing Sandbox Life journaling functionality.

## Integration with Existing System
Dashboard V2 uses the **existing** icons, questions, and journal types from the classic dashboard:
- **Icons**: Supabase-hosted SVG icons (Shield, Snake, Butterfly, etc.) stored in `journal_icon` field
- **Journal Types**: `daily_journal`, `book_journal`, `thought_of_the_day`
- **Questions**: From `src/constants/questions.jsx` (book_journal_questions, daily_journal_questions, iconsv2_questions)
- **Data Flow**: Entries fetched via `fetchDashboardV2Entries()` display actual user journal entries

## Glossary
- **Quest_Board**: The main view (formerly Dashboard) - displays journal entries as cards.
- **Campaign_Tome**: Book Journal entries - navigates to `/bookjourney`.
- **Daily Quest**: Daily Journal entries - navigates to `/dailyjournal`.
- **Oracle's Wisdom**: Thought of the Day entries - navigates to `/thoughtoftheday`.
- **Mana**: Entry count score (entries.length * 10).
- **Quadrants**: Mind, Body, Spirit, Heart - mapped from icon meanings in `sigilSystem.js`.

## Requirements

### Requirement 1: The "Tabletop" Experience (Visuals)
**User Story:** As a user, I want the interface to feel like a physical game table, so that journaling feels like an adventure.
- **1.1 Global Atmosphere**: The background MUST be a dynamic texture (options: Tavern Wood, Dungeon Stone, Celestial Void).
- **1.2 Perspective**: The board MUST use CSS 3D transforms (`perspective: 1000px`) to give depth to the table.
- **1.3 Lighting**: Interactive lighting layer that follows the cursor.

### Requirement 2: 3D Artifact Cards (Using Actual Icons)
**User Story:** As a user, I want my journal entries to look like valuable artifacts with their actual icons.
- **2.1 Card Physics**: Cards MUST tilt realistically based on mouse position (Holographic effect).
- **2.2 Icon Display**: Cards MUST display the actual `journal_icon` URL from the database entry.
- **2.3 Quadrant Mapping**: Icons are categorized into Mind/Body/Spirit/Heart quadrants based on their meaning.
- **2.4 Flip Interaction**: Clicking a card MUST trigger a 3D flip animation to reveal entry details on the back.

### Requirement 3: Gamified Progression
**User Story:** As a user, I want immediate visual feedback for my journaling, so that I feel rewarded for staying reflective.
- **3.1 Experience (XP) Bar**: Visualizing progress (entries count/streaks) as an XP bar on the card.
- **3.2 Particle Effects**: Completing a journal entry MUST trigger a particle explosion (Gold coins or magic sparkles).
- **3.3 Sound FX (Optional)**: Subtle sound cues for hover (paper shuffle) and click (stamp/quill scratch).

### Requirement 4: Journal Navigation (Feature Parity)
**User Story:** As a user, I can navigate to actual journal entry flows from the dashboard.
- **4.1 Choice Modal**: The "New Entry" button opens a modal with three choices:
  - Daily Quest → `/dailyjournal`
  - Campaign Tome → `/bookjourney`
  - Oracle's Wisdom → `/thoughtoftheday`
- **4.2 Deck Arrangement**: Users MUST be able to filter/sort entries by quadrant, date, or journal type.
- **4.3 Board/Map Toggle**: Switch between QuadrantsBoard view and TimelineMap view.

### Requirement 5: Technical Performance
- **5.1 60 FPS Target**: All 3D transforms and particle effects MUST run at 60fps on standard hardware.
- **5.2 Reduced Motion**: A "Low Fantasy" mode (Reduced Motion) MUST be available that disables tilt/particles for accessibility.

## Data Flow
```
User Entries (Supabase) → fetchDashboardV2Entries() → DashboardV2.jsx
  ↓
getCardDisplayData(entry) maps:
  - entry.journal_icon → Card icon (actual SVG URL)
  - entry.journal_meaning → Quadrant (via MEANING_TO_QUADRANT map)
  - entry.journal_type → Fallback quadrant
```

## Future Features (See game-system-design.md)

### Phase 2: Progression System
- XP & Leveling (journal entries earn XP)
- Icon mastery tracking (use icons to "master" them)
- Icon pack unlocks (Set B unlocks at level 10)

### Phase 3: Social Integration ("The Tavern")
- Party (Friends list) - restyle existing FriendsPage
- Rookery (Messages) - restyle existing InboxPage  
- Guild Hall (Group chats) - restyle existing ConversationPage
- Quest Board (Challenges) - new feature

### Phase 4: Monetization
- Premium icon packs
- Avatar frames
- XP boosters
- Early access to new sets
