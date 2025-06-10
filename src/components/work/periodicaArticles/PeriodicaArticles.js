import Section from "@/components/base/section";
import { useData } from "@/lib/api/api";
import Translate from "@/components/base/translate";
import Row from "react-bootstrap/Row";
import styles from "./PeriodicaArticles.module.css";
import Col from "react-bootstrap/Col";
import Text from "@/components/base/text/Text";
import Accordion, { Item } from "@/components/base/accordion";
import translate from "@/components/base/translate";
import Link from "@/components/base/link";
import { PeriodicaIssuByWork } from "@/lib/api/periodica.fragments";
import { encodeTitleCreator } from "@/lib/utils";

/**
 * show articles for an issue wrapped in an accordion
 * @param articles
 * @param isLoading
 * @returns {JSX.Element}
 * @constructor
 */
export function PeriodicaArticles({ manifestations, issue, isLoading }) {
  if (isLoading) {
    return <PeriodicaSkeleton />;
  }

  if (!manifestations) {
    return null;
  }

  return (
    <Section
      title={translate({ context: "periodica", label: "articlestitle" })}
      divider={{ content: false }}
      dataCy="section-fisk"
      sectionTag="div" // Section sat in parent
    >
      {/* we want an accordion to show articles in issue*/}
      <PeriodicaAccordion
        manifestations={manifestations}
        issue={issue}
        periodicaTitle={manifestations?.[0]?.hostPublication?.title}
        showCount={true}
      />
    </Section>
  );
}

export function PeriodicaAccordion({
  manifestations,
  issue,
  periodicaTitle,
  showCount,
}) {
  let publictationTitle = issue;
  if (periodicaTitle) {
    publictationTitle = periodicaTitle + " " + issue;
  }

  return (
    <Accordion>
      <Item
        useScroll={false}
        title={
          <div className={styles.accordiontitle}>
            <Text type="text1" tag="span">
              {publictationTitle}
            </Text>
            {showCount && (
              <Text type="text2" tag="span" className={styles.articlecount}>
                {manifestations?.length}{" "}
                {translate({
                  context: "general",
                  label: manifestations?.length === 1 ? "article" : "articles",
                })}
              </Text>
            )}
          </div>
        }
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
    { label: "tableHeadArticle", style: styles.tableHeadArticle },
    { label: "tableHeaderDescription", style: styles.tableHeaderDescription },
    { label: "tableHeaderSubjects", style: styles.tableHeaderSubjects },
    { label: "tableHeaderExtent", style: styles.tableHeaderExtent },
  ];

  return (
    <div className={styles.headerrow}>
      {header.map((head, index) => (
        <div
          className={`${styles.headline} ${head.style}`}
          key={`tableheader-${index}`}
        >
          <Text type="text3">
            {translate({
              context: "periodica",
              label: `${head.label}`,
            })}
          </Text>
        </div>
      ))}
    </div>
  );
}

/**
 * Shows an article
 */
export function PeriodicaArticle({ manifestation }) {
  const workId = manifestation?.work?.workId;
  const url = `/materiale/${encodeTitleCreator(
    manifestation.titles.full?.[0],
    manifestation.creators
  )}/${workId} `;
  // first column is title and creators
  const firstColumn = () => {
    return (
      <div className={styles.articlecontainer}>
        <Text type="text3" className={styles.bold}>
          <Text type="text1" lines={4} clamp={true}>
            {manifestation.titles.full}
          </Text>
        </Text>

        <Text type="text2" className={styles.creators} lines={2} clamp={true}>
          {manifestation.creators.map((crea) => crea.display).join(", ")}
        </Text>
      </div>
    );
  };

  return (
    <Link
      className={styles.row}
      tabIndex={0}
      href={url}
      border={{ top: true, bottom: { keepVisible: false } }}
    >
      <div>{firstColumn()}</div>
      <div className={` ${styles.description}`}>
        <Text type="text2" lines={4} clamp={true}>
          {manifestation?.abstract}
        </Text>
      </div>
      <div className={`${styles.subjects}`}>
        <Text type="text2" lines={4} clamp>
          {manifestation?.subjects?.dbcVerified
            .map((sub) => sub.display)
            .join(", ")}
        </Text>
      </div>
      <div className={`${styles.extent}`}>
        <Text type="text2">
          {manifestation?.physicalDescription?.summaryFull || ""}
        </Text>
      </div>
    </Link>
  );
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
  // use workid to fetch articles ,, abd other godd stuff .. from periodica
  const { data, isLoading } = useData(PeriodicaIssuByWork({ id: workId }));
  const manifestations = data?.work?.extendedWork?.parentIssue?.works
    .map((work) => [
      ...(work?.manifestations?.all?.map((m) => ({ ...m, work })) || []),
    ])
    .flat();

  const materialType =
    data?.work?.materialTypes?.[0]?.materialTypeSpecific?.code;

  const materialTypesToShow = ["ARTICLE", "ARTICLE_ONLINE"];
  if (!materialTypesToShow.includes(materialType)) {
    return null;
  }

  const issue = data?.work?.extendedWork?.parentIssue?.display;

  // show an issue
  return (
    <PeriodicaArticles
      manifestations={manifestations}
      issue={issue}
      isLoading={isLoading}
    />
  );
}
