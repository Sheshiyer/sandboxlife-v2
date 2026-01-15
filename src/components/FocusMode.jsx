import PropTypes from "prop-types";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

const FocusMode = ({ items, activeIndex, onPrev, onNext, onExit }) => {
  const current = items[activeIndex];

  if (!current) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-4xl px-4">
        <div className="rounded-3xl border border-darkpapyrus bg-lightpapyrus p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-serif font-semibold text-slate-900">
              Focus Mode
            </h2>
            <button
              type="button"
              onClick={onExit}
              className="rounded-full border border-darkpapyrus bg-white p-2"
              aria-label="Exit focus mode"
            >
              <XMarkIcon className="h-5 w-5 text-slate-700" />
            </button>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <button
              type="button"
              onClick={onPrev}
              className="h-12 w-12 rounded-full border border-darkpapyrus bg-white text-slate-700"
              aria-label="Previous card"
            >
              <ChevronLeftIcon className="h-6 w-6 mx-auto" />
            </button>
            <div className="flex-1">
              <div className="h-[70vh] w-full rounded-3xl border border-darkpapyrus bg-bgpapyrus p-6 shadow-sm">
                {current}
              </div>
            </div>
            <button
              type="button"
              onClick={onNext}
              className="h-12 w-12 rounded-full border border-darkpapyrus bg-white text-slate-700"
              aria-label="Next card"
            >
              <ChevronRightIcon className="h-6 w-6 mx-auto" />
            </button>
          </div>
          <div className="mt-4 text-center text-sm font-semibold text-slate-700">
            {activeIndex + 1} of {items.length}
          </div>
        </div>
      </div>
    </div>
  );
};

FocusMode.propTypes = {
  items: PropTypes.arrayOf(PropTypes.node).isRequired,
  activeIndex: PropTypes.number.isRequired,
  onPrev: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onExit: PropTypes.func.isRequired,
};

export default FocusMode;
