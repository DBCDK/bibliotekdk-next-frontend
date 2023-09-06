import PropTypes from "prop-types";
import HelpText from "../HelpText";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import HelpTextMenu from "@/components/help/menu";

import styles from "./Page.module.css";

/**
 * HelpText page React component
 *
 * @param  {Object} props
 * See propTypes for specific props and types
 *
 * @returns {JSX.Element}
 */
export default function HelpTextPage({ helpTextId }) {
  return (
    <Container fluid className={styles.content}>
      <Row>
        <Col md={3} className={styles.helpmenu}>
          <HelpTextMenu helpTextId={helpTextId} />
        </Col>
        <Col lg={6} md={9} className={styles.helptext}>
          <HelpText helpTextId={helpTextId} />
        </Col>
      </Row>
    </Container>
  );
}

HelpTextPage.propTypes = {
  helpTextId: PropTypes.string,
};
