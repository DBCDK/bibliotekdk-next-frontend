import { useMemo } from "react";
import PropTypes from "prop-types";

import useWindowSize from "@/lib/useWindowSize";
import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";

import { cyKey } from "@/utils/trim";

import Section from "@/components/base/section";
import Translate from "@/components/base/translate";

import Item from "./item";

import { sortReviews } from "./utils";
import styles from "./Reviews.module.css";

import ScrollSnapSlider from "@/components/base/scrollsnapslider/ScrollSnapSlider";
import { getScrollToNextFullWidth } from "@/components/base/scrollsnapslider/utils";

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {JSX.Element}
 */
export function Reviews({ data = [], skeleton = false }) {
  // Translate Context
  const sliderId = "review_scrollSnapSlider";

  const context = { context: "reviews" };

  const reviews = useMemo(
    () => [...data?.relations?.hasReview].sort(sortReviews),
    [data]
  );

  // Setup a window resize listener, triggering a component
  // rerender, when window size changes.
  useWindowSize();

  return (
    <Section
      className={`${styles.reviews}`}
      dataCy={cyKey({ name: "section", prefix: "reviews" })}
      title={Translate({
        ...context,
        label: "title",
        vars: [`${skeleton ? "..." : reviews.length}`],
      })}
      space={{ top: "var(--pt8)" }}
      backgroundColor="var(--parchment)"
    >
      <ScrollSnapSlider
        className={styles.sliderContainer}
        sliderId={sliderId}
        slideDistanceFunctionOverride={getScrollToNextFullWidth}
        childContainerClassName={styles.slider}
        arrowClass={styles.arrow_overwrite}
      >
        {reviews
          .map((review, idx) => (
            <Item
              key={`review_item_${idx}`}
              data={review}
              work={data}
              skeleton={skeleton}
            />
          ))
          .filter((valid) => valid)}
      </ScrollSnapSlider>
    </Section>
  );
}

/**
 * Function to return skeleton (Loading) version of the Component
 *
 * @param {obj} props
 *  See propTypes for specific props and types
 *
 * @returns {JSX.Element}
 */
export function ReviewsSkeleton(props) {
  const data = {
    relations: {
      hasReview: [{ access: [], review: { reviewByLibrarians: [{}] } }],
    },
  };

  return (
    <Reviews
      {...props}
      data={data}
      className={`${props.className} ${styles.skeleton}`}
      skeleton={true}
    />
  );
}

/**
 *  Default export function of the Component
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {JSX.Element}
 */
export default function Wrap(props) {
  const { workId } = props;

  const { data, isLoading, error } = useData(workFragments.reviews({ workId }));

  if (isLoading) {
    return <ReviewsSkeleton />;
  }

  if (error) {
    return null;
  }

  if (!data?.work?.relations?.hasReview?.length) {
    return null;
  }

  // we need a workid
  return <Reviews {...props} data={data.work} />;
}

// PropTypes for component
Wrap.propTypes = {
  workId: PropTypes.string,
  type: PropTypes.string,
  skeleton: PropTypes.bool,
};
