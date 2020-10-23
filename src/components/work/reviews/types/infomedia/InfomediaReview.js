import PropTypes from "prop-types";
import { Container, Row, Col } from "react-bootstrap";

import { cyKey } from "../../../../../utils/trim";

import Text from "../../../../base/text";
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
  const context = { context: "infomediaReview" };

  return (
    <Row className={`${styles.infomedia} ${className}`}>
      <Col xs={12} className={styles.rating}>
        <Rating rating={data.rating} />
      </Col>
      <Col xs={12} className={styles.media}>
        {data.media}
      </Col>
      <Col xs={12} className={styles.author}>
        {data.author}
      </Col>
      <Col xs={12} className={styles.url}>
        {data.url}
      </Col>
    </Row>
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
