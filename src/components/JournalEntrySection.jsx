import PropTypes from 'prop-types';
import { useGameMode } from '../context/GameModeContext';

export const JournalEntrySection = ({
  triggerQuestion,
  triggerIcon,
  onCancel,
  saveToDb,
  journalEntry,
  setJournalEntry,
  journalType,
  isLimitReached,
  entryDate,
  setEntryDate,
}) => {
  const { isGameMode } = useGameMode();
  
  const handleTextChange = (e) => {
    setJournalEntry(e.target.value);
  };

  const maxDate = new Date().toISOString().split("T")[0];

  const onSave = (isEntry) => {
    saveToDb(isEntry);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className={`relative rounded-2xl shadow-2xl overflow-hidden w-full max-w-3xl ${
        isGameMode 
          ? 'bg-gradient-to-b from-slate-700 to-slate-800' 
          : 'bg-gradient-to-b from-lightpapyrus to-bgpapyrus'
      }`}>
        
        {/* Header Section */}
        <div className={`px-8 py-6 text-center border-b-2 ${
          isGameMode
            ? 'border-slate-900 bg-slate-700/50'
            : 'border-darkpapyrus/30 bg-lightpapyrus'
        }`}>
          <h2 className={`text-2xl font-bold tracking-wide flex items-center justify-center gap-3 ${
            isGameMode ? 'text-yellow-500' : 'text-[#9B1D1E]'
          }`}>
            {isGameMode ? (
              <>
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3M19 19H5V5H19V19M17 12V7H7V10H10V17H14V10H17V12Z"/>
                </svg>
                Chronicle Your Quest
              </>
            ) : (
              'The Story'
            )}
          </h2>
          <p className={`text-sm mt-2 ${
            isGameMode ? 'text-slate-400' : 'text-gray-600'
          }`}>
            {isGameMode ? 'Answer the quest prompt' : 'Answer the trigger question'}
          </p>
        </div>

        {/* Content Section */}
        <div className={`px-8 py-6 ${
          isGameMode ? 'bg-slate-600/30' : 'bg-bgpapyrus/50'
        }`}>
          
          {/* Icon Display */}
          <div className="flex items-center justify-center mb-6">
            <div className={`rounded-xl overflow-hidden border-4 ${
              isGameMode
                ? 'border-yellow-500 shadow-lg shadow-yellow-500/50'
                : 'border-[#9B1D1E] shadow-lg shadow-red-900/30'
            }`}>
              <img 
                className="w-20 h-20 bg-white" 
                src={triggerIcon} 
                alt="Quest Icon" 
              />
            </div>
          </div>

          {/* Quest Prompt */}
          <p className={`mb-6 text-center italic px-4 ${
            isGameMode ? 'text-slate-300 text-base' : 'text-gray-700 text-sm'
          }`}>
            {typeof triggerQuestion === "string" ? triggerQuestion : triggerQuestion[0]}
          </p>

          {/* Entry Date Picker */}
          <div className={`flex items-center justify-center gap-3 mb-6 px-4 py-3 rounded-lg ${
            isGameMode ? 'bg-slate-700/50' : 'bg-lightpapyrus'
          }`}>
            <label className={`text-sm font-semibold ${
              isGameMode ? 'text-yellow-400' : 'text-[#9B1D1E]'
            }`} htmlFor="entry-date">
              Entry date
            </label>
            <input
              id="entry-date"
              type="date"
              value={entryDate}
              max={maxDate}
              onChange={(event) => setEntryDate(event.target.value)}
              className={`rounded-lg px-4 py-2 text-sm font-medium border-2 transition-all ${
                isGameMode
                  ? 'bg-slate-800 border-slate-900 text-slate-300 focus:border-yellow-500'
                  : 'bg-white border-darkpapyrus text-gray-800 focus:border-[#9B1D1E]'
              } focus:outline-none focus:ring-2 ${
                isGameMode ? 'focus:ring-yellow-500/30' : 'focus:ring-red-900/30'
              }`}
            />
          </div>

          {/* Textarea */}
          <textarea
            className={`w-full p-4 rounded-xl resize-none transition-all border-2 ${
              isGameMode
                ? 'bg-slate-800 border-slate-700 text-slate-300 placeholder-slate-500 focus:border-yellow-500 focus:ring-yellow-500/30'
                : 'bg-white border-darkpapyrus text-gray-800 placeholder-gray-400 focus:border-[#9B1D1E] focus:ring-red-900/30'
            } focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed`}
            rows={6}
            value={journalEntry}
            onChange={handleTextChange}
            placeholder={isGameMode ? "Write your chronicle here..." : "Write your story here..."}
            disabled={isLimitReached}
          />
        </div>

        {/* Action Buttons */}
        <div className={`px-8 py-6 flex justify-center gap-3 ${
          isGameMode ? 'bg-slate-700/50' : 'bg-bgpapyrus'
        }`}>
          <button
            onClick={onCancel}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              isGameMode
                ? 'bg-slate-800 text-slate-300 border-2 border-slate-700 hover:bg-slate-700'
                : 'bg-darkpapyrus text-gray-700 border-2 border-gray-400 hover:bg-[#d5d5b7]'
            }`}
          >
            Back
          </button>
          
          {journalType === "daily_journal" && (
            <button
              onClick={() => onSave(true)}
              disabled={isLimitReached}
              className={`px-6 py-3 rounded-xl font-bold transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${
                isGameMode
                  ? 'bg-yellow-500 hover:bg-yellow-400 text-black shadow-yellow-500/30 hover:shadow-yellow-500/50'
                  : 'bg-[#9B1D1E] hover:bg-[#8B1D1E] text-white shadow-red-900/30 hover:shadow-red-900/50'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
              {isGameMode ? 'Save & New Quest' : 'Save & New Entry'}
            </button>
          )}
          
          <button
            onClick={() => onSave(false)}
            disabled={isLimitReached}
            className={`px-6 py-3 rounded-xl font-bold transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${
              isGameMode
                ? 'bg-yellow-500 hover:bg-yellow-400 text-black shadow-yellow-500/30 hover:shadow-yellow-500/50'
                : 'bg-[#9B1D1E] hover:bg-[#8B1D1E] text-white shadow-red-900/30 hover:shadow-red-900/50'
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.2L4.8 12L3.4 13.4L9 19L21 7L19.6 5.6L9 16.2Z"/>
            </svg>
            {isGameMode ? 'Complete Quest' : 'Save & Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

JournalEntrySection.propTypes = {
    triggerQuestion: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array
    ]).isRequired,
    triggerIcon: PropTypes.string.isRequired,
    chapterEntry: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    saveToDb: PropTypes.func.isRequired,
    journalEntry: PropTypes.string.isRequired,
    setJournalEntry: PropTypes.func.isRequired,
    journalType: PropTypes.string.isRequired,
    changeQuestion: PropTypes.func,
    isLimitReached: PropTypes.bool,
    entryDate: PropTypes.string.isRequired,
    setEntryDate: PropTypes.func.isRequired,
};
