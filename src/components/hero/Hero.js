import styles from "./Hero.module.css";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import React from "react";
import Title from "@/components/base/title";
import Icon from "@/components/base/icon";

import FakeSearchInput from "@/components/header/suggester/FakeSearchInput";
import Translate from "@/components/base/translate";
import Image from "@/components/base/image";
import { useData } from "@/lib/api/api";
import { frontpageHero } from "@/lib/api/hero.fragments";
import Text from "@/components/base/text/Text";

//@TODO switch backclass for mobile
// @TODO image scale on resize
export function Hero({ image }) {
  return (
    <Container className={styles.containerback} fluid>
      {image?.image?.url && (
        <Image
          src={`${image?.image?.url}`}
          layout="fill"
          priority={true}
          objectFit="cover"
          alt=""
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
              label: "heroTxt",
            })}
          </Title>

          <FakeSearchInput className={styles.fakesearchinput} />
        </Col>
        <Col md={2} xs={1} />
        <div className={styles.bluebox}>
          <div className={styles.iconandtxt}>
            <Icon
              src={"ornament1white.svg"}
              size={{ w: 8, h: "auto" }}
              alt=""
              className={styles.heroicon}
            />

            <Title type="title2" className={styles.herotitle} tag="h1">
              {Translate({
                context: "general",
                label: "heroTxt",
              })}
            </Title>
          </div>
          <Text type="text2" className={styles.herobluetxt}>
            {Translate({
              context: "general",
              label: "readMore",
            })}
          </Text>
        </div>
        {image?.description && (
          <Text type="text2" className={styles.herodescription}>
            {`${image?.description}`}
          </Text>
        )}
      </Row>
    </Container>
  );
}

export function parseHero(data) {
  const heros =
    data?.nodeQuery?.entities &&
    data.nodeQuery.entities.filter(
      (hero) => hero && hero.__typename === "NodeHeroFrontpage"
    );
  // grab the first - entities are sorted by last edit
  return (
    heros &&
    heros[0] && {
      description: heros[0].fieldHeroDescription,
      image: {
        alt: heros[0].fieldImage.alt,
        url: heros[0].fieldImage.url,
        width: heros[0].fieldImage.width,
        height: heros[0].fieldImage.height,
        ogurl: "/_next/image?url=" + heros[0].fieldImage.url + "&w=3840&q=75",
      },
    }
  );
}

export default function Wrap() {
  const { data } = useData(frontpageHero());
  const heroImage = parseHero(data);
  return <Hero image={heroImage} />;
}
