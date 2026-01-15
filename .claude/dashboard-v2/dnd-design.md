# DnD Card Game Design Document (Dashboard V2)

## Overview
This document defines the creative vision for the "SandboxLife Chronicles" - a D&D-themed restyling of the user dashboard. The interface mimics a physical "Quest Board" where **existing journal entries** are displayed as "Campaign Cards" with their **actual icons** from the Sandbox Life icon system.

## Integration with Classic Dashboard
Dashboard V2 is a **restyled version** of the classic dashboard, not a replacement:
- Uses same data source: `user_journal_entries` table
- Displays same icons: Supabase-hosted SVGs (Shield, Butterfly, Snake, etc.)
- Same journal types: `daily_journal`, `book_journal`, `thought_of_the_day`
- Navigation flows to existing journal pages (`/dailyjournal`, `/bookjourney`, `/thoughtoftheday`)

## Aesthetic Vision: "The Arcane Tabletop"
- **Visual Style**: Cinematic, rich, tactile. Think "Hearthstone" meets "D&D Beyond" but for journaling.
- **Lighting**: Dynamic lighting effects, shadows that respond to mouse movement.
- **Physics**: Cards have weight, tilt on hover, and flip with satisfying "snap" animations.

## Core Metaphors
| Sandbox Life Term | DnD Web App Term | Visual Representation |
| :--- | :--- | :--- |
| **Daily Journal** | **Daily Quest** | Blue-bordered card with 📜 icon in choice modal. |
| **Book Journal** | **Campaign Tome** | Purple-bordered card with 📖 icon in choice modal. |
| **Thought of Day** | **Oracle's Wisdom** | Yellow-bordered card with ✨ icon in choice modal. |
| **Entry Count** | **Mana** | Score displayed as `entries.length * 10`. |
| **Icon Meaning** | **Quadrant** | Mind/Body/Spirit/Heart based on meaning mapping. |

## Component Architecture

### The Table (Layout)
`GameLayout.jsx`
- **Background**: High-res texture (wood/stone) with vignette.
- **Perspective**: Slight camera tilt to give depth.
- **Atmosphere**: subtle particle effects (dust motes, magic sparks).

### The Artifacts (Cards)
`Card3D.jsx`
- **Icon Display**: Shows actual `journal_icon` URL from entry (Supabase SVG).
- **Structure**: 
    - **Face**: Entry icon, title (meaning), date, quadrant color scheme.
    - **Back**: Entry details, "Quest Log" view.
- **Interactions**:
    - **Hover**: 3D Tilt (parallax), inner glow, scale up.
    - **Click**: Card flips to reveal back face.

### Player Choice Modal
`PlayerChoiceModal.jsx`
- Three choices map to actual journal routes:
  - Daily Quest → `/dailyjournal`
  - Campaign Tome → `/bookjourney`
  - Oracle's Wisdom → `/thoughtoftheday`

### Sigil System
`sigilSystem.js`
- Maps icon meanings to quadrants (Mind, Body, Spirit, Heart)
- `getCardDisplayData(entry)` returns: title, icon URL, quadrant, color scheme
- Example mappings:
  - "Protection", "Guidance", "Direction" → Mind quadrant
  - "Vitality", "Boundaries" → Body quadrant
  - "Transformation", "Growth" → Spirit quadrant
  - "Love & Friendship", "Recognition" → Heart quadrant

## Design System Tokens
- **Fonts**: 
    - Headers: *Cinzel* or *MedievalSharp* (Google Fonts) - evoking fantasy titles.
    - Body: *Quicksand* or *Lato* - for readability on "parchment".
- **Colors**:
    - **Legendary Gold**: `#FFD700` (accents, streaks).
    - **Mind Blue**: `bg-blue-900`, `border-blue-500`, `text-blue-400`
    - **Body Red**: `bg-red-900`, `border-red-500`, `text-red-400`
    - **Spirit Purple**: `bg-purple-900`, `border-purple-500`, `text-purple-400`
    - **Heart Green**: `bg-green-900`, `border-green-500`, `text-green-400`
    - **Deep Void**: `#0a0a0a` (backgrounds, shadows).

## Animations (Framer Motion)
1. **Deal**: Cards fly in from a specific deck pile.
2. **Flip**: 180-degree rotation with backface-visibility hidden.
3. **Hover**: `rotateX` / `rotateY` based on cursor position.
