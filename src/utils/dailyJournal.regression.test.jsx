import { beforeEach, describe, expect, it, vi } from 'vitest';

const database = {
  error: null,
  rows: [],
};

const queryCalls = [];

function createInMemoryQuery() {
  const filters = [];

  const query = new Proxy(
    {},
    {
      get(_target, property) {
        if (property === 'then') {
          return (resolve) => {
            const hasDailyTypeFilter = filters.some(
              ([column, value]) =>
                column === 'journal_type' &&
                String(value).toLowerCase().includes('daily'),
            );

            const data = hasDailyTypeFilter
              ? database.rows.filter((row) =>
                  String(row.journal_type).toLowerCase().includes('daily'),
                ).length
              : database.rows;

            resolve({
              count: Array.isArray(data) ? data.length : data,
              data: Array.isArray(data) ? data : database.rows.slice(0, data),
              error: database.error,
            });
          };
        }

        if (property === 'eq') {
          return (column, value) => {
            filters.push([column, value]);
            return query;
          };
        }

        return (...args) => {
          queryCalls.push([property, ...args]);
          return query;
        };
      },
    },
  );

  return query;
}

const from = vi.fn(() => createInMemoryQuery());

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({ from })),
}));

vi.stubEnv('VITE_SUPABASE_URL', 'https://in-memory.supabase.invalid');
vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'in-memory-test-key');

const { fetchDailyEntryCount } = await import('./supabase');

describe('Daily Journal slot accounting', () => {
  beforeEach(() => {
    database.error = null;
    database.rows = [
      ...Array.from({ length: 5 }, (_, index) => ({
        id: `daily-${index}`,
        journal_type: 'daily_journal',
      })),
      { id: 'book-1', journal_type: 'book_journal' },
      { id: 'thought-1', journal_type: 'thought_of_the_day' },
    ];
    from.mockClear();
    queryCalls.length = 0;
  });

  it('counts only Daily Journal entries toward the five-entry allowance', async () => {
    await expect(fetchDailyEntryCount('user-1')).resolves.toBe(5);
  });
});
