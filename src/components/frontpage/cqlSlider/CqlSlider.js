import PropTypes from "prop-types";

import { useData } from "@/lib/api/api";
import { doComplexSearchAll } from "@/lib/api/complexSearch.fragments";
import { Slider } from "@/components/inspiration/slider/Slider";

const DEFAULT_LIMIT = 30;

export default function CqlSlider({
  cql,
  limit = DEFAULT_LIMIT,
  ...sectionProps
}) {
  const { data, isLoading } = useData(
    cql
      ? doComplexSearchAll({
          cql,
          offset: 0,
          limit,
        })
      : null
  );

  const works = data?.complexSearch?.works || [];

  if (!cql || (!isLoading && works.length === 0)) {
    return null;
  }

  return <Slider data={works} isLoading={isLoading} {...sectionProps} />;
}

CqlSlider.propTypes = {
  cql: PropTypes.string,
  limit: PropTypes.number,
};
