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
  getIndicesForCoverCarousel,
  getTextDescription,
  moveCarousel,
  scrollToElement,
} from "@/components/work/overview/covercarousel/utils";
import useElementVisible from "@/components/hooks/useElementVisible";
import { Arrow } from "@/components/work/overview/covercarousel/arrow/Arrow";
import { DotHandler } from "@/components/work/overview/covercarousel/dothandler/DotHandler";
import Translate from "@/components/base/translate";
import RangeSlider from "@/components/work/overview/covercarousel/rangeslider/RangeSlider";
import range from "lodash/range";
import at from "lodash/at";

const CoverElement = forwardRef(function CoverElement(
  {
    thisIndex,
    manifestations,
    materialType,
    fullTitle,
    visibleElement,
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

  useEffect(() => {
    if (visibleElement !== thisIndex && isVisible) {
      setVisibleElement(thisIndex);
    }
  }, [isVisible, thisIndex, visibleElement]);

  return (
    <div
      ref={elementRef}
      id={`${sliderId}-${thisIndex}`}
      className={`${styles.cover_element} ${isVisible && styles.active_cover}`}
      data-cy={"cover_carousel"}
    >
      <img
        src={manifestations?.[thisIndex]?.cover?.detail}
        className={styles.cover_image}
        title={fullTitle}
        alt={Translate({ context: "general", label: "frontpage" })}
      />
      <Text>
        {getTextDescription(materialType, manifestations?.[thisIndex])}
      </Text>
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
  const [index, setIndex] = useState(0);
  const [visibleElement, setVisibleElement] = useState(0);
  const carouselId = useId();
  const carouselRef = useRef(null);

  useEffect(() => {
    if (visibleElement !== index) {
      setIndex(visibleElement);
    }
  }, [visibleElement]);

  const length = manifestations?.length;

  function clickCallback(newIndex) {
    visibleElement === index && scrollToElement(newIndex, sliderId);
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
              fullTitle={workTitles?.full}
              materialType={materialType}
              visibleElement={visibleElement}
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
            clickCallback={() => clickCallback(moveCarousel(-1, length, index))}
            orientation={"left"}
            arrowClass={`${styles.arrow_styling} ${styles.left_arrow}`}
            dataDisabled={!(index > 0)}
          />
          <Arrow
            clickCallback={() => clickCallback(moveCarousel(1, length, index))}
            orientation={"right"}
            arrowClass={`${styles.arrow_styling} ${styles.right_arrow}`}
            dataDisabled={!(index < length - 1)}
          />
          <div className={styles.dots}>
            {maxLength >= length ? (
              <DotHandler
                clickCallback={(newIndex) => clickCallback(newIndex)}
                index={index}
                length={length}
              />
            ) : (
              <RangeSlider
                clickCallback={(newIndex) => clickCallback(newIndex)}
                index={index}
                length={length}
              />
            )}
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

  const manifestations =
    manifestationsWithCover &&
    at(
      manifestationsWithCover,
      getIndicesForCoverCarousel(manifestationsWithCover?.length)
    );

  if (manifestationsIsLoading) {
    <Skeleton className={styles.image_skeleton} />;
  }

  return (
    <CoverCarousel
      manifestations={manifestations}
      materialType={materialType}
      workTitles={workTitles}
    />
  );
}
