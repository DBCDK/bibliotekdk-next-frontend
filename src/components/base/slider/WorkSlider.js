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
import { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import Swiper from "react-id-swiper";
import useWindowSize from "@/lib/useWindowSize";
import styles from "./WorkSlider.module.css";
import Card from "@/components/base/card";
import { ArrowLeft } from "@/components/base/arrow/ArrowLeft";
import { ArrowRight } from "@/components/base/arrow/ArrowRight";

/**
 * converts a list of manifestations to a list of "works"
 */
function manifestationsToWorks(manifestations) {
  return manifestations.map((m) => ({
    workId: `work-of:${m.manifestation.pid}`,
    ...m.manifestation,
    manifestations: { all: [{ cover: m.manifestation.cover }] },
  }));
}

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
function hashCode(str) {
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

// A map containing a progres for each slider
const storedProgress = {};

// A map containing the maximum progress sliders have been in
const storedProgressMax = {};

/**
 * The work slider React component
 *
 * @param skeleton
 * @param onWorkClick
 * @param {Object} props
 * @param {Array.<Object>} props.works
 *
 * @returns {JSX.Element}
 */
export default function WorkSlider({
  skeleton,
  works,
  manifestations,
  onWorkClick,
  ...props
}) {
  // supports both works and manifestations
  works = works || manifestationsToWorks(manifestations);

  // Setup a window resize listener, triggering a component
  // rerender, when window size changes.
  useWindowSize();

  // Ref to the swiper instance
  const swiperRef = useRef(null);

  // Ref to the first work card
  const cardRef = useRef(null);

  // The bounding rectangel for the swiper DOM element
  const swiperRect = swiperRef.current
    ? swiperRef.current.getBoundingClientRect()
    : null;

  // The bounding rectangel for the first work card DOM element
  const cardRect = cardRef.current
    ? cardRef.current.getBoundingClientRect()
    : null;

  // Variables used for enabling/disabling prev/next buttons
  const [{ progress }, setPosition] = useState({});

  // The number of cards to slide in one swipe (or clicking next/prev)
  // Calculated based on width of swiper and width of a card
  const slidesPerGroup =
    swiperRect && cardRect ? Math.floor(swiperRect.width / cardRect.width) : 1;

  const isBeginning = progress === 0;
  const isEnd = progress === 1 || works?.length <= slidesPerGroup;

  // Generate hash to uniquely identify this list of works
  const hash = useMemo(
    () => hashCode(works.map((work) => work.workId).join("")),
    [works]
  );

  // Store progress for slider
  useEffect(() => {
    if (typeof progress === "number") {
      storedProgress[hash] = progress;
      storedProgressMax[hash] = Math.max(
        storedProgressMax[hash] || 0,
        progress
      );
    }
  }, [progress]);

  // Update slidesPerGroup
  // Restore progress for slider
  useEffect(() => {
    if (!swiperRef.current?.swiper) {
      return;
    }
    swiperRef.current.swiper.params.slidesPerGroup = slidesPerGroup;
    swiperRef.current.swiper.update();
    if (slidesPerGroup > 1 && storedProgress[hash]) {
      swiperRef.current.swiper.setProgress(storedProgress[hash], 0);
    }
  }, [works, slidesPerGroup]);

  // If there is enough room to the left of the slider,
  // we move the left arrow a bit to the left
  const leftAdjustArrow = swiperRect ? swiperRect.left > 100 : true;

  // The Swiper params
  const params = {
    slidesPerView: "auto",
    slidesPerGroup,
    on: {
      init: (swiper) => {
        // We update progress on init
        setPosition({
          progress: storedProgressMax[hash] || Math.min(swiper.progress, 0),
        });
      },
      activeIndexChange: (swiper) => {
        setPosition({
          progress: swiper.progress,
        });
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

  if (skeleton) {
    return <WorkSliderSkeleton />;
  }

  // And finally we return the React component
  return (
    <div className={styles.WorkSlider} data-cy={props["data-cy"]}>
      <Swiper {...params} ref={swiperRef}>
        {works.map((work, idx) => {
          const cover = work?.manifestations?.all.find(
            (manifestation) => manifestation?.cover?.detail
          )?.cover;

          return (
            <Card
              cardRef={idx === 0 && cardRef}
              cover={cover}
              creators={work?.creators}
              workId={work?.workId}
              title={work?.titles?.main?.[0]}
              type={work?.materialTypes?.[0]?.specific}
              key={work.workId}
              className={styles.SlideWrapper}
              onFocus={() => {
                // Make sure focused card become visible
                // when tabbing through.
                swiperRef.current.swiper.slideTo(idx);
              }}
              onClick={() => {
                if (onWorkClick) {
                  // Find all the works that have been shown for this slider
                  const shownWorks = works
                    .map((work) => work.workId)
                    .slice(
                      0,
                      Math.max(
                        Math.ceil(storedProgressMax[hash] * works.length),
                        slidesPerGroup,
                        idx
                      ) + 1
                    );
                  onWorkClick(work, shownWorks, idx);
                }
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
    </div>
  );
}
WorkSlider.propTypes = {
  skeleton: PropTypes.bool,
  works: PropTypes.array,
  onWorkClick: PropTypes.func,
  "data-cy": PropTypes.string,
};
