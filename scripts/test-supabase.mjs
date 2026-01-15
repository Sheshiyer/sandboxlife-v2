/**
 * Supabase Connection Test Script
 * Run with: node scripts/test-supabase.mjs
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://teyudjxlutkavyyigwwz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRleXVkanhsdXRrYXZ5eWlnd3d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDYzMDQ2NjgsImV4cCI6MjAyMTg4MDY2OH0.MvaDhHKE55sSIEiasenRbR9U1LKnt7ae6dZUa89LUJg';

const supabase = createClient(supabaseUrl, supabaseKey);

const results = {
  passed: [],
  failed: []
};

function log(test, passed, details = '') {
  const status = passed ? '✓' : '✗';
  console.log(`${status} ${test}${details ? ` - ${details}` : ''}`);
  if (passed) {
    results.passed.push(test);
  } else {
    results.failed.push({ test, details });
  }
}

async function testConnection() {
  console.log('\n=== Phase 1: Connection Testing ===\n');
  
  // Test 1: Basic connection
  try {
    const { data, error } = await supabase.from('user_journal_entries').select('count').limit(1);
    log('Supabase connection', !error, error?.message);
  } catch (e) {
    log('Supabase connection', false, e.message);
  }
}

async function testTables() {
  console.log('\n=== Phase 2: Table Access Testing ===\n');
  
  // Test user_journal_entries table
  try {
    const { data, error } = await supabase.from('user_journal_entries').select('id').limit(1);
    log('user_journal_entries table', !error, error?.message);
  } catch (e) {
    log('user_journal_entries table', false, e.message);
  }

  // Test user_profiles table
  try {
    const { data, error } = await supabase.from('user_profiles').select('id').limit(1);
    log('user_profiles table', !error, error?.message);
  } catch (e) {
    log('user_profiles table', false, e.message);
  }

  // Test user_define_settings table
  try {
    const { data, error } = await supabase.from('user_define_settings').select('id').limit(1);
    log('user_define_settings table', !error, error?.message);
  } catch (e) {
    log('user_define_settings table', false, e.message);
  }
}

async function testAuth() {
  console.log('\n=== Phase 3: Auth Testing ===\n');
  
  // Test auth service availability
  try {
    const { data, error } = await supabase.auth.getSession();
    log('Auth service available', !error, error?.message);
  } catch (e) {
    log('Auth service available', false, e.message);
  }
}

async function testStorage() {
  console.log('\n=== Phase 4: Storage Testing ===\n');
  
  // Test avatars bucket
  try {
    const { data, error } = await supabase.storage.from('avatars').list('', { limit: 1 });
    log('Avatars bucket accessible', !error, error?.message);
  } catch (e) {
    log('Avatars bucket accessible', false, e.message);
  }
}

async function testQueries() {
  console.log('\n=== Phase 5: Query Testing ===\n');
  
  // Test fetchTopUserRecords equivalent
  try {
    const { data, error } = await supabase
      .from('user_journal_entries')
      .select('*')
      .order('id', { ascending: false })
      .limit(6)
      .neq('journal_type', 'thought_of_the_day');
    log('fetchTopUserRecords query', !error, error?.message || `Found ${data?.length || 0} entries`);
  } catch (e) {
    log('fetchTopUserRecords query', false, e.message);
  }

  // Test fetchEntries equivalent
  try {
    const { data, error } = await supabase
      .from('user_journal_entries')
      .select('*')
      .eq('journal_type', 'daily_journal')
      .order('created_at', { ascending: false })
      .limit(5);
    log('fetchEntries query', !error, error?.message || `Found ${data?.length || 0} entries`);
  } catch (e) {
    log('fetchEntries query', false, e.message);
  }

  // Test fetchDailyEntryCount equivalent
  try {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0)).toISOString();
    const endOfDay = new Date(now.setHours(23, 59, 59, 999)).toISOString();
    
    const { data, error } = await supabase
      .from('user_journal_entries')
      .select('id', { count: 'exact' })
      .gte('created_at', startOfDay)
      .lte('created_at', endOfDay);
    log('fetchDailyEntryCount query', !error, error?.message || `Today's entries: ${data?.length || 0}`);
  } catch (e) {
    log('fetchDailyEntryCount query', false, e.message);
  }
}

async function runTests() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   Sandbox Life - Supabase Test Suite   ║');
  console.log('╚════════════════════════════════════════╝');
  
  await testConnection();
  await testTables();
  await testAuth();
  await testStorage();
  await testQueries();
  
  console.log('\n=== Summary ===\n');
  console.log(`Passed: ${results.passed.length}`);
  console.log(`Failed: ${results.failed.length}`);
  
  if (results.failed.length > 0) {
    console.log('\nFailed tests:');
    results.failed.forEach(f => console.log(`  - ${f.test}: ${f.details}`));
  }
  
  console.log('\n');
  process.exit(results.failed.length > 0 ? 1 : 0);
}

runTests();
