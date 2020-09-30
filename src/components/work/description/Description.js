import PropTypes from "prop-types";
import { Row, Col } from "react-bootstrap";

import Section from "../../base/section";
import Skeleton from "../../base/skeleton";
import Text from "../../base/text";

import styles from "./Description.module.css";

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
function Description({ children = "", className = "", data = {} }) {
  return (
    <Section title="Beskrivelse">
      <Row className={`${styles.details} ${className}`}>
        {data.description && (
          <Col xs={12} md>
            <Text type="text2">{data.description}</Text>
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
    <Description {...props} className={`${props.className} ${styles.skeleton}`}>
      <Skeleton />
      {props.children}
    </Description>
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
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ultrices leo facilisis, sagittis ligula nec, dapibus purus. Phasellus blandit nisl vitae dignissim eleifend. In dictum tortor ex, vitae aliquam magna dictum in. Pellentesque condimentum metus eu dolor faucibus rhoncus. Duis eu dolor nisl. Donec ullamcorper augue varius eleifend maximus. Aliquam erat volutpat. Phasellus ut quam et ipsum varius efficitur et a leo.",
  };

  if (props.skeleton) {
    return <DescriptionSkeleton {...props} />;
  }

  return <Description {...props} data={data} />;
}

// PropTypes for component
Wrap.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  skeleton: PropTypes.bool,
};
