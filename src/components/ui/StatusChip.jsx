import PropTypes from 'prop-types';
import { CheckIcon, ClockIcon, StarIcon } from '@heroicons/react/24/solid';

/**
 * StatusChip Component - Status indicator with icon for Continue, Certificate, etc.
 */
const StatusChip = ({ 
  status = 'continue',
  size = 'md',
  className = '',
}) => {
  const statusConfig = {
    continue: {
      label: 'Continue',
      icon: ClockIcon,
      bgColor: 'bg-primary-green-light',
      textColor: 'text-primary-green-dark',
      iconColor: 'text-primary-green',
    },
    certificate: {
      label: 'Certificate',
      icon: StarIcon,
      bgColor: 'bg-accent-orange-light',
      textColor: 'text-accent-orange-dark',
      iconColor: 'text-accent-orange',
    },
    completed: {
      label: 'Completed',
      icon: CheckIcon,
      bgColor: 'bg-accent-blue-light',
      textColor: 'text-accent-blue-dark',
      iconColor: 'text-accent-blue',
    },
    review: {
      label: 'Review',
      icon: CheckIcon,
      bgColor: 'bg-accent-teal-pale',
      textColor: 'text-accent-teal-dark',
      iconColor: 'text-accent-teal',
    },
  };

  const sizeClasses = {
    sm: { chip: 'px-2 py-1 text-xs gap-1', icon: 'w-3 h-3' },
    md: { chip: 'px-3 py-1.5 text-sm gap-1.5', icon: 'w-4 h-4' },
    lg: { chip: 'px-4 py-2 text-base gap-2', icon: 'w-5 h-5' },
  };

  const config = statusConfig[status] || statusConfig.continue;
  const Icon = config.icon;
  const sizes = sizeClasses[size];

  return (
    <span
      className={`
        inline-flex items-center rounded-full font-semibold
        ${config.bgColor}
        ${config.textColor}
        ${sizes.chip}
        ${className}
      `}
    >
      <Icon className={`${sizes.icon} ${config.iconColor}`} />
      {config.label}
    </span>
  );
};

StatusChip.propTypes = {
  status: PropTypes.oneOf(['continue', 'certificate', 'completed', 'review']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};

export default StatusChip;