import { useEffect, useRef, useState } from "react";
import Swiper from "react-id-swiper";
import PropTypes from "prop-types";
import { Container, Row, Col } from "react-bootstrap";

import useWindowSize from "../../../lib/useWindowSize";
import { useData } from "../../../lib/api/api";
import * as workFragments from "../../../lib/api/work.fragments";

import { cyKey } from "../../../utils/trim";

import Section from "../../base/section";
import Translate from "../../base/translate";

import InfomediaReview from "./types/infomedia/InfomediaReview";
import MaterialReview from "./types/material/MaterialReview";

import styles from "./Reviews.module.css";

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

  // const Review = InfomediaReview;
  const Review = MaterialReview;

  // Setup a window resize listener, triggering a component
  // rerender, when window size changes.
  useWindowSize();

  // Ref to the swiper instance
  const swiperRef = useRef(null);

  // Ref to the first work card
  const reviewRef = useRef(null);

  // The bounding rectangel for the swiper DOM element
  const swiperRect = swiperRef.current
    ? swiperRef.current.getBoundingClientRect()
    : null;

  // The bounding rectangel for the first work card DOM element
  const reviewRect = reviewRef.current
    ? reviewRef.current.getBoundingClientRect()
    : null;

  // Variables used for enabling/disabling prev/next buttons
  const [{ isBeginning, isEnd }, setPosition] = useState({});

  // The number of cards to slide in one swipe (or clicking next/prev)
  // Calculated based on width of swiper and width of a card
  const slidesPerGroup =
    swiperRect && reviewRect
      ? Math.floor(swiperRect.width / reviewRect.width)
      : 1;

  // Update the swiper instance when slidesPerGroup changes
  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.swiper.params.slidesPerGroup = slidesPerGroup;
      swiperRef.current.swiper.update();
    }
  }, [slidesPerGroup]);

  // The Swiper params
  const params = {
    slidesPerView: 3,
    slidesPerGroup,
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
      clickable: true,
      renderBullet: (index, className) => {
        return '<span class="' + className + '">' + (index + 1) + "</span>";
      },
    },
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

  return (
    <Section
      title={Translate({ ...context, label: "title", vars: ["10"] })}
      bgColor="var(--parchment)"
    >
      <Swiper {...params} ref={swiperRef}>
        {data.map((review, idx) => {
          return (
            <Review
              reviewRef={idx === 0 && reviewRef}
              key={`review-${idx}`}
              data={review}
              className={styles.SlideWrapper}
              onFocus={() => {
                // Make sure focused card become visible
                // when tabbing through.
                swiperRef.current.swiper.slideTo(idx);
              }}
            />
          );
        })}
      </Swiper>
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
  const data = {};

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
