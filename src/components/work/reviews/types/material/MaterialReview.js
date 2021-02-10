import { useMemo } from "react";
import PropTypes from "prop-types";
import { Row, Col } from "react-bootstrap";

import { cyKey } from "@/utils/trim";

import Text from "@/components/base/text";
import Title from "@/components/base/title";
import Icon from "@/components/base/icon";
import Link from "@/components/base/link";
import Translate from "@/components/base/translate";

import styles from "./MaterialReview.module.css";

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export function MaterialReview({
  className = "",
  data = [],
  skeleton = false,
  onFocus = null,
}) {
  // Translate Context
  const context = { context: "reviews" };

  const bib = "https://bibliotek.dk/";

  return (
    <Col
      xs={12}
      className={`${styles.materialReview} ${className}`}
      data-cy={cyKey({ prefix: "review", name: "material" })}
    >
      <Row>
        <Col xs={6} xl={4} className={styles.type}>
          <Link
            href={bib}
            target="_blank"
            border={
              !skeleton ? { top: false, bottom: { keepVisible: true } } : false
            }
          >
            <Text type="text3" skeleton={skeleton} lines={1}>
              {Translate({ ...context, label: "materialTitle" })}
            </Text>
          </Link>
        </Col>
        <Col
          xs={{ span: 12, order: 3 }}
          xl={{ span: 4, order: 2 }}
          className={styles.author}
        >
          <Text type="text3" skeleton={skeleton} lines={1}>
            {Translate({ context: "general", label: "by" })}
          </Text>
          <Link
            href={bib}
            target="_blank"
            border={
              !skeleton ? { top: false, bottom: { keepVisible: true } } : false
            }
          >
            <Text type="text3" skeleton={skeleton} lines={1}>
              {data.author}
            </Text>
          </Link>
        </Col>
        <Col xs={6} xl={{ span: 4, order: 3 }} className={styles.date}>
          <Text type="text3" skeleton={skeleton} lines={1}>
            {data.date}
          </Text>
        </Col>
      </Row>

      <Col xs={12} className={styles.content}>
        <LectorReview data={data} skeleton={skeleton} />
      </Col>

      {data.url && (
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
            border={{ bottom: !skeleton }}
            border={
              !skeleton ? { top: false, bottom: { keepVisible: true } } : false
            }
          >
            <Title type="title4" skeleton={skeleton} lines={1}>
              {Translate({ ...context, label: "materialReviewLinkText" })}
            </Title>
          </Link>
        </Col>
      )}
    </Col>
  );
}

function LectorReview({ data, skeleton }) {
  console.log(data, "DATA");
  return (
    <Title type="title3" lines={5} skeleton={skeleton} clamp={true}>
      {data.all &&
        data.all
          .map((paragraph) => paragraph.text)
          .filter(
            (text) =>
              !text.startsWith("Materialevurdering") &&
              !text.startsWith("Indscannet version")
          )
          .join(". ")}
    </Title>
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
export function MaterialReviewSkeleton(props) {
  const data = {
    author: "Svend Svendsen",
    media: "Jyllandsposten",
    rating: "4/5",
    reviewType: "MATERIALREVIEW",
    url: "http://",
  };

  return (
    <MaterialReview
      {...props}
      data={data}
      className={`${props.className || ""} ${styles.skeleton}`}
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
  const { data, error, isSkeleton } = props;

  if (isSkeleton) {
    return <MaterialReviewSkeleton />;
  }

  if (error) {
    return null;
  }

  return <MaterialReview {...props} />;
}

// PropTypes for component
Wrap.propTypes = {
  workId: PropTypes.string,
  type: PropTypes.string,
  skeleton: PropTypes.bool,
};
