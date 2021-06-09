import PropTypes from "prop-types";
import { Col, Row } from "react-bootstrap";

import { cyKey } from "@/utils/trim";

import Text from "@/components/base/text";
import Link from "@/components/base/link";
import Title from "@/components/base/title";
import Icon from "@/components/base/icon";
import Translate from "@/components/base/translate";

import { dateToShortDate } from "@/utils/datetimeConverter";

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
      md={4}
      className={`${styles.litteratursiden} ${className}`}
      data-cy={cyKey({ prefix: "review", name: "litteratursiden" })}
    >
      <Row>
        <Col xs={12} className={styles.media}>
          <Title type="title4" skeleton={skeleton}>
            {Translate({ ...context, label: "litteratursiden" })}
          </Title>
        </Col>
        <div className={styles.row}>
          {data.author && (
            <Col className={styles.left}>
              <Text type="text3" skeleton={skeleton} lines={1}>
                {Translate({ context: "general", label: "by" })}
              </Text>
            </Col>
          )}
          {data.author && (
            <Col xs={10} className={styles.author}>
              {!skeleton && <Text type="text2">{data.author}</Text>}
              <div className={styles.date}>
                {!skeleton && (
                  <Text type="text3">d. {dateToShortDate(data.date)}</Text>
                )}
              </div>
            </Col>
          )}
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
