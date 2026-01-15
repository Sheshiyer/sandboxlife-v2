# Icon Unlock & Progression System - Implementation Guide

## 🚀 Quick Start

### 1. Apply Database Migrations

Run the migrations in order on your Supabase project:

```bash
# Via Supabase Dashboard:
# 1. Go to SQL Editor
# 2. Copy contents of sandboxlifebeta/supabase/migrations/20260115010000_icon_progression_system.sql
# 3. Execute the SQL
```

### 2. Verify Tables Created

Check that these tables exist in your Supabase database:
- `user_progression`
- `icon_unlock_requirements`
- `user_unlocked_icons`
- `achievements`
- `user_achievements`
- `level_titles`

### 3. Test the System

```javascript
// Test progression tracking
import { getUserProgression } from './utils/progression';
const progress = await getUserProgression(userId);
console.log(progress);

// Test icon unlocks
import { getIconsForJournal } from './utils/progression';
const icons = await getIconsForJournal(userId, 'book_journal');
console.log(icons);
```

## 📦 Components Created

### Core Components
1. **ProgressionCard.jsx** - Displays user level, XP bar, streak
2. **LevelUpModal.jsx** - Celebration modal when leveling up

### Utility Files
1. **progression.jsx** - All progression/icon/achievement functions
2. **social.js** (updated) - Now includes D&D theming (level & title)

## 🎮 Using the Components

### Display User Progression

```jsx
import ProgressionCard from './components/progression/ProgressionCard';

// Full card with stats
<ProgressionCard userId={userId} />

// Compact version for header/sidebar
<ProgressionCard userId={userId} compact={true} />
```

### Show Level Up Celebration

```jsx
import { useState } from 'react';
import LevelUpModal from './components/progression/LevelUpModal';

function MyComponent() {
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelData, setLevelData] = useState(null);

  // After journal entry is saved:
  const handleEntrySaved = async () => {
    // Progression is auto-updated by database trigger
    // Optionally check for level up:
    const progress = await getUserProgression(userId);
    if (progress.data.leveled_up) {
      setLevelData({
        new_level: progress.data.level,
        new_title: progress.data.title,
        leveled_up: true
      });
      setShowLevelUp(true);
    }
  };

  return (
    <>
      {/* Your content */}
      <LevelUpModal 
        isOpen={showLevelUp}
        onClose={() => setShowLevelUp(false)}
        levelData={levelData}
        unlockedIcons={[]}
      />
    </>
  );
}
```

## 🔧 Integrating into Existing Pages

### Home Page

Add progression card to dashboard:

```jsx
import ProgressionCard from '../components/progression/ProgressionCard';

// In HomePage.jsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <ProgressionCard userId={userId} />
  {/* Other dashboard cards */}
</div>
```

### Journal Entry Pages

The progression system **automatically** updates when a journal entry is inserted via the database trigger. No extra code needed!

Optional: Show level up modal after entry submission.

### Profile Page

Display progression + achievements:

```jsx
import ProgressionCard from '../components/progression/ProgressionCard';
import { getUserAchievements } from '../utils/progression';

// Fetch and display achievements
const [achievements, setAchievements] = useState([]);

useEffect(() => {
  const loadAchievements = async () => {
    const result = await getUserAchievements(userId);
    if (result.success) {
      setAchievements(result.data);
    }
  };
  loadAchievements();
}, [userId]);
```

### Friends Page (D&D Enhancement)

The `getFriends()` function now returns friends with `level` and `title`:

```jsx
// In FriendCard.jsx, update to show D&D info:
<div className="friend-card">
  <div className="flex items-center gap-3">
    <Avatar />
    <div>
      <p className="font-semibold">{friend.friend_display_name}</p>
      <p className="text-sm text-slate-600">
        Level {friend.level} {friend.title}
      </p>
    </div>
  </div>
</div>
```

## 🎨 Icon Selection Enhancement

When showing icons for journal entry selection:

```jsx
import { getIconsForJournal } from '../utils/progression';

const [icons, setIcons] = useState([]);

useEffect(() => {
  const loadIcons = async () => {
    const result = await getIconsForJournal(userId, 'book_journal');
    if (result.success) {
      setIcons(result.data);
    }
  };
  loadIcons();
}, [userId]);

// Render icons with locked/unlocked state
{icons.map(icon => (
  <div 
    key={icon.icon_uuid}
    className={`icon-card ${!icon.is_unlocked ? 'locked' : ''}`}
  >
    {icon.is_unlocked ? (
      <img src={icon.icon_url} alt={icon.icon_name} />
    ) : (
      <div className="locked-overlay">
        <LockIcon />
        <p className="text-xs">{formatUnlockRequirement(icon)}</p>
      </div>
    )}
  </div>
))}
```

