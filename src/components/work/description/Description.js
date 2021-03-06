import PropTypes from "prop-types";
import { Row, Col } from "react-bootstrap";

import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";

import Section from "@/components/base/section";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";

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
  if (!data) {
    return null;
  }
  // Translate Context
  const context = { context: "description" };

  return (
    <Section title={Translate({ ...context, label: "title" })} topSpace={true}>
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
