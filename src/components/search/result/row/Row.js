import { useMemo } from "react";
import PropTypes from "prop-types";
import { Row, Col } from "react-bootstrap";

import Translate from "@/components/base/translate";

import Title from "@/components/base/title";
import Text from "@/components/base/text";

import Cover from "@/components/base/cover";
import { encodeTitleCreator } from "@/lib/utils";
import Link from "@/components/base/link";

import styles from "./Row.module.css";
import { getCoverImage } from "@/components/utils/getCoverImage";
import { upperFirst } from "lodash";
import {
  formatMaterialTypesToUrl,
  manifestationMaterialTypeUtils,
} from "@/lib/manifestationFactoryFunctions";

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

  const coverDetail = useMemo(() => {
    if (work?.manifestations?.all) {
      return getCoverImage(work.manifestations.all).detail;
    }
  }, [work?.manifestations]);

  const { uniqueMaterialTypes } = useMemo(() => {
    return manifestationMaterialTypeUtils(work?.manifestations?.all);
  }, [work?.manifestations?.all]);

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
          <Title
            type="title5"
            tag="h2"
            lines={3}
            clamp={true}
            title={work?.titles?.full}
            data-cy={"ResultRow-title"}
            skeleton={!work?.titles?.main && !work?.titles?.full && isLoading}
          >
            {work?.titles?.full || work?.titles?.main || " "}
          </Title>
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
              uniqueMaterialTypes?.map((material) => {
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
                        type: formatMaterialTypesToUrl(material),
                        workId: work?.workId,
                      },
                    }}
                    key={material}
                    tabIndex="-1"
                    tag="span"
                  >
                    <Text type={"text4"} tag={"p"}>
                      {material?.map((mat, index) => {
                        return (
                          <span key={mat}>
                            {upperFirst(mat)}
                            {index < material.length - 1 && <>&nbsp;/&nbsp;</>}
                          </span>
                        );
                      })}
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
