import PropTypes from "prop-types";
import HelpText from "../HelpText";
import { Col, Container, Row } from "react-bootstrap";
import HelpTextMenu from "@/components/help/menu";

import styles from "./Page.module.css";

/**
 * HelpText page React component
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function HelpTextPage({ helptxtId }) {
  return (
    <Container fluid className={styles.content}>
      <Row>
        <Col md={{ span: 3 }} className={styles.helpmenu}>
          <HelpTextMenu helpTextID={helptxtId} />
        </Col>
        <Col lg={{ span: 6 }} md={{ span: 9 }} className={styles.helptext}>
          <HelpText helpTextID={helptxtId} />
        </Col>
      </Row>
    </Container>
  );
}

HelpTextPage.propTypes = {
  helptxtId: PropTypes.string,
};
