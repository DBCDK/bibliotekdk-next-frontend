import styles from "@/components/hero/Hero.module.css";
import { Col, Container, Row } from "react-bootstrap";
import React from "react";

import Title from "@/components/base/title";
import Button from "@/components/base/button";
import Icon from "@/components/base/icon";

import FakeSearchInput from "@/components/header/suggester/FakeSearchInput";
import Translate from "@/components/base/translate";
import Image from "@/components/base/image";
import Link from "@/components/base/link";

//@TODO switch backclass for mobile
// @TODO image scale on resize
export default function Hero() {
  return (
    <Container className={styles.containerback} fluid>
      <Image
        src="/img/bibdk-hero-scaled.jpeg"
        layout="fill"
        priority={true}
        objectFit="cover"
      />
      <Row>
        <Col lg={{ span: 3 }} xs={{ span: 0 }} className={styles.heroicon}>
          <Icon src={"ornament1white.svg"} size={{ w: 5, h: "auto" }} />
        </Col>

        <Col
          lg={{ span: 9, offset: 0 }}
          md={{ span: 8, offset: 2 }}
          sm={{ span: 10, offset: 1 }}
          xs={{ span: 12, offset: 0 }}
          className={styles.heromargin}
        >
          <Title type="title1" className={styles.herotitle}>
            {Translate({
              context: "general",
              label: "heroTxt",
              renderAsHtml: true,
            })}
          </Title>

          <Link a={false} href={"/artikel/bibliotek.dk/6"} target="_self">
            <Button
              className={styles.readmorebutton}
              type="primary"
              size="large"
            >
              {Translate({
                context: "general",
                label: "readMore",
              })}
            </Button>
          </Link>
          <FakeSearchInput className={styles.fakesearchinput} />
        </Col>
        <Col md={{ span: 2 }} xs={{ span: 1 }} />
      </Row>
    </Container>
  );
}
