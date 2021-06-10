import PropTypes from "prop-types";
import { Container, Row, Col } from "react-bootstrap";

import { cyKey } from "@/utils/trim";

import Text from "@/components/base/text";
import Title from "@/components/base/title";
import Icon from "@/components/base/icon";
import Rating from "@/components/base/rating";
import Link from "@/components/base/link";
import Translate from "@/components/base/translate";

import { dateToShortDate } from "@/utils/datetimeConverter";

import styles from "./InfomediaReview.module.css";

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export function InfomediaReview({
  className = "",
  data = [],
  onFocus,
  skeleton = false,
}) {
  // Translate Context
  const context = { context: "reviews" };

  return (
    <Col
      xs={12}
      sm={6}
      md={4}
      className={`${styles.infomedia} ${className}`}
      data-cy={cyKey({ prefix: "review", name: "infomedia" })}
    >
      <Row>
        {data.media && (
          <Col xs={12} className={styles.media}>
            <Title type="title4" skeleton={skeleton}>
              {data.media}
            </Title>
          </Col>
        )}
        <div className={styles.row}>
          {data.author && (
            <Col className={styles.left}>
              <Text type="text3" skeleton={skeleton} lines={1}>
                {Translate({ context: "general", label: "by" })}
              </Text>
            </Col>
          )}
          <Col xs={12} className={styles.right}>
            {data.author && <Text type="text2">{data.author}</Text>}
            <Col className={styles.date}>
              {!skeleton && (
                <Text type="text3">d. {dateToShortDate(data.date)}</Text>
              )}
            </Col>
            {data.rating && (
              <Col xs={12} className={styles.rating}>
                <Rating rating={data.rating} skeleton={skeleton} />
              </Col>
            )}
          </Col>
        </div>

        <Col xs={12} className={styles.url}>
          <Icon
            src="chevron.svg"
            size={{ w: 2, h: "auto" }}
            skeleton={skeleton}
          />
          <Link
            href={data.url}
            target="_blank"
            onFocus={onFocus}
            disabled={!data.url}
            border={{ top: false, bottom: { keepVisible: true } }}
          >
            <Text type="text2" skeleton={skeleton}>
              {Translate({
                ...context,
                label: "reviewLinkText",
              })}
            </Text>
          </Link>
        </Col>
      </Row>
    </Col>
  );
}

/**
 * Function to return skeleton (Loading) version of the Component
 *
 * @param {obj} props
 *  See propTypes for specific props and types
 *
 * @returns {component}
 */
export function InfomediaReviewSkeleton(props) {
  const data = {
    author: "Svend Svendsen",
    media: "Jyllandsposten",
    rating: "4/5",
    reviewType: "INFOMEDIA",
    url: "http://",
  };

  return (
    <InfomediaReview
      {...props}
      data={data}
      className={`${props.className} ${styles.skeleton}`}
      skeleton={true}
    />
  );
}

/**
 *  Default export function of the Component
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function Wrap(props) {
  const { data, isSkeleton } = props;

  if (isSkeleton) {
    return <InfomediaReviewSkeleton />;
  }

  return <InfomediaReview {...props} data={data} />;
}

// PropTypes for component
Wrap.propTypes = {
  workId: PropTypes.string,
  type: PropTypes.string,
  skeleton: PropTypes.bool,
};
