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
          height="560"
        />
      )}
      <div className={styles.gradient} />
      <Row className={styles.herotopmargin}>
        <Col
          lg={{ span: 3 }}
          xs={{ span: 0 }}
          className={styles.heroicon}
        ></Col>

        <Col
          lg={{ span: 9, offset: 0 }}
          md={{ span: 8, offset: 2 }}
          sm={{ span: 10, offset: 1 }}
          xs={{ span: 12, offset: 0 }}
          className={styles.heromargin}
        >
          <Title type="title2" className={styles.heromobiletxt}>
            {Translate({
              context: "general",
              label: "heroTxt",
            })}
          </Title>

          <FakeSearchInput className={styles.fakesearchinput} />
        </Col>
        <Col md={{ span: 2 }} xs={{ span: 1 }} />
        <div className={styles.bluebox}>
          <div className={styles.iconandtxt}>
            <Icon
              src={"ornament1white.svg"}
              size={{ w: 8, h: "auto" }}
              alt=""
              className={styles.heroicon}
            />

            <Title type="title2" className={styles.herotitle}>
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

export default function wrap() {
  const { isLoading, data } = useData(frontpageHero());
  const heroImage = parseHero(data);
  return <Hero image={heroImage} />;
}
