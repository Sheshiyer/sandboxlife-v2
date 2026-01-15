import { supabase } from './supabase';

// ============================================
// User Progression Functions
// ============================================

/**
 * Get user's current progression stats
 */
export async function getUserProgression(userId) {
  try {
    const { data, error } = await supabase
      .from('user_progression')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      // If no progression exists, create initial record
      if (error.code === 'PGRST116') {
        return await initializeUserProgression(userId);
      }
      return { success: false, error };
    }

    // Calculate XP needed for next level
    const xpForNextLevel = calculateXPForLevel(data.level + 1);
    const xpProgress = data.xp;
    const xpPercentage = (xpProgress / xpForNextLevel) * 100;

    return {
      success: true,
      data: {
        ...data,
        xp_for_next_level: xpForNextLevel,
        xp_percentage: xpPercentage,
      },
    };
  } catch (error) {
    return { success: false, error };
  }
}

/**
 * Initialize progression for new user
 */
async function initializeUserProgression(userId) {
  const { data, error } = await supabase
    .from('user_progression')
    .insert({
      user_id: userId,
      level: 1,
      xp: 0,
      total_entries: 0,
      streak_days: 0,
      longest_streak: 0,
      title: 'Wanderer',
    })
    .select()
    .single();

  if (error) {
    return { success: false, error };
  }

  // Unlock default icons
  await unlockDefaultIcons(userId);

  return { success: true, data };
}

/**
 * Calculate XP required for a specific level
 */
export function calculateXPForLevel(level) {
  return Math.floor(100 * Math.pow(level, 1.5));
}

/**
 * Award XP to user and check for level ups
 */
export async function awardXP(userId, xpAmount) {
  try {
    const { data, error } = await supabase.rpc('award_xp', {
      p_user_id: userId,
      xp_amount: xpAmount,
    });

    if (error) {
      return { success: false, error };
    }

    // data returns: new_level, new_xp, leveled_up, new_title
    return { success: true, data: data[0] };
  } catch (error) {
    return { success: false, error };
  }
}

// ============================================
// Icon Unlock Functions
// ============================================

/**
 * Get all icon unlock requirements
 */
