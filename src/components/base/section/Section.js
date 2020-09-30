import PropTypes from "prop-types";
import { Container, Row, Col } from "react-bootstrap";

import Skeleton from "../skeleton";
import Title from "../title";

import styles from "./Section.module.css";

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
function Section({ children = "", className = "" }) {
  return (
    <section className={`${styles.section} ${className}`}>{children}</section>
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
function SectionSkeleton(props) {
  return (
    <Section {...props} className={`${props.className} ${styles.skeleton}`}>
      <Skeleton />
      {props.children}
    </Section>
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
    return <SectionSkeleton {...props} />;
  }

  return <Section {...props} />;
}

// PropTypes for component
Wrap.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  skeleton: PropTypes.bool,
};
