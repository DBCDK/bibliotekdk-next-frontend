/**
 * @file Render continuation for overview
 *  Continuation covers Series, articleSeries.
 *  Can be expanded
 */
import PropTypes from "prop-types";
import Text from "@/components/base/text";
import Link from "@/components/base/link";
import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";
import { AnchorsEnum, WorkTypeEnum } from "@/lib/enums";
import {
  getIndexForAnchor,
  getUniqueIdForAnchor,
} from "@/components/base/anchor/Anchor";
import {
  getElementById,
  scrollToElementWithOffset,
} from "@/components/base/scrollsnapslider/utils";
import Translate from "@/components/base/translate";
import useDataForWorkRelationsWorkTypeFactory from "@/components/hooks/useDataForWorkRelationsWorkTypeFactory";

function getAnchor(anchorReference) {
  const seriesAnchorIndex = getIndexForAnchor(Translate(anchorReference));

  return getUniqueIdForAnchor(Translate(anchorReference), seriesAnchorIndex);
}

/**
 * Presenter for WorkGroupingsOverview
 * @param description
 * @param title
 * @param anchorId
 * @param scrollOffset
 * @return {JSX.Element}
 */
function WorkGroupingsOverview({ description, title, anchorId, scrollOffset }) {
  return (
    title && (
      <Text tag={"div"}>
        {description}
        <Link
          border={{ top: false, bottom: { keepVisible: true } }}
          disabled={!getElementById(anchorId)}
        >
          <div
            onClick={() =>
              scrollToElementWithOffset(anchorId, "y", scrollOffset)
            }
          >
            {title}
          </div>
        </Link>
      </Text>
    )
  );
}
WorkGroupingsOverview.propTypes = {
  partInSeries: PropTypes.string,
  seriesTitle: PropTypes.string,
  seriesLink: PropTypes.string,
};

function getSeriesMap(series) {
  return {
    partNumber: series?.numberInSeries?.number,
    description: `Del ${series?.numberInSeries?.number + " "} af `,
    title: series?.title,
    anchorId: getAnchor(AnchorsEnum.SERIES),
    scrollOffset: -64,
  };
}

function getContinuationMap(groupedByRelationWorkTypes) {
  return (
    groupedByRelationWorkTypes?.[WorkTypeEnum.ARTICLE] && {
      partNumber: null,
      description: `Del af `,
      title: "artikelserie",
      anchorId: getAnchor(AnchorsEnum.RELATED_WORKS),
      scrollOffset: 0,
    }
  );
}

/**
 * Wrapper for WorkGroupingsOverview
 * @param workId
 * @param type
 * @return {JSX.Element}
 */
export default function Wrap({ workId }) {
  const work_response = useData(
    workId && workFragments.series({ workId: workId })
  );

  const { workRelationsWorkTypeFactory } =
    useDataForWorkRelationsWorkTypeFactory({
      workId: workId,
    });

  const { groupedByRelationWorkTypes } = workRelationsWorkTypeFactory;

  const series = work_response?.data?.work?.series?.[0];
  const seriesMap = getSeriesMap(series);

  const continuationMap = getContinuationMap(groupedByRelationWorkTypes);

  // TODO: Find appropriate name for workGroup
  //  WorkGroup describes Series or continuations in this case
  const workGroupings = [
    ...(seriesMap ? [seriesMap] : []),
    ...(continuationMap ? [continuationMap] : []),
  ];

  if (
    work_response?.isLoading ||
    !work_response?.data ||
    work_response?.error
  ) {
    return null;
  }

  return workGroupings?.map((mapping) => (
    <WorkGroupingsOverview
      key={mapping?.title + "-" + mapping?.partNumber}
      {...mapping}
    />
  ));
}

// PropTypes for component
Wrap.propTypes = {
  workId: PropTypes.string,
  type: PropTypes.string,
};
