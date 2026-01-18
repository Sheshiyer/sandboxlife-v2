import { supabase } from "./supabase";

/**
 * Get the start of the current day (midnight UTC)
 */
function getStartOfDay() {
  const now = new Date();
  now.setUTCHours(0, 0, 0, 0);
  return now.toISOString();
}

/**
 * Get the start of the current week (Monday midnight UTC)
 */
function getStartOfWeek() {
  const now = new Date();
  const day = now.getUTCDay();
  const diff = now.getUTCDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
  now.setUTCDate(diff);
  now.setUTCHours(0, 0, 0, 0);
  return now.toISOString();
}

/**
 * Fetch all quest definitions
 */
export async function getQuestDefinitions() {
  try {
    const { data, error } = await supabase
      .from("quest_definitions")
      .select("*")
      .eq("is_active", true)
      .order("quest_type", { ascending: true })
      .order("xp_reward", { ascending: true });

    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Error fetching quest definitions:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Calculate quest progress for a user
 */
export async function calculateQuestProgress(userId) {
  try {
    const startOfDay = getStartOfDay();
    const startOfWeek = getStartOfWeek();

    // Get all quest definitions
    const { data: quests, error: questError } = await supabase
      .from("quest_definitions")
      .select("*")
      .eq("is_active", true);

    if (questError) throw questError;

    // Get user's entries for today
    const { data: todayEntries, error: todayError } = await supabase
      .from("user_journal_entries")
      .select("id, journal_type, journal_id, journal_entry, created_at")
      .eq("user_id", userId)
      .gte("created_at", startOfDay);

    if (todayError) throw todayError;

    // Get user's entries for this week
    const { data: weekEntries, error: weekError } = await supabase
      .from("user_journal_entries")
      .select("id, journal_type, journal_id, journal_entry, created_at")
      .eq("user_id", userId)
      .gte("created_at", startOfWeek);

    if (weekError) throw weekError;

    // Get user's progression for streak
    const { data: progression, error: progError } = await supabase
      .from("user_progression")
      .select("streak_days, last_entry_date")
      .eq("user_id", userId)
      .single();

    // Calculate progress for each quest
    const questProgress = quests.map((quest) => {
      let progress = 0;
      let target = quest.requirement_value;
      let isCompleted = false;

      switch (quest.requirement_type) {
        case "entries_count":
          if (quest.quest_type === "daily") {
            progress = todayEntries?.length || 0;
          } else {
            progress = weekEntries?.length || 0;
          }
          break;

        case "journal_types":
          if (quest.quest_type === "daily") {
            const types = new Set(todayEntries?.map((e) => e.journal_type) || []);
            progress = types.size;
          } else {
            const types = new Set(weekEntries?.map((e) => e.journal_type) || []);
            progress = types.size;
          }
          break;

        case "icons_used":
          if (quest.quest_type === "daily") {
            const icons = new Set(todayEntries?.map((e) => e.journal_id) || []);
            progress = icons.size;
          } else {
            const icons = new Set(weekEntries?.map((e) => e.journal_id) || []);
            progress = icons.size;
          }
          break;

        case "word_count": {
          const entries = quest.quest_type === "daily" ? todayEntries : weekEntries;
          progress = (entries || []).reduce((total, entry) => {
            const words = (entry.journal_entry || "").trim().split(/\s+/).filter(Boolean).length;
            return total + words;
          }, 0);
          break;
        }

        case "streak_maintain":
          if (progression && !progError) {
            const today = new Date().toISOString().split("T")[0];
            const lastEntry = progression.last_entry_date;
            // Streak is maintained if they've written today or yesterday
            if (lastEntry === today) {
              progress = 1;
            } else {
              const yesterday = new Date();
              yesterday.setDate(yesterday.getDate() - 1);
              const yesterdayStr = yesterday.toISOString().split("T")[0];
              if (lastEntry === yesterdayStr && progression.streak_days > 0) {
                progress = 0; // Need to write today to maintain
              }
            }
          }
          break;

        default:
          progress = 0;
      }

      isCompleted = progress >= target;

      return {
        ...quest,
        progress,
        target,
        isCompleted,
        percentComplete: Math.min(100, Math.round((progress / target) * 100)),
      };
    });

    return { success: true, data: questProgress };
  } catch (error) {
    console.error("Error calculating quest progress:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get user's quest progress records (for claimed status)
 */
export async function getUserQuestProgress(userId) {
  try {
    const startOfDay = getStartOfDay();
    const startOfWeek = getStartOfWeek();

    const { data, error } = await supabase
      .from("user_quest_progress")
      .select("*")
      .eq("user_id", userId)
      .or(`reset_at.gte.${startOfDay},reset_at.gte.${startOfWeek}`);

    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Error fetching user quest progress:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Claim quest reward
 */
export async function claimQuestReward(userId, questKey) {
  try {
    // Get quest definition
    const { data: quest, error: questError } = await supabase
      .from("quest_definitions")
      .select("*")
      .eq("quest_key", questKey)
      .single();

    if (questError) throw questError;

    const resetAt = quest.quest_type === "daily" ? getStartOfDay() : getStartOfWeek();

    // Check if already claimed
    const { data: existing, error: existingError } = await supabase
      .from("user_quest_progress")
      .select("id, is_claimed")
      .eq("user_id", userId)
      .eq("quest_key", questKey)
      .eq("reset_at", resetAt)
      .single();

    if (existingError && existingError.code !== "PGRST116") throw existingError;

    if (existing?.is_claimed) {
      return { success: false, error: "Quest already claimed" };
    }

    // Create or update quest progress record
    const { error: upsertError } = await supabase
      .from("user_quest_progress")
      .upsert({
        user_id: userId,
        quest_key: questKey,
        is_completed: true,
        is_claimed: true,
        completed_at: new Date().toISOString(),
        reset_at: resetAt,
      }, {
        onConflict: "user_id,quest_key,reset_at",
      });

    if (upsertError) throw upsertError;

    // Award XP
    const { data: xpResult, error: xpError } = await supabase.rpc("award_xp", {
      p_user_id: userId,
      xp_amount: quest.xp_reward,
    });

    if (xpError) {
      console.error("Error awarding XP:", xpError);
      // Don't fail the whole operation if XP award fails
    }

    return {
      success: true,
      data: {
        xpAwarded: quest.xp_reward,
        levelUp: xpResult?.leveled_up || false,
        newLevel: xpResult?.new_level || null,
        newTitle: xpResult?.new_title || null,
      },
    };
  } catch (error) {
    console.error("Error claiming quest reward:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get quests with full progress and claim status
 */
export async function getQuestsWithProgress(userId) {
  try {
    // Get calculated progress
    const progressResult = await calculateQuestProgress(userId);
    if (!progressResult.success) throw new Error(progressResult.error);

    // Get claimed status
    const claimedResult = await getUserQuestProgress(userId);
    const claimedMap = new Map(
      (claimedResult.data || []).map((p) => [`${p.quest_key}-${p.reset_at}`, p])
    );

    const startOfDay = getStartOfDay();
    const startOfWeek = getStartOfWeek();

    // Merge progress with claimed status
    const quests = progressResult.data.map((quest) => {
      const resetAt = quest.quest_type === "daily" ? startOfDay : startOfWeek;
      const claimRecord = claimedMap.get(`${quest.quest_key}-${resetAt}`);

      return {
        ...quest,
        isClaimed: claimRecord?.is_claimed || false,
        claimedAt: claimRecord?.completed_at || null,
      };
    });

    // Separate by type
    const dailyQuests = quests.filter((q) => q.quest_type === "daily");
    const weeklyQuests = quests.filter((q) => q.quest_type === "weekly");

    // Calculate stats
    const stats = {
      dailyCompleted: dailyQuests.filter((q) => q.isCompleted).length,
      dailyTotal: dailyQuests.length,
      weeklyCompleted: weeklyQuests.filter((q) => q.isCompleted).length,
      weeklyTotal: weeklyQuests.length,
      totalXpAvailable: quests.reduce((sum, q) => sum + q.xp_reward, 0),
      xpClaimed: quests
        .filter((q) => q.isClaimed)
        .reduce((sum, q) => sum + q.xp_reward, 0),
    };

    return {
      success: true,
      data: {
        dailyQuests,
        weeklyQuests,
        stats,
      },
    };
  } catch (error) {
    console.error("Error getting quests with progress:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get quest type styling
 */
export function getQuestTypeStyles(questType) {
  const styles = {
    daily: {
      bg: "bg-blue-500/20",
      border: "border-blue-500/50",
      text: "text-blue-400",
      badge: "bg-blue-500",
      glow: "shadow-[0_0_15px_rgba(59,130,246,0.3)]",
    },
    weekly: {
      bg: "bg-purple-500/20",
      border: "border-purple-500/50",
      text: "text-purple-400",
      badge: "bg-purple-500",
      glow: "shadow-[0_0_15px_rgba(168,85,247,0.3)]",
    },
    special: {
      bg: "bg-yellow-500/20",
      border: "border-yellow-500/50",
      text: "text-yellow-400",
      badge: "bg-yellow-500",
      glow: "shadow-[0_0_15px_rgba(234,179,8,0.3)]",
    },
  };

  return styles[questType] || styles.daily;
}
