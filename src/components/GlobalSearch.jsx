import PropTypes from "prop-types";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

const GlobalSearch = ({ value, onChange, placeholder }) => {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-darkpapyrus bg-lightpapyrus px-4 py-3 shadow-inner">
      <MagnifyingGlassIcon className="h-5 w-5 text-slate-600" />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-slate-800 placeholder:text-slate-500 focus:outline-none"
        aria-label="Search"
      />
    </div>
  );
};

GlobalSearch.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

GlobalSearch.defaultProps = {
  placeholder: "Search your entries",
};

export default GlobalSearch;
