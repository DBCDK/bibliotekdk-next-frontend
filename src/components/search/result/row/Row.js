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
        {/* BETA-1 - removed this column
        <Col className={styles.leftcol} xs={3}>
          <Breadcrumbs
            skeleton={!work.path}
            crumbs={work.path ? null : 4}
            path={work.path || []}
            link={false}
          />
        </Col>
        */}
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
                (!work?.materialTypes && isLoading) || !work?.materialTypes
              }
              dataCy={"result-row-laanemuligheder-wrap"}
            >
              {work?.materialTypes?.length > 0 &&
                Translate({ context: "search", label: "loanOptions" })}
            </Text>
            {work?.materialTypes?.length > 0 &&
              work?.materialTypes?.map((material) => {
                return (
                  <Link
                    border={{ top: false, bottom: { keepVisible: true } }}
                    className={styles.materiallink}
                    href={{
                      pathname: "/materiale/[title_author]/[workId]",
                      query: {
                        title_author: encodeTitleCreator(
                          work?.titles?.main?.[0],
                          work?.creators?.[0]?.display
                        ),
                        type: material?.specific,
                        workId: work?.workId,
                      },
                    }}
                    key={material?.specific}
                    tabIndex="-1"
                    tag="span"
                  >
                    <Text type="text4">
                      {material?.specific?.[0]?.toUpperCase() +
                        material?.specific?.slice(1)}
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
