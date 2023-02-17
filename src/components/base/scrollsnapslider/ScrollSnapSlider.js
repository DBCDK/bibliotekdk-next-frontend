import { Arrow } from "@/components/work/overview/covercarousel/arrow/Arrow";
import { scrollDistance } from "@/components/work/overview/covercarousel/utils";
import styles from "./ScrollSnapSlider.module.css";
import { useRef, useState } from "react";
import useScrollSlider from "@/components/hooks/useScrollSlider";
import debounce from "lodash/debounce";

function scrollSetter(target) {
  return {
    x: target.scrollLeft,
    y: target.scrollTop,
    scrollableWidth: target.scrollWidth - target.offsetWidth,
    scrollableHeight: target.scrollHeight - target.offsetHeight,
  };
}

export default function ScrollSnapSlider({
  sliderId,
  slideDistance = 600,
  children,
}) {
  const parentRef = useRef(null);
  const [scroll, setScroll] = useState({
    x: parentRef?.current?.scrollLeft || 0,
    y: parentRef?.current?.scrollTop || 0,
    scrollableWidth:
      parentRef?.current?.scrollWidth - parentRef?.current?.offsetWidth || 1,
    scrollableHeight:
      parentRef?.current?.scrollHeight - parentRef?.current?.offsetHeight || 1,
  });

  useScrollSlider({
    sliderId: sliderId,
    parentRef: parentRef,
  });

  return (
    <div className={`${styles.flex_row}`}>
      <>
        <Arrow
          arrowClass={`${styles.flex_arrow}`}
          orientation={"left"}
          clickCallback={() => scrollDistance(sliderId, -slideDistance)}
          dataDisabled={scroll.x === 0}
        />
        <div
          ref={parentRef}
          id={sliderId}
          onScroll={debounce(
            (event) => event?.target && setScroll(scrollSetter(event?.target)),
            scroll?.x === 0 || scroll?.x === scroll?.scrollableWidth ? 0 : 200
          )}
          className={`${styles.flex_box}`}
        >
          {children}
        </div>
        <Arrow
          arrowClass={styles.flex_arrow}
          orientation={"right"}
          clickCallback={() => scrollDistance(sliderId, slideDistance)}
          dataDisabled={scroll.x === scroll?.scrollableWidth}
        />
      </>
    </div>
  );
}
