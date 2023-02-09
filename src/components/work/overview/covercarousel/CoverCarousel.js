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
  scrollToElement,
} from "@/components/work/overview/covercarousel/utils";
import { range } from "lodash";
import useElementVisible from "@/components/hooks/useElementVisible";
import { Arrow } from "@/components/work/overview/covercarousel/arrow/Arrow";
import { DotHandler } from "@/components/work/overview/covercarousel/dothandler/DotHandler";
import Translate from "@/components/base/translate";

const CoverElement = forwardRef(function CoverElement(
  {
    thisIndex,
    manifestations,
    materialType,
    fullTitle,
    visibleElement,
    setVisibleElement,
  },
  carouselRef
) {
  const { elementRef, isVisible } = useElementVisible({
    root: carouselRef,
    rootMargin: "4000px 0px 4000px 0px",
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
      id={`slide-${thisIndex}`}
      className={`${styles.cover_element} ${isVisible && styles.active_cover}`}
    >
      {/*<Cover src={manifestations?.[thisIndex]?.cover?.detail} size="fill-width">*/}
      {/*<Bookmark title={fullTitle?.[0]} />*/}
      {/*</Cover>*/}
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
export function CoverCarousel({ manifestations, materialType, workTitles }) {
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
              carouselRef={carouselRef}
            />
          );
        })}
      </div>
      {length > 1 && (
        <>
          <div className={styles.left_arrow}>
            <Arrow
              clickCallback={() =>
                visibleElement === index &&
                scrollToElement(moveCarousel(-1, length, index))
              }
              orientation={"left"}
              arrowClass={index > 0 ? styles.icon : styles.disabled_icon}
            />
          </div>
          <div className={styles.right_arrow}>
            <Arrow
              clickCallback={() =>
                visibleElement === index &&
                scrollToElement(moveCarousel(1, length, index))
              }
              orientation={"right"}
              arrowClass={
                index < length - 1 ? styles.icon : styles.disabled_icon
              }
            />
          </div>
          <div className={styles.dots}>
            <DotHandler
              index={index}
              visibleElement={visibleElement}
              length={length}
              clickCallback={(newIndex) => scrollToElement(newIndex)}
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
    <Skeleton className={styles.image_skeleton} />;
  }

  return (
    <CoverCarousel
      manifestations={manifestationsWithCover}
      materialType={materialType}
      workTitles={workTitles}
    />
  );
}
