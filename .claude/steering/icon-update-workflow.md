# SandboxLife Icon Update Workflow - Kiro Steering Documentation

## Overview

This document provides a step-by-step workflow for updating icons and related questions in the SandboxLife journaling application. It covers v1 Supabase-signed icons and the local iconsv2 (Set B) workflow.

## Pre-Update Checklist

### 1. Requirements Analysis
- [ ] Define the purpose of the icon update (new themes, seasonal content, user feedback)
- [ ] Identify target journal types (daily, book, or both)
- [ ] Determine if this is an addition, replacement, or modification
- [ ] Review user analytics to understand current icon usage patterns

### 2. Design Considerations
- [ ] Ensure new icons align with existing visual style
- [ ] Verify symbolic meanings are clear and meaningful
- [ ] Check for cultural sensitivity and inclusivity
- [ ] Confirm icons work well at different sizes (mobile/desktop)

### 3. Content Preparation
- [ ] Prepare icon assets (SVG for v1, JPG for iconsv2)
- [ ] Write thoughtful trigger questions following established patterns
- [ ] Create unique UUIDs following naming conventions
- [ ] Prepare symbolic meanings (1-3 words)

## Icon Update Workflow

### Phase 1: Asset Preparation

#### Step 1: Icon Asset Creation
```bash
# Icon requirements:
- Format: SVG (v1) or high-quality JPG (iconsv2)
- Size: Scalable, optimized for web
- Style: Consistent with existing icon set
- Naming: descriptive_name.svg (lowercase, underscores)
```

#### Step 2: Upload to Supabase Storage (v1 icons)
```bash
# Using Supabase CLI
supabase storage cp ./new_icon.svg supabase://new_icons/new_icon.svg

# Or via Supabase Dashboard:
# 1. Navigate to Storage > new_icons bucket
# 2. Upload icon files
# 3. Copy public URLs
```

For iconsv2, skip Supabase storage and place JPGs directly in `src/assets/iconsv2`.

#### Step 3: Generate Signed URLs
```javascript
// Get signed URL for long-term use
const { data } = await supabase.storage
  .from('new_icons')
  .createSignedUrl('new_icon.svg', 60 * 60 * 24 * 365); // 1 year

// Record the signed URL for use in constants
const iconUrl = data.signedUrl;
```

### Phase 2: Code Implementation

#### Step 4: Update Constants File
```javascript
// src/constants/questions.jsx

// Add new icon object to appropriate array
const newIcon = {
  journal_type: "daily_journal", // or "book_journal"
  name: "New Icon Name",
  meaning: "Symbolic Meaning",
  icon: "https://teyudjxlutkavyyigwwz.supabase.co/storage/v1/object/sign/new_icons/new_icon.svg?token=...",
  trigger_question: [
    "Primary reflective question about the theme?",
    "How has this theme influenced your past experiences?",
    "What role does this theme play in your current life?",
    "How might you embrace this theme in the future?"
  ],
  uuid: "d_new_icon" // or "b_new_icon" for book journals
};

// Add to appropriate array
export const daily_journal_questions = [
  // ... existing icons
  newIcon
];
```

#### Iconsv2 (Set B) Variant
```javascript
// src/constants/questions.jsx
import NewIcon from "../assets/iconsv2/NewIcon.jpg";

const newIcon = {
  journal_type: "daily_journal",
  name: "New Icon Name",
  meaning: "Symbolic Meaning",
  icon: NewIcon,
  trigger_question: [
    "Primary reflective question about the theme?",
    "How has this theme influenced your past experiences?",
    "What role does this theme play in your current life?",
    "How might you embrace this theme in the future?"
  ],
  uuid: "d2_new_icon"
};

export const iconsv2_questions = [
  // ... existing icons
  newIcon
];
```

#### Step 5: Verify UUID Uniqueness
```javascript
// Check for UUID conflicts
const allUuids = [
  ...daily_journal_questions.map(icon => icon.uuid),
  ...book_journal_questions.map(icon => icon.uuid),
  ...iconsv2_questions.map(icon => icon.uuid)
];

const duplicates = allUuids.filter((uuid, index) => 
  allUuids.indexOf(uuid) !== index
);

if (duplicates.length > 0) {
  console.error('Duplicate UUIDs found:', duplicates);
}
```

### Phase 3: Testing and Validation

#### Step 6: Local Testing
```bash
# Start development server
npm run dev

# Test icon display in carousel
# Test icon selection functionality
# Test question display
# Test journal entry creation
# Test database storage
```

#### Step 7: Component Testing
```javascript
// Test IconSelectionWindow with new icons
const testIconDisplay = () => {
  // Verify new icons appear in carousel
  // Test navigation with additional icons
  // Confirm selection state management
  // Validate responsive design
};

// Test JournalEntrySection with new questions
const testQuestionDisplay = () => {
  // Verify questions display correctly
  // Test question cycling functionality
  // Confirm text formatting
};
```

#### Step 8: Database Integration Testing
```javascript
// Test database insertion with new icon
const testDatabaseIntegration = async () => {
  const testEntry = {
    userId: 'test-user-id',
    journalType: 'daily_journal',
    journalId: 'd_new_icon',
    journalIcon: 'https://supabase-url...',
    journalMeaning: 'New Meaning',
    journalEntry: 'Test entry content'
  };

  const result = await insertJournalEntry(...Object.values(testEntry));
  console.log('Database test result:', result);
};
```

