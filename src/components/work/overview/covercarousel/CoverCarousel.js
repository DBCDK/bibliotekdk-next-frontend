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

const CoverElement = forwardRef(function CoverElement(
  {
    thisIndex,
    manifestation,
    materialType,
    fullTitle,
    setVisibleElement,
    sliderId,
  },
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
        className={loaded ? styles.cover_image : styles.cover_image_skeleton}
        onLoad={() => setLoaded(true)}
        alt={""}
      />
      <Text>{getTextDescription(materialType, manifestation)}</Text>
    </div>
  );
});

/**
 * CoverCarousel
 * @param {array} manifestations
 * @param {array} materialType
 * @param {object} workTitles
 * @param {string} iconStyle
 * @return {JSX.Element}
 */
export function CoverCarousel({
  manifestations,
  materialType,
  workTitles,
  sliderId = "slide",
  maxLength = 10,
}) {
  const carouselId = useId();
  const carouselRef = useRef(null);

  const { visibleElement, sliderElementId, setVisibleElement } =
    useScrollSlider({
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
      >
        {range(0, length, 1)?.map((value, idx) => {
          return (
            <CoverElement
              key={idx}
              thisIndex={idx}
              manifestations={manifestations}
              manifestation={manifestations?.[idx]}
              fullTitle={workTitles?.full}
              materialType={materialType}
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
            arrowClass={`${styles.arrow_styling} ${styles.left_arrow}`}
            dataDisabled={!(visibleElement > 0)}
          />
          <Arrow
            clickCallback={() =>
              clickCallback(moveCarousel(1, length, visibleElement))
            }
            orientation={"right"}
            arrowClass={`${styles.arrow_styling} ${styles.right_arrow}`}
            dataDisabled={!(visibleElement < length - 1)}
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

export default function Wrap({ selectedPids, workTitles }) {
  const { data: manifestationsData, isLoading: manifestationsIsLoading } =
    useData(
      selectedPids?.length > 0 &&
        manifestationFragments.editionManifestations({
          pid: selectedPids,
        })
    );

  const { manifestationsWithCover, materialType } = useMemo(() => {
    return getManifestationsWithCorrectCover(
      manifestationsData?.manifestations
    );
  }, [manifestationsData?.manifestations]);

  if (manifestationsIsLoading) {
    <Skeleton className={styles.carousel_skeleton} />;
  }

  return (
    <CoverCarousel
      manifestations={manifestationsWithCover}
      materialType={materialType}
      workTitles={workTitles}
    />
  );
}
