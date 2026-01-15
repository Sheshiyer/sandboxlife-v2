import PropTypes from 'prop-types';

/**
 * Avatar Component - Circular user avatar with fallback initials
 */
const Avatar = ({ 
  src = null,
  alt = '',
  size = 'md',
  name = '',
  className = '',
  status = null,
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl',
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-3.5 h-3.5',
    '2xl': 'w-4 h-4',
  };

  const statusColors = {
    online: 'bg-primary-green',
    offline: 'bg-slate-400',
    busy: 'bg-accent-orange',
    away: 'bg-accent-orange-light',
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div 
        className={`
          ${sizeClasses[size]}
          rounded-full overflow-hidden
          bg-darkpapyrus text-slate-700 font-semibold
          flex items-center justify-center
          border-2 border-white shadow-nature-sm
        `}
      >
        {src ? (
          <img 
            src={src} 
            alt={alt || name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>
      
      {status && (
        <span 
          className={`
            absolute bottom-0 right-0
            ${statusSizes[size]}
            ${statusColors[status]}
            rounded-full border-2 border-white
          `}
        />
      )}
    </div>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  name: PropTypes.string,
  className: PropTypes.string,
  status: PropTypes.oneOf(['online', 'offline', 'busy', 'away']),
};

export default Avatar;