export async function getIconRequirements(journalType = null) {
  try {
    let query = supabase.from('icon_unlock_requirements').select('*');

    if (journalType) {
      query = query.eq('journal_type', journalType);
    }

    const { data, error } = await query.order('unlock_value', { ascending: true });

    if (error) {
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}

/**
 * Get user's unlocked icons
 */
export async function getUserUnlockedIcons(userId, journalType = null) {
  try {
    let query = supabase
      .from('user_unlocked_icons')
      .select(
        `
        *,
        icon_unlock_requirements (*)
      `
      )
      .eq('user_id', userId);

    if (journalType) {
      query = query.eq('icon_unlock_requirements.journal_type', journalType);
    }

    const { data, error } = await query.order('unlocked_at', { ascending: false });

    if (error) {
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}

/**
 * Check if user has unlocked a specific icon
 */
export async function isIconUnlocked(userId, iconUuid) {
  try {
    const { data, error } = await supabase
      .from('user_unlocked_icons')
      .select('*')
      .eq('user_id', userId)
      .eq('icon_uuid', iconUuid)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return { success: true, unlocked: false };
      }
      return { success: false, error };
    }

    return { success: true, unlocked: true, data };
  } catch (error) {
    return { success: false, error };
  }
}

/**
 * Unlock default icons for a user
 */
async function unlockDefaultIcons(userId) {
  const { data: defaultIcons } = await supabase
    .from('icon_unlock_requirements')
    .select('icon_uuid')
    .eq('is_default', true);

  if (defaultIcons && defaultIcons.length > 0) {
    const unlocks = defaultIcons.map((icon) => ({
      user_id: userId,
      icon_uuid: icon.icon_uuid,
      unlock_method: 'default',
    }));

    await supabase.from('user_unlocked_icons').insert(unlocks);
  }
}

/**
 * Check and unlock new icons based on current progression
 */
export async function checkIconUnlocks(userId) {
  try {
    const { data, error } = await supabase.rpc('check_icon_unlocks', {
      p_user_id: userId,
    });

    if (error) {
      return { success: false, error };
    }

    return {
      success: true,
      newly_unlocked: data[0]?.newly_unlocked_icons || [],
    };
  } catch (error) {
    return { success: false, error };
  }
}

/**
 * Get icons available for a journal type with unlock status
 */
export async function getIconsForJournal(userId, journalType) {
  try {
    // Get all icons for this journal type
    const { data: allIcons, error: iconsError } = await supabase
      .from('icon_unlock_requirements')
      .select('*')
      .eq('journal_type', journalType)
      .order('unlock_value', { ascending: true });

    if (iconsError) {
      return { success: false, error: iconsError };
    }

    // Get user's unlocked icons
    const { data: unlockedIcons, error: unlockedError } = await supabase
      .from('user_unlocked_icons')
      .select('icon_uuid')
      .eq('user_id', userId);

    if (unlockedError) {
      return { success: false, error: unlockedError };
    }

    const unlockedSet = new Set(unlockedIcons.map((i) => i.icon_uuid));

    // Combine data
    const iconsWithStatus = allIcons.map((icon) => ({
      ...icon,
      is_unlocked: unlockedSet.has(icon.icon_uuid),
    }));

    return { success: true, data: iconsWithStatus };
  } catch (error) {
    return { success: false, error };
  }
}

// ============================================
// Achievement Functions
// ============================================

/**
 * Get all available achievements
 */
export async function getAchievements(category = null) {
  try {
    let query = supabase.from('achievements').select('*');

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query.order('xp_reward', { ascending: true });

    if (error) {
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}

/**
 * Get user's earned achievements
 */
export async function getUserAchievements(userId) {
  try {
    const { data, error } = await supabase
      .from('user_achievements')
      .select(
        `
        *,
        achievements (*)
      `
      )
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });

    if (error) {
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}

/**
 * Check and award achievements
 */
export async function checkAchievements(userId) {
  try {
    // Get user progression
    const progressResult = await getUserProgression(userId);
    if (!progressResult.success) {
      return progressResult;
    }

    const progress = progressResult.data;

    // Get all achievements
    const achievementsResult = await getAchievements();
    if (!achievementsResult.success) {
      return achievementsResult;
    }

    // Get already earned achievements
    const earnedResult = await getUserAchievements(userId);
    const earnedKeys = new Set(
      earnedResult.success ? earnedResult.data.map((a) => a.achievement_key) : []
    );

    const newlyEarned = [];

    // Check each achievement
    for (const achievement of achievementsResult.data) {
      if (earnedKeys.has(achievement.achievement_key)) {
        continue;
      }

      let earned = false;

      switch (achievement.requirement_type) {
        case 'entries_count':
          earned = progress.total_entries >= achievement.requirement_value;
          break;
        case 'streak_days':
          earned = progress.streak_days >= achievement.requirement_value;
          break;
        case 'custom':
          // For level achievements
          if (achievement.achievement_key.startsWith('level_')) {
            earned = progress.level >= achievement.requirement_value;
          }
          break;
        // Add more cases as needed
      }

      if (earned) {
        // Award achievement
        const { error } = await supabase.from('user_achievements').insert({
          user_id: userId,
          achievement_key: achievement.achievement_key,
        });

        if (!error) {
          newlyEarned.push(achievement);
          // Award XP for achievement
          await awardXP(userId, achievement.xp_reward);
        }
      }
    }

    return { success: true, newly_earned: newlyEarned };
  } catch (error) {
    return { success: false, error };
  }
}

// ============================================
// Leaderboard Functions
// ============================================

/**
 * Get top users by level
 */
export async function getLeaderboard(limit = 10, orderBy = 'level') {
  try {
    const validOrderOptions = ['level', 'xp', 'total_entries', 'longest_streak'];
    const orderColumn = validOrderOptions.includes(orderBy) ? orderBy : 'level';

    const { data, error } = await supabase
      .from('user_progression')
      .select(
        `
        *,
        user_profiles!inner(display_name, avatar_url)
      `
      )
      .order(orderColumn, { ascending: false })
      .limit(limit);

    if (error) {
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}

/**
 * Get user's rank on leaderboard
 */
export async function getUserRank(userId) {
  try {
    const { data: userProgress } = await supabase
      .from('user_progression')
      .select('level, xp')
      .eq('user_id', userId)
      .single();

    if (!userProgress) {
      return { success: true, rank: null };
    }

    // Count users with higher level or same level with more XP
    const { count, error } = await supabase
      .from('user_progression')
      .select('*', { count: 'exact', head: true })
      .or(
        `level.gt.${userProgress.level},and(level.eq.${userProgress.level},xp.gt.${userProgress.xp})`
      );

    if (error) {
      return { success: false, error };
    }

    return { success: true, rank: count + 1 };
  } catch (error) {
    return { success: false, error };
  }
}

/**
 * Get level titles
 */
export async function getLevelTitles() {
  try {
    const { data, error } = await supabase
      .from('level_titles')
      .select('*')
      .order('level', { ascending: true });

    if (error) {
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}

/**
 * Get title for specific level
 */
export async function getTitleForLevel(level) {
  try {
    const { data, error } = await supabase
      .from('level_titles')
      .select('*')
      .lte('level', level)
      .order('level', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}

// ============================================
// Helper Functions
// ============================================

/**
 * Get rarity color for UI
 */
export function getRarityColor(rarity) {
  const colors = {
    common: 'text-slate-600 bg-slate-100',
    uncommon: 'text-green-600 bg-green-100',
    rare: 'text-blue-600 bg-blue-100',
    epic: 'text-purple-600 bg-purple-100',
    legendary: 'text-amber-600 bg-amber-100',
  };
  return colors[rarity] || colors.common;
}

/**
 * Get rarity badge styling
 */
export function getRarityBadgeStyle(rarity) {
  const styles = {
    common: 'border-slate-400 text-slate-700 bg-slate-50',
    uncommon: 'border-green-500 text-green-700 bg-green-50',
    rare: 'border-blue-500 text-blue-700 bg-blue-50',
    epic: 'border-purple-500 text-purple-700 bg-purple-50',
    legendary: 'border-amber-500 text-amber-700 bg-amber-50 shadow-lg',
  };
  return styles[rarity] || styles.common;
}

/**
 * Format unlock requirement text
 */
export function formatUnlockRequirement(icon) {
  switch (icon.unlock_type) {
    case 'default':
      return 'Unlocked by default';
    case 'level':
      return `Reach level ${icon.unlock_value}`;
    case 'entries':
      return `Write ${icon.unlock_value} entries`;
    case 'streak':
      return `Maintain a ${icon.unlock_value}-day streak`;
    case 'achievement':
      return `Earn specific achievement`;
    default:
      return 'Unknown requirement';
  }
}
