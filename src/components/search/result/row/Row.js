import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

import Translate from "@/components/base/translate";

import Title from "@/components/base/title";
import Text from "@/components/base/text";

import Cover from "@/components/base/cover";
import {
  encodeTitleCreator,
  extractCreatorPrioritiseCorporation,
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
  RenderLanguageAddition,
  RenderTitlesWithoutLanguage,
} from "@/components/work/overview/titlerenderer/TitleRenderer";
import isEqual from "lodash/isEqual";
import useFilters from "@/components/hooks/useFilters";

function TitlesForSearch({ work, isLoading }) {
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
      clamp={true}
      title={titles?.join(" ")}
      data-cy={"ResultRow-title"}
      skeleton={isLoading}
      className={`${styles.display_inline}`}
    >
      <div id={titlesElementId} className={`${styles.wrap_3_lines}`}>
        <RenderTitlesWithoutLanguage titles={titles} />
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
 * Row representation of a search result entry
 *
 * @param {object} work
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
  const creatorName = extractCreatorPrioritiseCorporation(work?.creators)?.[0]
    ?.display;

  const { filters } = useFilters();

  const coverDetail = useMemo(() => {
    if (work?.manifestations?.mostRelevant) {
      return getCoverImage(work.manifestations.mostRelevant)?.detail;
    }
  }, [work?.manifestations]);

  const { uniqueMaterialTypes } = useMemo(() => {
    return manifestationMaterialTypeFactory(work?.manifestations?.mostRelevant);
  }, [work?.manifestations?.mostRelevant]);

  const materialTypes = filters.materialTypes;
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
          <div className={styles.col_wrapper}>
            <TitlesForSearch work={work} isLoading={isLoading} />
            <Text
              type="text3"
              className={styles.creator}
              skeleton={(!work?.creators && isLoading) || !work?.creators}
              lines={1}
            >
              {creatorName || " "}
            </Text>
            <div className={styles.materials}>
              <Text
                tag="span"
                type="text3"
                skeleton={
                  (!uniqueMaterialTypes && isLoading) || !uniqueMaterialTypes
                }
                dataCy={"result-row-laanemuligheder-wrap"}
              >
                {uniqueMaterialTypes?.length > 0 &&
                  Translate({ context: "search", label: "loanOptions" })}
              </Text>
              {uniqueMaterialTypes?.length > 0 &&
                uniqueMaterialTypes?.map((materialTypeArray) => {
                  return (
                    <Link
                      border={{ top: false, bottom: { keepVisible: true } }}
                      href={{
                        pathname: "/materiale/[title_author]/[workId]",
                        query: {
                          title_author: encodeTitleCreator(
                            work?.titles?.main?.[0],
                            work?.creators
                          ),
                          type: formatMaterialTypesToUrl(materialTypeArray),
                          workId: work?.workId,
                        },
                      }}
                      key={materialTypeArray}
                      tabIndex="-1"
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
                  );
                })}
            </div>
          </div>
          <Cover
            className={styles.cover}
            src={coverDetail}
            skeleton={!coverDetail && !work?.manifestations}
            size="fill-width"
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
