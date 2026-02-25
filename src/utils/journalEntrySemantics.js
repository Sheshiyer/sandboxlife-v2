export const ENTRY_STATUS_LABELS = Object.freeze({
  continue: 'Continue',
  certificate: 'Certificate',
  completed: 'Completed',
  review: 'Review',
});

export const VALID_ENTRY_STATUSES = new Set(Object.keys(ENTRY_STATUS_LABELS));

function normalizeText(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeInteger(value) {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function normalizeMetadataObject(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }
  return value;
}

export function normalizeEntryStatus(entryStatus) {
  const normalized = typeof entryStatus === 'string' ? entryStatus.trim().toLowerCase() : '';
  return VALID_ENTRY_STATUSES.has(normalized) ? normalized : 'continue';
}

export function getPrimaryTriggerQuestion(triggerQuestion) {
  if (Array.isArray(triggerQuestion)) {
    const firstQuestion = triggerQuestion.find((question) => typeof question === 'string' && question.trim().length > 0);
    return firstQuestion ? firstQuestion.trim() : null;
  }

  if (typeof triggerQuestion === 'string' && triggerQuestion.trim().length > 0) {
    return triggerQuestion.trim();
  }

  return null;
}

export function normalizeEntryMetadata(entryMetadata = {}) {
  return {
    question_uuid: normalizeText(entryMetadata.question_uuid),
    question_text: normalizeText(entryMetadata.question_text),
    question_variant: normalizeInteger(entryMetadata.question_variant),
    icon_name: normalizeText(entryMetadata.icon_name),
    icon_color: normalizeText(entryMetadata.icon_color),
    chapter_label: normalizeText(entryMetadata.chapter_label),
    metadata: normalizeMetadataObject(entryMetadata.metadata),
  };
}

export function buildEntryMetadataSnapshot(selectedIconTheme, options = {}) {
  if (!selectedIconTheme || typeof selectedIconTheme !== 'object') {
    return normalizeEntryMetadata({});
  }

  const defaultQuestionText = getPrimaryTriggerQuestion(selectedIconTheme.trigger_question);
  const questionVariant = options.questionVariant ?? (Array.isArray(selectedIconTheme.trigger_question) ? 0 : null);

  return normalizeEntryMetadata({
    question_uuid: options.questionUuid ?? selectedIconTheme.uuid,
    question_text: options.questionText ?? defaultQuestionText,
    question_variant: questionVariant,
    icon_name: options.iconName ?? selectedIconTheme.name ?? selectedIconTheme.meaning,
    icon_color: options.iconColor ?? null,
    chapter_label: options.chapterLabel ?? selectedIconTheme.meaning,
    metadata: options.metadata ?? {},
  });
}

export function resolveEntryQuestionText(entry, fallbackQuestion = '') {
  const persistedQuestion = normalizeText(entry?.question_text);
  if (persistedQuestion) return persistedQuestion;

  const fallback = normalizeText(fallbackQuestion);
  return fallback || '';
}
