import PropTypes from "prop-types";
import { Col, Row } from "react-bootstrap";

import { useData } from "@/lib/api/api";
import { series } from "@/lib/api/work.fragments";

import Section from "@/components/base/section";
import WorkSlider from "@/components/base/slider/WorkSlider";
import Translate from "@/components/base/translate";

import styles from "./Series.module.css";

/**
 * Series React component
 *
 * @param {object} props
 * @param {string} props.isLoading The work id
 * @param {array} props.works array of works in series
 */
export function Series({ isLoading, works = [] }) {
  // Translate Context
  const context = { context: "series" };

  // BETA-1 hide series section ( hide={true} ) - it is not implemented
  return (
    <Section
      title={Translate({ ...context, label: "label" })}
      topSpace={true}
      hide={true}
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
 * @param {object} props
 * @param {string} props.workId The work id
 */
export default function Container({ workId }) {
  const { data, isLoading } = useData(series({ workId }));

  // if work is not part of series, we wont show series section
  if (!isLoading && data && data.work && !data.work.series) {
    return null;
  }

  const works = data && data.work && data.work.series && data.work.series.works;

  return <Series isLoading={isLoading} works={works} />;
}
Container.propTypes = {
  workId: PropTypes.string,
};
