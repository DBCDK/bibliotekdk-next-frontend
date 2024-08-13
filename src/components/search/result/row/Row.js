import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

import Translate from "@/components/base/translate";

import Title from "@/components/base/title";
import Text from "@/components/base/text";
import BookmarkDropdown from "@/components/work/overview/bookmarkDropdown/BookmarkDropdown";

import Cover from "@/components/base/cover";
import {
  encodeTitleCreator,
  extractCreatorsPrioritiseCorporation,
} from "@/lib/utils";
import Link from "@/components/base/link";

import styles from "./Row.module.css";
import { getCoverImage } from "@/components/utils/getCoverImage";
import {
  formatMaterialTypesToCypress,
  formatMaterialTypesToPresentation,
  formatMaterialTypesToUrl,
  manifestationMaterialTypeFactory,
} from "@/lib/manifestationFactoryUtils";
import {
  getTitlesAndType,
  RenderLanguageAddition,
  RenderTitlesWithoutLanguage,
} from "@/components/work/overview/titlerenderer/TitleRenderer";
import isEqual from "lodash/isEqual";
import useFilters from "@/components/hooks/useFilters";
import {
  getPartOfSeriesText,
  RenderHostPublication,
} from "@/components/work/overview/workgroupingsoverview/WorkGroupingsOverview";

function TitlesForSearch({ work, isLoading }) {
  // we need the titles here for the lineclamp - other than that title are no longer used in
  // RenderTitlesWithoutLanguage component
  const titles = [
    ...(Array.isArray(work?.titles?.full) ? work?.titles?.full : []),
    ...(Array.isArray(work?.titles?.parallel) ? work?.titles?.parallel : []),
  ];
  const titlesElementId = `TitlesForSearch__RenderTitlesWithoutLanguage-${work?.workId?.replace(
    /\W/g,
    ""
  )}`;
  const [titleClamped, setTitleClamped] = useState(null);

  useEffect(() => {
    function checkLineClamp(element) {
      return element?.scrollHeight > element?.clientHeight;
    }
    setTitleClamped(checkLineClamp(document?.getElementById(titlesElementId)));
  }, [work, titlesElementId]);

  return (
    <Title
      type="title5"
      tag="h2"
      lines={4}
      title={titles?.join(" ")}
      dataCy={"ResultRow-title"}
      className={`${!isLoading ? styles.display_inline : ""}`}
      skeleton={isLoading}
    >
      <div id={titlesElementId} className={`${styles.wrap_3_lines}`}>
        <RenderTitlesWithoutLanguage work={work} subtitleType="title6" />
        {!titleClamped && titles?.length < 2 && (
          <RenderLanguageAddition work={work} type={"title6"} />
        )}
      </div>
      {(titleClamped || titles?.length > 1) && (
        <RenderLanguageAddition work={work} type={"title6"} />
      )}
    </Title>
  );
}

TitlesForSearch.propTypes = {
  work: PropTypes.object,
  loading: PropTypes.bool,
};

function sortMaterialTypesByFilter(materialTypesInFilter) {
  return (a, b) => {
    const promoteA = materialTypesInFilter?.findIndex((mat) =>
      isEqual(formatMaterialTypesToUrl(a), mat)
    );
    const promoteB = materialTypesInFilter?.findIndex((mat) =>
      isEqual(formatMaterialTypesToUrl(b), mat)
    );

    const indexA = promoteA !== -1 ? promoteA : materialTypesInFilter?.length;
    const indexB = promoteB !== -1 ? promoteB : materialTypesInFilter?.length;

    return indexA - indexB;
  };
}

/**
 * Subtitle for series in search result - like: "Del af game of thrones"
 * @param work
 * @returns {*}
 * @constructor
 */
function RenderSeriesSubTitle({ work }) {
  // check if work is part of a serie
  if (work?.series?.length < 1) {
    return null;
  }
  // there may be more than one serie - the most i've seen is three
  return work?.series?.map((serie, index) => {
    const title = serie.title;
    const { type } = getTitlesAndType({ work });

    if (type === "tvSerie") {
      return null;
    }

    const numberInSeries = serie?.members?.find(
      (member) => member.work?.workId === work.workId
    )?.numberInSeries;

    const partOfSeriesText = getPartOfSeriesText(type, numberInSeries);

    return (
      <Text
        type="text3"
        lines={1}
        tag="span"
        key={`serie-searchresult-${index}`}
        className={styles.subtitle}
      >
        {partOfSeriesText} {title}
      </Text>
    );
  });
}

/**
 * Render various variations of subtitles .. article, serie, tvserie .. etc.
 * @param work
 * @returns {JSX.Element|null}
 * @constructor
 */
