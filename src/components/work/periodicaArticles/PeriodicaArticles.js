import Section from "@/components/base/section";
import { useData } from "@/lib/api/api";
import { complexSearchWorksByIssn } from "@/lib/api/complexSearch.fragments";
import { manifestationsByIssue } from "@/components/work/periodicaArticles/utils";
import Translate from "@/components/base/translate";
import Row from "react-bootstrap/Row";
import styles from "./PeriodicaArticles.module.css";
import Col from "react-bootstrap/Col";
import Text from "@/components/base/text/Text";
import { WorkIdToIssn } from "@/lib/api/work.fragments";
import Accordion, { Item } from "@/components/base/accordion";
import translate from "@/components/base/translate";
import Link from "@/components/base/link";
import { subjectUrl } from "@/components/work/keywords/Keywords";

/**
 * show articles for an issue wrapped in an accordion
 * @param articles
 * @param isLoading
 * @returns {JSX.Element}
 * @constructor
 */
export function PeriodicaArticles({ issuesMap = {}, issue, isLoading }) {
  if (isLoading) {
    return <PeriodicaSkeleton />;
  }

  const manifestations = issuesMap?.[issue];

  if (!manifestations) {
    return null;
  }

  const publictationTitle = `${
    manifestations?.[0]?.hostPublication?.title || ""
  } ${issue}`;

  return (
    <Section
      title={translate({ context: "periodica", label: "articlestitle" })}
      divider={{ content: false }}
      dataCy="section-fisk"
      sectionTag="div" // Section sat in parent
    >
      {/* we want an accordion to show articles in issue*/}
      <Accordion>
        <Item
          title={publictationTitle}
          eventKey={publictationTitle}
          headerContentClassName={styles.headerContent}
        >
          {(hasBeenSeen) => {
            return (
              <div className={styles.container}>
                <PeriodicaHeader />
                {manifestations?.map((manifestation) => (
                  <PeriodicaArticle
                    manifestation={manifestation}
                    key={manifestation?.pid}
                    hasBeenSeen={hasBeenSeen}
                  />
                ))}
              </div>
            );
          }}
        </Item>
      </Accordion>
    </Section>
  );
}

/**
 * Show a 'table' header for the articles
 * @returns {JSX.Element}
 * @constructor
 */
function PeriodicaHeader() {
  /** labels for the table header **/
  const header = [
    "tableHeadArticle",
    "tableHeaderDescription",
    "tableHeaderSubjects",
    "tableHeaderExtent",
  ];

  return (
    <>
      {header.map((head, index) => (
        <div className={styles.headline} key={`tableheader-${index}`}>
          {translate({ context: "periodica", label: `${head}` })}
        </div>
      ))}
    </>
  );
}

/**
 * Shows an article
 */
export function PeriodicaArticle({ manifestation }) {
  // first column is title and creators
  const firstColumn = () => {
    const url = `/work/${manifestation.pid} `;
    return (
      <div>
        <Text type="text3" className={styles.bold}>
          <Link
            href={url}
            border={{ top: false, bottom: { keepVisible: true } }}
          >
            {manifestation.titles.full}
          </Link>
        </Text>

        <Text type="text3">
          {manifestation.creators.map((crea) => crea.display).join(", ")}
        </Text>
      </div>
    );
  };

  return (
    <>
      <div className={styles.item}>{firstColumn()}</div>
      <div className={styles.item}>
        <Text type="text3">{manifestation.abstract}</Text>
      </div>
      <div className={styles.item}>
        <Text type="text3">
          {manifestation.subjects.dbcVerified
            .map((sub) => sub.display)
            .join(", ")}
        </Text>
      </div>
      <div className={styles.item}>
        <Text type="text3">
          {manifestation.physicalDescription.summaryFull}
        </Text>
      </div>
    </>
  );
  // @TODO implement
}

export function PeriodicaSkeleton() {
  const Rows = [1, 2, 3];
  const texts = [1, 2, 3, 4, 5, 6];
  return (
    <Section
      title={Translate({ context: "periodica", label: "articlestitle" })}
      space={{ top: "var(--pt8)", bottom: "var(--pt4)" }}
      className={styles.section}
    >
      {Rows.map((row) => (
        <Row key={`row-skeleton-${row}`} className={styles.skeletonrow}>
          {texts.map((txt) => (
            <Col xs={6} md={3} key={`col-skeleton-${txt}`}>
              <Text
                type="text3"
                className={styles.title}
                lines={2}
                skeleton={true}
              >
                ...
              </Text>
            </Col>
          ))}
        </Row>
      ))}
    </Section>
  );
}

export default function Wrap({ workId }) {
  // get issn (periodica id), and issue for given workid
  const { data: issnData, isLoading: issnIsLoading } = useData(
    WorkIdToIssn({ id: workId })
  );
  const issn =
    issnData?.work?.manifestations?.latest?.hostPublication?.issn || 0;
  const issue =
    issnData?.work?.manifestations?.latest?.hostPublication?.issue || 0;
  // we handle "ARTICLE_ONLINE" only for now
  const materialType =
    issnData?.work?.materialTypes?.[0]?.materialTypeSpecific?.code;

  // construct the cql for complex search :) - complex
  const cql = `term.issn = "${issn}" AND phrase.issue="${issue}"`;
  // use issn to fetch articles from periodica
  const { data, isLoading } = useData(complexSearchWorksByIssn({ cql }));
  // either issn or work is loading
  const allIsLoading = issnIsLoading || isLoading;
  // arrange articles by issue
  const issuesMap = manifestationsByIssue(data?.complexSearch?.works);

  if (materialType !== "ARTICLE_ONLINE") {
    return null;
  }

  // show an issue
  return (
    <PeriodicaArticles
      issuesMap={issuesMap}
      issue={issue}
      isLoading={allIsLoading}
    />
  );
}
