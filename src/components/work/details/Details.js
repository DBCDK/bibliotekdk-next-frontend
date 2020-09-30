import PropTypes from "prop-types";
import { Container, Row, Col } from "react-bootstrap";

import Section from "../../base/section";
import Skeleton from "../../base/skeleton";
import Title from "../../base/title";

import styles from "./Details.module.css";

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
function Details({ children = "", className = "" }) {
  return (
    <Section>
      <div className={`${styles.details} ${className}`}>{children}</div>
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
function DetailsSkeleton(props) {
  return (
    <Details {...props} className={`${props.className} ${styles.skeleton}`}>
      <Skeleton />
      {props.children}
    </Details>
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
  if (props.skeleton) {
    return <DetailsSkeleton {...props} />;
  }

  return <Details {...props} />;
}

// PropTypes for component
Wrap.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  skeleton: PropTypes.bool,
};
