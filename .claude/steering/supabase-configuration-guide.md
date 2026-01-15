# SandboxLife Supabase Configuration Guide - Kiro Steering Documentation

## Overview

This document provides comprehensive guidance for configuring and managing the Supabase backend integration for the SandboxLife journaling application, including authentication, database setup, storage management, and security policies.

## Current Supabase Setup

### Project Configuration
- **Project URL**: `https://teyudjxlutkavyyigwwz.supabase.co`
- **Anon Key**: Configured directly in `src/utils/supabase.jsx`
- **Client**: Created using `@supabase/supabase-js` v2.39.8

### Client Initialization
```javascript
// src/utils/supabase.jsx
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://teyudjxlutkavyyigwwz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

export const supabase = createClient(supabaseUrl, supabaseKey);
```

## Authentication Configuration

### Auth Settings
- **Provider**: Email/Password authentication
- **Session Management**: Handled via Supabase Auth
- **User Storage**: `auth.users` table (managed by Supabase)

### Authentication Flow
```javascript
// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});

// Logout
await supabase.auth.signOut();

// Get current user
const { data: { user } } = await supabase.auth.getUser();
```

### Session Persistence
- **Client Storage**: localStorage for user_id
- **Token Management**: Automatic token refresh by Supabase
- **Cross-tab Sync**: Supabase handles session synchronization

## Database Configuration

### Tables Structure

#### user_journal_entries
```sql
CREATE TABLE user_journal_entries (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  journal_type TEXT NOT NULL CHECK (journal_type IN ('daily_journal', 'book_journal', 'thought_of_the_day')),
  journal_id TEXT NOT NULL,
  journal_icon TEXT NOT NULL,
  journal_meaning TEXT NOT NULL,
  journal_entry TEXT NOT NULL,
  wisdom_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Indexes
```sql
-- Performance optimization indexes
CREATE INDEX idx_user_journal_entries_user_id ON user_journal_entries(user_id);
CREATE INDEX idx_user_journal_entries_created_at ON user_journal_entries(created_at);
CREATE INDEX idx_user_journal_entries_journal_type ON user_journal_entries(journal_type);
CREATE INDEX idx_user_journal_entries_composite ON user_journal_entries(user_id, journal_type, created_at DESC);
```

#### Triggers
```sql
-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_journal_entries_updated_at 
    BEFORE UPDATE ON user_journal_entries 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Storage Configuration

### Bucket Setup
- **Bucket Name**: `new_icons`
- **Access**: Public read access
- **File Types**: SVG, PNG, JPG
- **Size Limits**: 10MB per file

### Storage Policies
```sql
-- Allow public read access to icons
CREATE POLICY "Public read access for icons" ON storage.objects
  FOR SELECT USING (bucket_id = 'new_icons');

-- Allow authenticated users to upload icons (if needed)
CREATE POLICY "Authenticated users can upload icons" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'new_icons' 
    AND auth.role() = 'authenticated'
  );
```

### Icon URL Management
```javascript
// Get signed URL for icon
const { data } = await supabase.storage
  .from('new_icons')
  .createSignedUrl('icon_name.svg', 60 * 60 * 24 * 365); // 1 year expiry

// Public URL (if bucket is public)
const { data } = supabase.storage
  .from('new_icons')
  .getPublicUrl('icon_name.svg');
```

## Row Level Security (RLS)

### Enable RLS
```sql
ALTER TABLE user_journal_entries ENABLE ROW LEVEL SECURITY;
```

### Security Policies

#### Read Policy
```sql
CREATE POLICY "Users can view own journal entries" ON user_journal_entries
  FOR SELECT USING (auth.uid() = user_id);
```

#### Insert Policy
```sql
CREATE POLICY "Users can insert own journal entries" ON user_journal_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

#### Update Policy
```sql
CREATE POLICY "Users can update own journal entries" ON user_journal_entries
  FOR UPDATE USING (auth.uid() = user_id);
