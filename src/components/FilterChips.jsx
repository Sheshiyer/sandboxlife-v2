import PropTypes from "prop-types";

const FilterChips = ({ filters, activeFilters, onToggle, onClear }) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter) => {
        const isActive = activeFilters.includes(filter.value);
        return (
          <button
            key={filter.value}
            type="button"
            onClick={() => onToggle(filter.value)}
            className={`rounded-full border border-darkpapyrus px-4 py-2 font-semibold ${
              isActive
                ? "bg-bgpapyrus text-slate-900"
                : "bg-lightpapyrus text-slate-700"
            }`}
            aria-pressed={isActive}
          >
            {filter.label}
          </button>
        );
      })}
      <button
        type="button"
        onClick={onClear}
        className="rounded-full border border-darkpapyrus bg-white px-4 py-2 font-semibold text-slate-700"
      >
        Clear filters
      </button>
    </div>
  );
};

FilterChips.propTypes = {
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  activeFilters: PropTypes.arrayOf(PropTypes.string).isRequired,
  onToggle: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
};

export default FilterChips;
