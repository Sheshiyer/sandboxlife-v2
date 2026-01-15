import {
  BookOpenIcon,
  CalendarIcon,
  LightBulbIcon,
} from "@heroicons/react/24/solid";
import PropTypes from 'prop-types';

const JournalEntry = ({
  title,
  iconTitle,
  date,
  image,
  message,
  time,
  index
}) => {
  // Get background color based on journal type
  const getCardStyles = () => {
    switch (title) {
      case "Book":
        return {
          bg: "#d4edfc",
          borderFrom: "#83cefd",
          borderTo: "#5bb8f2",
          accent: "bg-[#83cefd]",
        };
      case "Status":
        return {
          bg: "#fef3d4",
          borderFrom: "#f5c15f",
          borderTo: "#d9a84b",
          accent: "bg-[#f5c15f]",
        };
      case "Daily":
        return {
          bg: "#d4fcd9",
          borderFrom: "#72fe82",
          borderTo: "#4adf61",
          accent: "bg-[#72fe82]",
        };
      default:
        return {
          bg: "#ffffff",
          borderFrom: "#e5e5c7",
          borderTo: "#cfcfa6",
          accent: "bg-lightpapyrus",
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
          `}
        >
      {/* Content Section */}
      <div className="flex-1 flex flex-col justify-between min-w-0 pr-5">
        {/* Title & Message */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-slate-700">
            <span className="text-sm font-semibold">{date}</span>
            <span className="text-sm">{time}</span>
          </div>
          <h2 className="text-lg font-serif font-semibold text-slate-900 leading-snug tracking-tight">
            {iconTitle}
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed line-clamp-2">
            {message?.length > 70 ? message?.slice(0, 70) + "..." : message}
          </p>
        </div>

        {/* Footer - Date & Type */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-black/10">
          <div className="flex items-center gap-2">
            <div className={`
              flex items-center justify-center w-8 h-8 rounded-lg
              ${styles.accent} bg-opacity-50 backdrop-blur-sm
            `}>
              {title === "Book" && (
                <BookOpenIcon className="w-4 h-4 text-gray-700" />
              )}
              {title === "Daily" && (
                <CalendarIcon className="w-4 h-4 text-gray-700" />
              )}
              {title === "Status" && (
                <LightBulbIcon className="w-4 h-4 text-gray-700" />
              )}
            </div>
            <span className="text-sm font-semibold text-slate-800">
              {title}
            </span>
          </div>
          <span className="text-sm text-slate-600">Tap to view</span>
        </div>
      </div>

      {/* Image Section */}
      <div className="flex-shrink-0 flex items-center justify-center">
        {image ? (
          <div className="w-[3.75rem] h-[3.75rem] md:w-[4.25rem] md:h-[4.25rem] rounded-2xl overflow-hidden bg-white shadow-inner border border-black/5">
            <img
              src={image}
              alt={iconTitle}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>
        ) : (
          <div className="w-[3.75rem] h-[3.75rem] md:w-[4.25rem] md:h-[4.25rem] rounded-2xl bg-lightpapyrus flex items-center justify-center">
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
