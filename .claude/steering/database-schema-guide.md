# SandboxLife Database Schema Guide - Kiro Steering Documentation

## Overview

This document provides detailed guidance for understanding and working with the SandboxLife database schema, specifically focusing on the journal entry system and icon management integration with Supabase.

## Current Database Structure

### Primary Table: `user_journal_entries`

```sql
CREATE TABLE user_journal_entries (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  journal_type TEXT NOT NULL,
  journal_id TEXT NOT NULL,
  journal_icon TEXT NOT NULL,
  journal_meaning TEXT NOT NULL,
  journal_entry TEXT NOT NULL,
  wisdom_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Field Descriptions

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | BIGSERIAL | Auto-incrementing primary key | 1, 2, 3... |
| `user_id` | UUID | Foreign key to Supabase auth.users | `550e8400-e29b-41d4-a716-446655440000` |
| `journal_type` | TEXT | Type of journal entry | `daily_journal`, `book_journal`, `thought_of_the_day` |
| `journal_id` | TEXT | Maps to icon UUID from constants | `d_butterfly`, `b_shield` |
| `journal_icon` | TEXT | Full URL to icon image | `https://supabase.co/storage/...` |
| `journal_meaning` | TEXT | Symbolic meaning of the icon | `Transformation`, `Protection` |
| `journal_entry` | TEXT | User's written journal content | User's reflective writing |
| `wisdom_message` | TEXT | Additional insights (book journals) | Optional wisdom/insights |
| `created_at` | TIMESTAMP | Entry timestamp (used as entry date in UI) | `2024-01-04T10:30:00Z` |
| `updated_at` | TIMESTAMP | Last modification timestamp | `2024-01-04T10:30:00Z` |

The UI sets `created_at` from the selected entry date (using a midday timestamp) so back-dated entries render in the expected calendar slot.

## Journal Type Specifications

### Daily Journal (`daily_journal`)
- **Purpose**: Quick daily reflections
- **Limit**: 5 entries per day per user
- **Icon Pool**: 25 available icons
- **Wisdom Message**: Not used (NULL)
- **UUID Prefix**: `d_`

Note: the UI enforces the limit using a date range over `created_at`.

### Book Journal (`book_journal`)
- **Purpose**: Comprehensive life stories
- **Limit**: No daily limit
- **Icon Pool**: 16 available icons
- **Wisdom Message**: Required field
- **UUID Prefix**: `b_`

### Thought of the Day (`thought_of_the_day`)
- **Purpose**: Status updates and brief thoughts
- **Limit**: No enforced daily limit in current UI
- **Icon Pool**: Uses daily_journal icons
- **Wisdom Message**: Not used (NULL)
- **UUID Prefix**: `t_` (converted from `d_`)

## Icon-Database Mapping

### UUID Mapping System
The `journal_id` field maps directly to the `uuid` field in the icon constants:

```javascript
// In src/constants/questions.jsx
{
  uuid: "d_butterfly",  // Maps to journal_id in database
  name: "Butterfly",
  meaning: "Transformation"  // Maps to journal_meaning in database
}
```

Icons v2 use a `d2_` prefix and are stored in the same table with local asset URLs.

### Icon URL Management
- **V1 icons**: Supabase Storage bucket `new_icons` with signed URLs
- **V2 icons**: Local JPG asset URLs stored in `journal_icon`
- **Refresh Strategy**: Signed URLs need periodic renewal for v1 icons

## Database Queries and Operations

### Common Query Patterns

#### Fetch User's Recent Entries
```sql
SELECT * FROM user_journal_entries 
WHERE user_id = $1 
ORDER BY created_at DESC 
LIMIT 10;
```

#### Daily Entry Count Check (current implementation)
```sql
SELECT COUNT(*) FROM user_journal_entries 
WHERE user_id = $1 
  AND created_at >= CURRENT_DATE 
  AND created_at < CURRENT_DATE + INTERVAL '1 day';
```

In the UI, the date range is built from the selected entry date, not always "today".

#### Entries by Date Range
```sql
SELECT * FROM user_journal_entries 
WHERE user_id = $1 
  AND created_at >= $2 
  AND created_at <= $3 
ORDER BY created_at DESC;
```

#### Filter by Journal Type
```sql
SELECT * FROM user_journal_entries 
WHERE user_id = $1 
  AND journal_type = $2 
ORDER BY created_at DESC;
```

### JavaScript/Supabase Query Examples

