import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  LightBulbIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";
import { fetchWeeklyData } from "../../utils/supabase";
import { formatDatetime, formatJournalType } from "../../utils/formatters";
import { 
  book_journal_questions, 
  daily_journal_questions, 
  iconsv2_questions 
} from "../../constants/questions";

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * RecentEntriesStrip - Horizontal scrollable strip showing recent journal entries
 * Classic variant: Papyrus nature theme
 * Game variant: Dark D&D quest log theme
 */
const RecentEntriesStrip = ({ 
  variant = "classic", // "classic" | "game"
  onEntryClick = null,
  maxEntries = 7
}) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const storedUserId = localStorage.getItem("user_id");
        const result = await fetchWeeklyData(storedUserId);

        if (result && Array.isArray(result)) {
          // Sort by date descending (newest first) and limit
          const sorted = result
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, maxEntries);
          setEntries(sorted);
        }
      } catch (error) {
        console.error("Failed to fetch entries:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [maxEntries]);

  const getIconSource = (entry) => {
    if (!entry) return null;

    let question = daily_journal_questions.find(q => q.meaning === entry.journal_meaning);
    if (question?.icon) return question.icon;

    question = book_journal_questions.find(q => q.meaning === entry.journal_meaning);
    if (question?.icon) return question.icon;

    question = iconsv2_questions.find(q => q.meaning === entry.journal_meaning);
    if (question?.icon) return question.icon;

    return entry.journal_icon;
  };

  const getJournalIcon = (journalType) => {
    switch (journalType) {
      case "book_journal":
        return BookOpenIcon;
      case "daily_journal":
        return CalendarDaysIcon;
      case "thought_of_the_day":
        return LightBulbIcon;
      default:
        return SparklesIcon;
    }
  };

  const getDayInfo = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();
    
    return {
      dayName: isToday ? 'Today' : isYesterday ? 'Yesterday' : DAYS_OF_WEEK[date.getDay()],
      dayNum: date.getDate(),
      month: date.toLocaleString('default', { month: 'short' }),
      isToday,
      isYesterday
    };
  };

  const handleEntryClick = (entry) => {
    if (onEntryClick) {
      onEntryClick(entry);
    }
  };

  const scrollLeft = () => {
    const container = document.getElementById('entries-strip-container');
    if (container) {
      container.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById('entries-strip-container');
    if (container) {
      container.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  // Theme configurations
  const themes = {
    classic: {
      container: "bg-lightpapyrus border-darkpapyrus",
      header: "text-slate-800",
      subtext: "text-slate-600",
      card: "bg-white border-darkpapyrus hover:border-red hover:shadow-lg",
      cardActive: "bg-bgpapyrus border-red shadow-lg ring-2 ring-red/20",
      iconBg: "bg-bgpapyrus",
      iconBorder: "border-darkpapyrus",
      dayText: "text-slate-700",
      dateText: "text-slate-500",
      meaningText: "text-slate-800",
      typeText: "text-slate-600",
      badge: "bg-red text-white",
      emptyIcon: "text-slate-400",
      emptyText: "text-slate-500",
      navBtn: "bg-white border-darkpapyrus text-slate-700 hover:bg-bgpapyrus",
    },
    game: {
      container: "bg-slate-800 border-slate-600",
      header: "text-yellow-400",
      subtext: "text-slate-400",
      card: "bg-slate-900 border-slate-700 hover:border-yellow-500 hover:shadow-[0_0_15px_rgba(234,179,8,0.3)]",
      cardActive: "bg-slate-800 border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.4)] ring-2 ring-yellow-400/30",
      iconBg: "bg-slate-800",
      iconBorder: "border-slate-600",
      dayText: "text-yellow-400",
      dateText: "text-slate-500",
      meaningText: "text-slate-200",
      typeText: "text-slate-500",
      badge: "bg-yellow-500 text-slate-900",
      emptyIcon: "text-slate-600",
      emptyText: "text-slate-500",
      navBtn: "bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600",
    }
  };

  const t = themes[variant] || themes.classic;

  // Loading skeleton
  if (loading) {
    return (
      <div className={`rounded-2xl border p-4 ${t.container}`}>
        <div className="flex gap-4 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-28 animate-pulse">
              <div className={`h-24 rounded-xl ${variant === 'game' ? 'bg-slate-700' : 'bg-darkpapyrus/50'}`} />
              <div className={`h-3 mt-2 rounded ${variant === 'game' ? 'bg-slate-700' : 'bg-darkpapyrus/50'}`} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border overflow-hidden ${t.container}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-inherit">
        <div>
          <h3 className={`font-serif font-bold text-base ${t.header}`}>
            {variant === 'game' ? '⚔️ Recent Quests' : 'Recent Entries'}
          </h3>
          <p className={`text-xs ${t.subtext}`}>
            {entries.length > 0 
              ? `${entries.length} entries this week` 
              : 'No entries yet'}
          </p>
        </div>
        
        {/* Navigation Arrows */}
        {entries.length > 4 && (
          <div className="flex items-center gap-1">
            <button
              onClick={scrollLeft}
              className={`p-1.5 rounded-lg border transition ${t.navBtn}`}
              aria-label="Scroll left"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <button
              onClick={scrollRight}
              className={`p-1.5 rounded-lg border transition ${t.navBtn}`}
              aria-label="Scroll right"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Entries Strip */}
      <div 
        id="entries-strip-container"
        className="flex gap-3 p-4 overflow-x-auto scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {entries.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-8">
            <SparklesIcon className={`w-12 h-12 mb-2 ${t.emptyIcon}`} />
            <p className={`text-sm ${t.emptyText}`}>
              {variant === 'game' 
                ? 'Begin your quest by writing your first entry!' 
                : 'Start journaling to see your entries here'}
            </p>
          </div>
        ) : (
          entries.map((entry, index) => {
            const iconSrc = getIconSource(entry);
            const JournalIcon = getJournalIcon(entry.journal_type);
            const dayInfo = getDayInfo(entry.created_at);
            const isLatest = index === 0;
            const formatted = formatDatetime(entry.created_at);

            return (
              <button
                key={entry.id || index}
                onClick={() => handleEntryClick(entry)}
                className={`
                  relative flex-shrink-0 w-28 rounded-xl border p-3
                  transition-all duration-200 text-left group
                  ${isLatest ? t.cardActive : t.card}
                `}
              >
                {/* Latest Badge */}
                {isLatest && (
                  <div className={`absolute -top-2 -right-2 text-[0.6rem] font-bold px-2 py-0.5 rounded-full ${t.badge}`}>
                    {variant === 'game' ? 'NEW' : 'Latest'}
                  </div>
                )}

                {/* Day Label */}
                <div className="text-center mb-2">
                  <p className={`text-xs font-bold ${dayInfo.isToday || dayInfo.isYesterday ? t.dayText : t.dateText}`}>
                    {dayInfo.dayName}
                  </p>
                  <p className={`text-[0.65rem] ${t.dateText}`}>
                    {dayInfo.month} {dayInfo.dayNum}
                  </p>
                </div>

                {/* Icon Container */}
                <div className={`
                  relative w-full aspect-square rounded-xl border overflow-hidden mb-2
                  ${t.iconBg} ${t.iconBorder}
                  group-hover:scale-105 transition-transform duration-200
                `}>
                  {iconSrc ? (
                    <img
                      src={iconSrc}
                      alt={entry.journal_meaning || ""}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className={`absolute inset-0 flex items-center justify-center ${iconSrc ? 'hidden' : ''}`}
                    style={{ display: iconSrc ? 'none' : 'flex' }}
                  >
                    <JournalIcon className={`w-8 h-8 ${variant === 'game' ? 'text-yellow-400/50' : 'text-slate-400'}`} />
                  </div>
                </div>

                {/* Entry Info */}
                <div className="text-center">
                  <p className={`text-xs font-semibold truncate ${t.meaningText}`}>
                    {entry.journal_meaning || 'Entry'}
                  </p>
                  <p className={`text-[0.6rem] uppercase tracking-wide ${t.typeText}`}>
                    {formatJournalType(entry.journal_type)}
                  </p>
                </div>

                {/* Time indicator */}
                <div className={`mt-1 text-center text-[0.6rem] ${t.dateText}`}>
                  {formatted.time}
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* View All Link */}
      {entries.length > 0 && (
        <div className={`px-4 py-2 border-t border-inherit text-center`}>
          <button
            onClick={() => {
              const userId = localStorage.getItem("user_id");
              navigate(`/my-calendar/${userId}`);
            }}
            className={`text-xs font-semibold ${variant === 'game' ? 'text-yellow-400 hover:text-yellow-300' : 'text-red hover:text-red/80'} transition`}
          >
            {variant === 'game' ? 'View Full Quest Log →' : 'View All Entries →'}
          </button>
        </div>
      )}
    </div>
  );
};

RecentEntriesStrip.propTypes = {
  variant: PropTypes.oneOf(['classic', 'game']),
  onEntryClick: PropTypes.func,
  maxEntries: PropTypes.number,
};

export default RecentEntriesStrip;
