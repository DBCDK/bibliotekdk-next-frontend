import { Arrow } from "@/components/work/overview/covercarousel/arrow/Arrow";
import styles from "./ScrollSnapSlider.module.css";
import { useEffect, useRef, useState } from "react";
import useScrollSlider from "@/components/hooks/useScrollSlider";
import debounce from "lodash/debounce";
import floor from "lodash/floor";
import {
  childSetter,
  getScrollToNextCoveredChild,
  scrollDistance,
  scrollSetter,
} from "@/components/base/scrollsnapslider/utils";

export default function ScrollSnapSlider({
  sliderId,
  slideDistanceOverride = null,
  children,
}) {
  const parentRef = useRef(null);
  const [containerScroll, setContainerScroll] = useState({});
  const [childScroll, setChildScroll] = useState([]);

  useEffect(() => {
    if (parentRef.current.childNodes) {
      setContainerScroll(scrollSetter(parentRef.current));
      setChildScroll(childSetter(parentRef.current.childNodes));
    }

    // OBS for Dependencies: Children are NECESSARY for render timing
  }, [children]);

  useScrollSlider({
    sliderId: sliderId,
    parentRef: parentRef,
  });

  function scrollFunction(orientation) {
    scrollDistance(
      sliderId,
      slideDistanceOverride ||
        getScrollToNextCoveredChild(orientation, childScroll, containerScroll)
    );
  }

  const debouncedOnScroll = debounce(
    (event) => event?.target && setContainerScroll(scrollSetter(event?.target)),
    // Debounce timing condition
    containerScroll?.x === 0 ||
      containerScroll?.x === containerScroll?.xScrollable
      ? 0
      : 200
  );

  return (
    <>
      <div className={`${styles.flex_row}`}>
        {containerScroll.xScrollable > 0 && (
          <Arrow
            arrowClass={`${styles.flex_arrow} ${styles.flex_arrow_left}`}
            orientation={"left"}
            clickCallback={() => scrollFunction("left")}
            dataDisabled={floor(containerScroll.x) <= 0}
          />
        )}
        <div
          ref={parentRef}
          id={sliderId}
          onScroll={debouncedOnScroll}
          className={`${styles.flex_box}`}
        >
          {children}
        </div>
        {containerScroll.xScrollable > 0 && (
          <Arrow
            arrowClass={`${styles.flex_arrow} ${styles.flex_arrow_right}`}
            orientation={"right"}
            clickCallback={() => scrollFunction("right")}
            dataDisabled={
              floor(containerScroll.xScrollable - containerScroll.x) <= 0
            }
          />
        )}
      </div>
    </>
  );
}
