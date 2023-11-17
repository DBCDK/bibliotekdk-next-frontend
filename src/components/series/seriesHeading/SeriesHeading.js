import Section from "@/components/base/section";
import styles from "./SeriesHeading.module.css";
import Col from "react-bootstrap/Col";
import Translate, { getLanguage } from "@/components/base/translate";
import Text from "@/components/base/text/Text";
import TitleBox from "@/components/series/seriesHeading/titleBox/TitleBox";

export function SeriesBreadcrumb({ firstWork }) {
  const firstWorkType = firstWork?.workTypes?.[0]?.toLowerCase();
  const workTypeTranslation = Translate({
    context: "facets",
    label: `label-${firstWorkType}`,
  });

  const fictionNonFiction = firstWork?.fictionNonfiction;

  const fictionNonfictionTranslation =
    fictionNonFiction?.code !== "NOT_SPECIFIED" && fictionNonFiction !== null
      ? [
          getLanguage() === "EN_GB"
            ? fictionNonFiction?.code?.toLowerCase()
            : fictionNonFiction?.display,
        ]
      : [];

  const seriesTranslation = Translate({
    context: "series_page",
    label: "series",
  });

  return (
    <Text type={"text3"}>
      {[
        ...(workTypeTranslation ? [workTypeTranslation] : []),
        ...(fictionNonfictionTranslation ? [fictionNonfictionTranslation] : []),
        seriesTranslation,
      ].join(" / ")}
    </Text>
  );
}

export default function SeriesHeading({ series, seriesIsLoading }) {
  const firstWork = series?.members?.[0]?.work;

  return (
    <Section
      space={false}
      divider={false}
      title={null}
      className={`${styles.top}`}
      isLoading={seriesIsLoading}
    >
      <Col xs={12} className={`${styles.overview}`}>
        <div className={styles.breadcrumb}>
          <SeriesBreadcrumb firstWork={firstWork} />
        </div>
        <TitleBox
          series={series}
          seriesIsLoading={seriesIsLoading}
          className={styles.title_box}
        />
      </Col>
    </Section>
  );
}
