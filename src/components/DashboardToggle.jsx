import PropTypes from "prop-types";

const DashboardToggle = ({ isV2, onToggle }) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="rounded-full border border-darkpapyrus bg-lightpapyrus px-4 py-2 font-semibold text-slate-800"
    >
      {isV2 ? "Back to Classic" : "Try New Dashboard"}
    </button>
  );
};

DashboardToggle.propTypes = {
  isV2: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default DashboardToggle;
