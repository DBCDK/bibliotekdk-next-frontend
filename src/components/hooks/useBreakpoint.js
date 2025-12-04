import { useState, useEffect } from "react";
import throttle from "lodash/throttle";

// Inspiration from https://betterprogramming.pub/usebreakpoint-hook-get-media-query-breakpoints-in-react-3f1779b73568

// Global cache for breakpoint to persist across navigation
// This solves hydration issues with SSR by ensuring server and client start with same value
let cachedBreakpoint = "";
let isInitialized = false;

const getDeviceConfig = (width) => {
  // React bootstrap breakpoints
  if (width < 576) {
    return "xs";
  } else if (width >= 576 && width < 768) {
    return "sm";
  } else if (width >= 768 && width < 992) {
    return "md";
  } else if (width >= 992 && width < 1200) {
    return "lg";
  } else if (width >= 1200) {
    return "xl";
  }
};

const useBreakpoint = () => {
  // Start with cached value if available, otherwise empty string for SSR
  const [brkPnt, setBrkPnt] = useState(
    typeof window !== "undefined" && isInitialized ? cachedBreakpoint : ""
  );

  useEffect(() => {
    // If we already have a cached breakpoint, use it immediately
    if (isInitialized && cachedBreakpoint) {
      setBrkPnt(cachedBreakpoint);
    }

    const calcInnerWidth = throttle(function () {
      const newBreakpoint = getDeviceConfig(window?.innerWidth);
      setBrkPnt(newBreakpoint);
      // Cache the new breakpoint
      cachedBreakpoint = newBreakpoint;
      isInitialized = true;
    }, 200);

    // exec on render
    calcInnerWidth();

    window?.addEventListener("resize", calcInnerWidth);
    return () => window?.removeEventListener("resize", calcInnerWidth);
  }, []);

  return brkPnt;
};
export default useBreakpoint;
