import { describe, expect, it } from 'vitest';
import {
  buildEntryMetadataSnapshot,
  getClassicBookStatusChipClass,
  getPrimaryTriggerQuestion,
  normalizeEntryMetadata,
  normalizeEntryStatus,
  resolveEntryQuestionText,
} from './journalEntrySemantics';

describe('journalEntrySemantics', () => {
  it('normalizes entry status safely', () => {
    expect(normalizeEntryStatus('completed')).toBe('completed');
    expect(normalizeEntryStatus('  REVIEW ')).toBe('review');
    expect(normalizeEntryStatus('invalid')).toBe('continue');
    expect(normalizeEntryStatus(null)).toBe('continue');
  });

  it('resolves primary trigger question from string or array', () => {
    expect(getPrimaryTriggerQuestion('What changed today?')).toBe('What changed today?');
    expect(getPrimaryTriggerQuestion(['', '  ', 'What changed today?'])).toBe('What changed today?');
    expect(getPrimaryTriggerQuestion([])).toBeNull();
  });

  it('builds metadata snapshot from selected icon theme', () => {
    const snapshot = buildEntryMetadataSnapshot(
      {
        uuid: 'b_shield',
        name: 'Shield',
        meaning: 'Protection',
        trigger_question: ['What needs protection?'],
      },
      {
        metadata: { source: 'book_journey' },
      }
    );

    expect(snapshot).toEqual({
      question_uuid: 'b_shield',
      question_text: 'What needs protection?',
      question_variant: 0,
      icon_name: 'Shield',
      icon_color: null,
      chapter_label: 'Protection',
      metadata: { source: 'book_journey' },
    });
  });

  it('normalizes metadata values and defaults metadata object', () => {
    const normalized = normalizeEntryMetadata({
      question_uuid: '  b_key ',
      question_text: '  What opens for you? ',
      question_variant: '2',
      icon_name: ' Key ',
      icon_color: '',
      chapter_label: ' Access ',
      metadata: null,
    });

    expect(normalized).toEqual({
      question_uuid: 'b_key',
      question_text: 'What opens for you?',
      question_variant: 2,
      icon_name: 'Key',
      icon_color: null,
      chapter_label: 'Access',
      metadata: {},
    });
  });

  it('prefers persisted question text and falls back when missing', () => {
    expect(resolveEntryQuestionText({ question_text: 'Stored question' }, 'Fallback')).toBe('Stored question');
    expect(resolveEntryQuestionText({}, 'Fallback')).toBe('Fallback');
    expect(resolveEntryQuestionText({}, '')).toBe('');
  });

  it('returns consistent classic chip class for book statuses', () => {
    expect(getClassicBookStatusChipClass('completed')).toBe('bg-[#9B1D1E] text-[#fdeee4]');
    expect(getClassicBookStatusChipClass(' REVIEW ')).toBe('bg-[#f3d1bd] text-[#7a2b18]');
    expect(getClassicBookStatusChipClass('unknown')).toBe('bg-[#f7c9b2] text-[#7a2b18]');
  });
});
