import Link from "@/components/base/link";
import { cyKey } from "@/utils/trim";
import styles from "./TitleBox.module.css";
import Translate from "@/components/base/translate";
import Title from "@/components/base/title";
import Text from "@/components/base/text/Text";
import cx from "classnames";
import ThumbnailParade from "@/components/series/seriesHeading/titleBox/thumbnailParade/ThumbnailParade";

import { getUniqueCreatorsDisplay } from "@/components/series/utils";
import { getUniverseUrl } from "@/lib/utils";
import { getAdvancedUrl } from "@/components/search/advancedSearch/utils";

export function LinkToCreator({ creator, isLoading }) {
  // @TODO .. do we need some refactoring ?? - this inputfield is
  // used manywhere :)
  const href = getAdvancedUrl({ type: "creator", value: creator });

  return (
    <Link
      href={href}
      dataCy={cyKey({
        name: creator,
        prefix: "details-creatore",
      })}
      disabled={isLoading}
      border={{ bottom: { keepVisible: true } }}
    >
      <Text type="text3" tag={"span"} lines={0}>
        {creator}
      </Text>
    </Link>
  );
}

export default function TitleBox({ series, seriesIsLoading, className }) {
  const firstSeriesFirstWork = series?.members?.[0]?.work;
  const description = series?.description;
  const identifyingAddition = series?.identifyingAddition
    ? " (" + series?.identifyingAddition + ")"
    : "";
  const { creators, creatorsToShow } = getUniqueCreatorsDisplay(series);

  return (
    <div
      className={cx(className, styles.box, {
        [styles.boxWithoutDescription]: !description,
      })}
    >
      <Text
        type={"text3"}
        skeleton={seriesIsLoading}
        lines={1}
        className={styles.series_by}
      >
        {Translate({ context: "series_page", label: "series_by" })}{" "}
        {creators.slice(0, creatorsToShow).map((creator, index, array) => (
          <>
            <LinkToCreator
              key={index}
              creator={creator}
              isLoading={seriesIsLoading}
            />
            {index !== array.length - 1 && ", "}
          </>
        ))}
        {creators?.length > creatorsToShow && ", m. fl."}
      </Text>
      <Title
        skeleton={seriesIsLoading || !series?.title}
        lines={1}
        type="title2"
        tag={"h1"}
        className={styles.series_title}
      >
        {series?.title + identifyingAddition}
      </Title>
      <div className={styles.series_images}>
        <ThumbnailParade series={series} isLoading={seriesIsLoading} />
      </div>
      <div className={styles.series_information}>
        {(description || seriesIsLoading) && (
          <Text type="text2" skeleton={seriesIsLoading} lines={6}>
            {description}
          </Text>
        )}
        {firstSeriesFirstWork?.universes?.map((universe) => {
          return (
            <Text
              skeleton={seriesIsLoading}
              lines={1}
              key={JSON.stringify(universe)}
              type="text2"
            >
              {Translate({
                context: "series_page",
                label: "part_of_universe",
                renderAsHtml: true,
              })}
              <Link
                href={getUniverseUrl(universe?.universeId)}
                border={{ bottom: { keepVisible: true } }}
              >
                {universe?.title}
              </Link>
            </Text>
          );
        })}
        {/*TODO: Insert this again later when we know how to interpret this */}
        {/*<Text type="text2">*/}
        {/*  {Translate({*/}
        {/*    context: "series_page",*/}
        {/*    label: "parts_in_series",*/}
        {/*    vars: [series?.members?.length],*/}
        {/*  })}*/}
        {/*</Text>*/}
        {series?.readThisWhenever && (
          <Text type="text2">
            {Translate({ context: "series_page", label: "read_this_whenever" })}
          </Text>
        )}
      </div>
    </div>
  );
}