```javascript
// Insert new journal entry
const { data, error } = await supabase
  .from('user_journal_entries')
  .insert({
    user_id: userId,
    journal_type: 'daily_journal',
    journal_id: 'd_butterfly',
    journal_icon: 'https://supabase.co/storage/...',
    journal_meaning: 'Transformation',
    journal_entry: 'Today I reflected on...',
    wisdom_message: null
  });

// Fetch user's entries with filtering
const { data, error } = await supabase
  .from('user_journal_entries')
  .select('*')
  .eq('user_id', userId)
  .eq('journal_type', 'daily_journal')
  .order('created_at', { ascending: false })
  .limit(5);

// Count entries for a date range (used for daily limit)
const { data, error } = await supabase
  .from('user_journal_entries')
  .select('id', { count: 'exact' })
  .eq('user_id', userId)
  .gte('created_at', startOfDay)
  .lte('created_at', endOfDay);
```

## Indexing Strategy

### Recommended Indexes
```sql
-- Primary user queries
CREATE INDEX idx_user_journal_entries_user_id ON user_journal_entries(user_id);

-- Date-based queries
CREATE INDEX idx_user_journal_entries_created_at ON user_journal_entries(created_at);

-- Type filtering
CREATE INDEX idx_user_journal_entries_journal_type ON user_journal_entries(journal_type);

-- Composite index for common query pattern
CREATE INDEX idx_user_journal_entries_user_type_date 
ON user_journal_entries(user_id, journal_type, created_at DESC);

-- Icon-based queries
CREATE INDEX idx_user_journal_entries_journal_id ON user_journal_entries(journal_id);
```

## Row Level Security (RLS)

### Security Policies
```sql
-- Enable RLS
ALTER TABLE user_journal_entries ENABLE ROW LEVEL SECURITY;

-- Users can only see their own entries
CREATE POLICY "Users can view own journal entries" ON user_journal_entries
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert their own entries
CREATE POLICY "Users can insert own journal entries" ON user_journal_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own entries
CREATE POLICY "Users can update own journal entries" ON user_journal_entries
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can only delete their own entries
CREATE POLICY "Users can delete own journal entries" ON user_journal_entries
  FOR DELETE USING (auth.uid() = user_id);
```

## Data Migration Considerations

### Adding New Icon Types
When adding new journal types or icon categories:

1. **Update Constants**: Add new icons to `src/constants/questions.jsx`
2. **Database Compatibility**: Ensure `journal_type` field accepts new values
3. **Application Logic**: Update filtering and display logic
4. **Migration Script**: If needed, migrate existing entries

### Schema Changes
```sql
-- Example: Adding new fields
ALTER TABLE user_journal_entries 
ADD COLUMN icon_category TEXT DEFAULT 'standard';

-- Example: Adding constraints
ALTER TABLE user_journal_entries 
ADD CONSTRAINT valid_journal_types 
CHECK (journal_type IN ('daily_journal', 'book_journal', 'thought_of_the_day'));
```

## Performance Optimization

### Query Optimization Tips
1. **Use Indexes**: Leverage composite indexes for common query patterns
2. **Limit Results**: Always use LIMIT for user-facing queries
3. **Select Specific Fields**: Avoid SELECT * when possible
4. **Date Filtering**: Use proper date range queries

### Caching Strategy
- **Client-side**: Cache recent entries in React state
- **Icon URLs**: Cache icon URLs to reduce Supabase calls
- **User Preferences**: Cache user settings and preferences

## Backup and Recovery

### Backup Strategy
- **Automated Backups**: Supabase provides automated backups
- **Export Options**: Regular exports for additional safety
- **Point-in-Time Recovery**: Available through Supabase

### Data Export Format
```javascript
// Example export structure
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "entries": [
    {
      "id": 1,
      "journal_type": "daily_journal",
      "journal_id": "d_butterfly",
      "journal_meaning": "Transformation",
      "journal_entry": "Today I reflected on...",
      "created_at": "2024-01-04T10:30:00Z"
    }
  ]
}
```

## Monitoring and Analytics

### Key Metrics to Track
- **Entry Volume**: Entries per user per day/week/month
- **Icon Popularity**: Most/least used icons
- **User Engagement**: Active users, retention rates
- **Performance**: Query response times

### Monitoring Queries
```sql
-- Daily entry statistics
SELECT 
  DATE(created_at) as entry_date,
  journal_type,
  COUNT(*) as entry_count
FROM user_journal_entries 
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at), journal_type
ORDER BY entry_date DESC;

-- Popular icons
SELECT 
  journal_id,
  journal_meaning,
  COUNT(*) as usage_count
FROM user_journal_entries 
GROUP BY journal_id, journal_meaning
ORDER BY usage_count DESC;
```

## Troubleshooting

### Common Issues
1. **Foreign Key Violations**: Ensure user exists in auth.users
2. **RLS Blocking Queries**: Check authentication state
3. **Icon URL Expiration**: Refresh Supabase storage URLs
4. **Performance Issues**: Review query patterns and indexes

### Debug Queries
```sql
-- Check user authentication
SELECT auth.uid();

-- Verify user exists
SELECT id FROM auth.users WHERE id = $1;

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'user_journal_entries';
```

---

*This schema guide should be updated whenever database structure changes are made.*
