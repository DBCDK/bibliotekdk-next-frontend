import PropTypes from "prop-types";

import Section from "@/components/base/section";
import Translate from "@/components/base/translate";
import Breadcrumbs from "@/components/base/breadcrumbs";
import Cover from "@/components/base/cover";
import styles from "./Result.module.css";
import Title from "@/components/base/title";
import Text from "@/components/base/text";
import { useData } from "@/lib/api/api";
import { fast, all } from "@/lib/api/search.fragments";
import Link from "@/components/base/link";
import { encodeTitleCreator } from "@/lib/utils";
import { Divider } from "@/components/base/divider";
import { Row, Col } from "react-bootstrap";
import ViewSelector from "../viewselector";

/**
 * Row representation of a search result entry
 *
 * @param {object} props
 * @param {object} props.data
 */
function ResultRow({ data }) {
  const { title, creator, work = {} } = data;
  const creatorName =
    (work.creators && work.creators[0] && work.creators[0].name) ||
    (creator && creator.name);
  return (
    <Link
      a={true}
      border={{ top: true, bottom: true }}
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
    >
      <Row className={styles.row}>
        <Col className={styles.leftcol} xs={3}>
          <Breadcrumbs
            skeleton={!work.path}
            crumbs={work.path ? null : 4}
            path={work.path || []}
            link={false}
          />
        </Col>
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
                    a={true}
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
                  >
                    <Text type="text4">{material.materialType}</Text>
                  </Link>
                );
              })}
          </div>
        </Col>
        <Col xs={3}>
          <Cover
            className={styles.cover}
            src={work.cover && work.cover.detail}
            skeleton={!work.cover}
            size={["100%", "100%"]}
          />
        </Col>
      </Row>
    </Link>
  );
}
ResultRow.propTypes = {
  data: PropTypes.object,
};

/**
 * Search result
 *
 * @param {object} props
 * @param {boolean} props.isLoading
 * @param {array} props.rows
 * @param {function} props.onViewSelect
 * @param {string} props.viewSelected
 */
export function Result({ isLoading, rows = [], onViewSelect, viewSelected }) {
  if (isLoading) {
    // Create some skeleton rows
    rows = [{}, {}, {}];
  }
  return (
    <Section
      className={styles.section}
      contentDivider={null}
      titleDivider={<Divider className={styles.titledivider} />}
      title={
        <div className={styles.titlewrapper}>
          <Title type="title4">
            {Translate({ context: "search", label: "title" })}
          </Title>
          <div>
            <Title
              type="title2"
              tag="h3"
              className={styles.resultlength}
              skeleton={isLoading}
            >
              1456
            </Title>
            <ViewSelector
              className={styles.viewselector}
              onViewSelect={onViewSelect}
              viewSelected={viewSelected}
            />
          </div>
        </div>
      }
    >
      {rows.map((row, index) => (
        <ResultRow data={row} key={`${row.title}_${index}`} />
      ))}
    </Section>
  );
}
Result.propTypes = {
  isLoading: PropTypes.bool,
  rows: PropTypes.array,
  viewSelected: PropTypes.string,
  onViewSelect: PropTypes.func,
};

/**
 * Wrap is a react component responsible for loading
 * data and displaying the right variant of the component
 *
 * @param {Object} props Component props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function Wrap({ q, onViewSelect, viewSelected }) {
  // use the useData hook to fetch data
  const fastResponse = useData(fast({ q }));
  const allResponse = useData(all({ q }));

  if (fastResponse.isLoading) {
    return <Result isLoading={true} />;
  }
  if (fastResponse.error || allResponse.error) {
    return null;
  }

  const data = allResponse.data || fastResponse.data;

  return (
    <Result
      rows={data.search.result}
      onViewSelect={onViewSelect}
      viewSelected={viewSelected}
    />
  );
}
Wrap.propTypes = {
  q: PropTypes.string,
  viewSelected: PropTypes.string,
  onViewSelect: PropTypes.func,
};
