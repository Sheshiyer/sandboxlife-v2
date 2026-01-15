import PropTypes from "prop-types";

export const CardDeckSkeleton = ({ count }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-3xl border border-darkpapyrus bg-lightpapyrus p-5 shadow-sm"
        >
          <div className="h-5 w-1/3 rounded-full bg-bgpapyrus" />
          <div className="mt-3 h-4 w-2/3 rounded-full bg-bgpapyrus" />
          <div className="mt-6 h-24 rounded-2xl bg-bgpapyrus" />
        </div>
      ))}
    </div>
  );
};

CardDeckSkeleton.propTypes = {
  count: PropTypes.number,
};

CardDeckSkeleton.defaultProps = {
  count: 6,
};

export const ListSkeleton = ({ count }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-darkpapyrus bg-lightpapyrus p-4"
        >
          <div className="h-4 w-1/2 rounded-full bg-bgpapyrus" />
          <div className="mt-2 h-4 w-1/3 rounded-full bg-bgpapyrus" />
        </div>
      ))}
    </div>
  );
};

ListSkeleton.propTypes = {
  count: PropTypes.number,
};

ListSkeleton.defaultProps = {
  count: 4,
};
