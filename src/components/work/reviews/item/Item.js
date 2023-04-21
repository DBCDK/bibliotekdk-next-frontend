import Title from "@/components/base/title";
import Text from "@/components/base/text";
import Link from "@/components/base/link/Link";

import { Rating } from "@/components/base/rating/Rating";

import { dateToShortDate, numericToISO } from "@/utils/datetimeConverter";

import Translate from "@/components/base/translate";

import { contentParser } from "../utils";

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

  return [data.abstract];
}

/**
 *
 * @param {*} param0
 * @returns {JSX}
 */
function Item({ data, work, skeleton }) {
  console.log("Item", { data, work });

  const isType = getReviewType(data);
  const isMaterialReview = isType === "isMaterialReview";

  const hasDate = getDate(data);
  const hasRating = data.review?.rating;
  const hasCreator = data.creators?.map(({ display }) => display).join(", ");
  const hasPublisher = getPublisher(data);
  const hasContent = getContent(data);
  const hasUrl = "";

  const typeClass = styles[isType];
  const hasDateClass = !!hasDate ? styles.hasDate : "";
  const hasRatingClass = !!hasRating ? styles.hasRating : "";
  const hasCreatorClass = !!hasCreator ? styles.hasCreator : "";
  const hasPublisherClass = !!hasPublisher ? styles.hasPublisher : "";
  const hasContentClass = !!hasContent.length ? styles.hasContent : "";

  const classNames = [
    typeClass,
    hasDateClass,
    hasRatingClass,
    hasCreatorClass,
    hasPublisherClass,
    hasContentClass,
  ].join(" ");

  return (
    <div className={`${styles.item} ${classNames}`}>
      <div className={styles.details}>
        <div>
          {hasPublisher && (
            <Title type="title5" className={styles.publisher}>
              {hasPublisher}
            </Title>
          )}
          {hasDate && (
            <Text type="text2" className={styles.date}>
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
                <Text type="text3" className={styles.by}>
                  {Translate({ context: "general", label: "by" })}
                </Text>
                <Text type="text2" skeleton={skeleton} lines={1}>
                  {hasCreator}
                </Text>
              </div>
            )}

            <Text type="text2" className={styles.date}>
              {hasDate}
            </Text>

            <Rating className={styles.rating} />
          </div>
        </div>
      </div>
      <div>
        <Text
          tag="span"
          type="text2"
          lines={6}
          clamp={true}
          skeleton={skeleton}
        >
          {hasContent.map((content, i) => {
            return (
              <span key={`content-${i}`} className={styles.reviewTxt}>
                <Text type="text2" skeleton={skeleton} lines={1}>
                  {isMaterialReview ? contentParser(content) : content}
                </Text>
              </span>
            );
          })}
        </Text>
      </div>
      <Link href="/" className={styles.link}>
        <Text type="text2">Læs here</Text>
      </Link>
    </div>
  );
}

export default function Wrap(props) {
  return <Item {...props} />;
}
