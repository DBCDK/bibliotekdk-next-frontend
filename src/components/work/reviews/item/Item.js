import Col from "react-bootstrap/Col";

import Title from "@/components/base/title";
import Text from "@/components/base/text";
import Link from "@/components/base/link/Link";
import Icon from "@/components/base/icon";

import { Rating } from "@/components/base/rating/Rating";

import Translate from "@/components/base/translate";

import {
  contentParser,
  getReviewType,
  getPublisher,
  getDate,
  getContent,
  getUrls,
} from "../utils";

import styles from "./Item.module.css";

/**
 *
 * @param {*} param0
 * @returns {JSX}
 */
function Item({ data, work, isLoading }) {
  const isType = getReviewType(data);
  const isMaterialReview = isType === "isMaterialReview";

  const hasDate = getDate(data);
  const hasRating = data.review?.rating;
  const hasCreator = data.creators?.map(({ display }) => display).join(", ");
  const hasPublisher = getPublisher(data);
  const hasContent = getContent(data);
  const hasUrls = getUrls(data, work) || [];

  const typeClass = styles[isType];
  // const hasDateClass = !!hasDate ? styles.hasDate : "";
  const hasRatingClass = !!hasRating ? styles.hasRating : "";
  const hasCreatorClass = !!hasCreator ? styles.hasCreator : "";
  // const hasPublisherClass = !!hasPublisher ? styles.hasPublisher : "";
  const hasContentClass = !!hasContent.length ? styles.hasContent : "";
  // const hasUrlClass = !!hasUrls.length ? styles.hasUrl : "";

  const isLoadingClass = isLoading ? styles.skeleton : "";

  const classNames = [
    typeClass,
    // hasDateClass,
    hasRatingClass,
    hasCreatorClass,
    // hasPublisherClass,
    hasContentClass,
    // hasUrlClass,
    isLoadingClass,
  ].join(" ");

  return (
    <Col
      xs={!!hasContent.length ? 10 : 8}
      sm={!!hasContent.length ? 10 : 6}
      md={!!hasContent.length ? 9 : 4}
      data-cy={`review-item-${isType}`}
      className={`${styles.item} ${classNames}`}
      as="article"
    >
      <figure className={styles.wrap}>
        <figcaption className={styles.details}>
          <div>
            {hasPublisher && (
              <Title
                type="title5"
                className={styles.publisher}
                skeleton={isLoading}
                tag="h3"
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
        </figcaption>
        <blockquote>
          <Title
            type="title6"
            tag="span"
            lines={6}
            clamp={true}
            skeleton={isLoading}
          >
            {hasContent.map((content, i) => {
              return (
                <p key={`content-${i}`}>
                  {isMaterialReview ? contentParser(content) : content}
                </p>
              );
            })}
          </Title>

          <div className={styles.links}>
            {hasUrls.map((url) => {
              // general link text
              const shouldUseAlternateText = url?.includes("https://moreinfo");
              const reviewLinkLabel = Translate({
                context: "reviews",
                label: shouldUseAlternateText
                  ? "alternateReviewLinkText"
                  : "reviewLinkText",
              });
              // material link text
              const materialReviewLinkLabel =
                isMaterialReview &&
                Translate({
                  context: "reviews",
                  label: "materialReviewLinkText",
                });

              return (
                <div className={styles.link} key={url}>
                  <Icon
                    src="chevron.svg"
                    size={{ w: 2, h: "auto" }}
                    skeleton={isLoading}
                    alt=""
                  />
                  <span>
                    <Link
                      href={url}
                      target={
                        isType === "isExternalReview" ? "_blank" : "_self"
                      }
                      disabled={isLoading || !url}
                      border={{ top: false, bottom: { keepVisible: true } }}
                    >
                      <Text
                        type="text2"
                        skeleton={isLoading}
                        lines={1}
                        tag="span"
                      >
                        {materialReviewLinkLabel || reviewLinkLabel}
                      </Text>
                    </Link>
                  </span>
                </div>
              );
            })}
          </div>
        </blockquote>
      </figure>
      <hr className={styles.seperator} />
    </Col>
  );
}

export default function Wrap(props) {
  return <Item {...props} />;
}
