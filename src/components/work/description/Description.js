import PropTypes from "prop-types";
import { Row, Col } from "react-bootstrap";

import Section from "../../base/section";
import Text from "../../base/text";

import dummy_materialTypesApi from "../dummy.materialTypesApi";

import styles from "./Description.module.css";

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
function Description({ className = "", data = {}, skeleton = false }) {
  return (
    <Section title="Beskrivelse">
      <Row className={`${styles.description} ${className}`}>
        {data.description && (
          <Col xs={12} md>
            <Text type="text2" skeleton={skeleton} lines={4}>
              {data.description}
            </Text>
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
function DescriptionSkeleton(props) {
  return (
    <Description
      {...props}
      data={{ description: "..." }}
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
    return <DescriptionSkeleton {...props} data={data[workId]} />;
  }

  return <Description {...props} data={data[workId]} />;
}

// PropTypes for component
Wrap.propTypes = {
  workId: PropTypes.string,
  type: PropTypes.string,
  skeleton: PropTypes.bool,
};
