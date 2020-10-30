import PropTypes from "prop-types";
import { Container, Row, Col } from "react-bootstrap";

import { cyKey } from "../../../../../utils/trim";

import Text from "../../../../base/text";
import Title from "../../../../base/title";
import Icon from "../../../../base/icon";
import Link from "../../../../base/link";
import Translate from "../../../../base/translate";

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
}) {
  // Translate Context
  const context = { context: "reviews" };

  const bib = "https://bibliotek.dk/";

  return (
    <Col xs={12} md={8} className={`${styles.materialReview} ${className}`}>
      <Row>
        <Col xs={6} xl={4} className={styles.type}>
          <Text type="text3">
            <Link href={bib} target="_blank">
              {Translate({ ...context, label: "materialTitle" })}
            </Link>
          </Text>
        </Col>
        <Col
          xs={{ span: 12, order: 3 }}
          xl={{ span: 4, order: 2 }}
          className={styles.author}
        >
          <Text type="text3">
            {Translate({ context: "general", label: "by" })}
            <Link href={bib} target="_blank">
              <Text type="text3">{data.author}</Text>
            </Link>
          </Text>
        </Col>
        <Col xs={6} xl={4} className={styles.date}>
          <Text type="text3">07/07-2010</Text>
        </Col>
      </Row>

      <Col xs={12} className={styles.content}>
        <Title type="title3">
          For alle, der holder af en god afdæmpet historie. Forsiden - et
          sort/hvidt billede af en dieselstander - sælger ikke bogen, men det
          gør navnet og vor aktive formidling
        </Title>
      </Col>

      {data.url && (
        <Col xs={12} className={styles.url}>
          <Icon src="chevron.svg" size={2} />
          <Link href={data.url} target="_blank">
            <Title type="title4">
              {Translate({ ...context, label: "materialReviewLinkText" })}
            </Title>
          </Link>
        </Col>
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
export function MaterialReviewSkeleton(props) {
  const data = {};

  return (
    <MaterialReview
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
