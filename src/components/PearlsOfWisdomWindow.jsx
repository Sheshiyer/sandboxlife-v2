import PropTypes from 'prop-types';
import { useGameMode } from '../context/GameModeContext';

export const PearlsOfWisdomWindow = ({
  triggerIcon,
  onCancel,
  onSave,
  wisdomMessage,
  setWisdomMessage,
}) => {
  const { isGameMode } = useGameMode();
  
  const handleTextChange = (e) => {
    setWisdomMessage(e.target.value); 
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
                  <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"/>
                </svg>
                Share Your Wisdom
              </>
            ) : (
              'Pearls of Wisdom'
            )}
          </h2>
          <p className={`text-sm mt-2 ${
            isGameMode ? 'text-slate-400' : 'text-gray-600'
          }`}>
            {isGameMode 
              ? 'What have you learned from this quest? (+5 Bonus XP)' 
              : 'Reflect on the topic'
            }
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

          {/* Textarea */}
          <textarea
            className={`w-full p-4 rounded-xl resize-none transition-all border-2 ${
              isGameMode
                ? 'bg-slate-800 border-slate-700 text-slate-300 placeholder-slate-500 focus:border-yellow-500 focus:ring-yellow-500/30'
                : 'bg-white border-darkpapyrus text-gray-800 placeholder-gray-400 focus:border-[#9B1D1E] focus:ring-red-900/30'
            } focus:outline-none focus:ring-2`}
            rows={6}
            value={wisdomMessage}
            onChange={handleTextChange}
            placeholder={isGameMode ? "Share your insight..." : "Reflect on your experience..."}
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
          
          <button
            onClick={onSave}
            className={`px-6 py-3 rounded-xl font-bold transition-all duration-200 shadow-lg flex items-center gap-2 ${
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

PearlsOfWisdomWindow.propTypes = {
    triggerQuestion: PropTypes.array,
    triggerIcon: PropTypes.string.isRequired,
    chapterEntry: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    wisdomMessage: PropTypes.string.isRequired,
    setWisdomMessage: PropTypes.func.isRequired
};
