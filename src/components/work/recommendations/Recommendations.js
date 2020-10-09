/**
 * @file Contains Recommendations React component
 *
 * Uses the laesekompas recommender, should be changed to the
 * new bib dk recommender when its ready
 */

import PropTypes from "prop-types";
import { Col, Row } from "react-bootstrap";
import { useData } from "../../../lib/api/api";
import { recommendations } from "../../../lib/api/work.fragments";
import Section from "../../base/section";
import WorkSlider from "../../base/slider/WorkSlider";

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
        description: manifestation.abstract[0],
        id: `work-of:${manifestation.pid}`,
        title: manifestation.title[0],
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

  return (
    <Section title="Minder om">
      <Row>
        <Col xs={12} md>
          <WorkSlider skeleton={isLoading} works={parsed} />
        </Col>
      </Row>
    </Section>
  );
}
Recommendations.propTypes = {
  workId: PropTypes.string,
};
