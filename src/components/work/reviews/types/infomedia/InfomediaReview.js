import PropTypes from "prop-types";
import { Container, Row, Col } from "react-bootstrap";

import { cyKey } from "../../../../../utils/trim";

import Text from "../../../../base/text";
import Icon from "../../../../base/icon";
import Rating from "../../../../base/rating";
import Link from "../../../../base/link";
import Translate from "../../../../base/translate";

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
  skeleton = false,
}) {
  // Translate Context
  const context = { context: "reviews" };

  return (
    <Col xs={12} md={4} className={`${styles.infomedia} ${className}`}>
      {data.rating && (
        <div className={styles.rating}>
          <Rating rating={data.rating} />
        </div>
      )}
      {data.media && (
        <div className={styles.media}>
          <Text type="text3">{data.media}</Text>
        </div>
      )}
      {data.author && (
        <div className={styles.author}>
          <Text type="text3">
            af <span>{data.author}</span> d. 05/07-2020
          </Text>
        </div>
      )}
      {data.url && (
        <div className={styles.url}>
          <Icon src="chevron.svg" size={1} />
          <Link href={data.url} target="_blank">
            <Text type="text2">
              {Translate({ ...context, label: "reviewLinkText" })}
            </Text>
          </Link>
        </div>
      )}
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
  const data = {};

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
