import PropTypes from "prop-types";
import merge from "lodash/merge";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { useData } from "@/lib/api/api";
import { inspiration } from "@/lib/api/inspiration.fragments";
import useElementVisible from "@/components/hooks/useElementVisible";

import Section from "@/components/base/section";
import WorkSlider from "@/components/base/slider/WorkSlider";

import styles from "./Slider.module.css";

export function Slider({ data, isLoading, lazyLoad = true, ...props }) {
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
            works={data}
            data-cy="inspiration-slider"
          />
        </Col>
      </Row>
    </Section>
  );
}

export default function Wrap({ category, filters = [], limit = 30, ...props }) {
  console.log("zzz", { category, filters });

  const { data, isLoading, error } = useData(
    inspiration({
      filters,
      limit,
      category,
    })
  );

  if (error) {
    console.log("error hest", { category, filters, error });
  }

  const cat = data?.inspiration?.categories?.[category]?.[0];

  if (!cat && !isLoading) {
    return null;
  }

  const works = cat?.result.map((obj) =>
    merge({}, obj.work, { manifestations: { all: [obj.manifestation] } })
  );

  return <Slider data={works || []} isLoading={isLoading} {...props} />;
}

Wrap.propTypes = {
  category: PropTypes.string,
  filters: PropTypes.array,
};
