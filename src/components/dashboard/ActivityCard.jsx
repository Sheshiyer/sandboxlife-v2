import PropTypes from 'prop-types';
import { ClockIcon } from '@heroicons/react/24/outline';

/**
 * ActivityCard Component - Compact recent activity item
 */
const ActivityCard = ({ 
  title, 
  timestamp, 
  onClick = null 
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        w-full flex items-center justify-between
        rounded-2xl border border-darkpapyrus bg-white px-4 py-3
        hover:bg-lightpapyrus hover:shadow-nature-sm transition-nature
        text-left
      "
    >
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-800 text-sm truncate">
          {title}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <ClockIcon className="w-3.5 h-3.5 text-slate-500" />
          <p className="text-xs text-slate-600">
            {timestamp}
          </p>
        </div>
      </div>
    </button>
  );
};

ActivityCard.propTypes = {
  title: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default ActivityCard;