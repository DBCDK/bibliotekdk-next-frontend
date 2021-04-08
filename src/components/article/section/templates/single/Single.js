/**
 * @file
 * Two articles in a row template
 */

import PropTypes from "prop-types";
import { Col, Row } from "react-bootstrap";
import get from "lodash/get";

import Image from "@/components/base/image";
import Title from "@/components/base/title";
import Text from "@/components/base/text";
import Skeleton from "@/components/base/skeleton";
import Link from "@/components/base/link";
import Button from "@/components/base/button";

import { encodeString } from "@/lib/utils";

import styles from "./Single.module.css";
import Translate from "@/components/base/translate";
import AnimationLine from "@/components/base/animation/line";

/**
 * A section displaying three articles
 *
 * @param {array} props.articles
 * @param {boolean} props.skeleton
 *
 */
export default function Single({ articles, skeleton }) {
  const context = { context: "articles" };
  const article = articles[0];

  if (!articles[0]) {
    return "No article found";
  }
  // extract image from article
  const image = article && article.fieldImage;

  // Check for alternative url
  let entityUrl = get(article, "fieldAlternativeArticleUrl.uri", false);
  // check if alternative url is for linking out of the page
  let external = false;
  if (entityUrl) {
    external = entityUrl.indexOf("internal") === -1;
    // drupal marks an internal url - remove the mark
    if (!external) {
      entityUrl = entityUrl.replace("internal:", "");
    }
  }

  const skeletonClass = skeleton ? styles.skeleton : "";
  // which pathname to use
  const pathname = entityUrl ? entityUrl : "/artikel/[title]/[articleId]";
  // Update query if no alternative url is found
  let query = {};
  if (!entityUrl) {
    query = { title: encodeString(article.title), articleId: article.nid };
  }

  // Action button label
  const btnLabel = get(article, "fieldAlternativeArticleUrl.title", false)
    ? get(article, "fieldAlternativeArticleUrl.title", false)
    : Translate({ ...context, label: "read-more-btn" });

  // Strip body for html tags
  const bodyText = get(article, "body.value", "").replace(/(<([^>]+)>)/gi, "");

  return (
    <Row className={styles.wrap}>
      <Col xs={12} lg={{ span: 10, offset: 1 }}>
        <Link
          a={false}
          href={{ pathname, query }}
          target={`${external} ? "_blank : "_self"`}
        >
          <Row className={`${styles.content} ${skeletonClass}`}>
            <Col xs={{ span: 12, order: 2 }} md={{ span: 5, order: 1 }}>
              <span className={styles.text}>
                <Text type="text2" lines={1} clamp={true} skeleton={skeleton}>
                  {bodyText}
                </Text>
              </span>
              <div />
              <span className={styles.title}>
                <Title tag="h3" type="title3" lines={1} skeleton={skeleton}>
                  {article.title}
                </Title>
                <AnimationLine />
              </span>
              <div />
              <Link a={false} href={{ pathname, query }}>
                <Button type="secondary" size="medium" skeleton={skeleton}>
                  {btnLabel}
                </Button>
              </Link>
            </Col>
            <Col xs={{ span: 12, order: 1 }} md={{ span: 7, order: 2 }}>
              <div className={styles.imagewrapper}>
                {image && (
                  <Image
                    src={image.url}
                    alt={image.alt}
                    layout="fill"
                    objectFit="cover"
                  />
                )}
                {skeleton && <Skeleton className={styles.imageskeleton} />}
              </div>
            </Col>
          </Row>
        </Link>
      </Col>
    </Row>
  );
}

Single.propTypes = {
  articles: PropTypes.array,
  skeleton: PropTypes.bool,
};
