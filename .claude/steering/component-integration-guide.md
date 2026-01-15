# SandboxLife Component Integration Guide - Kiro Steering Documentation

## Overview

This document provides comprehensive guidance for understanding and working with the React components that handle icon selection, journal entry creation, and data flow in the SandboxLife application.

## Component Architecture

### Core Components Hierarchy

```
App.jsx
├── TopBar.jsx (Navigation bar)
├── Menu.jsx (Sidebar navigation)
├── Breadcrumb.jsx (Route context)
├── CalendarDateHeader.jsx (Recent entry strip)
└── Journal Pages
    ├── DailyJournal.jsx
    ├── BookJourney.jsx
    └── ThoughtOfTheDay.jsx
        ├── IconSelectionWindow.jsx
        ├── JournalEntrySection.jsx
        └── PearlsOfWisdomWindow.jsx (Book journals only)
```

### Data Flow Architecture

```
Constants (questions.jsx)
    ↓
IconSelectionWindow (Icon selection)
    ↓
JournalEntrySection (Entry writing)
    ↓
Supabase (Database storage)
    ↓
Home.jsx / DashboardV2.jsx (Entry display)
```

## Component Specifications

### IconSelectionWindow.jsx

#### Purpose
Displays a carousel of available icons for users to select before writing their journal entry.

#### Props Interface
```javascript
{
  icons: Array,           // Array of icon objects from constants
  onSave: Function,       // Callback to proceed to next step
  setSelectedIconTheme: Function, // State setter for selected icon
  dailyEntryCount: Number // Current daily entry count (for limit enforcement)
}
```

#### Key Features
- **Carousel Navigation**: Previous/Next buttons for icon browsing
- **Icon Selection**: Click to select icon with visual feedback
- **Daily Limit Enforcement**: Prevents exceeding 5 daily entries
- **Responsive Design**: Adapts to mobile and desktop screens

#### State Management
```javascript
const [selectedIcon, setSelectedIcon] = useState({ name: '', meaning: '' });
const [startIndex, setStartIndex] = useState(0);
```

#### Integration Points
```javascript
// Icon data structure expected
{
  journal_type: "daily_journal",
  name: "Butterfly",
  meaning: "Transformation",
  icon: "https://supabase-url..." // or local asset import
  trigger_question: ["Question 1", "Question 2"],
  uuid: "d_butterfly"
}
```

### JournalEntrySection.jsx

#### Purpose
Provides the main writing interface where users compose their journal entries based on the selected icon and trigger questions.

#### Props Interface
```javascript
{
  triggerQuestion: String|Array, // Question(s) to display
  triggerIcon: String,          // Icon URL
  journalType: String,          // Type of journal entry
  chapterEntry: String,         // Placeholder text
  onCancel: Function,           // Return to icon selection
  saveToDb: Function,           // Save entry to database
  journalEntry: String,         // Current entry text
  setJournalEntry: Function,    // Entry text setter
  changeQuestion: Function,     // Question randomization (optional)
  isLimitReached: Boolean,      // Daily limit status (optional)
  entryDate: String,            // Selected entry date (YYYY-MM-DD)
  setEntryDate: Function        // Entry date setter
}
```

#### Key Features
- **Question Display**: Shows trigger questions for reflection
- **Text Editor**: Rich text area for journal writing
- **Question Cycling**: Ability to change questions for variety
- **Save/Cancel Actions**: Navigation and data persistence
- **Entry Date**: Date picker stores entry date in `created_at`

### PearlsOfWisdomWindow.jsx

#### Purpose
Additional step for book journals to capture insights and wisdom from the journaling experience.

#### Props Interface
```javascript
{
  triggerQuestion: Array,       // Original trigger questions
  triggerIcon: String,          // Icon URL
  chapterEntry: String,         // Section title
  onCancel: Function,           // Return to previous step
  onSave: Function,             // Final save to database
  wisdomMessage: String,        // Wisdom content
  setWisdomMessage: Function    // Wisdom content setter
}
```

### CalendarDateHeader.jsx

#### Purpose
Displays a recent-entry overview of journal entries with icons, providing visual navigation through recent journaling activity.

#### Props Interface
```javascript
// No props - component manages its own state
```

#### Key Features
- **Recent Entry Display**: Shows the five most recent entries sorted by `created_at`
- **Current Item Highlighting**: Highlights the most recent item (index 4)
- **Icon Thumbnails**: Displays journal entry icons as visual indicators
- **Date Formatting**: Shows formatted dates below each icon

#### State Management
```javascript
const [weeklyData, setweeklyData] = useState([]);
```

#### Integration Points
```javascript
// Fetches recent data from Supabase
const result = await fetchWeeklyData(storedUserId);

// Uses formatDatetime helper for date display
{formatDatetime(day.created_at).date}
```

#### Styling Implementation
- **Design System Integration**: Uses papyrus colors, rounded corners, and subtle shadows
- **Layout**: Compact horizontal layout sized for five entries
- **Current Item Highlight**: Subtle emphasis on the most recent item

