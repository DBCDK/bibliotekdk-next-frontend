import PropTypes from "prop-types";
import { Row, Col } from "react-bootstrap";

import Translate from "@/components/base/translate";

import Title from "@/components/base/title";
import Text from "@/components/base/text";

import Breadcrumbs from "@/components/base/breadcrumbs";
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
  const { title, creator, work = {} } = data;
  const creatorName =
    (work.creators && work.creators[0] && work.creators[0].name) ||
    (creator && creator.name);
  return (
    <Link
      a={true}
      border={{ top: { keepVisible: true }, bottom: { keepVisible: true } }}
      className={styles.wrapper}
      href={{
        pathname: "/materiale/[title_author]/[workId]",
        query: {
          title_author: encodeTitleCreator(
            title,
            work.creators && work.creators[0] && work.creators[0].name
          ),
          workId: work.id,
        },
      }}
      dataCy={`result-row${work.id ? "" : "-skeleton"}`}
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
            lines={1}
            skeleton={!work.title && !title}
          >
            {work.title || title}
          </Title>
          <Text
            type="text3"
            className={styles.creator}
            skeleton={!work.creators && !creator}
            lines={1}
          >
            {!work.creators && !creator ? "skeleton" : creatorName || " "}
          </Text>
          <div className={styles.materials}>
            <Text
              type="text3"
              lines={2}
              clamp={true}
              skeleton={!work.materialTypes}
            >
              {Translate({ context: "search", label: "loanOptions" })}
            </Text>
            {work.materialTypes &&
              work.materialTypes.length > 0 &&
              work.materialTypes.map((material) => {
                return (
                  <Link
                    border={{ top: false, bottom: { keepVisible: true } }}
                    className={styles.materiallink}
                    href={{
                      pathname: "/materiale/[title_author]/[workId]",
                      query: {
                        title_author: encodeTitleCreator(
                          title,
                          work.creators &&
                            work.creators[0] &&
                            work.creators[0].name
                        ),
                        type: material.materialType,
                        workId: work.id,
                      },
                    }}
                    key={material.materialType}
                    tabIndex="-1"
                    tag="span"
                  >
                    <Text type="text4">{material.materialType}</Text>
                  </Link>
                );
              })}
          </div>
        </Col>
        {/* BETA-1 changed column width 3->4 */}
        <Col xs={4}>
          <Cover
            className={styles.cover}
            src={work.cover && work.cover.detail}
            skeleton={!work.cover}
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
