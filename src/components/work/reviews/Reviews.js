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
import { getScrollToNextCoveredChild } from "@/components/base/scrollsnapslider/utils";

/**
 * The Component function
 *
 * @param {Object} props
 * See propTypes for specific props and types
 *
 * @returns {JSX.Element}
 */
export function Reviews({ data = [], isLoading = false }) {
  // Translate Context
  const sliderId = "review_scrollSnapSlider";

  const context = { context: "reviews" };

  const reviews = useMemo(
    () => [...data?.relations?.hasReview].sort(sortReviews),
    [data]
  );

  const isLoadingClass = isLoading ? styles.skeleton : "";

  // Setup a window resize listener, triggering a component
  // rerender, when window size changes.
  useWindowSize();

  return (
    <Section
      className={`${styles.reviews} ${isLoadingClass}`}
      dataCy={cyKey({ name: "section", prefix: "reviews" })}
      isLoading={isLoading}
      title={Translate({
        ...context,
        label: "title",
        vars: [`${isLoading ? "..." : reviews.length}`],
      })}
      space={{ top: "var(--pt8)" }}
      backgroundColor="var(--parchment)"
    >
      <ScrollSnapSlider
        className={styles.sliderContainer}
        sliderId={sliderId}
        slideDistanceFunctionOverride={getScrollToNextCoveredChild}
        childContainerClassName={styles.slider}
        arrowClass={styles.arrow_overwrite}
      >
        {reviews
          .map((review, idx) => (
            <Item
              key={`review_item_${idx}`}
              idx={idx}
              data={review}
              work={data}
              isLoading={isLoading}
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
 * @param {Object} props
 *  See propTypes for specific props and types
 *
 * @returns {JSX.Element}
 */
export function ReviewsSkeleton(props) {
  const data = {
    relations: {
      hasReview: [
        {
          pid: "some:pid",
          access: [{ id: "1" }],
          creators: [{ display: "John Doe" }],
          hostPublication: { issue: "2015-08-15" },
          review: { rating: "4/6", reviewByLibrarians: [{ content: "..." }] },
        },
        {
          pid: "some:pid",
          access: [{ id: "1" }],
          creators: [{ display: "John Doe" }],
          hostPublication: { issue: "2015-08-15" },
          review: { rating: "4/6", reviewByLibrarians: [{ content: "..." }] },
        },
      ],
    },
  };

  const work = { workId: "1234", title: "Some title" };

  return (
    <Reviews
      {...props}
      data={data}
      work={work}
      className={`${props.className} ${styles.skeleton}`}
      isLoading={true}
    />
  );
}

/**
 *  Default export function of the Component
 *
 * @param {Object} props
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
