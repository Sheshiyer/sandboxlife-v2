import PropTypes from 'prop-types';
import { Button as HeadlessButton } from '@headlessui/react';

/**
 * Button Component - Action buttons with multiple variants
 * 
 * Variants:
 * - primary: Solid green button
 * - secondary: Solid orange button
 * - outline: Outlined button
 * - ghost: Transparent button with hover
 * - icon: Icon-only button
 */
const Button = ({ 
  children, 
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  onClick = null,
  type = 'button',
  className = '',
  icon = null,
  iconPosition = 'left',
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    icon: 'p-2',
  };

  const variantClasses = {
    primary: 'bg-primary-green text-white hover:bg-primary-green-dark shadow-nature-sm hover:shadow-nature-md',
    secondary: 'bg-accent-orange text-white hover:bg-accent-orange-dark shadow-nature-sm hover:shadow-nature-md',
    blue: 'bg-accent-blue text-white hover:bg-accent-blue-dark shadow-nature-sm hover:shadow-nature-md',
    teal: 'bg-accent-teal text-white hover:bg-accent-teal-dark shadow-nature-sm hover:shadow-nature-md',
    outline: 'border-2 border-darkpapyrus bg-transparent text-slate-700 hover:bg-lightpapyrus',
    ghost: 'bg-transparent text-slate-700 hover:bg-lightpapyrus',
    subtle: 'bg-lightpapyrus text-slate-700 hover:bg-darkpapyrus border border-darkpapyrus',
  };

  const baseClasses = 'rounded-2xl font-semibold transition-nature inline-flex items-center justify-center gap-2';
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  const iconElement = icon && (
    <span className={size === 'icon' ? '' : 'w-5 h-5'}>
      {icon}
    </span>
  );

  return (
    <HeadlessButton
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        ${baseClasses}
        ${sizeClasses[size === 'icon' ? 'icon' : size]}
        ${variantClasses[variant]}
        ${widthClass}
        ${disabledClass}
        ${className}
      `}
    >
      {iconPosition === 'left' && iconElement}
      {children}
      {iconPosition === 'right' && iconElement}
    </HeadlessButton>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['primary', 'secondary', 'blue', 'teal', 'outline', 'ghost', 'subtle']),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'icon']),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
};

export default Button;