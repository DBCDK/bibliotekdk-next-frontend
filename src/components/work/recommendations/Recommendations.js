/**
 * @file Contains Recommendations React component
 *
 * Uses the laesekompas recommender, should be changed to the
 * new bib dk recommender when its ready
 */

import PropTypes from "prop-types";
import { Col, Row } from "react-bootstrap";

import { useData, fetcher } from "@/lib/api/api";
import { recommendations } from "@/lib/api/work.fragments";

import Section from "@/components/base/section";
import WorkSlider from "@/components/base/slider/WorkSlider";
import Translate from "@/components/base/translate";

import { collectRecommenderClick } from "@/lib/api/datacollect.mutations";

import styles from "./Recommendations.module.css";

/**
 * Parse recommendations
 * We don't need this parser when the bibdk recommender
 * is properly integrated in GraphQL API
 */
function parse(data) {
  if (data && data.manifestation && data.manifestation.recommendations) {
    return data.manifestation.recommendations.map(({ manifestation }) => {
      return {
        cover: manifestation.cover,
        creators: manifestation.creators,
        id: `work-of:${manifestation.pid}`,
        title: manifestation.title,
      };
    });
  }
  return [];
}

/**
 * The recommendations React component
 *
 * @param {object} props
 * @param {string} props.workId The work id
 */
export default function Recommendations({ workId }) {
  const { data, isLoading } = useData(recommendations({ workId }));

  const parsed = parse(data);

  if (!isLoading && parsed.length === 0) {
    return null;
  }

  // Translate Context
  const context = { context: "recommendations" };

  return (
    <Section
      title={Translate({ ...context, label: "remindsOf" })}
      topSpace={true}
    >
      <Row className={`${styles.recommendations}`}>
        <Col xs={12} md>
          <WorkSlider
            skeleton={isLoading}
            works={parsed}
            onWorkClick={(work, shownWorks, index) => {
              fetcher(
                collectRecommenderClick({
                  recommender_based_on: workId,
                  recommender_click_hit: index + 1,
                  recommender_click_work: work.id,
                  recommender_shown_recommendations: shownWorks,
                })
              );
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
