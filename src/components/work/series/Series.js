import PropTypes from "prop-types";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";

import Section from "@/components/base/section";
import WorkSlider from "@/components/base/slider/WorkSlider";
import Translate from "@/components/base/translate";

import Link from "@/components/base/link";
import Title from "@/components/base/title";

import styles from "./Series.module.css";
import { templateForSeriesSlider } from "@/components/base/materialcard/templates/templates";
import { getSeriesUrl } from "@/lib/utils";

/**
 * Series React component
 *
 * @param {boolean} isLoading The work id
 * @param {Object.<string, any>} series
 * @param {string} workId
 * @param {number} index
 */
export function Series({ isLoading, series = {}, workId = "" }) {
  const propsAndChildrenInputList =
    series?.members?.map((member) => {
      return { material: member?.work, series: member };
    }) || [];
console.log("Series.series", series);
  const link = getSeriesUrl(series?.seriesId);
  const identifyingAddition = series?.identifyingAddition
    ? "(" + series?.identifyingAddition + ")"
    : "";

  return (
    <Section
      title={
        <Title tag="h3" type="title4" skeleton={isLoading}>
          <Link border={{ bottom: true }} href={link}>
            {` HEJ MED DIG KAJ${series.title} ${identifyingAddition}`}
          </Link>
        </Title>
      }
      divider={{ content: false }}
      subtitle={
        <div className={styles.padding_top}>
          <Link border={{ bottom: { keepVisible: true } }} href={link}>
            {Translate({ context: "series", label: "go_to_series" })}
          </Link>
        </div>
      }
    >
      <Row className={`${styles.series}`}>
        <Col xs={12} md>
          <WorkSlider
            skeleton={isLoading}
            propsAndChildrenTemplate={templateForSeriesSlider}
            propsAndChildrenInputList={propsAndChildrenInputList}
          />
        </Col>
      </Row>
    </Section>
  );
}
Series.propTypes = {
  isLoading: PropTypes.bool,
  works: PropTypes.array,
};

/**
 * Container
 *
 * @param {Object} props
 * @param {string} props.workId The work id
 */
export default function Container({ workId }) {
  const { data, isLoading } = useData(
    workFragments.series({ workId, seriesLimit: 20 })
  );

  const allSeries = data?.work?.series;

  // if work is not part of series, we wont show series section
  if (!isLoading && !data?.work?.series?.length) {
    return null;
  }

  // TODO: Figure out if this is needed to sort by materialType
  //   Remember to update seriesMembers to use series.members
  // const seriesWithSameMaterialTypes = data?.work?.seriesMembers.filter(
  //   (member) => {
  //     const formattedMaterialTypes = flattenMaterialType(member);
  //     return type?.every((mat) =>
  //       toFlatMaterialTypes(
  //         formattedMaterialTypes,
  //         "specificDisplay"
  //       )?.includes(mat)
  //     );
  //   }
  // );

  return (
    <>
      {allSeries?.map((singleSeries, index) => {
        return (
          <Series
            key={index}
            isLoading={isLoading}
            series={singleSeries}
            workId={workId}
          />
        );
      })}
    </>
  );
}
Container.propTypes = {
  workId: PropTypes.string,
};
