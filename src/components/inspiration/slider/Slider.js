import PropTypes from "prop-types";
import merge from "lodash/merge";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { useData } from "@/lib/api/api";
import { inspiration } from "@/lib/api/inspiration.fragments";
import useElementVisible from "@/components/hooks/useElementVisible";

import Section from "@/components/base/section";
import WorkSlider from "@/components/base/slider/WorkSlider";

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
      <Row>
        <Col>
          <WorkSlider
            propsAndChildrenInputList={data?.map((work) => {
              return {
                material: work,
              };
            })}
            skeleton={isLoading || hide}
            data-cy="inspiration-slider"
          />
        </Col>
      </Row>
    </Section>
  );
}

export default function Wrap({ filters = [], limit = 30, ...props }) {
  const { data, isLoading } = useData(
    inspiration({
      filters,
      limit,
    })
  );

  const cat = data?.inspiration?.categories?.[0];

  if (!cat && !isLoading) {
    return null;
  }

  const works = cat?.subCategories?.[0]?.result?.map((obj) =>
    merge({}, obj.work, {
      manifestations: { mostRelevant: [obj.manifestation] },
    })
  );

  if (works?.length === 0) {
    return null;
  }

  return <Slider data={works || []} isLoading={isLoading} {...props} />;
}

Wrap.propTypes = {
  limit: PropTypes.number,
  filters: PropTypes.array,
};
