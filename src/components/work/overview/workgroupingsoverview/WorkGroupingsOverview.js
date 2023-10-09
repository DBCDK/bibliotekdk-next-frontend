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
import { scrollToElementWithOffset } from "@/components/base/scrollsnapslider/utils";
import Translate from "@/components/base/translate";
import useDataForWorkRelationsWorkTypeFactory from "@/components/hooks/useDataForWorkRelationsWorkTypeFactory";
import { useEffect, useState } from "react";
import styles from "./WorkGroupingsOverview.module.css";
import { dateToShortDate } from "@/utils/datetimeConverter";
import { getElementById } from "@/lib/utils";

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
 * @returns {React.ReactElement | null}
 */
function WorkGroupingsOverview({ description, title, anchorId, scrollOffset }) {
  const [element, setElement] = useState("");
  const [clickFunction, setClickFunction] = useState(() => {});

  useEffect(() => {
    if (anchorId) {
      setElement(getElementById(anchorId));
      setClickFunction(() => {
        return () => scrollToElementWithOffset(anchorId, "y", scrollOffset);
      });
    }
  }, [anchorId, scrollOffset]);

  return (
    title && (
      <Text tag={"div"} className={styles.display_inline}>
        {description}
        <Link
          border={{ top: false, bottom: { keepVisible: true } }}
          disabled={!element}
          onClick={clickFunction}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.keyCode === 13) {
              clickFunction();
            }
          }}
        >
          {title}
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

function getSeriesMap(series, seriesMembers) {
  const numberInSeries = series?.numberInSeries?.number?.join(".") || "";

  return (
    seriesMembers?.length > 0 && {
      partNumber: series?.numberInSeries?.number,
      description: `Del ${numberInSeries + " "} af `,
      title: series?.title,
      anchorId: getAnchor(AnchorsEnum.SERIES),
    }
  );
}

function getContinuationMap(groupedByRelationWorkTypes) {
  return (
    groupedByRelationWorkTypes?.[WorkTypeEnum.ARTICLE] && {
      partNumber: null,
      description: `Del af `,
      title: "artikelserie",
      anchorId: getAnchor(AnchorsEnum.RELATED_WORKS),
    }
  );
}

function RenderHostPublication({ hostPublication }) {
  return (
    hostPublication && (
      <Text className={styles.display_inline}>
        {hostPublication?.title}, {dateToShortDate(hostPublication?.issue)}
      </Text>
    )
  );
}

/**
 * Wrapper for WorkGroupingsOverview
 * @param workId
 * @returns {React.ReactElement | null}
 */
export default function Wrap({ workId }) {
  const work_response = useData(
    workId && workFragments.series({ workId: workId })
  );

  const { workRelationsWorkTypeFactory, data: workData } =
    useDataForWorkRelationsWorkTypeFactory({
      workId: workId,
    });

  const { groupedByRelationWorkTypes } = workRelationsWorkTypeFactory;

  const current =
    groupedByRelationWorkTypes?.[WorkTypeEnum.ARTICLE]?.find(
      (current) => current.relationType === "current"
    ) || workData?.work;

  const hostPublication =
    current?.manifestations?.mostRelevant?.[0]?.hostPublication;

  const series = work_response?.data?.work?.series?.[0];
  const seriesMembers = work_response?.data?.work?.seriesMembers;
  const seriesMap = getSeriesMap(series, seriesMembers);

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

  return (
    <>
      <RenderHostPublication hostPublication={hostPublication} />
      {hostPublication && workGroupings?.length > 0 && ". "}
      {workGroupings?.map((mapping) => (
        <WorkGroupingsOverview
          key={mapping?.title + "-" + mapping?.partNumber}
          {...mapping}
        />
      ))}
    </>
  );
}

// PropTypes for component
Wrap.propTypes = {
  workId: PropTypes.string,
};
