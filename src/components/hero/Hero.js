import styles from "@/components/hero/Hero.module.css";
import { Col, Container, Row } from "react-bootstrap";
import React from "react";

import Title from "@/components/base/title";
import Icon from "@/components/base/icon";
import Translate from "@/components/base/translate";

//@TODO switch backclass for mobile
// @TODO image scale on resize
export default function Hero() {
  return (
    <Container className={styles.containerback} fluid>
      <Row>
        <Col md={{ span: 3 }} xs={{ span: 0 }} className={styles.heroicon}>
          <Icon src={"ornament1white.svg"} size={{ w: 13, h: "auto" }} />
        </Col>
        <Col
          md={{ span: 7, offset: 0 }}
          xs={{ span: 10, offset: 0 }}
          className={styles.heromargin}
        >
          <Title type="title1" className={styles.herotitle}>
            {Translate({
              context: "general",
              label: "heroTxt",
            })}
          </Title>
        </Col>
        <Col md={{ span: 2 }} xs={{ span: 1 }} />
      </Row>
    </Container>
  );
}
