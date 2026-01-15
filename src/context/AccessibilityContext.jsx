import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

const AccessibilityContext = createContext(null);

const FONT_SIZES = {
  small: { label: "Small", scale: 0.875, class: "text-sm" },
  medium: { label: "Medium", scale: 1, class: "text-base" },
  large: { label: "Large", scale: 1.125, class: "text-lg" },
  xlarge: { label: "Extra Large", scale: 1.25, class: "text-xl" },
};

const DEFAULT_STATE = {
  fontSize: "medium",
  highContrast: false,
  reducedMotion: false,
};

export function AccessibilityProvider({ children }) {
  const [fontSize, setFontSize] = useState(DEFAULT_STATE.fontSize);
  const [highContrast, setHighContrast] = useState(DEFAULT_STATE.highContrast);
  const [reducedMotion, setReducedMotion] = useState(DEFAULT_STATE.reducedMotion);

  useEffect(() => {
    const stored = localStorage.getItem("accessibility_settings");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.fontSize) setFontSize(parsed.fontSize);
        if (parsed.highContrast !== undefined) setHighContrast(parsed.highContrast);
        if (parsed.reducedMotion !== undefined) setReducedMotion(parsed.reducedMotion);
      } catch (e) {
        // Invalid stored data, use defaults
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "accessibility_settings",
      JSON.stringify({ fontSize, highContrast, reducedMotion })
    );

    const scale = FONT_SIZES[fontSize]?.scale || 1;
    document.documentElement.style.setProperty("--font-scale", scale);
    document.documentElement.style.fontSize = `${scale * 100}%`;

    if (highContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }

    if (reducedMotion) {
      document.documentElement.classList.add("reduced-motion");
    } else {
      document.documentElement.classList.remove("reduced-motion");
    }
  }, [fontSize, highContrast, reducedMotion]);

  const increaseFontSize = useCallback(() => {
    setFontSize((current) => {
      const sizes = Object.keys(FONT_SIZES);
      const currentIndex = sizes.indexOf(current);
      if (currentIndex < sizes.length - 1) {
        return sizes[currentIndex + 1];
      }
      return current;
    });
  }, []);

  const decreaseFontSize = useCallback(() => {
    setFontSize((current) => {
      const sizes = Object.keys(FONT_SIZES);
      const currentIndex = sizes.indexOf(current);
      if (currentIndex > 0) {
        return sizes[currentIndex - 1];
      }
      return current;
    });
  }, []);

  const value = useMemo(
    () => ({
      fontSize,
      setFontSize,
      increaseFontSize,
      decreaseFontSize,
      highContrast,
      setHighContrast,
      reducedMotion,
      setReducedMotion,
      FONT_SIZES,
    }),
    [fontSize, increaseFontSize, decreaseFontSize, highContrast, reducedMotion]
  );

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

AccessibilityProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// eslint-disable-next-line react-refresh/only-export-components
export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within AccessibilityProvider");
  }
  return context;
}