## Journal Page Components

### DailyJournal.jsx

#### Workflow Steps
1. **Icon Selection** (`currentStep = 1`)
2. **Journal Entry** (`currentStep = 2`)

#### Key Features
- **Daily Limit**: Enforces 5 entries per day
- **Entry Count Tracking**: Fetches and displays current count
- **Question Randomization**: Cycles through available questions
- **Entry Date**: Allows back-dated entries via `created_at`
 - **Daily Count Scope**: Uses the selected entry date to compute limits

#### State Management
```javascript
const [currentStep, setCurrentStep] = useState(1);
const [selectedIconTheme, setSelectedIconTheme] = useState('');
const [journalEntry, setJournalEntry] = useState('');
const [dailyEntryCount, setDailyEntryCount] = useState(0);
const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
```

### BookJourney.jsx

#### Workflow Steps
1. **Icon Selection** (`currentStep = 1`)
2. **Journal Entry** (`currentStep = 2`)
3. **Pearls of Wisdom** (`currentStep = 3`)

#### Key Features
- **Three-Step Process**: Extended workflow for comprehensive entries
- **Wisdom Collection**: Additional insights capture
- **No Daily Limits**: Unlimited entries per day
- **Entry Date**: Allows back-dated entries via `created_at`

#### State Management
```javascript
const [currentStep, setCurrentStep] = useState(1);
const [selectedIconTheme, setSelectedIconTheme] = useState('');
const [journalEntry, setJournalEntry] = useState('');
const [wisdomMessage, setWisdomMessage] = useState('');
const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
```

### ThoughtOfTheDay.jsx

#### Workflow Steps
1. **Icon Selection** (`currentStep = 1`)
2. **Journal Entry** (`currentStep = 2`)

#### Key Features
- **Simplified Flow**: Two-step process for quick thoughts
- **UUID Conversion**: Converts daily UUIDs to thought format (`d_` → `t_`)
- **Status Updates**: Brief, status-like entries
- **Entry Date**: Uses `created_at` override for back-dated entries

## Integration Patterns

### Icon Data Flow

```javascript
// 1. Import icon constants
import { daily_journal_questions, book_journal_questions } from '../constants/questions';

// 2. Pass to IconSelectionWindow
<IconSelectionWindow
  icons={daily_journal_questions}
  setSelectedIconTheme={setSelectedIconTheme}
  onSave={() => setCurrentStep(2)}
  dailyEntryCount={dailyEntryCount}
/>

// 3. Use selected icon in JournalEntrySection
<JournalEntrySection
  triggerQuestion={selectedIconTheme.trigger_question}
  triggerIcon={selectedIconTheme.icon}
  journalType={selectedIconTheme.journal_type}
  // ... other props
/>
```

`iconsv2_questions` is used in `SetBCollection.jsx` for preview-only browsing.

### Database Integration

```javascript
// Save function pattern
const saveToDb = async () => {
  const createdAt = entryDate ? new Date(`${entryDate}T12:00:00`).toISOString() : undefined;
  const dbOperation = await insertJournalEntry(
    userId,
    selectedIconTheme.journal_type,
    selectedIconTheme.uuid,
    selectedIconTheme.icon,
    selectedIconTheme.meaning,
    journalEntry,
    wisdomMessage, // null for daily journals
    createdAt
  );
  
  if (dbOperation.success) {
    toast.success('Saved successfully!');
    navigate(`/home/${userId}`);
  } else {
    toast.error('Something went wrong while saving');
  }
};
```

### Navigation Flow

```javascript
// Step management pattern
const renderComponents = () => {
  switch (currentStep) {
    case 1:
      return <IconSelectionWindow {...iconProps} />;
    case 2:
      return <JournalEntrySection {...entryProps} />;
    case 3: // Book journals only
      return <PearlsOfWisdomWindow {...wisdomProps} />;
    default:
      return <div>Default component</div>;
  }
};
```

## State Management Patterns

### Local State Structure
```javascript
// Common state across journal pages
const [currentDate, setCurrentDate] = useState(new Date());
const [isMenuOpen, setIsMenuOpen] = useState(false);
const [currentStep, setCurrentStep] = useState(1);
const [selectedIconTheme, setSelectedIconTheme] = useState('');
const [journalEntry, setJournalEntry] = useState('');
const [userId, setUserId] = useState(null);
const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
```

### Context Usage
```javascript
// Global context for calendar functionality
import { Context } from '../utils/context';
const [context, setContext] = useContext(Context);
```

### Local Storage Integration
```javascript
// User ID persistence
useEffect(() => {
  const storedUserId = localStorage.getItem('user_id');
  setUserId(storedUserId);
}, []);
```

## Error Handling Patterns

### Database Error Handling
```javascript
try {
  const result = await insertJournalEntry(...params);
  if (result.success) {
    // Success handling
  } else {
    toast.error('Database error occurred');
  }
} catch (error) {
  console.error('Error:', error);
  toast.error('Unexpected error occurred');
}
```

