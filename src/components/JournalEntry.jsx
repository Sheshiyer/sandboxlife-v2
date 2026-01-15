import {
  BookOpenIcon,
  CalendarIcon,
  LightBulbIcon,
} from "@heroicons/react/24/solid";
import PropTypes from 'prop-types';
import { useGameMode } from '../context/GameModeContext';
import { resolveIcon } from '../utils/iconResolver';

const JournalEntry = ({
  title,
  iconTitle,
  date,
  image,
  message,
  time,
  index
}) => {
  const { isGameMode } = useGameMode();
  
  // Resolve icon using the utility, falling back to passed image prop
  const resolvedImage = resolveIcon({ journal_meaning: iconTitle, journal_icon: image });

  // Get background color based on journal type
  const getCardStyles = () => {
    if (isGameMode) {
      switch (title) {
        case "Book":
          return {
            bg: "rgba(124, 58, 237, 0.1)", // Purple tint
            borderFrom: "rgba(139, 92, 246, 0.5)",
            borderTo: "rgba(109, 40, 217, 0.5)",
            accent: "bg-purple-500/30",
            text: "text-slate-100",
            titleText: "text-purple-400",
            subText: "text-slate-400",
            footerBg: "border-purple-500/20",
            icon: "text-purple-400"
          };
        case "Daily":
          return {
            bg: "rgba(14, 165, 233, 0.1)", // Blue tint
            borderFrom: "rgba(56, 189, 248, 0.5)",
            borderTo: "rgba(2, 132, 199, 0.5)",
            accent: "bg-sky-500/30",
            text: "text-slate-100",
            titleText: "text-sky-400",
            subText: "text-slate-400",
            footerBg: "border-sky-500/20",
            icon: "text-sky-400"
          };
        case "Status":
          return {
            bg: "rgba(234, 179, 8, 0.1)", // Yellow/Gold tint
            borderFrom: "rgba(253, 224, 71, 0.5)",
            borderTo: "rgba(202, 138, 4, 0.5)",
            accent: "bg-yellow-500/30",
            text: "text-slate-100",
            titleText: "text-yellow-400",
            subText: "text-slate-400",
            footerBg: "border-yellow-500/20",
            icon: "text-yellow-400"
          };
        default:
          return {
            bg: "rgba(30, 41, 59, 0.4)",
            borderFrom: "rgba(234, 179, 8, 0.3)",
            borderTo: "rgba(202, 138, 4, 0.2)",
            accent: "bg-slate-700/50",
            text: "text-slate-100",
            titleText: "text-yellow-500",
            subText: "text-slate-400",
            footerBg: "border-white/10",
            icon: "text-slate-300"
          };
      }
    }

    switch (title) {
      case "Book":
        return {
          bg: "#d4edfc",
          borderFrom: "#83cefd",
          borderTo: "#5bb8f2",
          accent: "bg-[#83cefd]",
          text: "text-slate-700",
          titleText: "text-slate-900",
          subText: "text-slate-700",
          footerBg: "border-black/10",
          icon: "text-gray-700"
        };
      case "Status":
        return {
          bg: "#fef3d4",
          borderFrom: "#f5c15f",
          borderTo: "#d9a84b",
          accent: "bg-[#f5c15f]",
          text: "text-slate-700",
          titleText: "text-slate-900",
          subText: "text-slate-700",
          footerBg: "border-black/10",
          icon: "text-gray-700"
        };
      case "Daily":
        return {
          bg: "#d4fcd9",
          borderFrom: "#72fe82",
          borderTo: "#4adf61",
          accent: "bg-[#72fe82]",
          text: "text-slate-700",
          titleText: "text-slate-900",
          subText: "text-slate-700",
          footerBg: "border-black/10",
          icon: "text-gray-700"
        };
      default:
        return {
          bg: "#ffffff",
          borderFrom: "#e5e5c7",
          borderTo: "#cfcfa6",
          accent: "bg-lightpapyrus",
          text: "text-slate-700",
          titleText: "text-slate-900",
          subText: "text-slate-700",
          footerBg: "border-black/10",
          icon: "text-gray-700"
        };
    }
  };

  const styles = getCardStyles();
  const isFirst = index === 0;

  return (
    <div
      className={`entry-card transition-all duration-200 ${isFirst ? "ring-2 ring-red ring-offset-2" : ""} cursor-pointer group`}
      style={{
        "--card-bg": styles.bg,
        "--card-from": styles.borderFrom,
        "--card-to": styles.borderTo,
      }}
    >
      <div className="entry-card__inner">
        <div
          className={`
            relative flex justify-between rounded-2xl w-full min-w-0
            shadow-sm hover:shadow-lg transition-all duration-200
            p-5 md:p-6 min-h-[clamp(9.5rem,16vh,12.5rem)]
            ${isGameMode ? "bg-black/40 backdrop-blur-md" : ""}
          `}
        >
      {/* Content Section */}
      <div className="flex-1 flex flex-col justify-between min-w-0 pr-5">
        {/* Title & Message */}
        <div className="space-y-2">
          <div className={`flex items-center justify-between ${styles.subText}`}>
            <span className="text-sm font-semibold">{date}</span>
            <span className="text-sm">{time}</span>
          </div>
          <h2 className={`text-lg font-serif font-semibold leading-snug tracking-tight ${styles.titleText}`}>
            {iconTitle}
          </h2>
          <p className={`text-sm leading-relaxed line-clamp-2 ${styles.text}`}>
            {message?.length > 70 ? message?.slice(0, 70) + "..." : message}
          </p>
        </div>

        {/* Footer - Date & Type */}
        <div className={`flex items-center justify-between mt-3 pt-3 border-t ${styles.footerBg}`}>
          <div className="flex items-center gap-2">
            <div className={`
              flex items-center justify-center w-8 h-8 rounded-lg
              ${styles.accent} backdrop-blur-sm
            `}>
              {title === "Book" && (
                <BookOpenIcon className={`w-4 h-4 ${styles.icon}`} />
              )}
              {title === "Daily" && (
                <CalendarIcon className={`w-4 h-4 ${styles.icon}`} />
              )}
              {title === "Status" && (
                <LightBulbIcon className={`w-4 h-4 ${styles.icon}`} />
              )}
            </div>
            <span className={`text-sm font-semibold ${styles.text}`}>
              {title}
            </span>
          </div>
          <span className={`text-sm ${styles.subText}`}>Tap to view</span>
        </div>
      </div>

      {/* Image Section */}
      <div className="flex-shrink-0 flex items-center justify-center">
        {resolvedImage ? (
          <div className={`w-[3.75rem] h-[3.75rem] md:w-[4.25rem] md:h-[4.25rem] rounded-2xl overflow-hidden ${isGameMode ? "bg-slate-900" : "bg-white"} shadow-inner border border-black/5`}>
            <img
              src={resolvedImage}
              alt={iconTitle}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>
        ) : (
          <div className={`w-[3.75rem] h-[3.75rem] md:w-[4.25rem] md:h-[4.25rem] rounded-2xl ${isGameMode ? "bg-slate-800" : "bg-lightpapyrus"} flex items-center justify-center`}>
            <span className="text-gray-400 text-[0.7rem]">No image</span>
          </div>
        )}
      </div>

      {/* First Entry Badge */}
      {isFirst && (
        <div className="absolute -top-2 -right-2 bg-red text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
          Latest
        </div>
      )}
        </div>
      </div>
    </div>
  );
};


JournalEntry.propTypes = {
    id: PropTypes.number,
    title: PropTypes.string,
    iconTitle: PropTypes.string,
    date: PropTypes.string,
    image: PropTypes.string,
    message: PropTypes.string,
    time: PropTypes.string,
    selected: PropTypes.bool,
    index: PropTypes.number
};

export default JournalEntry;
