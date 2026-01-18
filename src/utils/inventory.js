import { supabase } from "./supabase";

/**
 * Fetch all icon definitions with user's unlock status
 */
export async function getIconInventory(userId) {
  try {
    // Get all icon requirements
    const { data: allIcons, error: iconsError } = await supabase
      .from("icon_unlock_requirements")
      .select("*")
      .order("rarity", { ascending: true })
      .order("journal_type", { ascending: true });

    if (iconsError) throw iconsError;

    // Get user's unlocked icons
    const { data: unlockedIcons, error: unlockedError } = await supabase
      .from("user_unlocked_icons")
      .select("icon_uuid, unlocked_at, unlock_method")
      .eq("user_id", userId);

    if (unlockedError) throw unlockedError;

    // Create a map of unlocked icons
    const unlockedMap = new Map(
      (unlockedIcons || []).map((u) => [u.icon_uuid, u])
    );

    // Merge the data
    const inventory = (allIcons || []).map((icon) => ({
      ...icon,
      isUnlocked: unlockedMap.has(icon.icon_uuid),
      unlockedAt: unlockedMap.get(icon.icon_uuid)?.unlocked_at || null,
      unlockMethod: unlockedMap.get(icon.icon_uuid)?.unlock_method || null,
    }));

    return { success: true, data: inventory };
  } catch (error) {
    console.error("Error fetching icon inventory:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Fetch all achievements with user's earned status
 */
export async function getAchievementInventory(userId) {
  try {
    // Get all achievements
    const { data: allAchievements, error: achievementsError } = await supabase
      .from("achievements")
      .select("*")
      .order("category", { ascending: true })
      .order("rarity", { ascending: true });

    if (achievementsError) throw achievementsError;

    // Get user's earned achievements
    const { data: earnedAchievements, error: earnedError } = await supabase
      .from("user_achievements")
      .select("achievement_key, earned_at, progress_data")
      .eq("user_id", userId);

    if (earnedError) throw earnedError;

    // Create a map of earned achievements
    const earnedMap = new Map(
      (earnedAchievements || []).map((a) => [a.achievement_key, a])
    );

    // Merge the data
    const inventory = (allAchievements || []).map((achievement) => ({
      ...achievement,
      isEarned: earnedMap.has(achievement.achievement_key),
      earnedAt: earnedMap.get(achievement.achievement_key)?.earned_at || null,
      progressData:
        earnedMap.get(achievement.achievement_key)?.progress_data || null,
    }));

    return { success: true, data: inventory };
  } catch (error) {
    console.error("Error fetching achievement inventory:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Fetch all level titles with user's current unlock status
 */
export async function getTitleInventory(userId) {
  try {
    // Get user's current level
    const { data: progression, error: progressionError } = await supabase
      .from("user_progression")
      .select("level, title")
      .eq("user_id", userId)
      .single();

    if (progressionError && progressionError.code !== "PGRST116") {
      throw progressionError;
    }

    const currentLevel = progression?.level || 1;

    // Get all level titles
    const { data: allTitles, error: titlesError } = await supabase
      .from("level_titles")
      .select("*")
      .order("level", { ascending: true });

    if (titlesError) throw titlesError;

    // Mark which titles are unlocked
    const inventory = (allTitles || []).map((title) => ({
      ...title,
      isUnlocked: currentLevel >= title.level,
      isCurrent: progression?.title === title.title,
    }));

    return { success: true, data: inventory, currentLevel };
  } catch (error) {
    console.error("Error fetching title inventory:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get inventory statistics
 */
export async function getInventoryStats(userId) {
  try {
    const [iconsResult, achievementsResult, titlesResult] = await Promise.all([
      getIconInventory(userId),
      getAchievementInventory(userId),
      getTitleInventory(userId),
    ]);

    const icons = iconsResult.data || [];
    const achievements = achievementsResult.data || [];
    const titles = titlesResult.data || [];

    const stats = {
      icons: {
        total: icons.length,
        unlocked: icons.filter((i) => i.isUnlocked).length,
        byRarity: {
          common: icons.filter((i) => i.rarity === "common").length,
          uncommon: icons.filter((i) => i.rarity === "uncommon").length,
          rare: icons.filter((i) => i.rarity === "rare").length,
          epic: icons.filter((i) => i.rarity === "epic").length,
          legendary: icons.filter((i) => i.rarity === "legendary").length,
        },
        unlockedByRarity: {
          common: icons.filter((i) => i.rarity === "common" && i.isUnlocked).length,
          uncommon: icons.filter((i) => i.rarity === "uncommon" && i.isUnlocked).length,
          rare: icons.filter((i) => i.rarity === "rare" && i.isUnlocked).length,
          epic: icons.filter((i) => i.rarity === "epic" && i.isUnlocked).length,
          legendary: icons.filter((i) => i.rarity === "legendary" && i.isUnlocked).length,
        },
      },
      achievements: {
        total: achievements.length,
        earned: achievements.filter((a) => a.isEarned).length,
      },
      titles: {
        total: titles.length,
        unlocked: titles.filter((t) => t.isUnlocked).length,
        currentLevel: titlesResult.currentLevel || 1,
      },
    };

    return { success: true, data: stats };
  } catch (error) {
    console.error("Error fetching inventory stats:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get rarity color classes
 */
export function getRarityStyles(rarity) {
  const styles = {
    common: {
      border: "border-slate-400",
      bg: "bg-slate-100",
      text: "text-slate-600",
      glow: "",
      badge: "bg-slate-500",
    },
    uncommon: {
      border: "border-green-500",
      bg: "bg-green-50",
      text: "text-green-600",
      glow: "shadow-[0_0_10px_rgba(34,197,94,0.3)]",
      badge: "bg-green-500",
    },
    rare: {
      border: "border-blue-500",
      bg: "bg-blue-50",
      text: "text-blue-600",
      glow: "shadow-[0_0_15px_rgba(59,130,246,0.4)]",
      badge: "bg-blue-500",
    },
    epic: {
      border: "border-purple-500",
      bg: "bg-purple-50",
      text: "text-purple-600",
      glow: "shadow-[0_0_20px_rgba(168,85,247,0.5)]",
      badge: "bg-purple-500",
    },
    legendary: {
      border: "border-yellow-500",
      bg: "bg-yellow-50",
      text: "text-yellow-600",
      glow: "shadow-[0_0_25px_rgba(234,179,8,0.6)]",
      badge: "bg-gradient-to-r from-yellow-400 to-amber-500",
    },
  };

  return styles[rarity] || styles.common;
}

/**
 * Format unlock requirement as human-readable string
 */
export function formatUnlockRequirement(item) {
  if (item.is_default) return "Default - Available from start";

  switch (item.unlock_type) {
    case "level":
      return `Reach Level ${item.unlock_value}`;
    case "entries":
      return `Write ${item.unlock_value} entries`;
    case "streak":
      return `Maintain ${item.unlock_value}-day streak`;
    case "achievement":
      return `Complete special achievement`;
    default:
      return "Unknown requirement";
  }
}
