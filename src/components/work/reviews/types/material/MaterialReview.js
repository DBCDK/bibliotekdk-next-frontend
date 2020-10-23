import PropTypes from "prop-types";

import { cyKey } from "../../../../../utils/trim";

import Title from "../../../../base/title";
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

  return <div>some materialreview</div>;
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

  // get subjects from response
  const subjects = data.work.subjects;

  return <MaterialReview {...props} data={subjects} />;
}

// PropTypes for component
Wrap.propTypes = {
  workId: PropTypes.string,
  type: PropTypes.string,
  skeleton: PropTypes.bool,
};
