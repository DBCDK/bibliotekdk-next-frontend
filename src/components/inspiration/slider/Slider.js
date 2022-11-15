import PropTypes from "prop-types";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { useData } from "@/lib/api/api";
import { inspiration } from "@/lib/api/inspiration.fragments";
import useElementVisible from "@/components/hooks/useElementVisible";

import Section from "@/components/base/section";
import WorkSlider from "@/components/base/slider/WorkSlider";

import styles from "./Slider.module.css";

export function Slider({ works, isLoading, lazyLoad = true, ...props }) {
  const isClient = typeof window !== "undefined";
  const { elementRef, hasBeenSeen } = useElementVisible({
    root: null,
    rootMargin: "300px",
    threshold: 0,
  });

  const hide = lazyLoad && isClient && !hasBeenSeen;

  return (
    <Section
      dataCy="section-inspiration"
      isLoading={isLoading}
      {...props}
      elRef={elementRef}
    >
      <Row className={`${styles.slider}`}>
        <Col>
          <WorkSlider
            skeleton={isLoading || hide}
            works={works}
            data-cy="inspiration-slider"
          />
        </Col>
      </Row>
    </Section>
  );
}

export default function Wrap({ category, filters = [], ...props }) {
  const { data, isLoading } = useData(
    inspiration({
      filters,
      limit: 30,
      category,
    })
  );

  const cat = data?.inspiration?.categories?.[category]?.[0];

  if (!cat && !isLoading) {
    return null;
  }

  return <Slider works={cat?.works || []} isLoading={isLoading} {...props} />;
}

Wrap.propTypes = {
  category: PropTypes.string,
  filters: PropTypes.array,
};
