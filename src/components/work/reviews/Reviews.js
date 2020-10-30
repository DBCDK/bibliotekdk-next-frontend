import { useEffect, useRef, useState } from "react";
import Swiper from "react-id-swiper";
import PropTypes from "prop-types";
import { Container, Row, Col } from "react-bootstrap";
import { groupBy } from "lodash";

import useWindowSize from "../../../lib/useWindowSize";
import { useData } from "../../../lib/api/api";
import * as workFragments from "../../../lib/api/work.fragments";

import { cyKey } from "../../../utils/trim";

import Icon from "../../base/icon";
import Section from "../../base/section";
import Translate from "../../base/translate";

import InfomediaReview from "./types/infomedia";
import LitteratursidenReview from "./types/litteratursiden";
import MaterialReview from "./types/material";

import styles from "./Reviews.module.css";

/**
 * Selecting the correct review template
 *
 * @param {string} type
 * @returns {component}
 *
 */

function getTemplate(type) {
  switch (type) {
    case "MATERIALREVIEWS":
      return MaterialReview;
    case "LITTERATURSIDEN":
      return LitteratursidenReview;
    case "INFOMEDIA":
      return InfomediaReview;
    default:
      return InfomediaReview;
  }
}

/**
 * The left arrow React component
 *
 * @param {Object} props
 * @param {function} props.onClick OnClick handler
 * @param {boolean} props.disabled true if button is disabled
 * @param {boolean} props.leftAdjust true if there is for the button to the left
 *
 */
function ArrowLeft({ onClick, disabled, leftAdjust }) {
  return (
    <label
      className={`${styles.button} ${styles.left} ${
        leftAdjust && styles["left-adjust"]
      } ${disabled && styles.disabled}`}
      data-cy="arrow-left"
      onClick={onClick}
    >
      <Icon src={"arrowleft.svg"} size={5} bgColor={"transparent"} />
    </label>
  );
}
ArrowLeft.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  leftAdjust: PropTypes.bool,
};

/**
 * The right arrow React component
 *
 * @param {Object} props
 * @param {function} props.onClick OnClick handler
 * @param {boolean} props.disabled true if button is disabled
 *
 */
function ArrowRight({ onClick, disabled }) {
  return (
    <label
      className={`${styles.button} ${styles.right} ${
        disabled && styles.disabled
      }`}
      data-cy="arrow-right"
      onClick={onClick}
    >
      <Icon src={"arrowright.svg"} size={5} bgColor={"transparent"} />
    </label>
  );
}
ArrowRight.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export function Reviews({ className = "", data = [], skeleton = false }) {
  // Translate Context
  const context = { context: "reviews" };

  // Group data by reviewType
  const groups = groupBy(data, "reviewType");

  // const reviews = groups.INFOMEDIA.concat(groups.LITTERATURSIDEN);
  const reviews = [
    ...(groups.INFOMEDIA || []),
    ...(groups.LITTERATURSIDEN || []),
  ];

  const materialReviews = [...(groups.MATERIALREVIEWS || [])];

  materialReviews.forEach((m, i) => {
    if (i === 0) {
      reviews.unshift(m);
    } else {
      const pos = Math.floor(reviews.length / 3) * i;
      reviews.splice(pos, 0, m);
    }
  });

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

  const hasMaterialReview = !!(
    data[0] && data[0].reviewType === "MATERIALREVIEWS"
  );

  const mixedClass = hasMaterialReview ? styles.mixed : "";

  return (
    <Section
      className={`${styles.reviews}`}
      title={Translate({
        ...context,
        label: "title",
        vars: [`${reviews.length}`],
      })}
      bgColor="var(--parchment)"
    >
      <Swiper {...params} ref={swiperRef} className="hello">
        {reviews.map((review, idx) => {
          // const Review = InfomediaReview;
          const Review = getTemplate(review.reviewType);

          return (
            <Review
              skeleton={skeleton}
              key={`review-${idx}`}
              data={review}
              className={`${mixedClass} ${styles.SlideWrapper}`}
              onFocus={() => {
                // Make sure focused card become visible
                // when tabbing through.
                swiperRef.current.swiper.slideTo(idx);
              }}
            />
          );
        })}
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
 * @returns {component}
 */
export function ReviewsSkeleton(props) {
  const data = [
    {
      author: "Svend Svendsen",
      media: "Jyllandsposten",
      rating: "4/5",
      reviewType: "INFOMEDIA",
      url: "http://",
    },
    {
      author: "Svend Svendsen",
      media: "Jyllandsposten",
      rating: "4/5",
      reviewType: "INFOMEDIA",
      url: "http://",
    },
    {
      author: "Svend Svendsen",
      media: "Jyllandsposten",
      rating: "4/5",
      reviewType: "INFOMEDIA",
      url: "http://",
    },
  ];

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
 * @returns {component}
 */
export default function Wrap(props) {
  const { workId, type, skeleton } = props;

  // Call materialTypes mockdata API
  const { data, isLoading, error } = useData(workFragments.reviews({ workId }));

  if (isLoading) {
    return <ReviewsSkeleton />;
  }

  if (error) {
    return null;
  }

  return <Reviews {...props} data={data.work.reviews} />;
}

// PropTypes for component
Wrap.propTypes = {
  workId: PropTypes.string,
  type: PropTypes.string,
  skeleton: PropTypes.bool,
};