```

#### Delete Policy
```sql
CREATE POLICY "Users can delete own journal entries" ON user_journal_entries
  FOR DELETE USING (auth.uid() = user_id);
```

## API Functions

### Core Database Functions

#### Insert Journal Entry
```javascript
export async function insertJournalEntry(
  userId,
  journalType,
  journalId,
  journalIcon,
  journalMeaning,
  journalEntry,
  wisdomMessage = null,
  createdAt
) {
  const { data, error } = await supabase
    .from('user_journal_entries')
    .insert({
      user_id: userId,
      journal_type: journalType,
      journal_id: journalId,
      journal_icon: journalIcon,
      journal_meaning: journalMeaning,
      journal_entry: journalEntry,
      wisdom_message: wisdomMessage,
      ...(createdAt ? { created_at: createdAt } : {})
    });

  return error ? { success: false, error } : { success: true, data };
}
```

`createdAt` is optional and used by the UI to store back-dated entries.

#### Fetch User Entries
```javascript
export async function fetchTopUserRecords(userId) {
  const { data, error } = await supabase
    .from('user_journal_entries')
    .select('*')
    .eq('user_id', userId)
    .neq('journal_type', 'thought_of_the_day')
    .order('id', { ascending: false })
    .limit(6);

  return error ? { success: false, error } : { success: true, data };
}
```

#### Daily Entry Count
```javascript
export const fetchDailyEntryCount = async (userId, entryDate) => {
  const baseDate = entryDate ? new Date(entryDate) : new Date();
  const startOfDay = new Date(baseDate.setHours(0, 0, 0, 0)).toISOString();
  const endOfDay = new Date(baseDate.setHours(23, 59, 59, 999)).toISOString();

  const { data, error } = await supabase
    .from('user_journal_entries')
    .select('id', { count: 'exact' })
    .eq('user_id', userId)
    .gte('created_at', startOfDay)
    .lte('created_at', endOfDay);

  return error ? 0 : (data?.length || 0);
};
```

#### Date Range Queries
```javascript
export const fetchAllEntries = async (userId, startDay, lastDay) => {
  const { data, error } = await supabase
    .from('user_journal_entries')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', startDay)
    .lte('created_at', lastDay)
    .order('created_at', { ascending: false });

  return error ? error : data;
};
```

#### Recent Entry Strip (CalendarDateHeader)
```javascript
export const fetchWeeklyData = async (userId) => {
  const { data, error } = await supabase
    .from('user_journal_entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5);

  return error ? error : data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
};
```

## Environment Configuration

The current codebase uses a hardcoded Supabase URL/key in `src/utils/supabase.jsx`. If you migrate to environment variables later, update this guide and the client initialization accordingly.

## Real-time Features (Future Enhancement)

### Real-time Subscriptions
```javascript
// Listen for changes to user's journal entries
const subscription = supabase
  .channel('journal_changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'user_journal_entries',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    console.log('Change received!', payload);
    // Update UI accordingly
  })
  .subscribe();

// Cleanup
return () => {
  supabase.removeChannel(subscription);
};
```

## Backup and Migration

### Database Backup
```sql
-- Create backup of journal entries
COPY user_journal_entries TO '/path/to/backup.csv' DELIMITER ',' CSV HEADER;

-- Restore from backup
COPY user_journal_entries FROM '/path/to/backup.csv' DELIMITER ',' CSV HEADER;
```

### Migration Scripts
```sql
-- Example migration: Add new column
ALTER TABLE user_journal_entries 
ADD COLUMN tags TEXT[] DEFAULT '{}';

-- Update existing entries
UPDATE user_journal_entries 
SET tags = '{}' 
WHERE tags IS NULL;
```

## Performance Optimization

### Query Optimization
```javascript
// Use specific field selection
const { data } = await supabase
  .from('user_journal_entries')
  .select('id, journal_type, journal_meaning, created_at')
  .eq('user_id', userId)
  .limit(10);

