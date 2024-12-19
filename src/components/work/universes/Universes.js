import PropTypes from "prop-types";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import { useData } from "@/lib/api/api";
import { universesByWork } from "@/lib/api/universe.fragments";

import Section from "@/components/base/section";
import WorkSlider from "@/components/base/slider/WorkSlider";
import Translate from "@/components/base/translate";

import Link from "@/components/base/link";
import Title from "@/components/base/title";

import styles from "./Universes.module.css";
import {
  templateForUniverseInfoCard,
  templateForUniverseSliderSeries,
  templateForUniverseSliderWork,
} from "@/components/base/materialcard/templates/templates";
import { getUniverseUrl } from "@/lib/utils";

/**
 * Universe React component
 *
 * @param {boolean} isLoading The work id
 * @param {Object.<string, any>} universe
 * @param {string} workId
 * @param {number} index
 */
function Universes({ isLoading, universe = {}, workId = "", traceId = "" }) {
  const seriesAndWorks = universe?.content?.entries?.map((entry) => {
    if (entry.__typename === "Series") {
      return {
        material: entry,
        propsAndChildrenTemplate: templateForUniverseSliderSeries,
      };
    }
    return {
      material: entry,
      propsAndChildrenTemplate: templateForUniverseSliderWork,
    };
  });

  const universeCard = {
    material: {
      title: universe?.title,
      workId: workId,
      key: universe?.key,
      universeId: universe?.universeId,
      traceId: universe?.traceId,
    },
    propsAndChildrenTemplate: templateForUniverseInfoCard,
  };

  const propsAndChildrenInputList = [...seriesAndWorks, universeCard];

  const link =
    universe?.title &&
    universe?.key &&
    getUniverseUrl(universe?.universeId, traceId);

  return (
    <Section
      title={
        <Title tag="h3" type="title4" skeleton={isLoading}>
          <Link border={{ bottom: true }} href={link}>
            {Translate({
              context: "universe",
              label: "label",
              vars: [universe?.title],
            })}
          </Link>
        </Title>
      }
      divider={{ content: false }}
      subtitle={
        <div className={styles.padding_top}>
          <Link border={{ bottom: { keepVisible: true } }} href={link}>
            {Translate({
              context: "universe",
              label: "go_to_universe",
              vars: [universe?.title],
            })}
          </Link>
        </div>
      }
    >
      <Row className={`${styles.universe}`}>
        <Col xs={12} md>
          <WorkSlider
            skeleton={isLoading}
            propsAndChildrenInputList={propsAndChildrenInputList}
          />
        </Col>
      </Row>
    </Section>
  );
}
Universes.propTypes = {
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
    workId && universesByWork({ workId, offset: 0, limit: 19 })
  );

  const traceId = data?.work?.traceId;

  const allUniverses = data?.work?.universes;

  // if work is not part of universe, we wont show universe section
  if (!isLoading && allUniverses?.length < 1) {
    return null;
  }

  return (
    <>
      {allUniverses?.map((singleUniverse, index) => {
        return (
          <Universes
            key={index}
            isLoading={isLoading}
            universe={singleUniverse}
            workId={workId}
            traceId={traceId}
          />
        );
      })}
    </>
  );
}
Container.propTypes = {
  workId: PropTypes.string,
};
