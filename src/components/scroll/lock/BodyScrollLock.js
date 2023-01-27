/**
 * @file
 * Handles BodyScrollLock on active modals
 *
 */

import useBreakpoint from "@/components/hooks/useBreakpoint";
import styles from "./BodyScrollLock.module.css";

/**
 * Function to get scrollY (scroll distance from top)
 *
 * @returns {int}
 */
function getScrollYPos() {
  // Get scrollY (all browsers)
  var doc = document.documentElement;
  var top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
  return top;
}

/**
 * Function to handle scrollLock on body
 *
 * @param {bool} shouldLockScroll
 *
 */
let scrollY = 0;
function scrollLock(shouldLockScroll) {
  const body = document.body;
  const layout = document.getElementById("layout");

  // We need booth
  if (!body || !layout) {
    return;
  }

  // check if already locked
  const isLocked = body.classList.contains(styles.lockScroll);

  // Add "lock" class and add "fake" scrollY position to body
  if (shouldLockScroll && !isLocked) {
    scrollY = getScrollYPos();
    layout.style.marginTop = `-${scrollY}px`;
    body.classList.add(styles.lockScroll);
  }
  // Remove "lock", remove "fake" scrollY position
  // + Scroll back to the scrollY position - same as before the modal was triggered
  else if (!shouldLockScroll && isLocked) {
    body.classList.remove(styles.lockScroll);
    layout.style.marginTop = `auto`;
    window.scrollTo(0, scrollY);
  }
}

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function BodyScrollLock({ router }) {
  // Query param targets to track
  // breakpoints are the breakpoints where the scroll is locked
  const targetList = [{ param: "suggester", breakpoints: ["xs", "sm", "md"] }];

  const breakpoint = useBreakpoint();

  if (typeof window !== "undefined") {
    /* Search for "modal" props in url query
     if any found lock body scroll */
    const shouldLockScroll =
      Object.keys(router.query).filter((k) =>
        targetList.find(
          (a) =>
            a.breakpoints.includes(breakpoint) &&
            a.param.toLowerCase().includes(k.toLowerCase())
        )
      ).length > 0;

    scrollLock(shouldLockScroll);
  }
  return null;
}
