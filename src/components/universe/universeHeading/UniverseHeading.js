import Section from "@/components/base/section";
import styles from "./UniverseHeading.module.css";
import Col from "react-bootstrap/Col";
import Translate from "@/components/base/translate";
import Text from "@/components/base/text/Text";
import UniverseTitleBox from "@/components/universe/universeHeading/universeTitleBox/UniverseTitleBox";
import { universeBasicInfo } from "@/lib/api/universe.fragments";
import { useData } from "@/lib/api/api";

export function UniverseBreadcrumb({ universeIsLoading }) {
  const frontPage = Translate({ context: "universe_page", label: "frontpage" });
  const universes = Translate({ context: "universe_page", label: "universes" });

  return (
    <Text type={"text3"} skeleton={universeIsLoading} lines={1}>
      {[frontPage, universes].join(" / ")}
    </Text>
  );
}

export default function UniverseHeading({ universeId }) {
  const { data, isLoading } = useData(
    universeId && universeBasicInfo({ key: universeId })
  );
  const universe = data?.universe;

  return (
    <Section
      space={false}
      divider={false}
      title={null}
      className={`${styles.top}`}
      isLoading={isLoading}
    >
      <Col xs={12} className={`${styles.overview}`}>
        <div className={styles.breadcrumb}>
          <UniverseBreadcrumb universeIsLoading={isLoading} />
        </div>
        <UniverseTitleBox
          universe={universe}
          universeIsLoading={isLoading}
          className={styles.title_box}
        />
      </Col>
    </Section>
  );
}
