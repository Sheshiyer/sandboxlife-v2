import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import MyCalendar from './MyCalendar';

const { fetchAllEntries } = vi.hoisted(() => ({ fetchAllEntries: vi.fn() }));
vi.mock('../utils/supabase', () => ({ fetchAllEntries }));
vi.mock('react-router-dom', () => ({ useParams: () => ({ userId: 'calendar-test-user' }) }));
vi.mock('../context/GameModeContext', () => ({ useGameMode: () => ({ isGameMode: false }) }));
vi.mock('../components/Menu', () => ({ default: () => null }));
vi.mock('../components/TopBar', () => ({ default: () => null }));
vi.mock('../components/Breadcrumb', () => ({ default: () => null }));
vi.mock('../components/EntryDetails', () => ({
  default: ({ selected, onPrimarySelected }) => (
    <button onClick={() => onPrimarySelected({ ...selected, primary_to_calendar: true })}>Confirm fixture primary</button>
  ),
}));
vi.mock('../components/JournalEntry', () => ({
  default: ({ iconTitle, isPrimary }) => <div data-testid="journal-entry" data-primary={String(isPrimary)}>{iconTitle}</div>,
}));
vi.mock('../utils/iconResolver', () => ({ resolveIcon: (entry) => entry.journal_icon }));
vi.mock('react-toastify', () => ({ ToastContainer: () => null, toast: { error: vi.fn() } }));

const entries = Array.from({ length: 5 }, (_, index) => ({
  id: index + 1,
  created_at: '2026-02-25T12:00:00.000Z',
  journal_type: 'daily_journal',
  journal_icon: `/icon-${index}.png`,
  journal_meaning: `Distinct icon ${index}`,
  journal_entry: `Synthetic calendar fixture ${index}`,
  primary_to_calendar: index === 2,
}));

describe('historical calendar entries', () => {
  let container;
  let root;
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-02T12:00:00.000Z'));
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    fetchAllEntries.mockReset();
  });
  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
    vi.useRealTimers();
    delete globalThis.IS_REACT_ACT_ENVIRONMENT;
  });

  it('refetches a historical month and retains five entries behind its primary icon', async () => {
    fetchAllEntries.mockImplementation(async (_user, start, end) => entries.filter(
      (entry) => entry.created_at >= start && entry.created_at <= end
    ));
    await act(async () => root.render(<MyCalendar />));
    for (let month = 0; month < 9; month++) {
      await act(async () => {
        const previous = container.querySelector('button[aria-label="Previous month"]')
          || Array.from(container.querySelectorAll('button')).find((button) => !button.textContent.trim());
        previous.click();
      });
    }
    const lastRange = fetchAllEntries.mock.calls.at(-1);
    expect(new Date(lastRange[1]).getFullYear()).toBe(2026);
    expect(new Date(lastRange[1]).getMonth()).toBe(1);
    expect(new Date(lastRange[1]).getDate()).toBe(1);
    expect(container.querySelectorAll('[data-testid="journal-entry"]')).toHaveLength(5);
    expect(container.textContent).toContain('+4');
    expect(container.querySelector('img[src="/icon-2.png"]')).not.toBeNull();
  });

  it('navigates one month at a time from the end of a long month', async () => {
    vi.setSystemTime(new Date('2026-03-31T12:00:00.000Z'));
    fetchAllEntries.mockResolvedValue([]);
    await act(async () => root.render(<MyCalendar />));
    await act(async () => {
      const previous = container.querySelector('button[aria-label="Previous month"]')
        || Array.from(container.querySelectorAll('button')).find((button) => !button.textContent.trim());
      previous.click();
    });
    expect(container.textContent).toContain('February 2026');
  });

  it('changes the primary icon without dropping any of the five entries', async () => {
    vi.setSystemTime(new Date('2026-02-25T12:00:00.000Z'));
    fetchAllEntries.mockResolvedValue(entries);
    await act(async () => root.render(<MyCalendar />));
    expect(container.querySelectorAll('[data-testid="journal-entry"]')).toHaveLength(5);
    expect(container.querySelector('img[src="/icon-2.png"]')).not.toBeNull();
    await act(async () => container.querySelector('[data-testid="journal-entry"]').click());
    await act(async () => Array.from(container.querySelectorAll('button'))
      .find(button => button.textContent === 'Confirm fixture primary').click());
    expect(container.querySelectorAll('[data-testid="journal-entry"]')).toHaveLength(5);
    expect(container.querySelectorAll('[data-primary="true"]')).toHaveLength(1);
    expect(container.querySelector('img[src="/icon-0.png"]')).not.toBeNull();
    expect(container.textContent).toContain('+4');
  });
});