### Phase 4: Quality Assurance

#### Step 9: Cross-Device Testing
- [ ] Test on mobile devices (iOS/Android)
- [ ] Test on tablets
- [ ] Test on desktop browsers (Chrome, Firefox, Safari)
- [ ] Verify icon clarity at all sizes
- [ ] Test touch interactions on mobile

#### Step 10: User Experience Testing
- [ ] Verify icon symbolism is intuitive
- [ ] Test question clarity and engagement
- [ ] Confirm navigation flow remains smooth
- [ ] Test with existing user data

#### Step 11: Performance Testing
```javascript
// Monitor icon loading performance
const testIconLoadingPerformance = () => {
  const startTime = performance.now();
  
  // Load icon carousel
  const endTime = performance.now();
  console.log(`Icon loading took ${endTime - startTime} milliseconds`);
};

// Test with network throttling
// Verify lazy loading works correctly
// Check bundle size impact
```

### Phase 5: Deployment

#### Step 12: Build and Deploy
```bash
# Build production version
npm run build

# Deploy to Vercel (or your hosting platform)
vercel --prod

# Or commit and push for automatic deployment
git add .
git commit -m "feat: add new journal icons and questions"
git push origin main
```

#### Step 13: Post-Deployment Verification
- [ ] Verify icons load correctly in production
- [ ] Test complete journal creation flow
- [ ] Check database entries are created properly
- [ ] Monitor for any console errors
- [ ] Verify Supabase storage URLs are accessible

### Phase 6: Monitoring and Maintenance

#### Step 14: Usage Analytics
```sql
-- Monitor new icon usage
SELECT 
  journal_id,
  journal_meaning,
  COUNT(*) as usage_count,
  DATE(created_at) as usage_date
FROM user_journal_entries 
WHERE journal_id IN ('d_new_icon', 'b_new_icon')
  AND created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY journal_id, journal_meaning, DATE(created_at)
ORDER BY usage_date DESC, usage_count DESC;
```

#### Step 15: User Feedback Collection
- [ ] Monitor user support channels for feedback
- [ ] Track completion rates for new icon entries
- [ ] Analyze user engagement with new questions
- [ ] Collect qualitative feedback through surveys

## Rollback Procedures

### Emergency Rollback
If critical issues are discovered post-deployment:

#### Step 1: Immediate Code Rollback
```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or rollback specific files
git checkout HEAD~1 -- src/constants/questions.jsx
git commit -m "rollback: revert icon updates due to critical issue"
git push origin main
```

#### Step 2: Database Cleanup (if needed)
```sql
-- Remove entries with problematic icons (use with caution)
DELETE FROM user_journal_entries 
WHERE journal_id IN ('d_problematic_icon')
  AND created_at >= '2024-01-04 00:00:00';
```

#### Step 3: Storage Cleanup
```bash
# Remove problematic icon files
supabase storage rm supabase://new_icons/problematic_icon.svg
```

## Best Practices

### Icon Design Guidelines
1. **Consistency**: Match existing visual style and color scheme
2. **Scalability**: Ensure clarity at 24x24px and 96x96px sizes
3. **Symbolism**: Choose universally understood symbols
4. **Accessibility**: Ensure sufficient contrast and clear shapes

### Question Writing Guidelines
1. **Open-ended**: Encourage reflection, not yes/no answers
2. **Variety**: Provide different perspectives on the theme
3. **Clarity**: Use simple, accessible language
4. **Depth**: Progress from surface to deeper reflection

### Technical Guidelines
1. **UUID Naming**: Follow established conventions (d_/b_ for v1, d2_ for iconsv2)
2. **File Naming**: Use descriptive, lowercase names with underscores
3. **URL Management**: Use long-expiry signed URLs for v1 icons
4. **Testing**: Test thoroughly before deployment

## Troubleshooting Common Issues

### Icon Display Problems
```javascript
// Debug icon loading issues
const debugIconLoading = (iconUrl) => {
  const img = new Image();
  img.onload = () => console.log('Icon loaded successfully');
  img.onerror = () => console.error('Icon failed to load');
  img.src = iconUrl;
};
```

### Database Integration Issues
```javascript
// Debug database insertion
const debugDatabaseInsertion = async (entryData) => {
  try {
    const result = await insertJournalEntry(...entryData);
    console.log('Database result:', result);
  } catch (error) {
    console.error('Database error:', error);
    // Check for constraint violations, RLS issues, etc.
  }
};
```

### Performance Issues
```javascript
// Monitor component render performance
const debugComponentPerformance = () => {
  // Use React DevTools Profiler
  // Monitor icon carousel rendering
  // Check for unnecessary re-renders
};
```

## Documentation Updates

After completing icon updates:

1. **Update this workflow document** with any lessons learned
2. **Update component documentation** if new patterns were introduced
3. **Update database schema documentation** if changes were made
4. **Create release notes** documenting the changes for users

## Approval Process

### Internal Review
- [ ] Code review by team member
- [ ] Design review for visual consistency
- [ ] Content review for question quality
- [ ] Technical review for performance impact

### Stakeholder Approval
- [ ] Product owner approval for new features
- [ ] Design team approval for visual elements
- [ ] Content team approval for questions
- [ ] QA team approval for testing completion

---

*This workflow should be followed for all icon and question updates to ensure consistency and quality in the SandboxLife application.*
