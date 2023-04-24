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
