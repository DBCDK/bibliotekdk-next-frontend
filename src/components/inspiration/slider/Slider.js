import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { useData } from "@/lib/api/api";
import * as inspiration from "@/lib/api/inspiration.fragments";

import Section from "@/components/base/section";
import WorkSlider from "@/components/base/slider/WorkSlider";

import styles from "./Slider.module.css";

export function Slider({ title, works, isLoading }) {
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
            data-cy="recommender"
          />
        </Col>
      </Row>
    </Section>
  );
}

export default function Wrap({ title, category, filter }) {
  const { data, isLoading } = useData(
    inspiration?.[category]?.({
      filters: [filter],
    })
  );

  const cat = data?.inspiration?.categories?.[category]?.[0];

  return (
    <Slider title={title} works={cat?.works || []} isLoading={isLoading} />
  );
}
