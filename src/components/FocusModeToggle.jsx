import PropTypes from "prop-types";

const FocusModeToggle = ({ enabled, onToggle }) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`inline-flex items-center gap-2 rounded-full border border-darkpapyrus px-4 py-2 font-semibold ${
        enabled ? "bg-bgpapyrus text-slate-900" : "bg-lightpapyrus text-slate-700"
      }`}
      aria-pressed={enabled}
    >
      <span className="h-3 w-3 rounded-full border border-darkpapyrus bg-white" />
      Focus Mode
    </button>
  );
};

FocusModeToggle.propTypes = {
  enabled: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default FocusModeToggle;
