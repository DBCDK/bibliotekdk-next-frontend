import React, {
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { useData } from "@/lib/api/api";
import * as manifestationFragments from "@/lib/api/manifestation.fragments";
import Skeleton from "@/components/base/skeleton";
import Text from "@/components/base/text";
import styles from "./CoverCarousel.module.css";
import {
  getManifestationsWithCorrectCover,
  getTextDescription,
  moveCarousel,
} from "@/components/work/overview/covercarousel/utils";
import useElementVisible from "@/components/hooks/useElementVisible";
import { Arrow } from "@/components/work/overview/covercarousel/arrow/Arrow";
import { DotHandler } from "@/components/work/overview/covercarousel/dothandler/DotHandler";
import useScrollSlider from "@/components/hooks/useScrollSlider";
import { scrollToElement } from "@/components/base/scrollsnapslider/utils";
import range from "lodash/range";
import { flattenMaterialType } from "@/lib/manifestationFactoryUtils";
import Custom404 from "@/pages/404";
import Translate from "@/components/base/translate";
import cx from "classnames";

const CoverElement = forwardRef(function CoverElement(
  { thisIndex, manifestation, fullTitle, setVisibleElement, sliderId },
  carouselRef
) {
  const { elementRef, isVisible } = useElementVisible({
    root: carouselRef,
    rootMargin: "500px 0px 500px 0px",
    threshold: 0.9,
  });

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setVisibleElement((prev) => prev !== thisIndex && thisIndex);
    }
  }, [isVisible, thisIndex, manifestation]);

  const src = manifestation?.cover?.detail;

  return (
    <div
      ref={elementRef}
      id={`${sliderId}-${thisIndex}`}
      className={`${styles.cover_element}`}
      data-cy={"cover_carousel"}
      title={fullTitle}
    >
      <img
        src={src}
        className={`${styles.cover_image} ${
          !loaded && styles.cover_image_skeleton
        }`}
        onLoad={() => setLoaded(true)}
        alt={""}
      />
      <Text>
        {getTextDescription(flattenMaterialType(manifestation), manifestation)}
      </Text>
    </div>
  );
});

/**
 * CoverCarousel
 * @param {Array} manifestations
 * @param {Object} workTitles
 * @param sliderId
 * @param maxLength
 * @returns {React.ReactElement | null}
 */
export function CoverCarousel({
  manifestations,
  workTitles,
  sliderId = "slide",
  maxLength = 10,
}) {
  const carouselId = useId();
  const carouselRef = useRef(null);

  const {
    visibleElement,
    sliderElementId,
    setVisibleElement,
    index: currentIndex,
  } = useScrollSlider({
    sliderId: sliderId,
    parentRef: carouselRef,
    disableScrollRestoration: true,
  });

  const length = manifestations?.length;

  function clickCallback(newIndex) {
    scrollToElement(sliderElementId(newIndex, sliderId));
  }

  return (
    <div className={styles.full_cover_carousel}>
      <div
        className={`${styles.carousel} ${styles.grid_cover_area}`}
        ref={carouselRef}
        id={carouselId}
        tabIndex="0"
        alt=""
        role="slider"
        aria-label={Translate({
          context: "general",
          label: "image-carousel-label",
        })}
        aria-valuemin={1}
        aria-valuemax={length}
        aria-valuenow={currentIndex + 1}
      >
        {range(0, length, 1)?.map((value, idx) => {
          return (
            <CoverElement
              key={idx}
              thisIndex={idx}
              manifestation={manifestations?.[idx]}
              fullTitle={workTitles?.full}
              setVisibleElement={setVisibleElement}
              sliderId={sliderId}
              carouselRef={carouselRef}
            />
          );
        })}
      </div>
      {length > 1 && (
        <>
          <Arrow
            clickCallback={() =>
              clickCallback(moveCarousel(-1, length, visibleElement))
            }
            orientation={"left"}
            arrowClass={cx(styles.left_arrow, styles.arrow_styling)}
            dataDisabled={!(visibleElement > 0)}
            tabIndex={-1}
          />
          <Arrow
            clickCallback={() =>
              clickCallback(moveCarousel(1, length, visibleElement))
            }
            orientation={"right"}
            arrowClass={cx(styles.right_arrow, styles.arrow_styling)}
            dataDisabled={!(visibleElement < length - 1)}
            tabIndex={-1}
          />
          <div className={styles.dots}>
            <DotHandler
              clickCallback={(newIndex) => clickCallback(newIndex)}
              index={visibleElement}
              length={length}
              maxLength={maxLength}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default function Wrap({ allPids, selectedPids, workTitles }) {
  const {
    data: manifestationsData,
    isLoading: manifestationsIsLoading,
    error: manifestationsError,
  } = useData(
    selectedPids?.length > 0 &&
      manifestationFragments.editionManifestations({
        pid: allPids,
      })
  );

  const { manifestationsWithCover } = useMemo(() => {
    return getManifestationsWithCorrectCover(
      manifestationsData?.manifestations?.filter((manifestation) =>
        selectedPids?.includes(manifestation?.pid)
      )
    );
  }, [manifestationsData?.manifestations, selectedPids]);

  if (manifestationsError) {
    return <Custom404 />;
  }

  if (manifestationsIsLoading) {
    return <Skeleton className={styles.carousel_skeleton} />;
  }

  return (
    <CoverCarousel
      manifestations={manifestationsWithCover}
      workTitles={workTitles}
    />
  );
}
