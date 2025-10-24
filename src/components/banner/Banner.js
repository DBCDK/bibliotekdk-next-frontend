import { useRouter } from "next/router";

import Container from "react-bootstrap/Container";
import Text from "@/components/base/text/Text";
import Translate from "@/components/base/translate";

import styles from "./Banner.module.css";

export default function Banner() {
  const router = useRouter();

  const omitOnPath = ["uddrag"];

  if (omitOnPath.includes(router.pathname.split("/")[1])) {
    return null;
  }

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
