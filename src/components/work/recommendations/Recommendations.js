/**
 * @file Contains Recommendations React component
 *
 * Uses the laesekompas recommender, should be changed to the
 * new bib dk recommender when its ready
 */

import PropTypes from "prop-types";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";

import Section from "@/components/base/section";
import WorkSlider from "@/components/base/slider/WorkSlider";
import Translate from "@/components/base/translate";

import useDataCollect from "@/lib/useDataCollect";

import styles from "./Recommendations.module.css";
import { useMemo } from "react";

/**
 * The recommendations React component
 *
 * @param {Object} props
 * @param {string} props.workId The work id
 */
export default function Recommendations({
  workId,
  headerTag,
  titleDivider = true,
}) {
  const { data, isLoading } = useData(
    workFragments.recommendations({ workId })
  );
  const dataCollect = useDataCollect();

  const works = useMemo(() => {
    return (
      data?.recommend?.result?.map?.(({ work, reader }) => ({
        ...work,
        reader: reader?.[0],
      })) || []
    );
  }, [data]);

  if (!isLoading && works.length === 0) {
    return null;
  }

  // Translate Context
  const context = { context: "recommendations" };

  return (
    <Section
      title={Translate({ ...context, label: "remindsOf" })}
      dataCy="section-recommend"
      divider={{ content: false, title: titleDivider }}
      headerTag={headerTag}
    >
      <Row className={`${styles.recommendations}`}>
        <Col xs={12} md>
          <WorkSlider
            skeleton={isLoading}
            works={works}
            onWorkClick={(work, shownWorks, index) => {
              dataCollect.collectRecommenderClick({
                recommender_based_on: workId,
                recommender_click_hit: index + 1,
                recommender_click_work: work.workId,
                recommender_click_reader: work.reader,
                recommender_shown_recommendations: shownWorks,
              });
            }}
            data-cy="recommender"
          />
        </Col>
      </Row>
    </Section>
  );
}
Recommendations.propTypes = {
  workId: PropTypes.string,
};
