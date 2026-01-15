# Set B Preview Implementation Guide

## Overview

Set B is a preview-only icon collection based on the local `iconsv2_questions` data set. It is visible in the classic dashboard sidebar and links to a dedicated preview page where users can browse the icons and see their trigger questions.

## What Exists Today

### Components
- `src/components/SetBPreviewCard.jsx`: Dashboard card that links to the Set B preview page.

### Page
- `src/pages/SetBCollection.jsx`: Preview-only collection page with grid and carousel views, plus selected icon detail.

### Data Source
- `src/constants/questions.jsx` → `iconsv2_questions`
- Local JPG assets stored in `src/assets/iconsv2`

## Routing

- Preview page: `/set-b-collection/:userId`
- Entry point: Set B preview card in `src/pages/Home.jsx`

## Key Behaviors

- Preview notice is displayed on the collection page.
- Selecting an icon shows its trigger questions.
- No database writes are performed from the Set B page.

## Update Checklist

1. Add new JPG assets to `src/assets/iconsv2`.
2. Import and append metadata in `iconsv2_questions`.
3. Verify Set B preview card shows correct counts.
4. Validate grid + carousel view modes in `SetBCollection`.

---

Keep this document aligned with the current Set B preview flow and avoid referencing non-existent routes or components.
