import PropTypes from "prop-types";
import { Container, Row, Col } from "react-bootstrap";

import Title from "@/components/base/title";

import { cyKey } from "@/utils/trim";

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
  children = "Some content",
  className = "",
  dataCy = "section",
  bgColor = null,
  contentDivider = <Divider />,
  titleDivider = <Divider />,
}) {
  const backgroundColor = bgColor;
  const backgroundClass = bgColor ? styles.background : "";
  title =
    typeof title === "string" ? <Title type="title4">{title}</Title> : title;
  return (
    <div
      className={`${backgroundClass}`}
      style={{ backgroundColor }}
      data-cy={dataCy}
    >
      <Container>
        <Row as="section" className={`${styles.section} ${className}`}>
          <Col
            xs={12}
            md={2}
            data-cy={cyKey({ name: "title", prefix: "section" })}
          >
            {titleDivider}
            {title}
          </Col>
          <Col
            xs={12}
            md={{ offset: 1 }}
            data-cy={cyKey({ name: "content", prefix: "section" })}
          >
            {contentDivider}
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
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
  ]),
  dataCy: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
  ]),
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};
