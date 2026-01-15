import { 
  book_journal_questions, 
  daily_journal_questions, 
  iconsv2_questions 
} from "../constants/questions";

/**
 * Resolves an icon source, prioritizing local stable assets over 
 * potentially expired or broken database URLs.
 * 
 * @param {Object} entry - The journal entry object
 * @returns {String} - The resolved icon source (local path or original URL)
 */
export const resolveIcon = (entry) => {
  if (!entry) return null;
  
  const meaning = entry.journal_meaning;
  if (!meaning) return entry.journal_icon;

  // Search all question sets for a matching meaning to get the local asset
  const allQuestions = [
    ...daily_journal_questions,
    ...book_journal_questions,
    ...iconsv2_questions
  ];

  const match = allQuestions.find(q => q.meaning === meaning);
  
  // Return the local asset if found, otherwise fallback to the stored icon URL
  return match ? match.icon : entry.journal_icon;
};
