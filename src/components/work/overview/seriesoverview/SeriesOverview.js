import PropTypes from "prop-types";
import Text from "@/components/base/text";
import Link from "@/components/base/link";
import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";
import { AnchorsEnum } from "@/lib/enums";
import {
  getIndexForAnchor,
  getUniqueIdForAnchor,
} from "@/components/base/anchor/Anchor";
import { scrollToElementWithOffset } from "@/components/base/scrollsnapslider/utils";
import Translate from "@/components/base/translate";

/**
 * Presenter for SeriesOverview
 * @param partInSeries
 * @param seriesTitle
 * @param seriesLink
 * @return {JSX.Element}
 */
function SeriesOverview({ partInSeries, seriesTitle }) {
  const seriesAnchorIndex = getIndexForAnchor(Translate(AnchorsEnum.SERIES));

  const seriesAnchorId = getUniqueIdForAnchor(
    Translate(AnchorsEnum.SERIES),
    seriesAnchorIndex
  );

  return (
    seriesTitle && (
      <Text tag={"div"}>
        Del {partInSeries + " "} af{" "}
        <Link border={{ top: false, bottom: { keepVisible: true } }}>
          <div onClick={() => scrollToElementWithOffset(seriesAnchorId)}>
            {seriesTitle}
          </div>
        </Link>
      </Text>
    )
  );
}

// PropTypes for component
SeriesOverview.propTypes = {
  partInSeries: PropTypes.string,
  seriesTitle: PropTypes.string,
  seriesLink: PropTypes.string,
};

/**
 * Wrapper for SeriesOverview
 * @param workId
 * @param type
 * @return {JSX.Element|null}
 */
export default function Wrap({ workId }) {
  const work_response = useData(
    workId && workFragments.series({ workId: workId })
  );

  const work = work_response?.data?.work;
  const series = work?.series?.[0];

  if (
    work_response?.isLoading ||
    !work_response?.data ||
    work_response?.error
  ) {
    return null;
  }

  return (
    <SeriesOverview
      partInSeries={series?.numberInSeries?.number}
      seriesTitle={series?.title}
    />
  );
}

// PropTypes for component
Wrap.propTypes = {
  workId: PropTypes.string,
  type: PropTypes.string,
};
