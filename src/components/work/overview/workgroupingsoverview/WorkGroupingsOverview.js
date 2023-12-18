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
import { getElementById, getSeriesUrl } from "@/lib/utils";

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
 * @param link
 * @returns {React.JSX.Element}
 */
function WorkGroupingsOverview({
  description,
  title,
  anchorId,
  scrollOffset,
  link = null,
}) {
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
          {...(link && { href: link })}
          {...(!link && {
            onClick: clickFunction,
            onKeyDown: (e) => {
              if (e.key === "Enter" || e.keyCode === 13) {
                clickFunction();
              }
            },
          })}
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

function getSeriesMap({ series, members, workId }) {
  const numberInSeries = series?.numberInSeries?.display || "";

  return (
    members?.length > 0 && {
      partNumber: series?.numberInSeries?.display,
      description: Translate({
        context: "overview",
        label: "work_groupings_overview_description",
        vars: [numberInSeries + " "],
      }),
      title: series?.title,
      anchorId: getAnchor(AnchorsEnum.SERIES),
      link: getSeriesUrl(series?.title, workId),
    }
  );
}

function getContinuationMap(groupedByRelationWorkTypes) {
  return (
    groupedByRelationWorkTypes?.[WorkTypeEnum.ARTICLE] && {
      partNumber: null,
      description: Translate({
        context: "overview",
        label: "work_groupings_overview_description",
        vars: [""],
      }),
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
 * @returns {React.JSX.Element}
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

  const allSeries = work_response?.data?.work?.series || [];
  const allSeriesMap = allSeries?.map((singleSeries) =>
    getSeriesMap({
      series: singleSeries,
      members: singleSeries.members?.map((member) => member?.work),
      workId: workId,
    })
  );

  const continuationMap = getContinuationMap(groupedByRelationWorkTypes);

  // TODO: Find appropriate name for workGroup
  //  WorkGroup describes Series or continuations in this case
  const workGroupings = [
    ...allSeriesMap,
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
    <div className={styles.workgroupings_flex}>
      <RenderHostPublication hostPublication={hostPublication} />
      {workGroupings?.map((mapping) => (
        <WorkGroupingsOverview
          key={mapping?.title + "-" + mapping?.partNumber}
          {...mapping}
        />
      ))}
    </div>
  );
}

// PropTypes for component
Wrap.propTypes = {
  workId: PropTypes.string,
};
