import PropTypes from "prop-types";
import { Row, Col } from "react-bootstrap";

import Section from "../../base/section";
import Text from "../../base/text";

import dummy_materialTypesApi from "../dummy.materialTypesApi";

import styles from "./Details.module.css";

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
function Details({ className = "", data = {}, skeleton = false }) {
  return (
    <Section title="Detaljer" className={styles.distanceTop}>
      <Row className={`${styles.details} ${className}`}>
        {data.lang && (
          <Col xs={12} md>
            <Text
              type="text3"
              className={styles.title}
              skeleton={skeleton}
              lines={2}
            >
              Sprog
            </Text>
            <Text type="text4" skeleton={skeleton} lines={0}>
              {data.lang}
            </Text>
          </Col>
        )}
        {data.pages && (
          <Col xs={12} md>
            <Text
              type="text3"
              className={styles.title}
              skeleton={skeleton}
              lines={2}
            >
              Sideantal
            </Text>
            <Text type="text4" skeleton={skeleton} lines={0}>
              {data.pages}
            </Text>
          </Col>
        )}
        {data.released && (
          <Col xs={12} md>
            <Text
              type="text3"
              className={styles.title}
              skeleton={skeleton}
              lines={2}
            >
              Udgivet
            </Text>
            <Text type="text4" skeleton={skeleton} lines={0}>
              {data.released}
            </Text>
          </Col>
        )}
        {data.contribution && (
          <Col xs={12} md>
            <Text
              type="text3"
              className={styles.title}
              skeleton={skeleton}
              lines={3}
            >
              Bidrag
            </Text>
            {data.contribution.map((c, i) => {
              // Array length
              const l = data.contribution.length;
              // Trailing comma
              const t = i + 1 === l ? "" : ", ";
              return (
                <Text
                  type="text4"
                  key={`${c}-${i}`}
                  skeleton={skeleton}
                  lines={0}
                >
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
  const mock = {
    lang: "...",
    pages: "...",
    released: "...",
    contribution: ["..."],
  };

  return (
    <Details
      {...props}
      data={mock}
      className={`${props.className} ${styles.skeleton}`}
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
  const { workId, type } = props;

  // Call materialTypes mockdata API
  const data = dummy_materialTypesApi({ workId, type });

  if (props.skeleton) {
    return <DetailsSkeleton {...props} data={data[workId]} />;
  }

  return <Details {...props} data={data[workId]} />;
}

// PropTypes for component
Wrap.propTypes = {
  workId: PropTypes.string,
  type: PropTypes.string,
  skeleton: PropTypes.bool,
};
