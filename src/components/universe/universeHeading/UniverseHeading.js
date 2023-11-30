import Section from "@/components/base/section";
import styles from "./UniverseHeading.module.css";
import Col from "react-bootstrap/Col";
import Translate from "@/components/base/translate";
import Text from "@/components/base/text/Text";
import UniverseTitleBox from "@/components/universe/universeHeading/universeTitleBox/UniverseTitleBox";

export function UniverseBreadcrumb() {
  const frontPage = Translate({ context: "universe_page", label: "frontpage" });
  const universes = Translate({ context: "universe_page", label: "universes" });

  return <Text type={"text3"}>{[frontPage, universes].join(" / ")}</Text>;
}

export default function UniverseHeading({ universe, universeIsLoading }) {
  return (
    <Section
      space={false}
      divider={false}
      title={null}
      className={`${styles.top}`}
      isLoading={universeIsLoading}
    >
      <Col xs={12} className={`${styles.overview}`}>
        <div className={styles.breadcrumb}>
          <UniverseBreadcrumb />
        </div>
        <UniverseTitleBox
          universe={universe}
          universeIsLoading={universeIsLoading}
          className={styles.title_box}
        />
      </Col>
    </Section>
  );
}
