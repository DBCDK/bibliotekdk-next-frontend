import Link from "@/components/base/link";
import { cyKey } from "@/utils/trim";
import styles from "./TitleBox.module.css";
import Translate from "@/components/base/translate";
import Title from "@/components/base/title";
import Text from "@/components/base/text/Text";
import cx from "classnames";
import { buildHtmlLink } from "@/lib/utils";

export function LinkToCreator({ firstWorkFirstSeries, seriesIsLoading }) {
  const firstCreator = firstWorkFirstSeries?.creators?.[0];

  return (
    <Link
      href={`/find?q.creator=${firstCreator?.display}`}
      dataCy={cyKey({
        name: firstCreator?.display,
        prefix: "details-creatore",
      })}
      disabled={seriesIsLoading}
      border={{ bottom: { keepVisible: true } }}
    >
      <Text type="text3" tag={"span"} lines={0}>
        {firstCreator?.display}
      </Text>
    </Link>
  );
}

export default function TitleBox({ series, seriesIsLoading, className }) {
  const firstSeriesFirstWork = series?.[0]?.members?.[0]?.work;

  return (
    <div className={cx(className, styles.box)}>
      <Text type={"text3"} className={styles.series_by}>
        {Translate({ context: "series_page", label: "series_by" })}{" "}
        <LinkToCreator
          firstWorkFirstSeries={firstSeriesFirstWork}
          seriesIsLoading={seriesIsLoading}
        />
      </Text>
      <Title type="title2" className={styles.series_title}>
        {series?.[0]?.title}
      </Title>
      <div className={styles.series_images}>images</div>
      {series?.[0]?.description && (
        <div className={styles.series_description}>
          {series?.[0]?.description}
        </div>
      )}
      {firstSeriesFirstWork?.universe && (
        <div className={styles.series_in_universe}>
          <Text type="text2">
            {Translate({
              context: "series_page",
              label: "part_of_universe",
              vars: [
                buildHtmlLink(
                  firstSeriesFirstWork?.universe?.title,
                  "",
                  "_self"
                ),
              ],
              renderAsHtml: true,
            })}
          </Text>
        </div>
      )}
      <div className={styles.series_components}>
        {Translate({
          context: "series_page",
          label: "parts_in_series",
          vars: [series?.[0]?.members?.length],
        })}
      </div>
      {series?.readThisWhenever && (
        <div className={styles.series_read_this_whenever}>
          {Translate({ context: "series_page", label: "read_this_whenever" })}
        </div>
      )}
    </div>
  );
}
