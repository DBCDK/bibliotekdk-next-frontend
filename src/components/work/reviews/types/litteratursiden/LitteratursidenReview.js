import PropTypes from "prop-types";
import { Col } from "react-bootstrap";

import { cyKey } from "@/utils/trim";

import Text from "@/components/base/text";
import Link from "@/components/base/link";
import Title from "@/components/base/title";
import Translate from "@/components/base/translate";

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
  onFocus = null,
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
      <Link
        onFocus={onFocus}
        border={{ bottom: false }}
        dataCy={cyKey({ name: "link", prefix: "litteratursiden" })}
      >
        <div className={styles.media}>
          <Title type="title4" skeleton={skeleton}>
            {Translate({ ...context, label: "litteratursiden" })}
          </Title>
        </div>

        {data.author && (
          <div className={styles.author}>
            <Text type="text3" skeleton={skeleton} lines={2}>
              {`${Translate({ context: "general", label: "by" })} `}
            </Text>
            {!skeleton && (
              <Title tag="h3" type="title4">
                {data.author}
              </Title>
            )}
            {!skeleton && <Text type="text3"> d. 05/07-2020</Text>}
          </div>
        )}
      </Link>
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
