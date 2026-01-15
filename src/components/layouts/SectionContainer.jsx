import PropTypes from 'prop-types';

/**
 * SectionContainer Component - Consistent section spacing and max-width
 */
const SectionContainer = ({ 
  children, 
  maxWidth = '6xl',
  padding = 'default',
  className = '',
}) => {
  const maxWidthClasses = {
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full',
  };

  const paddingClasses = {
    none: '',
    sm: 'px-4 py-4',
    default: 'px-4 md:px-8 py-6',
    lg: 'px-6 md:px-12 py-8',
  };

  return (
    <div 
      className={`
        ${maxWidthClasses[maxWidth]}
        ${paddingClasses[padding]}
        mx-auto
        ${className}
      `}
    >
      {children}
    </div>
  );
};

SectionContainer.propTypes = {
  children: PropTypes.node.isRequired,
  maxWidth: PropTypes.oneOf(['4xl', '5xl', '6xl', '7xl', 'full']),
  padding: PropTypes.oneOf(['none', 'sm', 'default', 'lg']),
  className: PropTypes.string,
};

export default SectionContainer;