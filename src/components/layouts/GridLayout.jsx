import PropTypes from 'prop-types';

/**
 * GridLayout Component - Responsive grid for cards
 */
const GridLayout = ({ 
  children, 
  columns = 'auto',
  gap = 'lg',
  className = '',
}) => {
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    auto: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-5',
    xl: 'gap-6',
  };

  return (
    <div 
      className={`
        grid
        ${columnClasses[columns]}
        ${gapClasses[gap]}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

GridLayout.propTypes = {
  children: PropTypes.node.isRequired,
  columns: PropTypes.oneOf([1, 2, 3, 4, 'auto']),
  gap: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  className: PropTypes.string,
};

export default GridLayout;