### Daily Limit Enforcement
```javascript
const saveToDb = async (isNewEntry = false) => {
  if (dailyEntryCount >= 5) {
    toast.error('You have reached the maximum of 5 entries for today!');
    return;
  }
  // Proceed with save
};
```

## UI Event Handling Patterns

### Click-Outside Handler
```javascript
// Common pattern for closing dropdowns/modals when clicking outside
useEffect(() => {
  const handleClickOutside = (event) => {
    if (isOpen && !event.target.closest('.dropdown-container')) {
      setIsOpen(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [isOpen]);
```

### Keyboard Navigation
```javascript
// Handle keyboard events for accessibility
useEffect(() => {
  const handleKeyDown = (event) => {
    if (event.key === 'Escape' && isOpen) {
      setIsOpen(false);
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
}, [isOpen]);
```

## Styling and UI Patterns

### Responsive Design
```javascript
// Mobile-first responsive classes
className="w-[19rem] sm:w-auto md:w-[40rem]"
className="text-[0.7rem] md:text-lg font-bold"
className="h-5 w-5 md:w-8 md:h-8"
```

### Theme Integration
```javascript
// Tailwind custom colors from tailwind.config.js
className="bg-bgpapyrus"      // #f5f5dc
className="bg-lightpapyrus"   // #fafaf0
className="bg-darkpapyrus"    // #e5e5c7

// Tailwind spacing scale for consistent layouts
className="p-4"               // 16px padding
className="m-8"               // 32px margin
className="gap-6"             // 24px gap
className="space-y-12"        // 48px vertical spacing

// Consistent card styling
className="rounded-2xl"       // 24px border radius
className="shadow-nature-sm"  // Standard card shadow
className="hover:shadow-nature-md" // Hover state shadow
```

### Icon Display Patterns
```javascript
// Icon carousel styling with consistent spacing
className={`mx-1 cursor-pointer ${
  selectedIcon === icon ? 'opacity-100' : 'opacity-50'
}`}

// Icon size responsive with consistent spacing
className="w-10 h-10 md:h-24 md:w-24 rounded-2xl shadow-nature-sm"

// Card layout with design system tokens
className="bg-white rounded-2xl shadow-nature-sm hover:shadow-nature-md p-6 space-y-4"
```

## Testing Considerations

### Component Testing
- **Icon Selection**: Test carousel navigation and selection
- **Entry Saving**: Mock database calls and test success/error flows
- **Step Navigation**: Test workflow progression
- **Responsive Design**: Test across device sizes

### Integration Testing
- **Data Flow**: Test icon selection to database storage
- **User Limits**: Test daily entry limit enforcement
- **Navigation**: Test page transitions and state persistence

### Error Scenarios
- **Network Failures**: Test offline/connection issues
- **Invalid Data**: Test malformed icon data
- **Authentication**: Test unauthorized access

## Performance Optimization

### Component Optimization
```javascript
// Memoization for expensive operations
const visibleIcons = useMemo(() => 
  icons.slice(startIndex, startIndex + 5), 
  [icons, startIndex]
);

// Debounced text input
const debouncedSetEntry = useCallback(
  debounce(setJournalEntry, 300),
  []
);
```

### Image Loading
```javascript
// Lazy loading for icons
<img 
  src={icon.icon} 
  alt={icon.name}
  loading="lazy"
  className="w-10 h-10 md:h-24 md:w-24"
/>
```

## Accessibility Considerations

### Keyboard Navigation
- **Tab Order**: Logical tab sequence through components
- **Enter/Space**: Activate buttons and selections
- **Arrow Keys**: Navigate icon carousel

### Screen Reader Support
```javascript
// ARIA labels for icons
<img 
  src={icon.icon} 
  alt={`${icon.name} - ${icon.meaning}`}
  role="button"
  aria-label={`Select ${icon.name} icon representing ${icon.meaning}`}
/>
```

### Focus Management
```javascript
// Focus management for step transitions
useEffect(() => {
  if (currentStep === 2) {
    textareaRef.current?.focus();
  }
}, [currentStep]);
```

## Future Enhancement Patterns

### Dynamic Icon Loading
```javascript
// Potential database-driven icon loading
const [icons, setIcons] = useState([]);

useEffect(() => {
  const loadIcons = async () => {
    const { data } = await supabase
      .from('journal_icons')
      .select('*')
      .eq('journal_type', 'daily_journal');
    setIcons(data);
  };
  loadIcons();
}, []);
```

### Custom Icon Support
```javascript
// User-uploaded icon integration
const handleCustomIconUpload = async (file) => {
  const { data } = await supabase.storage
    .from('user-icons')
    .upload(`${userId}/${file.name}`, file);
  
  // Add to user's icon collection
};
```

---

*This component guide should be updated whenever significant changes are made to the component architecture or integration patterns.*
