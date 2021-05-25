import PropTypes from "prop-types";
import { Row, Col } from "react-bootstrap";
import { useData } from "@/lib/api/api";

import Section from "@/components/base/section";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";

import * as workFragments from "@/lib/api/work.fragments";

import styles from "./Content.module.css";

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export function Content({ className = "", data = {}, skeleton = false }) {
  if (!data.content || data.content.length === 0) {
    return null;
  }
  // Translate Context
  const context = { context: "content" };

  return (
    <Section title={Translate({ ...context, label: "title" })} topSpace={true}>
      <Row className={`${styles.content} ${className}`}>
        {data.content.map((n, i) => {
          return (
            <Col key={n + i} xs={12}>
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
export function ContentSkeleton(props) {
  return (
    <Content
      {...props}
      data={{ content: ["..."] }}
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
  const { workId, type } = props;

  const { data, isLoading, error } = useData(workFragments.details({ workId }));

  if (error) {
    return null;
  }
  if (isLoading) {
    return <ContentSkeleton {...props} />;
  }

  // find the selected matieralType, use first element as fallback
  const materialType =
    data.work.materialTypes.find((element) => element.materialType === type) ||
    data.work.materialTypes[0];

  return <Content {...props} data={materialType?.manifestations?.[0]} />;
}

// PropTypes for component
Wrap.propTypes = {
  workId: PropTypes.string,
  type: PropTypes.string,
  skeleton: PropTypes.bool,
};
