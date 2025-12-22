import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Text from "@/components/base/text/Text";
import Translate from "@/components/base/translate";
import { IconLink } from "../base/iconlink/IconLink";

import Bubble from "@/public/icons/bubble.svg";
import styles from "./Banner.module.css";

export default function Banner() {
  return (
    <div className={styles.bannerWrap}>
      <Container className={styles.banner} fluid data-cy="top-banner">
        <Row>
          <Col className={styles.content}>
            <IconLink
              className={styles.link}
              href="/hjaelp/kontakt-os/25"
              dataCy="header-link-askLibrarian"
              iconSrc={Bubble}
              border={{ top: false, bottom: { keepVisible: false } }}
            >
              {Translate({ context: "header", label: "askLibrarian" })}
            </IconLink>

            <span className={styles.pipe} />

            <Text type="text3" className={styles.text}>
              {Translate({ context: "header", label: "banner-text" })}
            </Text>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
