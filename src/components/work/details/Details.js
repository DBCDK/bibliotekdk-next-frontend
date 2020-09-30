import PropTypes from "prop-types";
import { Row, Col } from "react-bootstrap";

import Section from "../../base/section";
import Skeleton from "../../base/skeleton";
import Text from "../../base/text";

import styles from "./Details.module.css";

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
function Details({ children = "", className = "", data = {} }) {
  return (
    <Section title="Detaljer">
      <Row className={`${styles.details} ${className}`}>
        {data.lang && (
          <Col xs={12} md>
            <Text type="text3" className={styles.title}>
              Sprog
            </Text>
            <Text type="text4">{data.lang}</Text>
          </Col>
        )}
        {data.pages && (
          <Col xs={12} md>
            <Text type="text3" className={styles.title}>
              Sideantal
            </Text>
            <Text type="text4">{data.pages}</Text>
          </Col>
        )}
        {data.released && (
          <Col xs={12} md>
            <Text type="text3" className={styles.title}>
              Udgivet
            </Text>
            <Text type="text4">{data.released}</Text>
          </Col>
        )}
        {data.contribution && (
          <Col xs={12} md>
            <Text type="text3" className={styles.title}>
              Bidrag
            </Text>
            {data.contribution.map((c, i) => {
              // Array length
              const l = data.contribution.length;
              // Trailing comma
              const t = i + 1 === l ? "" : ", ";
              return (
                <Text type="text4" key={`${c}-${i}`}>
                  {c + t}
                </Text>
              );
            })}
          </Col>
        )}
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
  const data = {
    lang: "danglish",
    pages: "123",
    released: "2020",
    contribution: ["some contributor", "some other contributor"],
  };

  if (props.skeleton) {
    return <DetailsSkeleton {...props} />;
  }

  return <Details {...props} data={data} />;
}

// PropTypes for component
Wrap.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  skeleton: PropTypes.bool,
};
