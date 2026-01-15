import PropTypes from "prop-types";
import Card from './ui/Card';
import ActivityCard from './dashboard/ActivityCard';

const RecentActivityModule = ({ items }) => {
  return (
    <Card variant="subtle" padding="lg" className="shadow-nature-sm">
      <h3 className="text-lg font-serif font-semibold text-slate-900">Recent Activity</h3>
      <p className="mt-1 text-sm text-slate-600">Your latest updates and changes.</p>
      <div className="mt-4 space-y-2">
        {items.map((item) => (
          <ActivityCard
            key={item.id}
            title={item.title}
            timestamp={item.timestamp}
            onClick={item.onOpen}
          />
        ))}
      </div>
    </Card>
  );
};

RecentActivityModule.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
      onOpen: PropTypes.func.isRequired,
    })
  ).isRequired,
};

export default RecentActivityModule;
