import Link from "@/components/base/link";
import { cyKey } from "@/utils/trim";
import styles from "./TitleBox.module.css";
import Translate from "@/components/base/translate";
import Title from "@/components/base/title";
import Text from "@/components/base/text/Text";
import cx from "classnames";
// TODO: Use when universe pages are implemented
// import { buildHtmlLink } from "@/lib/utils";
import ThumbnailParade from "@/components/series/seriesHeading/titleBox/thumbnailParade/ThumbnailParade";

export function LinkToCreator({ firstSeriesFirstWork, seriesIsLoading }) {
  const firstCreator = firstSeriesFirstWork?.creators?.[0];

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
  const description = series?.[0]?.description;

  return (
    <div
      className={cx(className, styles.box, {
        [styles.boxWithoutDescription]: !description,
      })}
    >
      <Text type={"text3"} className={styles.series_by}>
        {Translate({ context: "series_page", label: "series_by" })}{" "}
        <LinkToCreator
          firstSeriesFirstWork={firstSeriesFirstWork}
          seriesIsLoading={seriesIsLoading}
        />
      </Text>
      <Title type="title2" tag={"h1"} className={styles.series_title}>
        {series?.[0]?.title}
      </Title>
      <div className={styles.series_images}>
        <ThumbnailParade series={series} seriesIsLoading={seriesIsLoading} />
      </div>
      <div className={styles.series_information}>
        {description && <Text type="text2">{description}</Text>}
        {firstSeriesFirstWork?.universe && (
          <Text type="text2">
            {Translate({
              context: "series_page",
              label: "part_of_universe",
              vars: [
                firstSeriesFirstWork?.universe?.title,
                // TODO: Use link when Universe has page
                // buildHtmlLink(
                //   firstSeriesFirstWork?.universe?.title,
                //   "",
                //   "_self"
                // ),
              ],
              renderAsHtml: true,
            })}
          </Text>
        )}
        <Text type="text2">
          {Translate({
            context: "series_page",
            label: "parts_in_series",
            vars: [series?.[0]?.members?.length],
          })}
        </Text>
        {series?.readThisWhenever && (
          <Text type="text2">
            {Translate({ context: "series_page", label: "read_this_whenever" })}
          </Text>
        )}
      </div>
    </div>
  );
}
