import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/solid";

const Breadcrumb = ({ items }) => {
  return (
    <nav className="bg-lightpapyrus border-b border-darkpapyrus px-4 md:px-8 py-4">
      <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-700">
        <HomeIcon className="h-5 w-5 text-slate-700" />
        {items.map((item, index) => (
          <span key={item.label} className="flex items-center gap-2">
            <ChevronRightIcon className="h-4 w-4 text-darkpapyrus" />
            {item.to ? (
              <Link
                to={item.to}
                className={`hover:underline ${index === items.length - 1 ? "text-slate-900 font-bold" : "text-slate-700"}`}
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-slate-900 font-bold">{item.label}</span>
            )}
          </span>
        ))}
      </div>
    </nav>
  );
};

Breadcrumb.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      to: PropTypes.string,
    })
  ).isRequired,
};

export default Breadcrumb;
