import PropTypes from 'prop-types';
import Card from '../ui/Card';
import StatusChip from '../ui/StatusChip';
import Button from '../ui/Button';

/**
 * CategoryCard Component - Card for collection/category views
 */
const CategoryCard = ({
  title,
  description,
  image,
  status = 'continue',
  actions = [],
  variant = 'default',
  onClick = null,
}) => {
  return (
    <Card
      variant={variant}
      padding="lg"
      hover
      onClick={onClick}
      className="relative"
    >
      <div className="space-y-4">
        {/* Image */}
        {image && (
          <div className="w-full aspect-square rounded-2xl overflow-hidden bg-white shadow-nature-sm">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Content */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-serif font-semibold text-slate-900 flex-1">
              {title}
            </h3>
            {status && (
              <StatusChip status={status} size="sm" />
            )}
          </div>
          
          {description && (
            <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
              {description}
            </p>
          )}
        </div>

        {/* Actions */}
        {actions.length > 0 && (
          <div className="flex gap-2 pt-2">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'subtle'}
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick?.();
                }}
                className="flex-1"
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

CategoryCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  image: PropTypes.string,
  status: PropTypes.oneOf(['continue', 'certificate', 'completed', 'review']),
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func,
      variant: PropTypes.string,
    })
  ),
  variant: PropTypes.oneOf(['default', 'green', 'orange', 'blue', 'teal']),
  onClick: PropTypes.func,
};

export default CategoryCard;