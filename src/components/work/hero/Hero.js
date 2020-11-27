import styles from "@/components/work/hero/Hero.module.css";
import { Col, Container, Row } from "react-bootstrap";
import React from "react";

import Title from "@/components/base/title";
import Icon from "@/components/base/icon";
import Translate from "@/components/base/translate";

//@TODO switch backclass for mobile
// @TODO image scale on resize
export default function Hero() {
  return (
    <Container className={styles.containerback}>
      <Row>
        <Col md={{ span: 3 }} xs="3" className={styles.heromargin}>
          <Icon src={"ornament1white.svg"} size={4} />
        </Col>
        <Col md={{ span: 7 }} xs={{ span: 7 }} className={styles.heromargin}>
          <Title type="title1" className={styles.herotitle}>
            {Translate({
              context: "general",
              label: "heroTxt",
            })}
          </Title>
        </Col>
        <Col md={{ span: 2 }} xs={{ span: 2 }} />
      </Row>
    </Container>
  );
}
