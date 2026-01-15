// Game Assets Registry & Sigil Logic
// Maps existing Sandbox Life icons/meanings to D&D-themed quadrants

const QUADRANT_SCHEMES = {
    mind: { bg: 'bg-blue-900', border: 'border-blue-500', text: 'text-blue-400' },
    body: { bg: 'bg-red-900', border: 'border-red-500', text: 'text-red-400' },
    spirit: { bg: 'bg-purple-900', border: 'border-purple-500', text: 'text-purple-400' },
    heart: { bg: 'bg-green-900', border: 'border-green-500', text: 'text-green-400' },
    neutral: { bg: 'bg-slate-800', border: 'border-slate-600', text: 'text-slate-400' },
};

// Map existing icon meanings to quadrants
const MEANING_TO_QUADRANT = {
    // MIND quadrant - intellectual, knowledge, guidance
    'protection': 'mind',
    'guidance': 'mind',
    'direction': 'mind',
    'decisive': 'mind',
    'overview': 'mind',
    'obstacle': 'mind',
    'self-reliance': 'mind',
    'knowledge & temptation': 'mind',
    'illumination & guidance': 'mind',
    'hope & inner light': 'mind',
    'reflection & truth': 'mind',
    
    // BODY quadrant - physical, action, vitality
    'vitality': 'body',
    'boundaries': 'body',
    'multi-tasking': 'body',
    'strength & solitude': 'body',
    'endurance & resourcefulness': 'body',
    'ambition & sure-footedness': 'body',
    'freedom & drive': 'body',
    
    // SPIRIT quadrant - transformation, growth, inner journey
    'transformation': 'spirit',
    'growth': 'spirit',
    'rebirth': 'spirit',
    'regeneration': 'spirit',
    'enlightenment': 'spirit',
    'endings': 'spirit',
    'power & transformation': 'spirit',
    'transformation & cleansing': 'spirit',
    'cycles & progress': 'spirit',
    'transformation & persistence': 'spirit',
    'mystery & dual nature': 'spirit',
    'preservation & past': 'spirit',
    
    // HEART quadrant - relationships, emotions, prosperity
    'love & friendship': 'heart',
    'recognition': 'heart',
    'luck': 'heart',
    'security': 'heart',
    'access': 'heart',
    'travel & leisure': 'heart',
    'discovery & prosperity': 'heart',
    'fertility/ abundance': 'heart',
    'immortality & fame': 'heart',
    'international issues': 'heart',
    'beauty & confidence': 'heart',
    'memory & wisdom': 'heart',
    'patience & persistence': 'heart',
    'uniqueness & impermanence': 'heart',
    'wisdom & patience': 'heart',
    'value & exchange': 'heart',
    'support & stability': 'heart',
    'stability & foundation': 'heart',
    'resilience & buoyancy': 'heart',
    'time & impermanence': 'heart',
    'legacy & extinction': 'heart',
    'freedom & perspective': 'heart',
    'journey & navigation': 'heart',
    'exploration & discovery': 'heart',
    'intuition & flow': 'heart',
    'adaptability & grace': 'heart',
    'regeneration & awareness': 'heart',
    'direction & true north': 'heart',
    'potential & new beginnings': 'heart',
    'protection & inner voice': 'heart',
};

/**
 * Determines the Quadrant and Scheme based on entry data.
 * Uses the actual journal_icon URL from entries when available.
 * @param {string|string[]} meaningOrArray - The journal_meaning from the entry, or array [meaning, journalType]
 * @param {string} journalType - The journal_type (daily_journal, book_journal, thought_of_the_day)
 * @returns {object} { quadrant, scheme }
 */
export const getSigilData = (meaningOrArray, journalType) => {
    // Handle legacy array format: [meaning, journalType]
    let meaning = meaningOrArray;
    if (Array.isArray(meaningOrArray)) {
        meaning = meaningOrArray[0];
        journalType = meaningOrArray[1];
    }
    
    const lowerMeaning = (meaning || '').toLowerCase();
    
    // Try to find quadrant by meaning
    let quadrant = MEANING_TO_QUADRANT[lowerMeaning];
    
    // Fallback based on journal type if meaning not found
    if (!quadrant) {
        if (journalType === 'book_journal') {
            quadrant = 'mind';
        } else if (journalType === 'thought_of_the_day') {
            quadrant = 'spirit';
        } else {
            quadrant = 'neutral';
        }
    }
    
    // Quadrant icons for fallback display
    const QUADRANT_ICONS = {
        mind: '🧠',
        body: '💪',
        spirit: '✨',
        heart: '❤️',
        neutral: '📜',
    };
    
    return {
        quadrant,
        scheme: QUADRANT_SCHEMES[quadrant] || QUADRANT_SCHEMES.neutral,
        icon: QUADRANT_ICONS[quadrant] || '📜',
    };
};

import { resolveIcon } from "./iconResolver";

/**
 * Gets display data for a journal entry card
 * @param {object} entry - The journal entry from database
 * @returns {object} { title, icon, quadrant, scheme }
 */
export const getCardDisplayData = (entry) => {
    const sigilData = getSigilData(entry.journal_meaning, entry.journal_type);
    
    return {
        title: entry.journal_meaning || formatJournalTypeName(entry.journal_type),
        icon: resolveIcon(entry), // Use the resolver to ensure stable icons
        ...sigilData,
    };
};

const formatJournalTypeName = (type) => {
    switch (type) {
        case 'book_journal': return 'Book Journey';
        case 'daily_journal': return 'Daily Journal';
        case 'thought_of_the_day': return 'Thought of the Day';
        default: return 'Journal Entry';
    }
};
