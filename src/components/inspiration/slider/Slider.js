import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { useData } from "@/lib/api/api";
import { inspiration } from "@/lib/api/inspiration.fragments";

import Section from "@/components/base/section";
import WorkSlider from "@/components/base/slider/WorkSlider";

import styles from "./Slider.module.css";

export function Slider({ works, isLoading, ...props }) {
  return (
    <Section dataCy="section-inspiration" isLoading={isLoading} {...props}>
      <Row className={`${styles.slider}`}>
        <Col>
          <WorkSlider
            skeleton={isLoading}
            works={works}
            data-cy="inspiration-slider"
          />
        </Col>
      </Row>
    </Section>
  );
}

export default function Wrap({ title, category, filter }) {
  const { data, isLoading } = useData(
    inspiration({
      filters: [filter],
      limit: 30,
      category,
    })
  );

  const cat = data?.inspiration?.categories?.[category]?.[0];

  if (!cat && !isLoading) {
    return null;
  }

  return (
    <Slider
      title={title}
      works={cat?.works || []}
      isLoading={isLoading}
      backgroundColor="var(--parchment)"
    />
  );
}
