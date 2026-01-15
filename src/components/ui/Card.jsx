import PropTypes from 'prop-types';

/**
 * Card Component - Base card with optional gradient border
 * 
 * Variants:
 * - default: Simple card with border
 * - green: Card with green gradient border
 * - orange: Card with orange gradient border
 * - blue: Card with blue gradient border
 * - teal: Card with teal gradient border
 */
const Card = ({ 
  children, 
  variant = 'default',
  className = '',
  padding = 'lg',
  hover = false,
  onClick = null,
  as: Component = 'div'
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-5',
    xl: 'p-6',
  };

  const variantClasses = {
    default: 'bg-white border border-darkpapyrus',
    green: 'bg-primary-green-pale border-2 border-primary-green-light',
    orange: 'bg-accent-orange-pale border-2 border-accent-orange-light',
    blue: 'bg-accent-blue-pale border-2 border-accent-blue-light',
    teal: 'bg-accent-teal-pale border-2 border-accent-teal-light',
    subtle: 'bg-lightpapyrus border border-darkpapyrus',
  };

  const hoverClasses = hover 
    ? 'hover:shadow-nature-md hover:scale-[1.02] transition-nature cursor-pointer'
    : '';

  return (
    <Component
      className={`
        rounded-3xl shadow-nature-sm
        ${variantClasses[variant]}
        ${paddingClasses[padding]}
        ${hoverClasses}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </Component>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'green', 'orange', 'blue', 'teal', 'subtle']),
  className: PropTypes.string,
  padding: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl']),
  hover: PropTypes.bool,
  onClick: PropTypes.func,
  as: PropTypes.elementType,
};

export default Card;