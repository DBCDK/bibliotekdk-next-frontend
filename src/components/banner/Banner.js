import Container from "react-bootstrap/Container";
import Text from "@/components/base/text/Text";
import Translate from "@/components/base/translate";

import styles from "./Banner.module.css";

export default function Banner() {
  return (
    <div className={styles.bannerWrap}>
      <Container className={styles.banner} fluid data-cy="top-banner">
        <Text type="text3">
          {Translate({ context: "header", label: "banner-text" })}
        </Text>
      </Container>
    </div>
  );
}
