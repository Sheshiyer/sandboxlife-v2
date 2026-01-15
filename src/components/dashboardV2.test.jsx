import { describe, it, expect } from "vitest";
import FocusMode from "./FocusMode";
import FocusModeToggle from "./FocusModeToggle";
import GlobalSearch from "./GlobalSearch";
import FilterChips from "./FilterChips";
import NextUpModule from "./NextUpModule";
import RecentActivityModule from "./RecentActivityModule";
import DashboardToggle from "./DashboardToggle";

const components = [
  FocusMode,
  FocusModeToggle,
  GlobalSearch,
  FilterChips,
  NextUpModule,
  RecentActivityModule,
  DashboardToggle,
];

describe("dashboard v2 components", () => {
  it("exports components as functions", () => {
    components.forEach((component) => {
      expect(typeof component).toBe("function");
    });
  });
});
