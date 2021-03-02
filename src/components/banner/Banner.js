import styles from "./Banner.module.css";
import { Container } from "react-bootstrap";
import Text from "@/components/base/text/Text";
import Translate from "@/components/base/translate";

export default function Banner() {
  return (
    <div className={styles.bannerWrap}>
      <Container className={styles.banner} fluid>
        <Text type="text3">
          {Translate({ context: "header", label: "banner-text" })}
        </Text>
      </Container>
    </div>
  );
}
