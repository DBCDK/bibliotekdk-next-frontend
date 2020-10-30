import PropTypes from "prop-types";
import { Col } from "react-bootstrap";

import { cyKey } from "../../../../../utils/trim";

import Text from "../../../../base/text";
import Rating from "../../../../base/rating";
import Title from "../../../../base/title";

import styles from "./LitteratursidenReview.module.css";

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export function LitteratursidenReview({
  className = "",
  data = [],
  skeleton = false,
}) {
  // Translate Context
  const context = { context: "reviews" };

  return (
    <Col
      xs={12}
      sm={6}
      xl={4}
      className={`${styles.litteratursiden} ${className}`}
    >
      <div className={styles.media}>
        <Title type="title4">Litteratursiden</Title>
      </div>

      {data.author && (
        <div className={styles.author}>
          <Text type="text3">af </Text>
          <Title tag="h3" type="title4">
            {data.author}
          </Title>
          <Text type="text3"> d. 05/07-2020</Text>
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
export function LitteratursidenReviewSkeleton(props) {
  const data = {
    author: "Svend Svendsen",
    reviewType: "INFOMEDIA",
    url: "http://",
  };

  return (
    <LitteratursidenReview
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
    return <LitteratursidenReviewSkeleton />;
  }

  return <LitteratursidenReview {...props} data={data} />;
}

// PropTypes for component
Wrap.propTypes = {
  workId: PropTypes.string,
  type: PropTypes.string,
  skeleton: PropTypes.bool,
};
