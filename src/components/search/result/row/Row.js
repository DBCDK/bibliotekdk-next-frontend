import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import Translate from "@/components/base/translate";

import Title from "@/components/base/title";
import Text from "@/components/base/text";

import Cover from "@/components/base/cover";
import { encodeTitleCreator } from "@/lib/utils";
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
import { useRouter } from "next/router";
import isEqual from "lodash/isEqual";

function TitlesForSearch({ work, isLoading }) {
  const titles = work?.titles;
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
      title={titles?.full?.join(" ")}
      data-cy={"ResultRow-title"}
      skeleton={!titles && isLoading}
      className={`${styles.display_inline}`}
    >
      <div id={titlesElementId} className={`${styles.wrap_3_lines}`}>
        <RenderTitlesWithoutLanguage titles={titles} />
        {!titleClamped && titles?.full?.length < 2 && (
          <RenderLanguageAddition work={work} type={"title6"} />
        )}
      </div>
      {(titleClamped || titles?.full?.length > 1) && (
        <RenderLanguageAddition work={work} type={"title6"} />
      )}
    </Title>
  );
}

TitlesForSearch.propTypes = {
  work: PropTypes.object,
  loading: PropTypes.bool,
};

function sortMaterialTypesByRouter(routerMaterialTypes) {
  return (a, b) => {
    const promoteA = routerMaterialTypes?.findIndex((mat) =>
      isEqual(a.join(","), mat)
    );
    const promoteB = routerMaterialTypes?.findIndex((mat) =>
      isEqual(b.join(","), mat)
    );

    const indexA = promoteA !== -1 ? promoteA : routerMaterialTypes?.length;
    const indexB = promoteB !== -1 ? promoteB : routerMaterialTypes?.length;

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
  const creatorName = work?.creators?.[0]?.display;

  const router = useRouter();

  const coverDetail = useMemo(() => {
    if (work?.manifestations?.mostRelevant) {
      return getCoverImage(work.manifestations.mostRelevant)?.detail;
    }
  }, [work?.manifestations]);

  const { uniqueMaterialTypes } = useMemo(() => {
    return manifestationMaterialTypeFactory(work?.manifestations?.mostRelevant);
  }, [work?.manifestations?.mostRelevant]);

  const routerMaterialTypes = router?.query?.materialTypes?.split(",");
  uniqueMaterialTypes.sort(sortMaterialTypesByRouter(routerMaterialTypes));

  return (
    <Link
      a={true}
      border={{ top: { keepVisible: true }, bottom: { keepVisible: true } }}
      className={`${styles.wrapper} ${className}`}
      href={{
        pathname: "/materiale/[title_author]/[workId]",
        query: {
          title_author: encodeTitleCreator(
            work?.titles?.main?.[0],
            work?.creators?.[0]?.display
          ),
          workId: work?.workId,
        },
      }}
      dataCy={`result-row${work?.workId ? "" : "-skeleton"}`}
      onClick={onClick}
    >
      <Row className={styles.row}>
        <Col>
          <TitlesForSearch work={work} loading={isLoading} />
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
              type="text3"
              lines={2}
              clamp={true}
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
                    className={`${styles.materiallink}`}
                    href={{
                      pathname: "/materiale/[title_author]/[workId]",
                      query: {
                        title_author: encodeTitleCreator(
                          work?.titles?.main?.[0],
                          work?.creators?.[0]?.display
                        ),
                        type: formatMaterialTypesToUrl(materialTypeArray),
                        workId: work?.workId,
                      },
                    }}
                    key={materialTypeArray}
                    tabIndex="-1"
                    tag="span"
                  >
                    <Text
                      type={"text4"}
                      tag={"p"}
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
        </Col>
        {/* BETA-1 changed column width 3->4 */}
        <Col xs={4}>
          <Cover
            className={styles.cover}
            src={coverDetail}
            skeleton={!coverDetail && !work?.manifestations}
            size="fill-width"
          />
        </Col>
      </Row>
    </Link>
  );
}
ResultRow.propTypes = {
  work: PropTypes.object,
  className: PropTypes.string,
  onClick: PropTypes.func,
  isLoading: PropTypes.bool,
};
