import { supabase } from "./supabase";

export const fetchDashboardV2Entries = async (userId, limit = 12) => {
  const { data, error } = await supabase
    .from("user_journal_entries")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return { success: false, error };
  }

  return { success: true, data };
};

export const fetchDashboardV2RecentActivity = async (userId, limit = 5) => {
  const { data, error } = await supabase
    .from("user_journal_entries")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return { success: false, error };
  }

  return { success: true, data };
};
