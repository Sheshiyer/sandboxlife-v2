import { createClient } from '@supabase/supabase-js';
import { normalizeEntryMetadata, normalizeEntryStatus } from './journalEntrySemantics';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

const STATUS_COLUMNS = ['entry_status', 'primary_to_calendar'];
const METADATA_COLUMNS = [
  'question_uuid',
  'question_text',
  'question_variant',
  'icon_name',
  'icon_color',
  'chapter_label',
  'metadata',
];

function isSchemaColumnError(error, columns = []) {
  const bucket = `${error?.message || ''} ${error?.details || ''} ${error?.hint || ''}`.toLowerCase();
  return columns.some((columnName) => bucket.includes(String(columnName).toLowerCase()));
}

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
  entryStatus = 'continue',
  primaryToCalendar = false,
  entryMetadata = {},
) {
  const normalizedStatus = normalizeEntryStatus(entryStatus);
  const normalizedMetadata = normalizeEntryMetadata(entryMetadata);
  const basePayload = {
    user_id: userId,
    journal_type: journalType,
    journal_id: journalId,
    journal_icon: journalIcon,
    journal_meaning: journalMeaning,
    journal_entry: journalEntry,
    wisdom_message: wisdomMessage,
  };
  const statusPayload = {
    ...basePayload,
    entry_status: normalizedStatus,
    primary_to_calendar: Boolean(primaryToCalendar),
  };
  const payload = {
    ...statusPayload,
    ...normalizedMetadata,
  };

  if (createdAt) {
    basePayload.created_at = createdAt;
    statusPayload.created_at = createdAt;
    payload.created_at = createdAt;
  }

  let { data, error } = await supabase
    .from('user_journal_entries')
    .insert(payload)
    .select('*');

  // Backward compatibility for environments where metadata columns are not yet applied
  if (error && isSchemaColumnError(error, METADATA_COLUMNS)) {
    const fallbackResult = await supabase
      .from('user_journal_entries')
      .insert(statusPayload)
      .select('*');
    data = fallbackResult.data;
    error = fallbackResult.error;
  }

  // Backward compatibility for environments where status columns are not yet applied
  if (error && isSchemaColumnError(error, STATUS_COLUMNS)) {
    const fallbackResult = await supabase
      .from('user_journal_entries')
      .insert(basePayload)
      .select('*');
    data = fallbackResult.data;
    error = fallbackResult.error;
  }

  if (error) {
    console.error('Insert error:', error.message, error.details, error.hint);
    return { success: false, error };
  }
  return { success: true, data };
}

export async function setPrimaryCalendarEntry(entryId) {
  const { data, error } = await supabase.rpc('set_primary_calendar_entry', { p_entry_id: entryId });
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
