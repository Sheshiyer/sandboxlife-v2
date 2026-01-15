import PropTypes from 'prop-types';
import {
  BookOpenIcon,
  CalendarIcon,
  LightBulbIcon,
} from '@heroicons/react/24/solid';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

/**
 * JournalCard Component - Enhanced journal entry card with nature theme
 */
const JournalCard = ({
  title,
  iconTitle,
  date,
  image,
  message,
  time,
  index,
  onClick = null,
}) => {
  // Determine variant based on journal type
  const getCardVariant = () => {
    switch (title) {
      case 'Book':
        return 'blue';
      case 'Status':
        return 'orange';
      case 'Daily':
        return 'green';
      default:
        return 'default';
    }
  };

  const getBadgeVariant = () => {
    switch (title) {
      case 'Book':
        return 'blue-light';
      case 'Status':
        return 'orange-light';
      case 'Daily':
        return 'primary-light';
      default:
        return 'neutral';
    }
  };

  const variant = getCardVariant();
  const badgeVariant = getBadgeVariant();
  const isFirst = index === 0;

  return (
    <Card
      variant={variant}
      padding="lg"
      hover
      onClick={onClick}
      className={`
        relative min-h-[200px]
        ${isFirst ? 'ring-2 ring-red ring-offset-2' : ''}
      `}
    >
      <div className="flex gap-4 h-full">
        {/* Content Section */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between text-slate-600 text-sm mb-2">
              <span className="font-semibold">{date}</span>
              <span>{time}</span>
            </div>
            
            <h2 className="text-lg font-serif font-semibold text-slate-900 mb-2 leading-snug">
              {iconTitle}
            </h2>
            
            <p className="text-sm text-slate-700 leading-relaxed line-clamp-3">
              {message?.length > 120 ? message?.slice(0, 120) + '...' : message}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-black/10">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/50">
                {title === 'Book' && (
                  <BookOpenIcon className="w-4 h-4 text-slate-700" />
                )}
                {title === 'Daily' && (
                  <CalendarIcon className="w-4 h-4 text-slate-700" />
                )}
                {title === 'Status' && (
                  <LightBulbIcon className="w-4 h-4 text-slate-700" />
                )}
              </div>
              <Badge variant={badgeVariant} size="sm">
                {title}
              </Badge>
            </div>
            <span className="text-sm text-slate-600">Tap to view</span>
          </div>
        </div>

        {/* Image Section */}
        <div className="flex-shrink-0">
          {image ? (
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden bg-white shadow-nature-sm border border-black/5">
              <img
                src={image}
                alt={iconTitle}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
          ) : (
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/50 flex items-center justify-center">
              <span className="text-gray-400 text-xs">No image</span>
            </div>
          )}
        </div>
      </div>

      {/* Latest Badge */}
      {isFirst && (
        <div className="absolute -top-2 -right-2 bg-red text-white text-xs font-bold px-2 py-1 rounded-full shadow-nature-md">
          Latest
        </div>
      )}
    </Card>
  );
};

JournalCard.propTypes = {
  title: PropTypes.string.isRequired,
  iconTitle: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  image: PropTypes.string,
  message: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  index: PropTypes.number,
  onClick: PropTypes.func,
};

export default JournalCard;