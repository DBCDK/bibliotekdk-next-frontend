import Section from "@/components/base/section";
import { useData } from "@/lib/api/api";
import translate from "@/components/base/translate";
import { PeriodicaIssuByWork } from "@/lib/api/periodica.fragments";
import MaterialCard from "@/components/base/materialcard/MaterialCard";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import Link from "@/components/base/link";
import styles from "./PeriodicaOverview.module.css";
import { subjectUrl } from "../keywords/Keywords";

/**
 * show articles for an issue wrapped in an accordion
 * @param articles
 * @param isLoading
 * @returns {JSX.Element}
 * @constructor
 */
export function PeriodicaOverview({ work, isLoading }) {
  if (!isLoading && !work) {
    return null;
  }

  const publisher = work?.manifestations?.bestRepresentation?.publisher?.[0];
  const cover = work?.manifestations?.bestRepresentation?.cover;
  const parsedWork = {
    ...work,
    creators: [{ display: publisher }],
    cover,
    materialTypesArray: ["Tidsskrift"],
  };
  const periodicaTitle = work?.titles?.main;

  const subjects = work?.extendedWork?.issues?.subjects?.entries;

  return (
    <Section
      title={translate({
        context: "periodica",
        label: "periodicaOverviewTitle",
      })}
      subtitle={
        <Text type="text2" lines={4} clamp={true}>
          {translate({
            context: "periodica",
            label: "periodicaOverviewSubtitle",
            vars: [periodicaTitle],
          })}
        </Text>
      }
      divider={{ content: false }}
      sectionTag="div" // Section sat in parent
    >
      <Row>
        <Col xs={12} md={5} xl={4}>
          <div>
            <MaterialCard
              colSizing={{ xs: 12 }}
              propAndChildrenInput={parsedWork}
            />
          </div>
        </Col>
        <Col>
          <Text type="text1">
            {Translate({
              context: "keywords",
              label: "periodicaSubtitle1",
              vars: [work?.titles?.main],
            })}
            &nbsp;
            {Translate({
              context: "keywords",
              label: "periodicaSubtitle2",
            })}
          </Text>
          <div className={styles.words}>
            {subjects?.map((entry) => (
              <Link
                key={entry.term}
                href={subjectUrl(entry?.term)}
                disabled={isLoading}
                border={{ bottom: { keepVisible: true } }}
              >
                <Text type="text2" skeleton={isLoading} lines={1} tag="span">
                  {entry?.term}
                </Text>
              </Link>
            ))}
          </div>
        </Col>
      </Row>
    </Section>
  );
}

export default function Wrap({ workId }) {
  // use workid to fetch articles ,, abd other godd stuff .. from periodica
  const { data, isLoading } = useData(PeriodicaIssuByWork({ id: workId }));
  // show an issue
  return (
    <PeriodicaOverview
      work={data?.work?.extendedWork?.parentPeriodical}
      isLoading={isLoading}
    />
  );
}
