import PropTypes from "prop-types";

import Section from "@/components/base/section";
import Text from "@/components/base/text";
import Title from "@/components/base/title";
import Link from "@/components/base/link";
import Icon from "@/components/base/icon";
import Translate from "@/components/base/translate";
import Cover from "@/components/base/cover/Cover";
import { getInfomediaReviewUrl, getWorkUrl, encodeString } from "@/lib/utils";
import { getCoverImage } from "@/components/utils/getCoverImage";
import { useData } from "@/lib/api/api";
import { reviewsForCreator } from "@/lib/api/creator.fragments";

import ScrollSnapSlider from "@/components/base/scrollsnapslider/ScrollSnapSlider";
import {
  getScrollToNextCoveredChild,
  scrollToElementWhenStable,
} from "@/components/base/scrollsnapslider/utils";
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
 * Check that a review is from Infomedia.
 */
function isInfomedia(review) {
  return review?.access?.some((a) => a?.__typename === "InfomediaService");
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
 * Sort reviews by date (newest first) - helper for selectBestReview
 */
function sortByDateDesc(reviews) {
  return reviews
    .map((r) => {
      const { valid, value } = parseIssueISO(r?.hostPublication?.issue);
      return { ...r, __parsedDateValid: valid, __parsedDate: value };
    })
    .sort((a, b) => {
      if (a.__parsedDateValid !== b.__parsedDateValid) {
        return a.__parsedDateValid ? -1 : 1;
      }
      if (a.__parsedDate && b.__parsedDate) {
        return b.__parsedDate - a.__parsedDate;
      }
      if (a.__parsedDate && !b.__parsedDate) return -1;
      if (!a.__parsedDate && b.__parsedDate) return 1;
      return 0;
    });
}

/**
 * Pick the best review: highest rating if available, otherwise newest.
 * Returns review with parsed date info attached.
 */
function selectBestReview(reviews = []) {
  const infomediaReviews = reviews.filter(isInfomedia);

  if (infomediaReviews.length === 0) {
    return null;
  }

  // Separate reviews with and without ratings
  const withRatings = infomediaReviews
    .map((r) => ({
      ...r,
      ratingPercentage: toRatingPercentage(r),
    }))
    .filter((r) => r.ratingPercentage > 0);

  // If there are reviews with ratings, pick the one with highest rating
  if (withRatings.length > 0) {
    const best = withRatings.sort(
      (a, b) => b.ratingPercentage - a.ratingPercentage
    )[0];
    // Parse date for consistency
    const { valid, value } = parseIssueISO(best?.hostPublication?.issue);
    return {
      ...best,
      __parsedDateValid: valid,
      __parsedDate: value,
    };
  }

  // Otherwise, sort by date (newest first)
  return sortByDateDesc(infomediaReviews)[0];
}

/**
 * Map a work to its selected review and parsed publication date.
 */
function mapWorkToReview(work) {
  const bestReview = selectBestReview(work?.relations?.hasReview || []);
  if (!bestReview) {
    return null;
  }
  return {
    work,
    review: bestReview,
    __parsedDateValid: bestReview.__parsedDateValid,
    __parsedDate: bestReview.__parsedDate,
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
    hostPublication: review?.hostPublication?.title || "",
    subtitle: reviewerName || "",
    date: review?.hostPublication?.issue || "",
    workTitle: mainTitle || "",
    workId: work?.workId || "",
    infomediaId: accessInf?.id || "",
    cover: coverDetail || null,
    workHref,
    reviewsCount: work?.relations?.hasReview?.length || 0,
  };
}

/**
 * Renders a slider of reviewer favorites for a creator.
 *
 * @param {Object} props
 * @param {Array} [props.data=[]] Items to render in the slider
 * @param {boolean} [props.isLoading=false] Show skeleton state
 * @returns {JSX.Element}
 */
/**
 * Scroll to reviews section by finding element with id starting with "anmeldelser"
 */
function scrollToReviewsSection() {
  scrollToElementWhenStable('[id^="anmeldelser"]', 80);
}

/**
 * Individual work review item component
 */
function WorkReviewItem({ item, isLoading }) {
  const handleFocus = (e) => {
    e.currentTarget.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
  };

  return (
    <Link
      href={item.workHref}
      border={{ top: false, bottom: { keepVisible: false } }}
      className={styles.itemLink}
      onFocus={handleFocus}
    >
      <div className={styles.item}>
        <div className={styles.row}>
          <div className={styles.cover}>
            <Cover
              src={
                item.cover ||
                "https://fbiinfo-present.dbc.dk/images/xzE5DeFpSc-ax1Q6ENNQKg/240px!AS2cLB0cUHOxu-MsTSuWAwnrHhLs7Y42ue_VWka2Cbl39A"
              }
              alt={item.hostPublication}
              skeleton={isLoading}
              size="medium"
            />
          </div>
          <div className={styles.content}>
            <Title
              type="title4"
              lines={1}
              skeleton={isLoading}
              tag="div"
              className={styles.title}
            >
              {item.workTitle}
            </Title>

            {item.date && (
              <div className={styles.date}>
                {item.hostPublication && (
                  <Text type="text2" lines={1} skeleton={isLoading}>
                    {Translate({
                      context: "creator",
                      label: "reviewedIn",
                    })}{" "}
                    {item.hostPublication}
                  </Text>
                )}
                {(() => {
                  const { valid, value } = parseIssueISO(item.date);
                  return (
                    <Text type="text2" lines={1} skeleton={isLoading}>
                      {valid && value
                        ? `d. ${value.toLocaleDateString("da-DK", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}`
                        : item.date}
                    </Text>
                  );
                })()}
              </div>
            )}
            {!isLoading && (
              <div className={styles.link}>
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
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Text type="text2" lines={1} tag="span">
                      {Translate({
                        context: "reviews",
                        label: "reviewLinkText",
                      })}
                    </Text>
                  </Link>
                </span>
                <Icon
                  src="chevron.svg"
                  size={{ w: 2, h: "auto" }}
                  alt=""
                  className={styles.icon}
                />
              </div>
            )}
            {item.reviewsCount > 1 && (
              <div className={styles.allReviewsLink}>
                <span>
                  <Link
                    href={item.workHref}
                    border={{ bottom: { keepVisible: true } }}
                    onClick={(e) => {
                      e.stopPropagation();
                      scrollToReviewsSection();
                    }}
                  >
                    <Text type="text2" tag="span">
                      {Translate({
                        context: "creator",
                        label: "seeAllReviews",
                      })}{" "}
                      ({item.reviewsCount})
                    </Text>
                  </Link>
                </span>
                <Icon
                  src="chevron.svg"
                  size={{ w: 2, h: "auto" }}
                  alt=""
                  className={styles.icon}
                />
              </div>
            )}
          </div>
        </div>
        <div className={styles.bottomLine} />
      </div>
    </Link>
  );
}

WorkReviewItem.propTypes = {
  item: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
};

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
      <div className={styles.sliderContainer}>
        <ScrollSnapSlider
          sliderId={sliderId}
          slideDistanceFunctionOverride={getScrollToNextCoveredChild}
          childContainerClassName={styles.slider}
        >
          {data.map((item, idx) => (
            <WorkReviewItem
              key={`favorite_${idx}`}
              item={item}
              isLoading={isLoading}
            />
          ))}
        </ScrollSnapSlider>
      </div>
    </Section>
  );
}

export function FavoritesSkeleton(props) {
  const data = [
    {
      hostPublication: "title1",
      subtitle: "reviewer1",
      date: "2024-01-01",
    },
    { hostPublication: "title2", subtitle: "reviewer2", date: "2023-01-01" },
  ];

  return <Favorites {...props} data={data} isLoading={true} />;
}

/**
 * Wrapper: fetches and displays reviewer favorites for a creator.
 */
export default function Wrap({ creatorId }) {
  const { data: reviewsData, isLoading } = useData(
    creatorId && reviewsForCreator({ creator: creatorId, limit: 50, offset: 0 })
  );

  const reviews = useMemo(() => {
    if (!reviewsData?.complexSearch?.works) {
      return [];
    }

    const mapped = reviewsData.complexSearch.works
      .map(mapWorkToReview)
      .filter((w) => w?.review)
      .sort(compareByValidDateDesc)
      .slice(0, 20)
      .map(mapToFavoritesItem);

    // Generate hash for reviews section once
    const reviewsHash = `#${encodeString(
      Translate({ context: "workmenu", label: "reviews" })
    )}-13`;

    return mapped.map((item) => ({
      ...item,
      workHref: item.workHref + reviewsHash,
    }));
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
