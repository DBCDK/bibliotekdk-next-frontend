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

  // Check for alternative url alias
  const entityUrl = get(article, "entityUrl.path", false);
  const hasAlternativeUrl = entityUrl && entityUrl !== `/node/${article.nid}`;

  let pathname = "/artikel/[title]/[articleId]";
  // Update pathname if alternative url is found
  if (hasAlternativeUrl) {
    pathname = entityUrl;
  }

  let query = {};
  // Update query if no alternative url is found
  if (!hasAlternativeUrl) {
    query = { title: encodeString(article.title), articleId: article.nid };
  }

  return (
    <Row className={styles.wrap}>
      <Col xs={12} lg={{ span: 10, offset: 1 }} className={styles.article}>
        <Row>
          <Col xs={12} lg={5}>
            <Text type="text2" lines={3} clamp={true} skeleton={skeleton}>
              {article.fieldRubrik}
            </Text>
            <Title
              className={styles.title}
              tag="h3"
              type="title3"
              lines={1}
              skeleton={skeleton}
            >
              {article.title}
            </Title>
            <Link a={false} href={{ pathname, query }}>
              <Button type="secondary" size="medium">
                {Translate({ ...context, label: "all-articles-btn" })}
              </Button>
            </Link>
          </Col>
          <Col xs={12} lg={7}>
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
      </Col>
    </Row>
  );
}

Single.propTypes = {
  articles: PropTypes.array,
  skeleton: PropTypes.bool,
};
