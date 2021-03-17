import PropTypes from "prop-types";
import HelpText from "../HelpText";
import styles from "../HelpTexts.module.css";
import { Col, Container, Row } from "react-bootstrap";
import HelpTextHeader from "@/components/help/header";
import HelpTextMenu from "../menu/HelpTextMenu";

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
    <React.Fragment>
      <HelpTextHeader />
      <Container fluid>
        <Row>
          <Col md={{ span: 3 }} className={styles.helpmenu}>
            <HelpTextMenu helpTextID={helptxtId} />
          </Col>
          <Col md={{ span: 9 }} xs={{ span: 12 }} className={styles.helptext}>
            <HelpText helpTextID={helptxtId} />
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
}

HelpTextPage.propTypes = {
  helptxtId: PropTypes.string,
};
