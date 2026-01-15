# Classic Dashboard Layout Improvement Requirements

## Introduction

This specification addresses the layout and spacing issues in the classic SandboxLife dashboard (Home.jsx). The current implementation has overlapping elements, poor use of screen space, and inconsistent spacing that creates a cramped user experience. This improvement will modernize the layout while maintaining the classic dashboard functionality.

## Glossary

- **Classic_Dashboard**: The original Home.jsx dashboard implementation (v1)
- **Viewport_Units**: CSS units (vh, vw) that scale relative to viewport dimensions
- **Grid_System**: CSS Grid layout for organizing dashboard components
- **Spacing_System**: Consistent spacing using relative units and design tokens
- **Calendar_Header**: The weekly journal entry overview component
- **Navigation_Section**: The journal-type navigation area near the top of the dashboard
- **Entry_Grid**: The grid layout displaying recent journal entries
- **Menu_Overlay**: The sidebar navigation menu

## Requirements

### Requirement 1: Full Viewport Layout

**User Story:** As a user, I want the dashboard to utilize the full screen space effectively, so that I can see more content and have a better visual experience.

#### Acceptance Criteria

1. THE Classic_Dashboard SHALL use viewport height (100vh) for full screen utilization
2. THE Classic_Dashboard SHALL use viewport width (100vw) for horizontal space optimization
3. WHEN the dashboard loads, THE layout SHALL adapt to any screen size without horizontal scrolling
4. THE main content area SHALL expand to fill available space after header and navigation
5. THE responsive breakpoints SHALL maintain proper proportions across all device sizes

### Requirement 2: Proper Component Spacing

**User Story:** As a user, I want proper spacing between dashboard elements, so that the interface feels clean and organized rather than cramped.

#### Acceptance Criteria

1. THE Calendar_Header SHALL have consistent vertical spacing from surrounding elements
2. THE Navigation_Section SHALL have proper margin separation from adjacent components
3. THE Entry_Grid SHALL use consistent gap spacing between individual cards
4. THE spacing system SHALL use relative units (rem, em) instead of fixed pixels
5. THE vertical rhythm SHALL follow an 8-point spacing system for consistency

### Requirement 3: Eliminate Element Overlapping

**User Story:** As a user, I want all dashboard elements to be clearly separated without overlapping, so that I can interact with each component without interference.

#### Acceptance Criteria

1. WHEN the Menu_Overlay is open, THE main content SHALL not be obscured or overlapped
2. THE Navigation_Section SHALL not overlap with the Calendar_Header
3. THE Entry_Grid cards SHALL have clear boundaries without visual interference
4. THE dashboard toggle SHALL be positioned without overlapping other elements
5. THE Set B preview tile SHALL integrate seamlessly without layout disruption

### Requirement 4: Responsive Grid System

**User Story:** As a user, I want the dashboard layout to work well on all screen sizes, so that I can access my journal entries on any device.

#### Acceptance Criteria

1. THE Entry_Grid SHALL use CSS Grid with responsive column counts
2. WHEN on mobile devices, THE grid SHALL display 1 column with full-width cards
3. WHEN on tablet devices, THE grid SHALL display 2-3 columns with appropriate spacing
4. WHEN on desktop devices, THE grid SHALL display 3-4 columns with optimal spacing
5. THE grid gaps SHALL scale proportionally with screen size

### Requirement 5: Improved Visual Hierarchy

**User Story:** As a user, I want clear visual separation between different sections of the dashboard, so that I can quickly find and focus on specific content areas.

#### Acceptance Criteria

1. THE Calendar_Header SHALL have distinct visual separation from other sections
2. THE Navigation_Section SHALL be visually grouped as a navigation section
3. THE Entry_Grid SHALL have a clear content area with proper boundaries
4. THE section headers SHALL use consistent typography hierarchy
5. THE background colors SHALL create subtle visual zones for different sections

### Requirement 6: Enhanced Card Layout

**User Story:** As a user, I want journal entry cards to be properly sized and spaced, so that I can easily read and interact with my entries.

#### Acceptance Criteria

1. THE journal entry cards SHALL have consistent dimensions across the grid
2. THE card content SHALL be properly padded with readable text spacing
3. THE card images SHALL maintain aspect ratio without distortion
4. THE card hover states SHALL provide clear interactive feedback
5. THE card typography SHALL be legible with proper line height and spacing

### Requirement 7: Menu Integration

**User Story:** As a user, I want the sidebar menu to integrate smoothly with the dashboard layout, so that navigation doesn't disrupt my viewing experience.

#### Acceptance Criteria

1. WHEN the menu is closed, THE dashboard SHALL use full available width
2. WHEN the menu is open, THE dashboard content SHALL adjust gracefully
3. THE menu overlay SHALL not interfere with dashboard scrolling
4. THE menu toggle SHALL be easily accessible without layout conflicts
5. THE menu animation SHALL be smooth without causing layout shifts

### Requirement 8: Performance Optimization

**User Story:** As a user, I want the improved dashboard to load quickly and perform smoothly, so that my journaling workflow is not interrupted.

#### Acceptance Criteria

1. THE layout changes SHALL not impact component rendering performance
2. THE CSS Grid implementation SHALL be optimized for smooth scrolling
3. THE responsive breakpoints SHALL not cause layout thrashing
4. THE image loading SHALL be optimized to prevent layout shifts
5. THE component re-renders SHALL be minimized during layout updates
