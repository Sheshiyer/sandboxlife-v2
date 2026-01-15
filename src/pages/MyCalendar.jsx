import { useState, useEffect } from "react";
import Menu from "../components/Menu";
import TopBar from "../components/TopBar";
import { fetchAllEntries } from "../utils/supabase";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import JournalEntry from "../components/JournalEntry";
import { formatJournalType, formatDatetime } from "../utils/formatters";
import EntryDetails from "../components/EntryDetails";
import Breadcrumb from "../components/Breadcrumb";
import { useGameMode } from "../context/GameModeContext";

export default function MyCalendar() {
  const { userId } = useParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isGameMode } = useGameMode();
  
  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarDays, setCalendarDays] = useState([]);
  
  // Entries state
  const [allEntries, setAllEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [groupedEntries, setGroupedEntries] = useState({});
  const [expandedMonths, setExpandedMonths] = useState({});
  
  // Modal state
  const [selectedEntry, setSelectedEntry] = useState(null);

  // Fetch entries for last 3 months on mount
  useEffect(() => {
    fetchEntriesForLastThreeMonths();
  }, [userId]);

  // Update calendar when currentDate changes
  useEffect(() => {
    generateCalendarDays();
  }, [currentDate, allEntries]);

  // Filter and group entries when selection changes
  useEffect(() => {
    if (selectedDate) {
      filterEntriesByDate(selectedDate);
    } else {
      setFilteredEntries(allEntries);
    }
    groupEntriesByMonth(filteredEntries.length ? filteredEntries : allEntries);
  }, [selectedDate, allEntries]);

  const fetchEntriesForLastThreeMonths = async () => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 3);

      const entries = await fetchAllEntries(userId, startDate.toISOString(), endDate.toISOString());
      
      const formattedEntries = entries.map(entry => ({
        ...entry,
        ...formatDatetime(entry.created_at)
      })).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      setAllEntries(formattedEntries);
      setFilteredEntries(formattedEntries);
      
      // Auto-expand last 3 months
      const months = {};
      for (let i = 0; i < 3; i++) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        months[key] = true;
      }
      setExpandedMonths(months);
    } catch (error) {
      toast.error("Failed to load entries");
    }
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ day: null, entries: [] });
    }
    
    // Add days of month with their entries
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEntries = allEntries.filter(entry => {
        const entryDate = new Date(entry.created_at);
        return entryDate.getFullYear() === year && 
               entryDate.getMonth() === month && 
               entryDate.getDate() === day;
      });
      
      days.push({ day, date: dateStr, entries: dayEntries });
    }
    
    setCalendarDays(days);
  };

  const filterEntriesByDate = (dateStr) => {
    const filtered = allEntries.filter(entry => {
      const entryDate = new Date(entry.created_at).toISOString().split('T')[0];
      return entryDate === dateStr;
    });
    setFilteredEntries(filtered);
  };

  const groupEntriesByMonth = (entries) => {
    const grouped = {};
    entries.forEach(entry => {
      const date = new Date(entry.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      grouped[monthKey].push(entry);
    });
    setGroupedEntries(grouped);
  };

  const toggleMonth = (monthKey) => {
    setExpandedMonths(prev => ({
      ...prev,
      [monthKey]: !prev[monthKey]
    }));
  };

  const handlePrevMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const handleDayClick = (dateStr) => {
    if (selectedDate === dateStr) {
      setSelectedDate(null);
    } else {
      setSelectedDate(dateStr);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className={isGameMode ? "min-h-screen bg-slate-900" : "min-h-screen bg-bgpapyrus"}>
      <TopBar toggleMenu={toggleMenu} />

      {isMenuOpen && (
        <div className="fixed inset-0 z-50">
          <Menu toggleMenu={toggleMenu} isDnDTheme={isGameMode} />
        </div>
      )}
      
      <Breadcrumb
        items={[
          { label: "Dashboard", to: `/home/${userId}` },
          { label: isGameMode ? "Quest Log" : "My Calendar" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6">
          
          {/* LEFT - Calendar View */}
          <div className={`rounded-3xl p-6 shadow-lg ${
            isGameMode 
              ? 'bg-slate-800 border border-slate-700' 
              : 'bg-lightpapyrus border border-darkpapyrus'
          }`}>
            
            {/* Month Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${isGameMode ? 'text-yellow-400' : 'text-slate-900'}`}>
                {isGameMode ? '📅 Quest Calendar' : 'Calendar'}
              </h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={handlePrevMonth}
                  className={`p-2 rounded-lg transition ${
                    isGameMode 
                      ? 'hover:bg-slate-700 text-slate-300' 
                      : 'hover:bg-darkpapyrus text-slate-700'
                  }`}
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <span className={`font-semibold min-w-[140px] text-center ${
                  isGameMode ? 'text-slate-300' : 'text-slate-800'
                }`}>
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </span>
                <button
                  onClick={handleNextMonth}
                  className={`p-2 rounded-lg transition ${
                    isGameMode 
                      ? 'hover:bg-slate-700 text-slate-300' 
                      : 'hover:bg-darkpapyrus text-slate-700'
                  }`}
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Day Names */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {dayNames.map(day => (
                <div 
                  key={day} 
                  className={`text-center text-sm font-semibold py-2 ${
                    isGameMode ? 'text-yellow-400' : 'text-slate-600'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((dayObj, idx) => {
                const isSelected = selectedDate === dayObj.date;
                const hasEntries = dayObj.entries && dayObj.entries.length > 0;
                const latestEntry = hasEntries ? dayObj.entries[0] : null;
                
                return (
                  <button
                    key={idx}
                    onClick={() => dayObj.day && handleDayClick(dayObj.date)}
                    disabled={!dayObj.day}
                    className={`
                      relative aspect-square rounded-xl transition-all
                      ${!dayObj.day ? 'invisible' : ''}
                      ${isSelected 
                        ? (isGameMode ? 'ring-2 ring-yellow-400 bg-yellow-900' : 'ring-2 ring-red bg-red bg-opacity-20') 
                        : hasEntries 
                          ? (isGameMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-white hover:bg-darkpapyrus') 
                          : (isGameMode ? 'bg-slate-900 hover:bg-slate-800' : 'bg-bgpapyrus hover:bg-darkpapyrus')
                      }
                      ${hasEntries ? 'border-2' : 'border'}
                      ${isGameMode ? 'border-slate-600' : 'border-darkpapyrus'}
                    `}
                  >
                    <div className="absolute top-1 left-2 text-xs font-semibold" style={{
                      color: isGameMode ? (hasEntries ? '#fbbf24' : '#cbd5e1') : (hasEntries ? '#9B1D1E' : '#64748b')
                    }}>
                      {dayObj.day}
                    </div>
                    
                    {latestEntry && latestEntry.journal_icon && (
                      <div className="absolute inset-0 p-6 flex items-center justify-center">
                        <img 
                          src={latestEntry.journal_icon} 
                          alt="" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    )}
                    
                    {hasEntries && dayObj.entries.length > 1 && (
                      <div className={`absolute bottom-1 right-1 text-[0.6rem] font-bold px-1.5 py-0.5 rounded ${
                        isGameMode ? 'bg-yellow-400 text-slate-900' : 'bg-red text-white'
                      }`}>
                        +{dayObj.entries.length - 1}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {selectedDate && (
              <button
                onClick={() => setSelectedDate(null)}
                className={`mt-4 w-full py-2 rounded-lg font-semibold transition ${
                  isGameMode 
                    ? 'bg-slate-700 text-yellow-400 hover:bg-slate-600' 
                    : 'bg-darkpapyrus text-slate-800 hover:bg-slate-300'
                }`}
              >
                Clear Filter
              </button>
            )}
          </div>

          {/* RIGHT - Entries List */}
          <div className={`rounded-3xl p-6 shadow-lg ${
            isGameMode 
              ? 'bg-slate-800 border border-slate-700' 
              : 'bg-lightpapyrus border border-darkpapyrus'
          }`}>
            <h2 className={`text-2xl font-bold mb-6 ${isGameMode ? 'text-yellow-400' : 'text-slate-900'}`}>
              {isGameMode ? '⚔️ Quest History' : 'Journal Entries'}
            </h2>

            {selectedDate && (
              <div className={`mb-4 p-3 rounded-lg ${
                isGameMode ? 'bg-slate-900 text-slate-300' : 'bg-bgpapyrus text-slate-700'
              }`}>
                <p className="text-sm font-semibold">
                  Showing entries for: {new Date(selectedDate).toLocaleDateString('en-US', { 
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                  })}
                </p>
              </div>
            )}

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {Object.keys(groupedEntries).length === 0 ? (
                <p className={`text-center py-8 ${isGameMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  No entries found
                </p>
              ) : (
                Object.entries(groupedEntries)
                  .sort((a, b) => b[0].localeCompare(a[0]))
                  .map(([monthKey, entries]) => {
                    const [year, month] = monthKey.split('-');
                    const monthName = monthNames[parseInt(month) - 1];
                    const isExpanded = expandedMonths[monthKey];
                    
                    return (
                      <div key={monthKey} className={`rounded-xl overflow-hidden ${
                        isGameMode ? 'bg-slate-900' : 'bg-bgpapyrus'
                      }`}>
                        <button
                          onClick={() => toggleMonth(monthKey)}
                          className={`w-full px-4 py-3 flex items-center justify-between transition ${
                            isGameMode 
                              ? 'hover:bg-slate-800 text-slate-300' 
                              : 'hover:bg-darkpapyrus text-slate-800'
                          }`}
                        >
                          <span className="font-semibold">
                            {monthName} {year} ({entries.length} {entries.length === 1 ? 'entry' : 'entries'})
                          </span>
                          {isExpanded ? (
                            <ChevronUpIcon className="w-5 h-5" />
                          ) : (
                            <ChevronDownIcon className="w-5 h-5" />
                          )}
                        </button>
                        
                        {isExpanded && (
                          <div className="p-4 space-y-3">
                            {entries.map((entry, idx) => (
                              <div key={entry.id} onClick={() => setSelectedEntry(entry)}>
                                <JournalEntry
                                  id={entry.id}
                                  index={idx}
                                  title={formatJournalType(entry.journal_type)}
                                  iconTitle={entry.journal_meaning}
                                  date={entry.date}
                                  image={entry.journal_icon}
                                  message={entry.journal_entry}
                                  time={entry.time}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
              )}
            </div>
          </div>

        </div>
      </div>

      {selectedEntry && (
        <EntryDetails
          id={selectedEntry.id}
          title={formatJournalType(selectedEntry.journal_type)}
          iconTitle={selectedEntry.journal_meaning}
          date={selectedEntry.date}
          image={selectedEntry.journal_icon}
          message={selectedEntry.journal_entry}
          time={selectedEntry.time}
          selected={selectedEntry}
          setSelected={setSelectedEntry}
        />
      )}

      <ToastContainer />
    </div>
  );
}