## 🏆 Achievement System

Check for new achievements after significant actions:

```jsx
import { checkAchievements } from '../utils/progression';

// After writing 10th entry, adding 5th friend, etc.
const result = await checkAchievements(userId);
if (result.success && result.newly_earned.length > 0) {
  // Show achievement notification
  result.newly_earned.forEach(achievement => {
    toast.success(`Achievement unlocked: ${achievement.name}!`);
  });
}
```

## 📊 Leaderboard Page

Create a new leaderboard page:

```jsx
import { getLeaderboard, getUserRank } from '../utils/progression';

function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [myRank, setMyRank] = useState(null);

  useEffect(() => {
    const loadLeaderboard = async () => {
      const result = await getLeaderboard(10, 'level');
      if (result.success) {
        setLeaders(result.data);
      }

      const rankResult = await getUserRank(userId);
      if (rankResult.success) {
        setMyRank(rankResult.rank);
      }
    };
    loadLeaderboard();
  }, []);

  return (
    <div>
      <h2>Top Chroniclers</h2>
      {myRank && <p>Your rank: #{myRank}</p>}
      {leaders.map((user, i) => (
        <div key={i} className="leaderboard-item">
          <span>#{i + 1}</span>
          <span>{user.user_profiles.display_name}</span>
          <span>Level {user.level} - {user.title}</span>
          <span>{user.total_entries} entries</span>
        </div>
      ))}
    </div>
  );
}
```

## 🎯 Testing Checklist

### Database Tests
- [ ] All migrations run successfully
- [ ] Default icons inserted for each journal type
- [ ] Level titles table populated
- [ ] Achievements table populated

### Progression Tests
- [ ] New user gets Level 1 "Wanderer"
- [ ] Writing entry awards 20 XP
- [ ] 3-day streak awards bonus XP
- [ ] Level up calculates correctly
- [ ] Title updates on level up

### Icon Unlock Tests
- [ ] New users get 3 default icons per journal type
- [ ] Level-based icons unlock at correct level
- [ ] Entry-based icons unlock after X entries
- [ ] Streak-based icons unlock after X days

### Achievement Tests
- [ ] "First Steps" awards on first entry
- [ ] Entry milestones trigger correctly
- [ ] Streak achievements trigger correctly
- [ ] Achievement XP is awarded

### Social D&D Tests
- [ ] Friend list shows level & title
- [ ] User search shows level & title
- [ ] Chat displays level badges
- [ ] Leaderboard ranks correctly

## 🐛 Troubleshooting

### Progression not updating
- Check if trigger `progression_on_entry` is enabled
- Verify `user_journal_entries` table has proper user_id
- Check Supabase logs for errors

### Icons not unlocking
- Verify `check_icon_unlocks` function exists
- Check `user_unlocked_icons` table for entries
- Ensure icon UUIDs match between `constants/questions.jsx` and database

### Level up not calculating
- Test `award_xp()` function directly in Supabase SQL editor
- Check `user_progression` table for correct XP values
- Verify `calculate_xp_for_level()` formula

### Friends not showing D&D data
- Verify `user_progression` records exist for friends
- Check if `getFriends()` is using the updated version
- Ensure RLS policies allow viewing friend progression

## 📝 Next Steps

1. **Add Progression to Home Page** - Show ProgressionCard on dashboard
2. **Update Icon Selection UI** - Show locked/unlocked states with requirements
3. **Create Achievements Page** - Display all earned achievements
4. **Build Leaderboard Page** - Show top users by level/XP/entries/streak
5. **Add Level Up Notifications** - Show modal after journal submission
6. **Enhance Friend Cards** - Display D&D level & title
7. **Create Admin Panel** - Manage icon requirements and achievements

## 📚 Reference

- Full system design: `/SYSTEM_DESIGN.md`
- Database schema: `/sandboxlifebeta/supabase/migrations/20260115010000_icon_progression_system.sql`
- Utility functions: `/sandboxlifebeta/src/utils/progression.jsx`
- Social functions: `/sandboxlifebeta/src/utils/social.js`

---

**Need Help?** Check `SYSTEM_DESIGN.md` for complete documentation of the system architecture, D&D theming, and all features.
