import styles from "./Hero.module.css";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import React from "react";
import Title from "@/components/base/title";

import FakeSearchInput from "@/components/header/suggester/FakeSearchInput";
import Translate from "@/components/base/translate";
import Image from "@/components/base/image";

import Text from "@/components/base/text/Text";
import useAgencyFromSubdomain from "@/components/hooks/useSubdomainToAgency";

//@TODO switch backclass for mobile
// @TODO image scale on resize
export function Hero({ heroTxts }) {
  const { agency, heroPath } = useAgencyFromSubdomain();

  return (
    <Container className={styles.containerback} fluid>
      {heroPath && (
        <Image
          src={`${heroPath}`}
          layout="fill"
          priority={true}
          objectFit="cover"
          alt={agency?.name}
        />
      )}
      <div className={styles.gradient} />
      <Row className={styles.herotopmargin}>
        <Col lg={3} xs={0} className={styles.heroicon} />
        <Col
          lg={{ span: 9, offset: 0 }}
          md={{ span: 8, offset: 2 }}
          sm={{ span: 10, offset: 1 }}
          xs={{ span: 12, offset: 0 }}
        >
          <Title type="title2" className={styles.heromobiletxt} tag="h1">
            {Translate({
              context: "general",
              label: heroTxts["heroTxt"],
            })}
          </Title>

          <FakeSearchInput className={styles.fakesearchinput} />
        </Col>
        <Col md={2} xs={1} />
        <div className={styles.bluebox}>
          <Title type="title2" className={styles.herotitle} tag="h1">
            {Translate({
              context: "general",
              label: heroTxts["heroTxt"],
            })}
          </Title>
          <Text type="text2" className={styles.herobluetxt}>
            {Translate({
              context: "general",
              label: heroTxts["readMore"],
            })}
          </Text>
        </div>
        {agency?.name && (
          <Text type="text2" className={styles.herodescription}>
            {`${agency.name}`}
          </Text>
        )}
      </Row>
    </Container>
  );
}

export default function Wrap() {
  const { heroTxts } = useAgencyFromSubdomain();
  return <Hero heroTxts={heroTxts} />;
}
