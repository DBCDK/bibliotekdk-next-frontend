/**
 * @file The work slider
 *
 * Accessibility decisions:
 * - Prev/next buttons are clickable via mouse or touch only,
 *   they are not focusable
 * - Each card is focusable
 * - Slider will automatically scroll to card in focus,
 *   when tabbing through cards
 */
import { useId } from "react";
import PropTypes from "prop-types";
import useWindowSize from "@/lib/useWindowSize";
import styles from "./WorkSlider.module.css";
import Card from "@/components/base/card";
import MaterialCard from "@/components/base/materialcard/MaterialCard";
import { templateForVerticalWorkCard } from "@/components/base/materialcard/templates/templates";
import ScrollSnapSlider from "@/components/base/scrollsnapslider/ScrollSnapSlider";
import { useBundledElementVisibleById } from "@/components/hooks/useElementVisible";
import isEmpty from "lodash/isEmpty";

/**
 * The work slider skeleton React component
 */
function WorkSliderSkeleton() {
  // Number of skeleton cards to show
  const numElements = 10;
  return (
    <div className={`${styles.WorkSlider} ${styles.skeleton}`}>
      {Array.apply(null, Array(numElements)).map((el, idx) => (
        <Card key={idx} className={styles.SlideWrapper} skeleton={true} />
      ))}
    </div>
  );
}

/**
 * Returns hashcode from string.
 * Found online
 * @param {string} str
 * @returns {string}
 */
export function hashCode(str) {
  return (
    str
      .split("")
      .reduce(
        (prevHash, currVal) =>
          ((prevHash << 5) - prevHash + currVal.charCodeAt(0)) | 0,
        0
      ) + ""
  );
}

/**
 * The work slider React component
 *
 * @param skeleton
 * @param onWorkClick
 * @param {function} propsAndChildrenTemplate
 * @param {Array.<Object.<string, any>>} propsAndChildrenInputList
 * @param {Array.<Object>} works
 * @param props
 *
 * @returns {React.JSX.Element}
 */
export default function WorkSlider({
  skeleton,
  works,
  onWorkClick,
  propsAndChildrenTemplate = templateForVerticalWorkCard,
  propsAndChildrenInputList = [],
  ...props
}) {
  // Setup a window resize listener, triggering a component
  // rerender, when window size changes.
  useWindowSize();

  const sliderId = useId();

  const { elementRef, hasBeenSeen } = useBundledElementVisibleById({
    rootId: sliderId,
    rootMargin: "1px",
    threshold: 1,
  });

  function onClick(work, idx) {
    if (onWorkClick) {
      const shownWorks = Array.from(hasBeenSeen, ([name]) => name);
      // Find all the works that have been shown for this slider
      onWorkClick(work, shownWorks, idx);
    }
  }

  if (skeleton) {
    return <WorkSliderSkeleton />;
  }

  const inputList = !isEmpty(propsAndChildrenInputList)
    ? propsAndChildrenInputList
    : works?.map((work) => {
        return {
          material: work,
        };
      });

  // And finally we return the React component
  return (
    <div
      className={styles.WorkSlider}
      data-cy={props["data-cy"]}
      key={sliderId}
    >
      <ScrollSnapSlider
        sliderId={sliderId}
        childContainerClassName={styles.SlideChildren}
      >
        {inputList?.map((input, idx) => {
          return (
            <MaterialCard
              key={idx}
              propAndChildrenTemplate={
                input?.propsAndChildrenTemplate || propsAndChildrenTemplate
              }
              propAndChildrenInput={input}
              colSizing={{ xs: 4, sm: 3, md: 2, lg: 2 }}
              onClick={() => onClick(input.material, idx)}
              ref={(element) => (elementRef.current[idx] = element)}
            />
          );
        })}
      </ScrollSnapSlider>
    </div>
  );
}
WorkSlider.propTypes = {
  skeleton: PropTypes.bool,
  works: PropTypes.array,
  onWorkClick: PropTypes.func,
  "data-cy": PropTypes.string,
};
