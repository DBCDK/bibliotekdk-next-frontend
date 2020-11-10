import PropTypes from "prop-types";
import { Container, Row, Col } from "react-bootstrap";

import Title from "@/components/base/title";

import styles from "./Section.module.css";

/**
 * Divider function
 *
 * @returns {component}
 */
function Divider() {
  return <div className={styles.divider} />;
}

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function Section({
  title = "Some section",
  children = "...",
  className = "",
  bgColor = null,
}) {
  const backgroundColor = bgColor;
  const backgroundClass = bgColor ? styles.background : "";

  return (
    <div className={`${backgroundClass}`} style={{ backgroundColor }}>
      <Container>
        <Row as="section" className={`${styles.section} ${className}`}>
          <Col xs={12} md={2}>
            <Divider />
            <Title type="title4">{title}</Title>
          </Col>
          <Col xs={12} md={{ offset: 1 }}>
            <Divider />
            {children}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

// PropTypes for component
Section.propTypes = {
  bgColor: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};
