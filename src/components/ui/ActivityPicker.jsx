import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CalendarDaysIcon, ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline';

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const FULL_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * ActivityPicker - Custom month/year picker for checking journal activity
 * Classic variant: Papyrus theme
 * Game variant: Dark slate D&D theme
 */
const ActivityPicker = ({ 
  value, 
  onChange, 
  placeholder = "Check activity",
  variant = "classic" // "classic" | "game"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const containerRef = useRef(null);
  
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  
  // Parse value to get selected month/year
  const selectedDate = value ? new Date(value + '-01') : null;
  const selectedMonth = selectedDate ? selectedDate.getMonth() : null;
  const selectedYear = selectedDate ? selectedDate.getFullYear() : null;

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleMonthSelect = (monthIndex) => {
    const formattedMonth = String(monthIndex + 1).padStart(2, '0');
    const formattedValue = `${viewYear}-${formattedMonth}`;
    onChange(formattedValue);
    setIsOpen(false);
  };

  const handlePrevYear = () => {
    setViewYear(prev => prev - 1);
  };

  const handleNextYear = () => {
    if (viewYear < currentYear + 1) {
      setViewYear(prev => prev + 1);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange(null);
  };

  const displayValue = value 
    ? `${FULL_MONTHS[selectedMonth]} ${selectedYear}`
    : placeholder;

  const isCurrentMonth = (monthIndex) => {
    return viewYear === currentYear && monthIndex === currentMonth;
  };

  const isSelectedMonth = (monthIndex) => {
    return viewYear === selectedYear && monthIndex === selectedMonth;
  };

  const isFutureMonth = (monthIndex) => {
    return viewYear > currentYear || (viewYear === currentYear && monthIndex > currentMonth);
  };

  // Theme classes based on variant
  const themes = {
    classic: {
      container: 'bg-white border-darkpapyrus',
      trigger: 'bg-lightpapyrus border-darkpapyrus hover:bg-bgpapyrus text-slate-800',
      dropdown: 'bg-lightpapyrus border-darkpapyrus',
      header: 'text-slate-800',
      headerBtn: 'hover:bg-darkpapyrus text-slate-700',
      yearLabel: 'text-slate-800 font-semibold',
      monthDefault: 'bg-white border-darkpapyrus text-slate-700 hover:bg-bgpapyrus hover:border-slate-400',
      monthCurrent: 'bg-bgpapyrus border-red text-red font-semibold',
      monthSelected: 'bg-red border-red text-white font-semibold',
      monthDisabled: 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed',
      icon: 'text-slate-600',
      clearBtn: 'hover:bg-darkpapyrus text-slate-500',
    },
    game: {
      container: 'bg-slate-800 border-slate-600',
      trigger: 'bg-slate-700 border-slate-600 hover:bg-slate-600 text-slate-200',
      dropdown: 'bg-slate-800 border-slate-600',
      header: 'text-yellow-400',
      headerBtn: 'hover:bg-slate-700 text-slate-300',
      yearLabel: 'text-yellow-400 font-bold',
      monthDefault: 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600 hover:border-yellow-400',
      monthCurrent: 'bg-slate-700 border-yellow-400 text-yellow-400 font-semibold',
      monthSelected: 'bg-yellow-500 border-yellow-400 text-slate-900 font-bold',
      monthDisabled: 'bg-slate-900 border-slate-700 text-slate-600 cursor-not-allowed',
      icon: 'text-yellow-400',
      clearBtn: 'hover:bg-slate-700 text-slate-400',
    }
  };

  const t = themes[variant] || themes.classic;

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-4 py-2.5 rounded-2xl border
          transition-all duration-200 w-full justify-between
          ${t.trigger}
        `}
      >
        <div className="flex items-center gap-2">
          <CalendarDaysIcon className={`w-5 h-5 ${t.icon}`} />
          <span className="text-sm font-medium">{displayValue}</span>
        </div>
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className={`p-1 rounded-full ${t.clearBtn}`}
            aria-label="Clear selection"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className={`
          absolute top-full left-0 right-0 mt-2 z-50
          rounded-2xl border shadow-xl overflow-hidden
          ${t.dropdown}
        `}>
          {/* Year Navigation */}
          <div className={`flex items-center justify-between px-4 py-3 border-b ${variant === 'game' ? 'border-slate-700' : 'border-darkpapyrus'}`}>
            <button
              type="button"
              onClick={handlePrevYear}
              className={`p-1.5 rounded-lg transition ${t.headerBtn}`}
              aria-label="Previous year"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <span className={`text-lg ${t.yearLabel}`}>{viewYear}</span>
            <button
              type="button"
              onClick={handleNextYear}
              disabled={viewYear >= currentYear + 1}
              className={`p-1.5 rounded-lg transition ${t.headerBtn} disabled:opacity-40 disabled:cursor-not-allowed`}
              aria-label="Next year"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Month Grid */}
          <div className="p-4">
            <div className="grid grid-cols-4 gap-2">
              {MONTHS.map((month, index) => {
                const isFuture = isFutureMonth(index);
                const isCurrent = isCurrentMonth(index);
                const isSelected = isSelectedMonth(index);
                
                let monthClass = t.monthDefault;
                if (isFuture) {
                  monthClass = t.monthDisabled;
                } else if (isSelected) {
                  monthClass = t.monthSelected;
                } else if (isCurrent) {
                  monthClass = t.monthCurrent;
                }

                return (
                  <button
                    key={month}
                    type="button"
                    onClick={() => !isFuture && handleMonthSelect(index)}
                    disabled={isFuture}
                    className={`
                      py-2.5 px-2 rounded-xl border text-sm
                      transition-all duration-150
                      ${monthClass}
                    `}
                  >
                    {month}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className={`px-4 py-3 border-t ${variant === 'game' ? 'border-slate-700' : 'border-darkpapyrus'}`}>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setViewYear(currentYear);
                  handleMonthSelect(currentMonth);
                }}
                className={`
                  flex-1 py-2 rounded-xl text-sm font-medium transition
                  ${variant === 'game' 
                    ? 'bg-slate-700 text-yellow-400 hover:bg-slate-600' 
                    : 'bg-bgpapyrus text-slate-700 hover:bg-darkpapyrus'
                  }
                `}
              >
                This Month
              </button>
              <button
                type="button"
                onClick={() => {
                  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
                  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
                  setViewYear(lastMonthYear);
                  handleMonthSelect(lastMonth);
                }}
                className={`
                  flex-1 py-2 rounded-xl text-sm font-medium transition
                  ${variant === 'game' 
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
                    : 'bg-bgpapyrus text-slate-700 hover:bg-darkpapyrus'
                  }
                `}
              >
                Last Month
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ActivityPicker.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  variant: PropTypes.oneOf(['classic', 'game']),
};

export default ActivityPicker;
