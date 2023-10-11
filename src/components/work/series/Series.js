import PropTypes from "prop-types";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";

import Section from "@/components/base/section";
import WorkSlider from "@/components/base/slider/WorkSlider";
import Translate from "@/components/base/translate";

import styles from "./Series.module.css";

/**
 * Series React component
 *
 * @param {Object} props
 * @param {string} props.isLoading The work id
 * @param {Array} props.works array of works in series
 */
export function Series({ isLoading, works = [] }) {
  // Translate Context
  const context = { context: "series" };

  return (
    <Section
      title={Translate({ ...context, label: "label" })}
      divider={{ content: false }}
    >
      <Row className={`${styles.series}`}>
        <Col xs={12} md>
          <WorkSlider skeleton={isLoading} works={works} />
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
  const { data, isLoading } = useData(workFragments.series({ workId }));

  // if work is not part of series, we wont show series section
  if (!isLoading && !data?.work?.seriesMembers?.length) {
    return null;
  }

  return <Series isLoading={isLoading} works={data?.work?.seriesMembers} />;
}
Container.propTypes = {
  workId: PropTypes.string,
};
