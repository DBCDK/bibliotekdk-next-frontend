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

/**
 * Row representation of a search result entry
 *
 * @param {object} props
 * @param {object} props.data
 */
export default function ResultRow({ data, onClick }) {
  const work = data;

  const creatorName = work.creators?.[0]?.display;

  const coverDetail = useMemo(() => {
    if (data?.manifestations?.all) {
      return data.manifestations.all
        .map((all) => all.cover.detail)
        .find((detail) => detail);
    }
  }, [data.manifestations]);

  return (
    <Link
      a={true}
      border={{ top: { keepVisible: true }, bottom: { keepVisible: true } }}
      className={styles.wrapper}
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
            skeleton={!work?.titles?.main}
          >
            {work?.titles?.full || work?.titles?.main}
          </Title>
          <Text
            type="text3"
            className={styles.creator}
            skeleton={!work?.creators}
            lines={1}
          >
            {creatorName || " "}
          </Text>
          <div className={styles.materials}>
            <Text
              type="text3"
              lines={2}
              clamp={true}
              skeleton={!work?.materialTypes}
            >
              {Translate({ context: "search", label: "loanOptions" })}
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
            skeleton={!work?.manifestations?.all}
            size="fill-width"
          />
        </Col>
      </Row>
    </Link>
  );
}
ResultRow.propTypes = {
  data: PropTypes.object,
  onClick: PropTypes.func,
};
