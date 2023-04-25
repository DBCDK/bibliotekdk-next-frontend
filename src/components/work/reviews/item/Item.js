import Title from "@/components/base/title";
import Text from "@/components/base/text";
import Link from "@/components/base/link/Link";
import Icon from "@/components/base/icon";

import { Rating } from "@/components/base/rating/Rating";

import { dateToShortDate, numericToISO } from "@/utils/datetimeConverter";

import Translate from "@/components/base/translate";

import { contentParser } from "../utils";
import { encodeString } from "@/lib/utils";

import styles from "./Item.module.css";

/**
 * Selecting the correct review template
 *
 * @param review
 *
 * @returns {component}
 */

function getReviewType(data) {
  if (data.review?.reviewByLibrarians?.length > 0) {
    return "isMaterialReview";
  }
  if (data.access?.find((a) => a.__typename === "InfomediaService")) {
    return "isInfomediaReview";
  }
  return "isExternalReview";
}

/**
 *
 * @param {*} data
 * @returns {string}
 */
function getPublisher(data) {
  const isType = getReviewType(data);
  const isMaterialReview = isType === "isMaterialReview";

  if (isMaterialReview) {
    return Translate({ context: "general", label: "lecturerStatement" });
  }

  return data.hostPublication?.title;
}

/**
 *
 * @param {*} data
 * @returns {string}
 */
function getDate(data) {
  const date =
    data.hostPublication?.issue ||
    (data.recordCreationDate && numericToISO(data.recordCreationDate));

  return dateToShortDate(date, "d. ");
}

/**
 *
 * @param {*} data
 * @returns {string}
 */
function getContent(data) {
  const isType = getReviewType(data);
  const isMaterialReview = isType === "isMaterialReview";

  if (isMaterialReview) {
    return data.review?.reviewByLibrarians
      ?.map((p) => p)
      .filter(
        (p) =>
          !p.content?.startsWith("Materialevurdering") &&
          !p.content?.startsWith("Indscannet version")
      );
  }

  if (data.abstract) {
    return data.abstract;
  }

  return [];
}

/**
 *
 * @param {*} data
 * @returns {string}
 */
function getUrls(data, work) {
  const { workId, title } = work;
  const isType = getReviewType(data);
  const isMaterialReview = isType === "isMaterialReview";
  const isInfomediaReview = isType === "isInfomediaReview";

  const urlTxt = title && encodeString(title);

  if (isMaterialReview) {
    return data.pid && [`/anmeldelse/${urlTxt}/${workId}/${data.pid}`];
  }

  if (isInfomediaReview) {
    const infomediaAccess = data.access?.find((a) => a.id);
    return (
      infomediaAccess.id && [
        `/anmeldelse/${urlTxt}/${workId}/${infomediaAccess.id}`,
      ]
    );
  }

  return data.access
    .filter((d) => d.__typename === "AccessUrl" && d.url !== "")
    .map((a) => a.url);
}

/**
 *
 * @param {*} param0
 * @returns {JSX}
 */
function Item({ data, work, isLoading }) {
  console.log("Item", { data, work });

  const isType = getReviewType(data);
  const isMaterialReview = isType === "isMaterialReview";

  const hasDate = getDate(data);
  const hasRating = data.review?.rating;
  const hasCreator = data.creators?.map(({ display }) => display).join(", ");
  const hasPublisher = getPublisher(data);
  const hasContent = getContent(data);
  const hasUrls = getUrls(data, work) || [];

  const typeClass = styles[isType];
  const hasDateClass = !!hasDate ? styles.hasDate : "";
  const hasRatingClass = !!hasRating ? styles.hasRating : "";
  const hasCreatorClass = !!hasCreator ? styles.hasCreator : "";
  const hasPublisherClass = !!hasPublisher ? styles.hasPublisher : "";
  const hasContentClass = !!hasContent.length ? styles.hasContent : "";
  const hasUrlClass = !!hasUrls.length ? styles.hasUrl : "";

  const isLoadingClass = isLoading ? styles.skeleton : "";

  const classNames = [
    typeClass,
    hasDateClass,
    hasRatingClass,
    hasCreatorClass,
    hasPublisherClass,
    hasContentClass,
    hasUrlClass,
    isLoadingClass,
  ].join(" ");

  return (
    <div className={`${styles.item} ${classNames}`}>
      <div className={styles.details}>
        <div>
          {hasPublisher && (
            <Title
              type="title5"
              className={styles.publisher}
              skeleton={isLoading}
            >
              {hasPublisher}
            </Title>
          )}
          {hasDate && (
            <Text
              type="text2"
              className={styles.date}
              lines={1}
              skeleton={isLoading}
            >
              {hasDate}
            </Text>
          )}
        </div>
        <div>
          <Text type="text3" className={styles.by}>
            {Translate({ context: "general", label: "by" })}
          </Text>
          <div>
            {hasCreator && (
              <div>
                <Text type="text3" className={styles.by} skeleton={isLoading}>
                  {Translate({ context: "general", label: "by" })}
                </Text>
                <Text type="text2" skeleton={isLoading} lines={1}>
                  {hasCreator}
                </Text>
              </div>
            )}

            <Text
              type="text2"
              className={styles.date}
              skeleton={isLoading}
              lines={1}
            >
              {hasDate}
            </Text>

            {hasRating && (
              <Rating
                rating={hasRating}
                skeleton={isLoading}
                className={styles.rating}
              />
            )}
          </div>
        </div>
      </div>
      <div>
        <Title
          type="title4"
          tag="span"
          lines={6}
          clamp={true}
          skeleton={isLoading}
        >
          {hasContent.map((content, i) => {
            return (
              <span key={`content-${i}`} className={styles.reviewTxt}>
                <Text type="text2" skeleton={isLoading} lines={1}>
                  {isMaterialReview ? contentParser(content) : content}
                </Text>
              </span>
            );
          })}
        </Title>
      </div>

      <div className={styles.links}>
        {hasUrls.map((url) => {
          const shouldUseAlternateText = url?.includes("https://moreinfo");
          return (
            <div className={styles.link} key={url}>
              <Icon
                src="chevron.svg"
                size={{ w: 2, h: "auto" }}
                skeleton={isLoading}
                alt=""
              />
              <Link
                href={url}
                target="_blank"
                disabled={isLoading || !url}
                border={{ top: false, bottom: { keepVisible: true } }}
              >
                <Text type="text2" skeleton={isLoading} lines={1}>
                  {Translate({
                    context: "reviews",
                    label: shouldUseAlternateText
                      ? "alternateReviewLinkText"
                      : "reviewLinkText",
                  })}
                </Text>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Wrap(props) {
  return <Item {...props} />;
}
