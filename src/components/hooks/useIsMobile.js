import { useState, useEffect } from "react";
import useWindowSize from "./useWindowSize";

const MAX_MOBILE_WIDTH = 375;

/**
 * Hook that checks with help of useWindowSize hook if the window is mobile (width <=375px) or desktop (>375px)
 * @returns {boolean} isMobile
 */
const useIsMobile = () => {
  const windowSize = useWindowSize();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(windowSize.width <= MAX_MOBILE_WIDTH);
  }, [windowSize.width]);

  return isMobile;
};

export default useIsMobile;
