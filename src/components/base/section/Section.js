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
  bgColor = null,
  topSpace = false,
  contentDivider = <Divider />,
  titleDivider = <Divider />,
  // to hide entire section
  hide = false,
}) {
  const backgroundColor = bgColor;
  const backgroundClass = bgColor ? styles.background : "";

  const topSpaceClass = topSpace ? styles.topSpace : "";

  const noContentDividerClass = !contentDivider ? styles.noContentDivider : "";
  const noTitleDividerClass = !titleDivider ? styles.noTitleDivider : "";

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
    <div className={`${topSpaceClass} ${hide ? styles.hide : ""}`}>
      <div
        className={`${backgroundClass} ${className} `}
        style={{ backgroundColor }}
        data-cy={dataCy}
      >
        <Container fluid>
          <Row as="section" className={`${styles.section}`}>
            {title && (
              <Col
                xs={12}
                lg={2}
                data-cy={cyKey({ name: "title", prefix: "section" })}
                className={noTitleDividerClass}
              >
                {titleDivider}
                {title}
              </Col>
            )}
            <Col
              xs={12}
              lg={{ offset: title ? 1 : 0 }}
              data-cy={cyKey({ name: "content", prefix: "section" })}
              className={noContentDividerClass}
            >
              {contentDivider}
              {children}
            </Col>
          </Row>
        </Container>
      </div>
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
    PropTypes.bool,
  ]),
  dataCy: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
  ]),
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  hide: PropTypes.bool,
};
