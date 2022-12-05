import PropTypes from "prop-types";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import { cyKey } from "@/utils/trim";

import Text from "@/components/base/text";
import Link from "@/components/base/link";
import Title from "@/components/base/title";
import Icon from "@/components/base/icon";
import Rating from "@/components/base/rating";
import Translate from "@/components/base/translate";

import { dateToShortDate } from "@/utils/datetimeConverter";

import styles from "./ExternalReview.module.css";

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export function ExternalReview({
  className = "",
  data = [],
  onFocus = null,
  skeleton = false,
}) {
  // Translate Context
  const context = { context: "reviews" };

  const volume =
    data.periodica?.volume || (data.date && dateToShortDate(data.date, "d. "));

  return (
    <Col
      xs={12}
      sm={6}
      md={4}
      className={`${styles.litteratursiden} ${className}`}
      data-cy={cyKey({ prefix: "review", name: "external" })}
    >
      <Row>
        {data.origin && (
          <Col xs={12} className={styles.media}>
            <Title type="title4" skeleton={skeleton}>
              {data.origin}
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
            {data.author && (
              <Col xs={10} className={styles.author}>
                {!skeleton && <Text type="text2">{data.author}</Text>}
                <div className={styles.date}>
                  {!skeleton && volume && <Text type="text3">{volume}</Text>}
                </div>
              </Col>
            )}

            {data.rating && (
              <Col xs={12} className={styles.rating}>
                <Rating rating={data.rating} skeleton={skeleton} />
              </Col>
            )}
          </Col>
        </div>

        {data.urls?.map((accessUrl) => {
          const shouldUseAlternateText =
            accessUrl.url?.includes("https://moreinfo");
          return (
            <Col xs={12} className={styles.url} key={accessUrl.url}>
              <Icon
                src="chevron.svg"
                size={{ w: 2, h: "auto" }}
                skeleton={skeleton}
                alt=""
              />
              <Link
                href={accessUrl.url}
                target="_blank"
                onFocus={onFocus}
                disabled={!accessUrl.url}
                border={{ top: false, bottom: { keepVisible: true } }}
              >
                <Text type="text2" skeleton={skeleton}>
                  {Translate({
                    ...context,
                    label: shouldUseAlternateText
                      ? "alternateReviewLinkText"
                      : "reviewLinkText",
                  })}
                </Text>
              </Link>
            </Col>
          );
        })}
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
export function ExternalReviewSkeleton(props) {
  const data = {
    author: "Svend Svendsen",
    date: "2013-06-25",
    origin: "Litteratursiden.dk online",
    urls: [{ url: "http://" }],
  };

  return (
    <ExternalReview
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
  const { data, skeleton } = props;

  if (skeleton) {
    return <ExternalReviewSkeleton />;
  }

  return <ExternalReview {...props} data={data} />;
}

// PropTypes for component
Wrap.propTypes = {
  workId: PropTypes.string,
  type: PropTypes.string,
  skeleton: PropTypes.bool,
};
