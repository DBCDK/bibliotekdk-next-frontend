import PropTypes from "prop-types";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

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
 * @returns {JSX.Element}
 */
export function Description({ className = "", data = "", skeleton = false }) {
  if (!data || data?.length === 0) {
    return null;
  }
  // Translate Context
  const context = { context: "description" };

  return (
    <Section title={Translate({ ...context, label: "title" })}>
      <Row className={`${styles.description} ${className}`}>
        {data && (
          <Col xs={12} md>
            <Text
              dataCy={"description"}
              type="text2"
              skeleton={skeleton}
              lines={4}
            >
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
 * @returns {JSX.Element}
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
 * @returns {JSX.Element}
 */
export default function Wrap(props) {
  const { workId } = props;

  const { data, isLoading, error } = useData(
    workFragments.description({ workId })
  );

  if (isLoading) {
    return <DescriptionSkeleton />;
  }

  if (error) {
    return null;
  }

  return <Description {...props} data={data?.work?.abstract} />;
}

// PropTypes for component
Wrap.propTypes = {
  workId: PropTypes.string,
  type: PropTypes.arrayOf(PropTypes.string),
  skeleton: PropTypes.bool,
};
