import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { useData } from "@/lib/api/api";
import useDataCollect from "@/lib/useDataCollect";
import * as inspiration from "@/lib/api/inspiration.fragments";

import Section from "@/components/base/section";
import WorkSlider from "@/components/base/slider/WorkSlider";
import Translate from "@/components/base/translate";

import styles from "./Slider.module.css";

export function Slider({ title, works, isLoading }) {
  const dataCollect = useDataCollect();

  return (
    <Section
      title={title}
      bgColor="var(--parchment)"
      dataCy="section-inspiration"
    >
      <Row className={`${styles.slider}`}>
        <Col xs={12} md>
          <WorkSlider
            skeleton={isLoading}
            works={works}
            onWorkClick={(work, shownWorks, index) => {
              dataCollect.collectRecommenderClick({
                recommender_based_on: workId,
                recommender_click_hit: index + 1,
                recommender_click_work: work.id,
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

export default function Wrap({ title, category, subCategory }) {
  const { data, isLoading } = useData(inspiration?.[category]?.());

  const cat = data?.inspiration?.categories?.[category];
  const sub = cat?.find((obj) => obj.title === subCategory);

  return (
    <Slider title={title} works={sub?.works || []} isLoading={isLoading} />
  );
}
