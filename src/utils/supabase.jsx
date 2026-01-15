import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Get public URL for an icon from Supabase storage
 * @param {string} iconPath - Path to icon in storage (e.g., 'new_icons/shield.svg')
 * @returns {string} Public URL without expiring token
 */
export function getPublicIconUrl(iconPath) {
  const { data } = supabase.storage
    .from('new_icons')
    .getPublicUrl(iconPath);
  return data.publicUrl;
}

export async function insertJournalEntry(
  userId,
  journalType,
  journalId,
  journalIcon,
  journalMeaning,
  journalEntry,
  wisdomMessage,
  createdAt,
) {
  const payload = {
    user_id: userId,
    journal_type: journalType,
    journal_id: journalId,
    journal_icon: journalIcon,
    journal_meaning: journalMeaning,
    journal_entry: journalEntry,
    wisdom_message: wisdomMessage,
  };

  if (createdAt) {
    payload.created_at = createdAt;
  }

  const { data, error } = await supabase.from('user_journal_entries').insert(payload);

  if (error) {
    return { success: false, error };
  }
  return { success: true, data };
}


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

  if (error) {
    return 0;
  }

  return data?.length || 0;
};


export async function fetchTopUserRecords(userId) {
  const { data, error } = await supabase
    .from('user_journal_entries')
    .select('*') // Select all columns (you can adjust this to specific columns)
    .order('id', { ascending: false }) // Order by ID descending (latest first)
    .limit(6) // Limit to top 6 records
    .neq('journal_type', 'thought_of_the_day')
    .eq('user_id', userId); // Filter by user ID

  if (error) {
    return { success: false, error };
  }

  return { success: true, data };
}

export const fetchEntries = async (userId, journalType, limit) => {
  try {
    const { data, error } = await supabase
      .from('user_journal_entries')
      .select('*')
      .eq('user_id', userId)
      .eq('journal_type', journalType)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      return error;
    }
    return data;
  } catch (error) {
    return { error };
  }
};

export const fetchAllEntries = async (userId, startDay, lastDay) => {
  try {
    const { data, error } = await supabase
      .from("user_journal_entries")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .gte("created_at", startDay)
      .lte("created_at", lastDay);

    if (error) {
      return error;
    }
    return data;
  } catch (error) {
    return { error };
  }
};

export const fetchWeeklyData = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("user_journal_entries")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      return error;
    }
    const sorted = data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    return sorted;
  } catch (error) {
    return { error };
  }
};