// Use proper indexing for filters
const { data } = await supabase
  .from('user_journal_entries')
  .select('*')
  .eq('user_id', userId)           // Uses index
  .eq('journal_type', 'daily_journal') // Uses composite index
  .order('created_at', { ascending: false })
  .limit(5);
```

### Connection Pooling
- **Supabase Pooler**: Automatically managed
- **Connection Limits**: Monitor usage in Supabase dashboard
- **Optimization**: Use connection pooling for high-traffic scenarios

## Monitoring and Analytics

### Supabase Dashboard Metrics
- **Database Performance**: Query performance and slow queries
- **Storage Usage**: File storage and bandwidth usage
- **Authentication**: User sign-ups and active sessions
- **API Usage**: Request volume and response times

### Custom Analytics
```javascript
// Track journal entry creation
const trackJournalEntry = async (journalType, iconId) => {
  await supabase
    .from('analytics_events')
    .insert({
      event_type: 'journal_entry_created',
      user_id: userId,
      metadata: { journal_type: journalType, icon_id: iconId }
    });
};
```

## Security Best Practices

### API Key Management
- **Anon Key**: Safe for client-side use (public)
- **Service Role Key**: Never expose in client code
- **Environment Variables**: Use for sensitive configuration

### Data Validation
```javascript
// Client-side validation
const validateJournalEntry = (entry) => {
  if (!entry.journal_entry || entry.journal_entry.trim().length === 0) {
    throw new Error('Journal entry cannot be empty');
  }
  if (entry.journal_entry.length > 10000) {
    throw new Error('Journal entry too long');
  }
};

// Database constraints
ALTER TABLE user_journal_entries 
ADD CONSTRAINT journal_entry_not_empty 
CHECK (LENGTH(TRIM(journal_entry)) > 0);
```

### Rate Limiting
```sql
-- Example: Limit daily entries per user
CREATE OR REPLACE FUNCTION check_daily_limit()
RETURNS TRIGGER AS $$
DECLARE
  daily_count INTEGER;
BEGIN
  IF NEW.journal_type = 'daily_journal' THEN
    SELECT COUNT(*) INTO daily_count
    FROM user_journal_entries
    WHERE user_id = NEW.user_id
      AND journal_type = 'daily_journal'
      AND created_at >= CURRENT_DATE
      AND created_at < CURRENT_DATE + INTERVAL '1 day';
    
    IF daily_count >= 5 THEN
      RAISE EXCEPTION 'Daily journal entry limit exceeded';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_daily_limit
  BEFORE INSERT ON user_journal_entries
  FOR EACH ROW EXECUTE FUNCTION check_daily_limit();
```

## Troubleshooting

### Common Issues

#### Authentication Problems
```javascript
// Check authentication status
const { data: { session } } = await supabase.auth.getSession();
if (!session) {
  // Redirect to login
}

// Handle auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    // Clear local storage and redirect
  }
});
```

#### RLS Policy Issues
```sql
-- Debug RLS policies
SELECT * FROM pg_policies WHERE tablename = 'user_journal_entries';

-- Test policy with specific user
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claims TO '{"sub": "user-uuid-here"}';
SELECT * FROM user_journal_entries;
```

#### Performance Issues
```sql
-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM user_journal_entries 
WHERE user_id = 'uuid' 
ORDER BY created_at DESC 
LIMIT 10;

-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
WHERE tablename = 'user_journal_entries';
```

## CLI Commands

### Supabase CLI Setup
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to project
supabase link --project-ref teyudjxlutkavyyigwwz

# Generate types
supabase gen types typescript --linked > src/types/supabase.ts
```

### Database Management
```bash
# Run migrations
supabase db push

# Reset database (development only)
supabase db reset

# Create migration
supabase migration new add_new_column

# Apply specific migration
supabase migration up --target 20240104000000
```

---

*This Supabase configuration guide should be updated whenever backend infrastructure changes are made.*
