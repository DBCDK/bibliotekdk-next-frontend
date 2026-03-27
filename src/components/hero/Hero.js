import styles from "./Hero.module.css";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import React from "react";
import Title from "@/components/base/title";
import Icon from "@/components/base/icon";

import Translate from "@/components/base/translate";
import Image from "@/components/base/image";
import { useData } from "@/lib/api/api";
import { cmsFrontpage, getCmsFrontpage } from "@/lib/api/frontpage.fragments";
import Text from "@/components/base/text/Text";
import useSiteConfig from "@/components/hooks/useSiteConfig";

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

export function parseCmsHero(data) {
  const frontpage = getCmsFrontpage(data);
  if (!frontpage?.hero?.image?.url) return null;
  return {
    description: frontpage.hero.description,
    image: {
      alt: frontpage.hero.alternativeText || "",
      url: frontpage.hero.image.url,
      width: frontpage.hero.image.width,
      height: frontpage.hero.image.height,
      ogurl: frontpage.hero.image.url,
    },
  };
}

export default function Wrap() {
  const { hero } = useSiteConfig();
  const useSiteHero = !!hero?.path;
  const { data: cmsData } = useData(!useSiteHero && cmsFrontpage());

  const heroImage = useSiteHero
    ? {
        description: hero?.description,
        image: {
          alt: hero?.alt || "",
          url: hero.path,
        },
      }
    : parseCmsHero(cmsData);

  return <Hero image={heroImage} />;
}
