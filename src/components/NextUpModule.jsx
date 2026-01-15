import PropTypes from "prop-types";
import Card from './ui/Card';

const NextUpModule = ({ items }) => {
  return (
    <Card variant="subtle" padding="lg" className="shadow-nature-sm">
      <h3 className="text-lg font-serif font-semibold text-slate-900">Next Up</h3>
      <p className="mt-1 text-sm text-slate-600">
        Recommended actions based on your activity.
      </p>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-2xl border border-darkpapyrus bg-white px-4 py-3 hover:bg-lightpapyrus hover:shadow-nature-sm transition-nature"
          >
            <div className="flex-1">
              <p className="font-semibold text-slate-800">{item.title}</p>
              <p className="text-sm text-slate-600">{item.description}</p>
            </div>
            <span className="text-sm font-semibold text-slate-600 ml-3">{item.time}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

NextUpModule.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default NextUpModule;
