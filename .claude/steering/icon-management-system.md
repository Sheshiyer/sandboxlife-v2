# SandboxLife Icon Management System - Kiro Steering Documentation

## Overview

This document provides comprehensive guidance for managing and updating the icon and question system in the SandboxLife journaling application. The system uses symbolic icons paired with reflective questions to guide users through their journaling experience.

## Current System Architecture

### Data Structure
The icon system is built around three data arrays in `src/constants/questions.jsx`:

1. **`book_journal_questions`** - 16 icons for comprehensive life stories
2. **`daily_journal_questions`** - 25 icons for daily reflections
3. **`iconsv2_questions`** - Set B preview icons (local JPG assets, preview-only)

Each icon object contains:
```javascript
{
  journal_type: "book_journal" | "daily_journal",
  name: "Icon Name",
  meaning: "Symbolic Meaning",
  icon: "https://supabase-storage-url" // or local asset import
  trigger_question: ["Question 1", "Question 2", ...],
  uuid: "prefix_identifier"
}
```

### Database Schema
**Table**: `user_journal_entries`
- `user_id`: User identifier
- `journal_type`: Type of journal entry
- `journal_id`: Maps to icon UUID
- `journal_icon`: Icon URL
- `journal_meaning`: Icon symbolic meaning
- `journal_entry`: User's written content
- `wisdom_message`: Additional insights (book journals only)
- `created_at`: Timestamp

### Component Flow
1. **IconSelectionWindow** - Displays carousel of available icons
2. **JournalEntrySection** - Shows selected icon with trigger questions
3. **Database Storage** - Saves entry with icon metadata

## Icon Management Guidelines

### Adding New Icons

#### 1. Icon Asset Requirements
- **V1 icons**: SVG preferred, stored in Supabase bucket `new_icons`
- **V2 icons**: JPG assets stored locally in `src/assets/iconsv2`
- **Naming**: Use descriptive names with spaces replaced by underscores
- **Size**: Optimized for web (typically under 50KB for SVG, reasonable JPG sizes)

#### 2. Icon Data Structure
```javascript
{
  journal_type: "daily_journal", // or "book_journal"
  name: "Descriptive Name",
  meaning: "Symbolic Meaning (1-3 words)",
  icon: "https://teyudjxlutkavyyigwwz.supabase.co/storage/v1/object/sign/new_icons/icon_name.svg?token=...",
  trigger_question: [
    "Primary reflective question",
    "Alternative question for variety",
    "Follow-up question for depth",
    "Future-oriented question"
  ],
  uuid: "d_unique_identifier" // 'd_' for daily, 'b_' for book
}
```

#### 3. UUID Convention
- **Daily Journal**: `d_[descriptive_name]`
- **Book Journal**: `b_[descriptive_name]`
- **Icons v2 (Set B)**: `d2_[descriptive_name]`
- Use lowercase, underscores for spaces
- Must be unique across all icons

### Question Writing Guidelines

#### Question Categories
1. **Present-focused**: Current situations and feelings
2. **Past-reflective**: Learning from experiences
3. **Future-oriented**: Goals and aspirations
4. **Relationship-based**: Connections with others

#### Question Quality Standards
- **Open-ended**: Avoid yes/no questions
- **Emotionally engaging**: Encourage deep reflection
- **Accessible**: Clear language, avoid jargon
- **Varied perspectives**: Multiple angles on the theme

#### Example Question Patterns
```javascript
// Good examples:
"What aspects of [theme] resonate most with your current life?"
"How has your relationship with [theme] evolved over time?"
"What would embracing [theme] look like in your daily life?"

// Avoid:
"Do you like [theme]?" // Too simple
"[Theme] is important, right?" // Leading question
```

## Technical Implementation

### File Locations
- **Icon Data**: `src/constants/questions.jsx`
- **Icon Selection UI**: `src/components/IconSelectionWindow.jsx`
- **Database Functions**: `src/utils/supabase.jsx`
- **Journal Pages**: `src/pages/[DailyJournal|BookJourney|ThoughtOfTheDay].jsx`

### Key Functions
```javascript
// Database insertion
insertJournalEntry(userId, journalType, journalId, journalIcon, journalMeaning, journalEntry, wisdomMessage)

// Data fetching
fetchEntries(userId, journalType, limit)
fetchTopUserRecords(userId)
```

### Component Props Flow
```
IconSelectionWindow
├── icons: Array of icon objects
├── setSelectedIconTheme: State setter
├── onSave: Callback for next step
└── dailyEntryCount: For daily limit enforcement

JournalEntrySection
├── triggerQuestion: Selected question(s)
├── triggerIcon: Icon URL
├── journalType: Entry type
└── saveToDb: Database save function
```

## Supabase Integration

### Storage Management
- **V1 bucket**: `new_icons` (Supabase signed URLs)
- **V2 assets**: local JPG imports from `src/assets/iconsv2`
- **URL Pattern**: Signed URLs with expiration tokens for v1 icons

### Database Considerations
- **Icon URLs**: Store full signed URLs for v1 icons; local asset URLs for iconsv2
- **Metadata**: Preserve icon meaning and UUID for filtering
- **Indexing**: Consider indexes on `journal_type` and `user_id`

## Testing Considerations

### Icon Display Testing
- Verify icon carousel navigation
- Test icon selection state management
- Validate responsive design across devices

### Database Integration Testing
- Confirm icon metadata saves correctly
- Test entry retrieval with icon information
- Verify icon URL accessibility

### User Experience Testing
- Question clarity and engagement
- Icon symbolism understanding
- Navigation flow smoothness

## Maintenance Procedures

### Regular Updates
1. **Icon Refresh**: Update expired Supabase URLs
2. **Question Review**: Evaluate question effectiveness
3. **User Feedback**: Incorporate user suggestions
4. **Performance**: Monitor icon loading times

### Version Control
- Track changes to `questions.jsx`
- Document icon additions/removals
- Maintain backward compatibility for existing entries

## Security Considerations

### Icon Storage
- Use Supabase RLS policies
- Validate icon file types
- Monitor storage usage

### Data Privacy
- Icon selection patterns may reveal personal information
- Ensure compliance with privacy policies
- Consider anonymization for analytics

## Future Enhancements

### Potential Features
- **Dynamic Icon Loading**: Database-driven icon management
- **User Custom Icons**: Allow personal icon uploads
- **Seasonal Icons**: Time-based icon availability
- **Icon Categories**: Grouped icon selection
- **Question Randomization**: Vary question presentation

### Scalability Considerations
- **Icon CDN**: Consider CDN for better performance
- **Lazy Loading**: Load icons on demand
- **Caching**: Implement icon caching strategies
- **Database Optimization**: Optimize queries for large datasets

## Troubleshooting

### Common Issues
1. **Icons not loading**: Check Supabase URL expiration (v1) or local asset path (v2)
2. **Question display**: Verify array structure
3. **Database errors**: Check field mappings
4. **UI responsiveness**: Test carousel on mobile

### Debug Steps
1. Check browser console for errors
2. Verify Supabase connection
3. Test icon URLs directly
4. Validate data structure integrity

---

*This document should be updated whenever changes are made to the icon system or related components.*
