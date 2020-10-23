import PropTypes from "prop-types";
import { Container, Row, Col } from "react-bootstrap";

import { useData } from "../../../lib/api/api";
import * as workFragments from "../../../lib/api/work.fragments";

import { cyKey } from "../../../utils/trim";

import Section from "../../base/section";
import Translate from "../../base/translate";

import InfomediaReview from "./types/infomedia/InfomediaReview";
import MaterialReview from "./types/material/MaterialReview";

import styles from "./Reviews.module.css";

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export function Reviews({ className = "", data = [], skeleton = false }) {
  // Translate Context
  const context = { context: "reviews" };

  const Review = InfomediaReview;

  return (
    <Section
      title={Translate({ ...context, label: "title", vars: ["10"] })}
      bgColor="var(--parchment)"
    >
      <Row>
        <Col xs={12} md={4}>
          <Review />
        </Col>
      </Row>
    </Section>
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
export function ReviewsSkeleton(props) {
  const data = {};

  return (
    <Reviews
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
  const { workId, type, skeleton } = props;

  // Call materialTypes mockdata API
  const { data, isLoading, error } = useData(workFragments.reviews({ workId }));

  if (isLoading) {
    return <ReviewsSkeleton />;
  }

  if (error) {
    return null;
  }

  return <Reviews {...props} data={data.work.reviews} />;
}

// PropTypes for component
Wrap.propTypes = {
  workId: PropTypes.string,
  type: PropTypes.string,
  skeleton: PropTypes.bool,
};
