import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * NavCard Component - Card-style navigation item
 */
const NavCard = ({ 
  to, 
  title, 
  description, 
  icon = null,
  variant = 'default',
  onClick = null,
}) => {
  const variantClasses = {
    default: 'bg-white border-darkpapyrus',
    green: 'bg-primary-green-pale border-primary-green-light',
    orange: 'bg-accent-orange-pale border-accent-orange-light',
    blue: 'bg-accent-blue-pale border-accent-blue-light',
    teal: 'bg-accent-teal-pale border-accent-teal-light',
  };

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`
        block rounded-2xl border-2 px-4 py-3
        ${variantClasses[variant]}
        hover:shadow-nature-md hover:scale-[1.02] transition-nature
      `}
    >
      <div className="flex items-start gap-3">
        {icon && (
          <div className="flex-shrink-0 mt-0.5">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="text-base font-semibold text-slate-800 mb-0.5">
            {title}
          </div>
          <p className="text-sm text-slate-600 leading-snug">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
};

NavCard.propTypes = {
  to: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.node,
  variant: PropTypes.oneOf(['default', 'green', 'orange', 'blue', 'teal']),
  onClick: PropTypes.func,
};

export default NavCard;