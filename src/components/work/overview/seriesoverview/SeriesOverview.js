import PropTypes from "prop-types";
import Text from "@/components/base/text";
import Link from "@/components/base/link";
import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";
import { encodeTitleCreator } from "@/lib/utils";

/**
 * Presenter for SeriesOverview
 * @param partInSeries
 * @param seriesTitle
 * @param seriesLink
 * @return {JSX.Element}
 */
function SeriesOverview({ partInSeries, seriesTitle, seriesLink }) {
  return (
    <Text tag={"div"}>
      Del {partInSeries + " "} af{" "}
      <Link
        href={seriesLink}
        border={{ top: false, bottom: { keepVisible: true } }}
      >
        {seriesTitle}
      </Link>
    </Text>
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
export default function Wrap({ workId, type }) {
  const work_response = useData(
    workId && workFragments.series({ workId: workId })
  );

  const work = work_response?.data?.work;
  const series = work?.series?.[0];
  const firstMember = work?.seriesMembers?.[0];

  const linkToFirstMember = {
    pathname: "/materiale/[title_author]/[workId]",
    query: {
      title_author: encodeTitleCreator(
        firstMember?.titles?.main?.[0],
        firstMember?.creators?.[0]?.display
      ),
      workId: firstMember?.workId,
      type: type,
    },
  };

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
      seriesLink={linkToFirstMember}
    />
  );
}

// PropTypes for component
Wrap.propTypes = {
  workId: PropTypes.string,
  type: PropTypes.string,
};
