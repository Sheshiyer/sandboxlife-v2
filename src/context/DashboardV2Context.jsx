import { createContext, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

export const DashboardV2Context = createContext(null);

const DEFAULT_STATE = {
  density: "comfort",
  focusMode: false,
  filters: [],
  search: "",
};

export const DashboardV2Provider = ({ children }) => {
  const [density, setDensity] = useState(DEFAULT_STATE.density);
  const [focusMode, setFocusMode] = useState(DEFAULT_STATE.focusMode);
  const [filters, setFilters] = useState(DEFAULT_STATE.filters);
  const [search, setSearch] = useState(DEFAULT_STATE.search);

  useEffect(() => {
    const storedDensity = localStorage.getItem("dashboard_v2_density");
    const storedFocus = localStorage.getItem("dashboard_v2_focus_mode");
    const storedFilters = localStorage.getItem("dashboard_v2_filters");
    const storedSearch = localStorage.getItem("dashboard_v2_search");

    if (storedDensity) setDensity(storedDensity);
    if (storedFocus) setFocusMode(storedFocus === "true");
    if (storedFilters) setFilters(JSON.parse(storedFilters));
    if (storedSearch) setSearch(storedSearch);
  }, []);

  useEffect(() => {
    localStorage.setItem("dashboard_v2_density", density);
  }, [density]);

  useEffect(() => {
    localStorage.setItem("dashboard_v2_focus_mode", String(focusMode));
  }, [focusMode]);

  useEffect(() => {
    localStorage.setItem("dashboard_v2_filters", JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    localStorage.setItem("dashboard_v2_search", search);
  }, [search]);

  const value = useMemo(
    () => ({
      density,
      setDensity,
      focusMode,
      setFocusMode,
      filters,
      setFilters,
      search,
      setSearch,
    }),
    [density, focusMode, filters, search]
  );

  return (
    <DashboardV2Context.Provider value={value}>
      {children}
    </DashboardV2Context.Provider>
  );
};

DashboardV2Provider.propTypes = {
  children: PropTypes.node.isRequired,
};
