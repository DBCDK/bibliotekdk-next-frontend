import PropTypes from "prop-types";

import Section from "@/components/base/section";
import Text from "@/components/base/text";
import Title from "@/components/base/title";
import Link from "@/components/base/link";
import Icon from "@/components/base/icon";
import Translate from "@/components/base/translate";
import { Rating } from "@/components/base/rating/Rating";
import Cover from "@/components/base/cover/Cover";
import { getInfomediaReviewUrl, getWorkUrl } from "@/lib/utils";
import { getCoverImage } from "@/components/utils/getCoverImage";
import { useData } from "@/lib/api/api";
import { reviewsForCreator } from "@/lib/api/creator.fragments";

import ScrollSnapSlider from "@/components/base/scrollsnapslider/ScrollSnapSlider";
import { getScrollToNextCoveredChild } from "@/components/base/scrollsnapslider/utils";
import styles from "./Favorites.module.css";
import { useMemo } from "react";

/**
 * Parse ISO date strings (YYYY-MM-DD) and mark validity for sorting.
 */
function parseIssueISO(issue) {
  if (!issue || typeof issue !== "string") return { valid: false, value: null };
  const isIso = /^\d{4}-\d{2}-\d{2}$/.test(issue);
  if (!isIso) return { valid: false, value: null };
  const d = new Date(issue);
  return Number.isNaN(d?.getTime?.())
    ? { valid: false, value: null }
    : { valid: true, value: d };
}

/**
 * Check that a review is from Infomedia and has a rating.
 */
function isInfomediaWithRating(review) {
  return (
    review?.access?.some((a) => a?.__typename === "InfomediaService") &&
    !!review?.review?.rating
  );
}

/**
 * Convert rating like "4/6" to a 0..1 percentage value.
 */
function toRatingPercentage(review) {
  const [first, last] = review?.review?.rating?.split?.("/") || [];
  const num = Number(first);
  const den = Number(last);
  return num && den ? num / den : 0;
}

/**
 * Pick the best review by rating percentage, only above a threshold.
 */
function selectBestReview(reviews = []) {
  return reviews
    .filter(isInfomediaWithRating)
    .map((r) => ({ ...r, ratingPercentage: toRatingPercentage(r) }))
    .filter((r) => r.ratingPercentage > 0.5)
    .sort((a, b) => b.ratingPercentage - a.ratingPercentage)?.[0];
}

/**
 * Map a work to its selected review and parsed publication date.
 */
function mapWorkToReview(work) {
  const bestReview = selectBestReview(work?.relations?.hasReview || []);
  const { valid, value } = parseIssueISO(bestReview?.hostPublication?.issue);
  return {
    work,
    review: bestReview,
    __parsedDateValid: valid,
    __parsedDate: value,
  };
}

/**
 * Sort so valid dates come first, newest to oldest.
 */
function compareByValidDateDesc(a, b) {
  if (a.__parsedDateValid !== b.__parsedDateValid) {
    return a.__parsedDateValid ? -1 : 1; // valid dates first
  }
  if (a.__parsedDate && b.__parsedDate) {
    return b.__parsedDate - a.__parsedDate; // newest first
  }
  return 0;
}

/**
 * Map the selected work+review pair into the Favorites UI item shape.
 */
function mapToFavoritesItem({ work, review }) {
  const mainTitle = Array.isArray(work?.titles?.main)
    ? work?.titles?.main?.[0]
    : work?.titles?.main;
  const accessInf = review?.access?.find(
    (a) => a?.__typename === "InfomediaService"
  );
  const coverDetail = getCoverImage(
    work?.manifestations?.mostRelevant || work?.manifestations?.all
  )?.detail;
  const reviewerName = review?.creators
    ?.map((c) => c?.display)
    ?.filter(Boolean)
    ?.join(", ");
  const workHref = getWorkUrl(
    mainTitle || "",
    work?.creators || [],
    work?.workId,
    undefined,
    true
  );

  return {
    title: review?.hostPublication?.title || "",
    subtitle: reviewerName || "",
    rating: review?.review?.rating || "",
    date: review?.hostPublication?.issue || "",
    workTitle: mainTitle || "",
    workId: work?.workId || "",
    infomediaId: accessInf?.id || "",
    cover: coverDetail || null,
    workHref,
  };
}

