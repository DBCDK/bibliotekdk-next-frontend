import PropTypes from "prop-types";

import { HelpText, HelpTextMenu } from "./HelpText";
import { useData } from "@/lib/api/api";
import * as helpTextFragments from "@/lib/api/helptexts.fragments";
import styles from "@/components/header/Header.module.css";
import { Col, Container, Row } from "react-bootstrap";
import React from "react";
import { HelpTextHeader } from "@/components/helptexts/HelpTextHeader";

/**
 * HelpText page React component
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function HelpTextPage({ helptxtId }) {
  const data = useData(helpTextFragments.helpText(helptxtId));

  if (!data.data || !data.data.helptext || data.isLoading || data.error) {
    return null;
  }

  const helptext = data.data.helptext;

  return (
    <Container className={styles.header} fluid>
      <Row>
        <Col>
          <HelpTextHeader />
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 3 }}>
          <HelpTextMenu helpTextId={helptxtId} />
        </Col>
        <Col md={{ span: 9 }}>
          <HelpText helptext={helptext} />
        </Col>
      </Row>
    </Container>
  );
}

HelpTextPage.propTypes = {
  helptxtId: PropTypes.string,
};
