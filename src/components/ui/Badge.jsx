import PropTypes from 'prop-types';

/**
 * Badge Component - Status indicators and labels
 * 
 * Variants:
 * - primary: Green badge
 * - orange: Orange badge
 * - blue: Blue badge
 * - teal: Teal badge
 * - neutral: Gray badge
 * - outline: Outlined badge
 */
const Badge = ({ 
  children, 
  variant = 'primary',
  size = 'md',
  className = '',
  dot = false
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const variantClasses = {
    primary: 'bg-primary-green text-white',
    'primary-light': 'bg-primary-green-pale text-primary-green-dark',
    orange: 'bg-accent-orange text-white',
    'orange-light': 'bg-accent-orange-pale text-accent-orange-dark',
    blue: 'bg-accent-blue text-white',
    'blue-light': 'bg-accent-blue-pale text-accent-blue-dark',
    teal: 'bg-accent-teal text-white',
    'teal-light': 'bg-accent-teal-pale text-accent-teal-dark',
    neutral: 'bg-darkpapyrus text-slate-700',
    outline: 'border-2 border-darkpapyrus bg-transparent text-slate-700',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        rounded-full font-semibold
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75" />
      )}
      {children}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    'primary', 'primary-light',
    'orange', 'orange-light',
    'blue', 'blue-light',
    'teal', 'teal-light',
    'neutral', 'outline'
  ]),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  dot: PropTypes.bool,
};

export default Badge;