import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import EntryDetails from './EntryDetails';

const { setPrimaryCalendarEntry } = vi.hoisted(() => ({ setPrimaryCalendarEntry: vi.fn() }));
vi.mock('../utils/supabase', () => ({ setPrimaryCalendarEntry }));
vi.mock('../context/GameModeContext', () => ({ useGameMode: () => ({ isGameMode: false }) }));
vi.mock('../constants/questions', () => ({ daily_journal_questions: [], book_journal_questions: [], iconsv2_questions: [] }));
vi.mock('../utils/iconResolver', () => ({ resolveIcon: (entry) => entry.journal_icon }));
/* eslint-disable react/prop-types -- Test doubles only forward Headless UI children. */
vi.mock('@headlessui/react', () => ({
  Dialog: ({ children }) => <div>{children}</div>,
  DialogPanel: ({ children }) => <div>{children}</div>,
  Transition: ({ children, show }) => show ? children : null,
  TransitionChild: ({ children }) => children,
}));
/* eslint-enable react/prop-types */

const selected = { id: 42, journal_type: 'daily_journal', primary_to_calendar: false, question_text: 'Synthetic prompt' };

describe('calendar primary action', () => {
  let container;
  let root;
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    setPrimaryCalendarEntry.mockReset();
  });
  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
    delete globalThis.IS_REACT_ACT_ENVIRONMENT;
  });
  const render = async (onPrimarySelected) => act(async () => root.render(
    <EntryDetails title="Daily" iconTitle="Fixture" selected={selected} setSelected={vi.fn()} onPrimarySelected={onPrimarySelected} />
  ));
  const primaryButton = () => Array.from(container.querySelectorAll('button')).find((button) => button.textContent.includes('Make primary'));

  it('marks the numeric entry ID and notifies the calendar only after success', async () => {
    const onPrimarySelected = vi.fn();
    let complete;
    setPrimaryCalendarEntry.mockImplementation(() => new Promise((resolve) => { complete = resolve; }));
    await render(onPrimarySelected);
    await act(async () => primaryButton().click());
    expect(setPrimaryCalendarEntry).toHaveBeenCalledWith(42);
    expect(onPrimarySelected).not.toHaveBeenCalled();
    expect(container.querySelector('button:disabled')).not.toBeNull();
    await act(async () => complete({ success: true, data: { id: 42 } }));
    expect(onPrimarySelected).toHaveBeenCalledWith(expect.objectContaining({ id: 42, primary_to_calendar: true }));
  });

  it('reports a failed request without marking the entry primary', async () => {
    const onPrimarySelected = vi.fn();
    setPrimaryCalendarEntry.mockResolvedValue({ success: false, error: { message: 'Access denied' } });
    await render(onPrimarySelected);
    await act(async () => primaryButton().click());
    expect(onPrimarySelected).not.toHaveBeenCalled();
    expect(container.querySelector('[role="alert"]').textContent).toContain('Could not update');
    expect(primaryButton().disabled).toBe(false);
  });
});
