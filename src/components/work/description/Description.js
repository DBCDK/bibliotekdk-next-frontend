import PropTypes from "prop-types";
import { Row, Col } from "react-bootstrap";
import { useData } from "../../../lib/api/api";

import Section from "../../base/section";
import Text from "../../base/text";
import * as workFragments from "../../../lib/api/work.fragments";

import styles from "./Description.module.css";

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export function Description({ className = "", data = "", skeleton = false }) {
  return (
    <Section title="Beskrivelse">
      <Row className={`${styles.description} ${className}`}>
        {data && (
          <Col xs={12} md>
            <Text type="text2" skeleton={skeleton} lines={4}>
              {data}
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
export function DescriptionSkeleton(props) {
  return (
    <Description
      {...props}
      data="..."
      className={`${props.className} ${styles.skeleton}`}
      skeleton={true}
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
  const { workId } = props;

  const { data, isLoading, error } = useData(workFragments.basic({ workId }));

  if (isLoading) {
    return <DescriptionSkeleton />;
  }

  if (error) {
    return null;
  }

  return <Description {...props} data={data.work.description} />;
}

// PropTypes for component
Wrap.propTypes = {
  workId: PropTypes.string,
  type: PropTypes.string,
  skeleton: PropTypes.bool,
};
