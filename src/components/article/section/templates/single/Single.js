/**
 * @file
 * Two articles in a row template
 */

import PropTypes from "prop-types";
import Col from "react-bootstrap/Col";
import get from "lodash/get";

import Image from "@/components/base/image";
import Title from "@/components/base/title";
import Text from "@/components/base/text";
import Skeleton from "@/components/base/skeleton";
import Link, { LinkOnlyInternalAnimations } from "@/components/base/link";
import Button from "@/components/base/button";

import { articlePathAndTarget } from "@/components/articles/utils";

import styles from "./Single.module.css";
import Translate from "@/components/base/translate";
import React from "react";
import cx from "classnames";
import isEmpty from "lodash/isEmpty";

/**
 * A section displaying three articles
 *
 * @param {Array} articles
 * @param {boolean} skeleton
 *
 */
export default function Single({ articles, skeleton }) {
  const context = { context: "articles" };
  const article = articles[0];
  // extract image from article
  const image = article && article.fieldImage;

  const { target, query, pathname } = articlePathAndTarget(article);
  // Action button label
  const btnLabel = get(article, "fieldAlternativeArticleUrl.title", false)
    ? get(article, "fieldAlternativeArticleUrl.title", false)
    : Translate({ ...context, label: "read-more-btn" });

  // Strip body for html tags
  const bodyText = get(article, "body.value", "").replace(/(<([^>]+)>)/gi, "");

  return (
    <Col
      as={LinkOnlyInternalAnimations}
      href={{ pathname, query }}
      target={`${target}`}
      className={cx(styles.content)}
      xs={12}
      lg={{ span: 10, offset: 1 }}
    >
      <div className={styles.grid__text}>
        {bodyText && !isEmpty(bodyText) && (
          <Text
            tag="span"
            type="text2"
            lines={1}
            clamp={true}
            skeleton={skeleton}
          >
            {bodyText}
          </Text>
        )}
        <Title
          tag="h3"
          type="title3"
          lines={1}
          skeleton={skeleton}
          className={cx(styles.title)}
        >
          <span>
            <Link className={styles.underlineContainer__colors}>
              {article.title}
            </Link>
          </span>
        </Title>
        <Link a={false} target={`${target}`}>
          <Button
            onClick={() => {}}
            type="secondary"
            size="medium"
            skeleton={skeleton}
            className={cx(styles.button_width)}
          >
            {btnLabel}
          </Button>
        </Link>
      </div>
      <div className={styles.grid__image}>
        {image && (
          <div className={styles.imagewrapper}>
            <Image
              src={image.url}
              alt={image.alt}
              // width="100%"
              // height="62.5%"
              layout="fill"
              objectFit="cover"
            />
          </div>
        )}
        {skeleton && <Skeleton className={styles.imageskeleton} />}
      </div>
    </Col>
  );
}

Single.propTypes = {
  articles: PropTypes.array,
  skeleton: PropTypes.bool,
};
