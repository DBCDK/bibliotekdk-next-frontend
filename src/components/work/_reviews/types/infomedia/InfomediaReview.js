import PropTypes from "prop-types";
import Col from "react-bootstrap/Col";

import { cyKey } from "@/utils/trim";

import Text from "@/components/base/text";
import Title from "@/components/base/title";
import Icon from "@/components/base/icon";
import Rating from "@/components/base/rating";
import Link from "@/components/base/link";
import Translate from "@/components/base/translate";

import { dateToShortDate } from "@/utils/datetimeConverter";

import styles from "./InfomediaReview.module.css";
import { encodeString } from "@/lib/utils";

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
  title,
  workId,
  skeleton = false,
}) {
  // Translate Context
  const context = { context: "reviews" };

  // make an url for infomedia page
  const urlTxt = encodeString(title);
  const infomediaAccess = data.access?.find((a) => a.id);
  const url =
    infomediaAccess.id &&
    `/anmeldelse/${urlTxt}/${workId}/${infomediaAccess.id}`;

  return (
    <Col
      xs={11}
      sm={6}
      md={4}
      className={`${styles.infomedia} ${className}`}
      data-cy={cyKey({ prefix: "review", name: "infomedia" })}
    >
      <div>
        {data.hostPublication?.title && (
          <div className={styles.media}>
            <Title type="title4" skeleton={skeleton}>
              {data.hostPublication?.title}
            </Title>
          </div>
        )}
        <div className={styles.row}>
          {data.creators?.length > 0 && (
            <div className={styles.left}>
              <Text type="text3" skeleton={skeleton} lines={1}>
                {Translate({ context: "general", label: "by" })}
              </Text>
            </div>
          )}
          <div className={styles.right}>
            {data.creators?.length > 0 && (
              <Text type="text2" skeleton={skeleton} lines={1}>
                {data.creators?.map((c) => c.display).join(", ")}
              </Text>
            )}
            <div className={styles.date}>
              {!skeleton && data.hostPublication?.issue && (
                <Text type="text3">
                  {dateToShortDate(data.hostPublication?.issue, "d. ")}
                </Text>
              )}
            </div>
            {data.review?.rating && (
              <div className={styles.rating}>
                <Rating rating={data.review?.rating} skeleton={skeleton} />
              </div>
            )}
          </div>
        </div>

        {url && (
          <div className={styles.url}>
            <Icon
              src="chevron.svg"
              size={{ w: 2, h: "auto" }}
              skeleton={skeleton}
              alt=""
            />
            <Link
              href={url}
              target="_self"
              onFocus={onFocus}
              disabled={!url}
              border={{ top: false, bottom: { keepVisible: true } }}
            >
              <Text type="text2" skeleton={skeleton}>
                {Translate({
                  ...context,
                  label: "reviewLinkText",
                })}
              </Text>
            </Link>
          </div>
        )}
      </div>
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
    pid: "Some pid",
    creators: [
      {
        display: "Some creator",
      },
    ],
    access: [
      {
        __typename: "InfomediaService",
        id: "Some id",
      },
    ],
    hostPublication: {
      title: "Some host publication",
      issue: "2005-06-24",
    },
    recordCreationDate: "20050627",
    review: {
      rating: "5/6",
    },
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
  const { isSkeleton } = props;

  if (isSkeleton) {
    return <InfomediaReviewSkeleton />;
  }

  return <InfomediaReview {...props} />;
}

// PropTypes for component
Wrap.propTypes = {
  workId: PropTypes.string,
  type: PropTypes.string,
  skeleton: PropTypes.bool,
};
