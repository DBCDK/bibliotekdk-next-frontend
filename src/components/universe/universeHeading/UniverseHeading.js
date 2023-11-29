import Section from "@/components/base/section";
import styles from "./UniverseHeading.module.css";
import Col from "react-bootstrap/Col";
import Translate, { getLanguage } from "@/components/base/translate";
import Text from "@/components/base/text/Text";
import TitleBox from "@/components/series/seriesHeading/titleBox/TitleBox";
import UniverseTitleBox from "@/components/universe/universeHeading/universeTitleBox/UniverseTitleBox";
import { universes } from "@/lib/api/universe.fragments";

export function UniverseBreadcrumb() {
  // const firstWorkType = firstWork?.workTypes?.[0]?.toLowerCase();
  // const workTypeTranslation = Translate({
  //   context: "facets",
  //   label: `label-${firstWorkType}`,
  // });

  // const fictionNonFiction = firstWork?.fictionNonfiction;
  //
  // const fictionNonfictionTranslation =
  //   fictionNonFiction?.code !== "NOT_SPECIFIED" && fictionNonFiction !== null
  //     ? [
  //         getLanguage() === "EN_GB"
  //           ? fictionNonFiction?.code?.toLowerCase()
  //           : fictionNonFiction?.display,
  //       ]
  //     : [];

  // const seriesTranslation = Translate({
  //   context: "series_page",
  //   label: "series",
  // });

  const frontPage = Translate({ context: "universe_page", label: "frontpage" });
  const universes = Translate({ context: "universe_page", label: "universes" });

  return (
    <Text type={"text3"}>
      {/*{[*/}
      {/*  ...(workTypeTranslation ? [workTypeTranslation] : []),*/}
      {/*  ...(fictionNonfictionTranslation ? [fictionNonfictionTranslation] : []),*/}
      {/*  seriesTranslation,*/}
      {/*].join(" / ")}*/}
      {[frontPage, universes].join(" / ")}
    </Text>
  );
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
