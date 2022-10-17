import { useState, useEffect } from "react";
import throttle from "lodash/throttle";

// Inspiration from https://betterprogramming.pub/usebreakpoint-hook-get-media-query-breakpoints-in-react-3f1779b73568

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
  const [brkPnt, setBrkPnt] = useState(() =>
    getDeviceConfig(window?.innerWidth)
  );

  useEffect(() => {
    const calcInnerWidth = throttle(function () {
      setBrkPnt(getDeviceConfig(window?.innerWidth));
    }, 200);
    window?.addEventListener("resize", calcInnerWidth);
    return () => window?.removeEventListener("resize", calcInnerWidth);
  }, []);

  if (typeof window === "undefined") {
    return null;
  }

  return brkPnt;
};
export default useBreakpoint;