function SubTitlesByMaterial({ work }) {
  const materialType =
    work?.manifestations?.mostRelevant?.[0]?.materialTypes?.[0]
      ?.materialTypeGeneral?.code;

  // check if this is an ARTICLES
  if (materialType === "ARTICLES") {
    const manifestation = work?.manifestations?.mostRelevant?.[0];
    const hostpub = manifestation?.hostPublication;
    return <RenderHostPublication hostPublication={hostpub} />;
  }

  // @TODO .. there are probably more :)

  // we found nothing to handle
  return null;
}

/**
 * Row representation of a search result entry
 *
 * @param {Object} work
 * @param {string} className
 * @param {function} onClick
 * @param {boolean} isLoading
 */
export default function ResultRow({
  work,
  className = "",
  onClick,
  isLoading,
}) {
  const creatorsNames = extractCreatorsPrioritiseCorporation(
    work?.creators
  )?.map((creator) => creator.display);

  const { filters } = useFilters();

  const coverDetail = useMemo(() => {
    if (work?.manifestations?.mostRelevant) {
      return getCoverImage(work.manifestations.mostRelevant)?.detail;
    }
  }, [work?.manifestations]);

  const { uniqueMaterialTypes } = useMemo(() => {
    return manifestationMaterialTypeFactory(work?.manifestations?.mostRelevant);
  }, [work?.manifestations?.mostRelevant]);

  const materialTypes = filters.materialTypesSpecific;
  uniqueMaterialTypes.sort(sortMaterialTypesByFilter(materialTypes));
  return (
    <article className={styles.search}>
      <Link
        a={true}
        border={{ top: { keepVisible: true }, bottom: { keepVisible: true } }}
        className={`${styles.wrapper} ${className}`}
        href={{
          pathname: "/materiale/[title_author]/[workId]",
          query: {
            title_author: encodeTitleCreator(
              work?.titles?.main?.[0],
              work?.creators
            ),
            workId: work?.workId,
          },
        }}
        dataCy={`result-row${work?.workId ? "" : "-skeleton"}`}
        onClick={onClick}
      >
        <div className={styles.row_wrapper}>
          <Cover
            className={styles.cover}
            src={coverDetail}
            skeleton={!coverDetail && !work?.manifestations}
            size="fill-width"
          />
          <div className={styles.col_wrapper}>
            <TitlesForSearch work={work} isLoading={isLoading} />
            <SubTitlesByMaterial work={work} />
            <RenderSeriesSubTitle work={work} />
            <Text
              type="text2"
              className={styles.creator}
              skeleton={(!work?.creators && isLoading) || !work?.creators}
              lines={1}
            >
              {creatorsNames?.join(", ") || " "}
            </Text>

            <div className={styles.materials}>
              {uniqueMaterialTypes?.length > 0 &&
                uniqueMaterialTypes?.map((materialTypeArray) => {
                  const typeString =
                    formatMaterialTypesToUrl(materialTypeArray);
                  return (
                    <span
                      key={`${work?.workId}-${typeString}`}
                      className={styles.material}
                    >
                      <Link
                        border={{ top: false, bottom: { keepVisible: true } }}
                        href={{
                          pathname: "/materiale/[title_author]/[workId]",
                          query: {
                            title_author: encodeTitleCreator(
                              work?.titles?.main?.[0],
                              work?.creators
                            ),
                            type: typeString,
                            workId: work?.workId,
                          },
                        }}
                        key={materialTypeArray}
                        tabIndex={0}
                        aria-labelledby={`TitlesForSearch__RenderTitlesWithoutLanguage-${work?.workId?.replace(
                          /\W/g,
                          ""
                        )}`}
                      >
                        <Text
                          type={"text4"}
                          tag={"span"}
                          dataCy={
                            "text-" +
                            formatMaterialTypesToCypress(materialTypeArray)
                          }
                        >
                          {formatMaterialTypesToPresentation(materialTypeArray)}
                        </Text>
                      </Link>
                    </span>
                  );
                })}
            </div>
          </div>
          <BookmarkDropdown
            className={styles.BookmarkDropdown}
            materialId={work?.workId}
            workId={work?.workId}
            materialTypes={uniqueMaterialTypes}
            title={work?.titles?.sort}
            size={{ w: 4, h: 4 }}
            editions={work?.manifestations?.mostRelevant}
          />
        </div>
      </Link>
    </article>
  );
}
ResultRow.propTypes = {
  work: PropTypes.object,
  className: PropTypes.string,
  onClick: PropTypes.func,
  isLoading: PropTypes.bool,
};
