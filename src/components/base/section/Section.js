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
  return <hr className={styles.divider} />;
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
  backgroundColor = null,
  divider = {},
  space = {},
}) {
  // background color class
  const backgroundClass = backgroundColor ? styles.background : "";

  // space settings can be boolean or custom
  const _space = space ? { bottom: "var(--pt8)", top: false } : {};
  space = typeof space === "object" ? { ..._space, ...space } : _space;

  // divider settings can be boolean or custom
  const _divider = divider ? { title: <Divider />, content: <Divider /> } : {};
  divider =
    typeof divider === "object" ? { ..._divider, ...divider } : _divider;

  const contentDividerClass = divider?.content ? styles.divider : "";
  const titleDividerClass = divider?.title ? styles.divider : "";

  // inline styles (custom settings)
  let style = {
    paddingTop: space?.top,
    paddingBottom: space?.bottom,
  };

  if (backgroundColor) {
    style = {
      ...style,
      backgroundColor,
      paddingTop: space?.top || "var(--pt8)",
      marginBottom: space.bottom || "var(--pt8)",
    };
  }

  // Title as component support
  if (title) {
    title =
      typeof title === "string" ? (
        <Title type="title4" tag="h2">
          {title}
        </Title>
      ) : (
        title
      );
  }

  return (
    <div
      className={`${backgroundClass} ${className}`}
      style={style}
      data-cy={dataCy}
    >
      <Container className={styles.container} fluid>
        <Row as="section" className={styles.section}>
          {title && (
            <Col
              xs={12}
              lg={2}
              data-cy={cyKey({ name: "title", prefix: "section" })}
              className={`${styles.title} ${titleDividerClass}`}
            >
              {divider?.title}
              {title}
            </Col>
          )}
          <Col
            xs={12}
            lg={{ offset: title ? 1 : 0 }}
            data-cy={cyKey({ name: "content", prefix: "section" })}
            className={`${styles.content} ${contentDividerClass}`}
          >
            {divider?.content}
            {children}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

// PropTypes for component
Section.propTypes = {
  title: PropTypes.any,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
  ]),
  dataCy: PropTypes.string,
  backgroundColor: PropTypes.string,
  divider: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  space: PropTypes.object,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};
