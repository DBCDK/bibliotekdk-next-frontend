import PropTypes from "prop-types";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

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

// function to replace true with a 'default' value and false with a 'null'
function handleBooleans(obj, def) {
  const c = {};
  if (typeof obj === "object") {
    Object.entries(obj).forEach(
      ([k, v]) => (c[k] = v === true ? def : v === false ? null : v)
    );
  }
  return c;
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
  children = "",
  className = "",
  dataCy = "section",
  isLoading = false,
  backgroundColor = null,
  divider = {},
  space = {},
  elRef = null,
}) {
  const backgroundClass = backgroundColor ? styles.background : "";

  // default space setting
  const defSpace = { bottom: "var(--pt8)" };
  // support true/false on object attribute level
  const _space = handleBooleans(space, "var(--pt8)");
  space = space === false ? {} : { ...defSpace, ..._space };

  // default divider setting
  const defDivider = { title: <Divider />, content: <Divider /> };
  // support true/false on object attribute level
  const _divider = handleBooleans(divider, <Divider />);
  divider = divider === false ? {} : { ...defDivider, ..._divider };

  // divider class'
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
      marginBottom: defSpace.bottom || "var(--pt8)",
    };
  }

  // Title as component support
  if (title) {
    title =
      typeof title === "string" ? (
        <Title type="title4" tag="h2" skeleton={isLoading}>
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
      ref={elRef}
    >
      <Container className={styles.container} fluid>
        <Row as="section" className={styles.section}>
          {title && (
            <Col
              xs={12}
              lg={2}
              data-cy={cyKey({ name: "title", prefix: "section" })}
              className={`section-title ${styles.title} ${titleDividerClass}`}
            >
              {divider?.title}
              {title}
            </Col>
          )}
          <Col
            xs={12}
            lg={{ offset: title ? 1 : 0 }}
            data-cy={cyKey({ name: "content", prefix: "section" })}
            className={`section-content ${styles.content} ${contentDividerClass}`}
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
    PropTypes.bool,
  ]),
  dataCy: PropTypes.string,
  isLoading: PropTypes.bool,
  backgroundColor: PropTypes.string,
  divider: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  space: PropTypes.object,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};