/**
 * Renders a slider of reviewer favorites for a creator (dummy data for now).
 *
 * @param {Object} props
 * @param {Array} [props.data=[]] Items to render in the slider
 * @param {boolean} [props.isLoading=false] Show skeleton state
 * @returns {JSX.Element}
 */
export function Favorites({ data = [], isLoading = false }) {
  const sliderId = "creator_favorites_slider";

  return (
    <Section
      title={Translate({ context: "creator", label: "favorites-title" })}
      isLoading={isLoading}
      space={{ top: "var(--pt8)" }}
      backgroundColor="var(--parchment)"
      dataCy="creator-favorites"
    >
      <ScrollSnapSlider
        sliderId={sliderId}
        slideDistanceFunctionOverride={getScrollToNextCoveredChild}
        childContainerClassName={styles.slider}
      >
        {data.map((item, idx) => (
          <div key={`favorite_${idx}`} className={styles.item}>
            <div className={styles.row}>
              <div className={styles.cover}>
                <Link
                  href={item.workHref}
                  border={{ bottom: false, top: false }}
                >
                  <Cover
                    src={
                      item.cover ||
                      "https://fbiinfo-present.dbc.dk/images/xzE5DeFpSc-ax1Q6ENNQKg/240px!AS2cLB0cUHOxu-MsTSuWAwnrHhLs7Y42ue_VWka2Cbl39A"
                    }
                    alt={item.title}
                    skeleton={isLoading}
                    size="medium"
                  />
                </Link>
              </div>
              <div className={styles.content}>
                <Title
                  type="title4"
                  lines={1}
                  skeleton={isLoading}
                  tag="div"
                  className={styles.title}
                >
                  {item.title}
                </Title>
                <div className={styles.meta}>
                  <Text
                    type="text3"
                    className={styles.by}
                    lines={1}
                    skeleton={isLoading}
                  >
                    {Translate({ context: "general", label: "by" })}
                  </Text>
                  <Text type="text2" lines={1} skeleton={isLoading}>
                    {item.subtitle}
                  </Text>
                </div>
                {item.date && (
                  <Text
                    type="text2"
                    className={styles.date}
                    lines={1}
                    skeleton={isLoading}
                  >
                    {new Date(item.date).toLocaleDateString("da-DK", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </Text>
                )}
                {item.rating && (
                  <div style={{ marginTop: "var(--pt1)" }}>
                    <Rating rating={item.rating} skeleton={isLoading} />
                  </div>
                )}
                {!isLoading && (
                  <div className={styles.link}>
                    <Icon src="chevron.svg" size={{ w: 2, h: "auto" }} alt="" />
                    <span>
                      <Link
                        href={
                          item?.infomediaId && item?.workId
                            ? getInfomediaReviewUrl(
                                item.workTitle || "",
                                item.workId,
                                item.infomediaId
                              )
                            : "#"
                        }
                        border={{ bottom: { keepVisible: true } }}
                      >
                        <Text type="text2" lines={1} tag="span">
                          {Translate({
                            context: "reviews",
                            label: "reviewLinkText",
                          })}
                        </Text>
                      </Link>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </ScrollSnapSlider>
    </Section>
  );
}

export function FavoritesSkeleton(props) {
  const data = [
    {
      title: "title1",
      subtitle: "reviewer1",
      rating: "4/6",
      date: "2024-01-01",
    },
    { title: "title2", subtitle: "reviewer2", date: "2023-01-01" },
  ];

  return <Favorites {...props} data={data} isLoading={true} />;
}

/**
 * Wrapper: will later fetch reviewer favorites for a creator.
 * Uses dummy data for initial implementation.
 */
export default function Wrap({ creatorId }) {
  const { data: reviewsData, isLoading } = useData(
    creatorId && reviewsForCreator({ creator: creatorId, limit: 50, offset: 0 })
  );

  const reviews = useMemo(() => {
    const mapped = reviewsData?.complexSearch?.works
      ?.map(mapWorkToReview)
      ?.filter((w) => w.review)
      ?.sort(compareByValidDateDesc)
      ?.slice(0, 10);

    return mapped?.map(mapToFavoritesItem);
  }, [reviewsData]);

  if (isLoading) {
    return <FavoritesSkeleton />;
  }

  // Prefer live data when available
  if (Array.isArray(reviews) && reviews.length > 0) {
    return <Favorites data={reviews} />;
  }
  return null;
}

Wrap.propTypes = {
  creatorId: PropTypes.string,
};
