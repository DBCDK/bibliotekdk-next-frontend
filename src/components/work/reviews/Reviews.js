import { useRef, useState, useMemo } from "react";
import Swiper from "react-id-swiper";
import PropTypes from "prop-types";

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

import { ArrowLeft } from "@/components/base/arrow/ArrowLeft";
import { ArrowRight } from "@/components/base/arrow/ArrowRight";

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {JSX.Element}
 */
export function Reviews({ className = "", data = [], skeleton = false }) {
  // Translate Context
  const context = { context: "reviews" };
  const workId = data?.workId;
  const title = data?.titles?.main?.[0];
  const reviews = data?.relations?.hasReview;

  // Setup a window resize listener, triggering a component
  // rerender, when window size changes.
  useWindowSize();

  // Ref to the swiper instance
  const swiperRef = useRef(null);

  // The bounding rectangel for the swiper DOM element
  const swiperRect = swiperRef.current
    ? swiperRef.current.getBoundingClientRect()
    : null;

  // Variables used for enabling/disabling prev/next buttons
  const [{ isBeginning, isEnd }, setPosition] = useState({});

  // If there is enough room to the left of the slider,
  // we move the left arrow a bit to the left
  const leftAdjustArrow = swiperRect ? swiperRect.left > 100 : true;

  // The Swiper params
  const params = {
    slidesPerView: "auto",
    slidesPerGroup: 1,
    on: {
      init: (swiper) => {
        // We update isBeginning and isEnd on init
        setPosition({ isBeginning: swiper.isBeginning, isEnd: swiper.isEnd });
      },
      transitionStart: (swiper) => {
        // We update isBeginning and isEnd when user interacts with swiper
        setPosition({ isBeginning: swiper.isBeginning, isEnd: swiper.isEnd });
      },
    },
  };

  /**
   * Slide forward
   */
  function nextHandler() {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  }

  /**
   * Slide backwards
   */
  function prevHandler() {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  }

  const reviewElements = [];

  reviews.forEach((review, idx) => {
    const skeletonReview = skeleton
      ? `${styles.skeleton} ${styles.custom}`
      : "";

    const props = {
      title,
      workId,
      skeleton,
      key: `review-${idx}`,
      data: review,
      className: `${styles.SlideWrapper} ${skeletonReview}`,
      onFocus: () => {
        // Make sure focused card become visible
        // when tabbing through.
        swiperRef.current.swiper.slideTo(idx);
      },
    };

    review.review?.reviewByLibrarians?.forEach((lib, idx) => {
      reviewElements.push(<MaterialReview idx={idx} {...props} />);
    });

    if (review.access?.find((a) => a.__typename === "InfomediaService")) {
      reviewElements.push(<InfomediaReview {...props} />);
    }

    if (review.access?.find((a) => a.__typename === "AccessUrl")) {
      reviewElements.push(<ExternalReview {...props} />);
    }
  });

  // const sortedElements = useMemo(
  //   () => reviewElements.sort(sortReviews),
  //   [data]
  // );

  const sortedElements = reviewElements.sort(sortReviews);

  return (
    <Section
      className={`${styles.reviews} ${className}`}
      dataCy={cyKey({ name: "section", prefix: "reviews" })}
      title={Translate({
        ...context,
        label: "title",
        vars: [`${skeleton ? "..." : reviews.length}`],
      })}
      space={{ top: "var(--pt8)" }}
      backgroundColor="var(--parchment)"
    >
      <Swiper {...params} ref={swiperRef}>
        {sortedElements}
      </Swiper>

      <ArrowLeft
        onClick={prevHandler}
        disabled={isBeginning}
        leftAdjust={leftAdjustArrow}
      />
      <ArrowRight onClick={nextHandler} disabled={isEnd} />
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
