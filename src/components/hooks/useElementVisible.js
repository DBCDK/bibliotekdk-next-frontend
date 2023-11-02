/**
 * @file {@link useElementVisible} and {@link useBundledElementVisibleById} hook is a wrapper around IntersectionObserver.
 *  Handles the intersectionObserver
 *  IntersectionObserver can be used for different things, ie. lazy load
 *  or counting the number of objects that has been observed for data_collect
 */

import { useEffect, useRef, useState } from "react";
import { hashCode } from "@/components/base/slider/WorkSlider";
import { useRouter } from "next/router";

function useSetupIntersector() {
  const elementRef = useRef([]);
  const [isVisible, setIsVisible] = useState(new Map());
  const [hasBeenSeen, setHasBeenSeen] = useState(new Map());
  const router = useRouter();

  useEffect(() => {
    setIsVisible(new Map());
    setHasBeenSeen(new Map());
  }, [router.query]);

  function handleIntersection(entries) {
    entries.forEach((entry) => {
      const elementId = `${
        entry.target.id || hashCode(entry.target.innerHTML)
      }`;
      setIsVisible(isVisible.set(elementId, entry.intersectionRatio >= 1));
      if (entry.intersectionRatio >= 1) {
        setHasBeenSeen(hasBeenSeen.set(elementId, true));
      }
    });
  }

  return { elementRef, isVisible, hasBeenSeen, handleIntersection };
}

/**
 * {@link useElementVisible} and {@link useBundledElementVisibleById} hooks are wrappers around IntersectionObserver.
 * Bundled version of {@link useElementVisible}. Preferred whenever we use children, to remove some overhead
 *  *  In this project there are some different useCases:
 *  @example ```
 *  - LazyLoading:
 *    - /inspiration/[workType] uses the lazy load to reduce the load slightly and improve first load times
 *  - Load on intersection, so Components can handle their own data:
 *    - Accordion.js loads their content when user is close to the component
 *  - Allow Javascript to see which element is currently visible, so we can reflect that in other places
 *    - The shown image in CoverCarousel.js is reflected by DotHandler.js.
 *  ```
 * @param options
 * @returns {{elementRef: React.MutableRefObject<*[]>, isVisible: Map<any, any>, hasBeenSeen: Map<any, any>}}
 */
export function useBundledElementVisibleById(options) {
  const { elementRef, isVisible, hasBeenSeen, handleIntersection } =
    useSetupIntersector({ newRootId: options.rootId });

  useEffect(() => {
    const root =
      options.root ??
      (options.rootId !== null &&
        document.querySelector(`#${CSS.escape(options.rootId)}`)) ??
      null;

    const intersectionObserver = new IntersectionObserver(handleIntersection, {
      root: root,
      ...options,
    });

    elementRef.current.forEach((elem) => {
      if (elem) {
        intersectionObserver.observe(elem);
      }
    });

    return () => {
      elementRef.current.forEach((elem) => {
        if (elem) {
          intersectionObserver.unobserve(elem);
        }
      });
    };
  }, [elementRef, options]);

  return { elementRef, isVisible, hasBeenSeen };
}

/**
 * {@link useElementVisible} and {@link useBundledElementVisibleById} hooks are wrappers around IntersectionObserver.
 * Bundled version of {@link useElementVisible}. Preferred whenever we use children, to remove some overhead
 *  *  In this project there are some different useCases:
 *  @example ```
 *  - LazyLoading:
 *    - /inspiration/[workType] uses the lazy load to reduce the load slightly and improve first load times
 *  - Load on intersection, so Components can handle their own data:
 *    - Accordion.js loads their content when user is close to the component
 *  - Allow Javascript to see which element is currently visible, so we can reflect that in other places
 *    - The shown image in CoverCarousel.js is reflected by DotHandler.js.
 *  ```
 * @param options
 * @returns {{elementRef: React.MutableRefObject<null>, isVisible: boolean, hasBeenSeen: boolean}}
 */
export default function useElementVisible(options) {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenSeen, setHasBeenSeen] = useState(false);

  function handleIntersection(entries) {
    const isIntersecting = entries.some((entry) => entry.isIntersecting);
    setIsVisible(isIntersecting);
    if (!hasBeenSeen && isIntersecting) {
      setHasBeenSeen(true);
    }
  }

  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(
      handleIntersection,
      options
    );
    if (elementRef.current) {
      intersectionObserver.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        intersectionObserver.unobserve(elementRef.current);
      }
    };
  }, [elementRef]);

  return { elementRef, isVisible, hasBeenSeen };
}
