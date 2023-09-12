import PropTypes from "prop-types";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import Title from "@/components/base/title";
import Text from "@/components/base/text";

import { cyKey } from "@/utils/trim";

import styles from "./Section.module.css";
import useBreakpoint from "@/components/hooks/useBreakpoint";
import cx from "classnames";

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
  //if true the title will be shown on the right side instead of the left side
  rightSideTitle = false,
  children = "",
  className = "",
  dataCy = "section",
  isLoading = false,
  backgroundColor = null,
  divider = {},
  space = {},
  elRef = null,
  subtitle = "",
  headerTag = "h2",
  sectionTag = "section",
  id,
  colSize={}
}) {
  const breakpoint = useBreakpoint();
  const isDesktop = breakpoint === "lg" || breakpoint === "xl";
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
        <Title type="title4" tag={headerTag} skeleton={isLoading}>
          {title}
        </Title>
      ) : (
        title
      );
  }
  //Only show the title on the right side if desktop
  rightSideTitle = rightSideTitle && isDesktop;

  return (
    <div
      className={`${backgroundClass} ${className}`}
      style={style}
      data-cy={dataCy}
      ref={elRef}
      id={id}
      tabIndex={!!id ? -1 : null} // If id is sat, we wont the ability to set focus on element - used for skip links
    >
      <Container fluid>
        <Row as={sectionTag}>
          {title && !rightSideTitle && (
            <Col
              xs={12}
              lg={2}
              data-cy={cyKey({ name: "title", prefix: "section" })}
              className={`section-title ${styles.title} ${titleDividerClass}`}
            >
              {divider?.title}
              {title}
              {subtitle && <Text type="text2">{subtitle}</Text>}
            </Col>
          )}

          <Col
            xs={12}
            lg={colSize.lg || { offset: title ? 1 : 0, span: true }}
            data-cy={cyKey({ name: "content", prefix: "section" })}
            className={`section-content ${styles.content} ${contentDividerClass}`}
          >
            {divider?.content}
            {children}
          </Col>
          {title && rightSideTitle && (
            <Col
              xs={12}
              lg={2}
              data-cy={cyKey({ name: "title", prefix: "section" })}
              className={cx('section-title', styles.title, titleDividerClass, styles.rightSideTitle)}
            >
              {divider?.title}
              {title}
              {subtitle && <Text type="text2">{subtitle}</Text>}
            </Col>
          )}
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
  space: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  headerTag: PropTypes.string,
  sectionTag: PropTypes.string,
};
