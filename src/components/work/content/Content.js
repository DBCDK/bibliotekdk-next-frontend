import PropTypes from "prop-types";
import { Row, Col } from "react-bootstrap";

import Section from "../../base/section";
import Text from "../../base/text";

import dummy_materialTypesApi from "../dummy.materialTypesApi";

import styles from "./Content.module.css";

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
function Content({ className = "", data = {}, skeleton = false }) {
  return (
    <Section title="Indhold">
      <Row className={`${styles.content} ${className}`}>
        {data.notes &&
          data.notes.map((n) => {
            return (
              <Col key={n} xs={12}>
                <Text type="text3" skeleton={skeleton} lines={8}>
                  {n}
                </Text>
              </Col>
            );
          })}
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
function ContentSkeleton(props) {
  return (
    <Content
      {...props}
      data={{ notes: ["..."] }}
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
    return <ContentSkeleton {...props} data={data[workId]} />;
  }

  return <Content {...props} data={data[workId]} />;
}

// PropTypes for component
Wrap.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  skeleton: PropTypes.bool,
};
