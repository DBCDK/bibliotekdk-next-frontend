import PropTypes from "prop-types";
import { Container, Row, Col } from "react-bootstrap";

import { cyKey } from "../../../../../utils/trim";

import Text from "../../../../base/text";
import Title from "../../../../base/title";
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
  onFocus,
  skeleton = false,
}) {
  // Translate Context
  const context = { context: "reviews" };

  return (
    <Col
      xs={12}
      sm={6}
      xl={4}
      className={`${styles.infomedia} ${className}`}
      data-cy={cyKey({ prefix: "review", name: "infomedia" })}
    >
      {data.rating && (
        <div className={styles.rating}>
          <Rating rating={data.rating} skeleton={skeleton} />
        </div>
      )}
      {data.media && (
        <div className={styles.media}>
          <Text type="text3" skeleton={skeleton} lines={3}>
            {data.media}
          </Text>
        </div>
      )}
      {!skeleton && data.author && (
        <div className={styles.author}>
          <Text type="text3">
            {`${Translate({ context: "general", label: "by" })} `}
          </Text>
          <Title tag="h3" type="title4">
            {data.author}
          </Title>
          <Text type="text3"> d. 05/07-2020</Text>
        </div>
      )}
      {data.url && (
        <div className={styles.url}>
          <Icon src="chevron.svg" size={2} skeleton={skeleton} />
          <Link
            href={data.url}
            target="_blank"
            border={!skeleton}
            onFocus={onFocus}
          >
            <Title type="title4" skeleton={skeleton}>
              {Translate({ ...context, label: "reviewLinkText" })}
            </Title>
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
