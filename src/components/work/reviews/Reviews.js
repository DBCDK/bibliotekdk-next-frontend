import { useMemo } from "react";
import PropTypes from "prop-types";
import Col from "react-bootstrap/Col";

import useWindowSize from "@/lib/useWindowSize";
import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";

import { cyKey } from "@/utils/trim";

import Section from "@/components/base/section";
import Translate from "@/components/base/translate";

import InfomediaReview from "./types/infomedia";
import ExternalReview from "./types/external";
import MaterialReview from "./types/material";

import { sortReviews } from "./utils";
import styles from "./Reviews.module.css";

import ScrollSnapSlider from "@/components/base/scrollsnapslider/ScrollSnapSlider";
import { getScrollToNextFullWidth } from "@/components/base/scrollsnapslider/utils";
import range from "lodash/range";

/**
 * Selecting the correct review template
 *
 * @param review
 *
 * @returns {component}
 */

function getTemplate(review) {
  if (review.review?.reviewByLibrarians?.length > 0) {
    return MaterialReview;
  }

  if (review.access?.find((a) => a.__typename === "InfomediaService")) {
    return InfomediaReview;
  }

  return ExternalReview;
}

function ReviewFromTemplate({ review, idx, skeleton, title, workId }) {
  const Review = getTemplate(review);

  if (Review) {
    const skeletonReview = skeleton
      ? `${styles.skeleton} ${styles.custom}`
      : "";

    return (
      <div className={styles.only_content}>
        <Review
          skeleton={skeleton}
          key={`review-${idx}`}
          data={review}
          className={`${styles.SlideWrapper} ${skeletonReview}`}
          title={title}
          workId={workId}
        />
      </div>
    );
  }
}

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
  const workId = data?.workId;
  const title = data?.titles?.main?.[0];

  const reviews = useMemo(
    () => [...data?.relations?.hasReview].sort(sortReviews),
    [data]
  );

  const lectorReviews = reviews.filter(
    (review) => review?.review?.reviewByLibrarians?.length > 0
  );
  const otherReviews = reviews.filter(
    (review) => review?.review?.reviewByLibrarians?.length === 0
  );

  // Setup a window resize listener, triggering a component
  // rerender, when window size changes.
  useWindowSize();

  const ReviewFromTemplateWithProps = ({ review, idx }) => (
    <ReviewFromTemplate
      review={review}
      idx={idx}
      skeleton={skeleton}
      title={title}
      workId={workId}
    />
  );

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
        sliderId={sliderId}
        slideDistanceFunctionOverride={getScrollToNextFullWidth}
        childContainerClassName={styles.slider}
      >
        {lectorReviews
          .map((review, idx) => (
            <ReviewFromTemplateWithProps
              key={`review_lector_${idx}`}
              review={review}
              idx={idx}
            />
          ))
          .filter((valid) => valid)}
        {range(0, otherReviews.length, 3).map((review, idx) => (
          <Col key={"trio" + review + idx} xs={12} className={styles.trio}>
            {otherReviews.slice(idx * 3, idx * 3 + 3).map((review, idx2) => (
              <ReviewFromTemplateWithProps
                key={`review_non_lector_${idx2}`}
                review={review}
                idx={idx}
              />
            ))}
          </Col>
        ))}
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
