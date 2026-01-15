import { useState, useEffect, useCallback } from 'react';
import { toast } from "react-toastify";
import { useGameMode } from '../context/GameModeContext';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import PropTypes from 'prop-types';

const IconCarousel = ({ icons, onSave, setSelectedIconTheme, dailyEntryCount }) => {
  const { isGameMode } = useGameMode();
  const [selectedIcon, setSelectedIcon] = useState({ name: '', meaning: '' });
  const [startIndex, setStartIndex] = useState(0);

  const handleIconClick = useCallback((icon) => {
    setSelectedIcon(icon);
    setSelectedIconTheme(icon);
  }, [setSelectedIconTheme]);

  const handlePrevClick = () => {
    setStartIndex((prevIndex) => Math.max(prevIndex - 5, 0));
  };

  const handleNextClick = () => {
    setStartIndex((prevIndex) => Math.min(prevIndex + 5, Math.max(0, icons.length - 5)));
  };

  const visibleIcons = icons.slice(startIndex, startIndex + 5);

  useEffect(()=>{
    handleIconClick(icons[0])
  },[icons, handleIconClick])

  const handleNextStep = () => {
    if (dailyEntryCount >= 5) {
      toast.error("You have reached the daily limit of 5 entries.");
    } else {
      onSave();
    }
  };

  return (
    <div className={`relative rounded-2xl shadow-2xl overflow-hidden max-w-3xl mx-auto ${
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
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
              Choose Your Symbol
            </>
          ) : (
            'Choose Your Symbol'
          )}
        </h2>
      </div>

      {/* Icon Carousel Section */}
      <div className={`px-6 py-8 ${
        isGameMode ? 'bg-slate-600/30' : 'bg-bgpapyrus/50'
      }`}>
        <div className="flex items-center justify-between gap-4">
          
          {/* Left Arrow */}
          <button
            onClick={handlePrevClick}
            disabled={startIndex === 0}
            className={`p-3 rounded-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed ${
              isGameMode
                ? 'bg-slate-800 hover:bg-slate-700 border-2 border-slate-900 text-yellow-500'
                : 'bg-darkpapyrus hover:bg-[#d5d5b7] border-2 border-[#9B1D1E] text-[#9B1D1E]'
            }`}
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>

          {/* Icon Grid */}
          <div className="flex-1 flex items-center justify-center gap-3">
            {visibleIcons.map((icon, index) => (
              <button
                key={index}
                onClick={() => handleIconClick(icon)}
                className={`relative group transition-all duration-300 ${
                  selectedIcon === icon 
                    ? 'scale-110' 
                    : 'scale-95 opacity-60 hover:opacity-100 hover:scale-100'
                }`}
              >
                <div className={`relative rounded-xl overflow-hidden border-4 transition-all ${
                  selectedIcon === icon
                    ? isGameMode
                      ? 'border-yellow-500 shadow-lg shadow-yellow-500/50'
                      : 'border-[#9B1D1E] shadow-lg shadow-red-900/30'
                    : isGameMode
                      ? 'border-slate-500 hover:border-yellow-500/50'
                      : 'border-darkpapyrus hover:border-[#9B1D1E]/50'
                }`}>
                  <img 
                    src={icon.icon} 
                    alt={icon.label} 
                    className="w-20 h-20 md:w-24 md:h-24 object-cover bg-white"
                  />
                  {selectedIcon === icon && (
                    <div className={`absolute inset-0 pointer-events-none ${
                      isGameMode
                        ? 'bg-yellow-500/10'
                        : 'bg-red-900/10'
                    }`} />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNextClick}
            disabled={startIndex >= icons.length - 5}
            className={`p-3 rounded-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed ${
              isGameMode
                ? 'bg-slate-800 hover:bg-slate-700 border-2 border-slate-900 text-yellow-500'
                : 'bg-darkpapyrus hover:bg-[#d5d5b7] border-2 border-[#9B1D1E] text-[#9B1D1E]'
            }`}
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Selected Icon Info Bar */}
      <div className={`px-8 py-4 text-center border-t-2 ${
        isGameMode
          ? 'bg-slate-900/50 border-slate-900'
          : 'bg-darkpapyrus/20 border-darkpapyrus/30'
      }`}>
        <p className={`text-base font-semibold ${
          isGameMode ? 'text-yellow-400' : 'text-[#9B1D1E]'
        }`}>
          {selectedIcon.name} - {selectedIcon.meaning}
        </p>
      </div>

      {/* Action Button */}
      <div className={`px-8 py-6 flex justify-center ${
        isGameMode ? 'bg-slate-700/50' : 'bg-bgpapyrus'
      }`}>
        <button
          onClick={handleNextStep}
          disabled={dailyEntryCount >= 5}
          className={`px-8 py-3 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
            isGameMode
              ? 'bg-yellow-500 hover:bg-yellow-400 text-black shadow-yellow-500/30 hover:shadow-yellow-500/50'
              : 'bg-[#9B1D1E] hover:bg-[#8B1D1E] text-white shadow-red-900/30 hover:shadow-red-900/50'
          }`}
        >
          Next Step
        </button>
      </div>
    </div>
  );
};

IconCarousel.propTypes = {
    icons: PropTypes.array.isRequired,
    onSave: PropTypes.func.isRequired,
    setSelectedIconTheme: PropTypes.func.isRequired,
    dailyEntryCount: PropTypes.number.isRequired
};

export default IconCarousel;
