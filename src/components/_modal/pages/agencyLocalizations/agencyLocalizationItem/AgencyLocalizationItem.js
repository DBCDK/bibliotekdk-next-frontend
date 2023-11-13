import Text from "@/components/base/text/Text";
import LocalizationItemBase from "@/components/_modal/pages/base/localizationsBase/localizationItemBase/LocalizationItemBase";
import {
  useSingleAgency,
  AvailabilityEnum,
  useHighlightsForSingleAgency,
} from "@/components/hooks/useHandleAgencyAccessData";
import isEmpty from "lodash/isEmpty";
import { highlightMarkedWords } from "@/components/_modal/utils";
import Translate from "@/components/base/translate";
import { getLibraryType, LibraryTypeEnum } from "@/lib/utils";

/**
 * When there is no query, show this default agencyBranches, which are branches that have holdings
 * @param {Object} props
 * @param {Object.<string, any>} props.agency
 * @returns {React.ReactElement | null}
 */
function DefaultShowingOfAgencyBranches({ agency }) {
  const numberOfBranchesWithAvailable = agency?.branches?.filter(
    (branch) => branch?.availabilityAccumulated === AvailabilityEnum.NOW
  ).length;

  const publicLibrary = getLibraryType(agency?.agencyId);

  return (
    <>
      <Text clamp={true}>
        {Translate({
          context: "localizations",
          label:
            numberOfBranchesWithAvailable > 1
              ? "home_at_branches"
              : numberOfBranchesWithAvailable === 0
              ? "home_no_branch_specified"
              : "home_at_1_branch",
          vars: [numberOfBranchesWithAvailable],
        })}
        {(LibraryTypeEnum.DANISH_PUBLIC_LIBRARY !== publicLibrary ||
          numberOfBranchesWithAvailable > 0) &&
          " " +
            Translate({
              context: "localizations",
              label:
                LibraryTypeEnum.DANISH_PUBLIC_LIBRARY !== publicLibrary
                  ? "or_more_branches"
                  : numberOfBranchesWithAvailable > 1
                  ? "branches"
                  : "branch",
            })}
      </Text>
    </>
  );
}

/**
 * Shows the result from querying, which is the formatted branches which the necessary data for highlighting queried fields
 * @param {Object} props
 * @param {Array.<Object.<string, any>>} props.branchesWithHighlights
 * @returns {React.ReactElement | null}
 */
function FormattedBranchesWithHighlights({ branchesWithHighlights }) {
  const branchesFormattedWithHighlights = branchesWithHighlights
    ?.filter((branch) => {
      return branch?.highlights?.some((highlight) =>
        ["name", "postalCode", "city"].includes(highlight.key)
      );
    })
    ?.map((branch) => {
      const branchName = branch?.highlights.find(
        (highlight) => highlight.key === "name"
      )?.value;
      const postalCode = branch?.highlights.find(
        (highlight) => highlight.key === "postalCode"
      )?.value;
      const city = branch?.highlights.find(
        (highlight) => highlight.key === "city"
      )?.value;
      return {
        branchName: branchName
          ? highlightMarkedWords(branchName)
          : branch.branchName,
        postalCode: postalCode ? highlightMarkedWords(postalCode) : null,
        city: city ? highlightMarkedWords(city) : null,
      };
    })
    ?.map((branch, index) => {
      return (
        <Text clamp={true} key={index}>
          {branch.branchName}
          {branch.postalCode && ", "}
          {branch.postalCode}
          {branch.city && ", "}
          {branch.city}
        </Text>
      );
    });

  return branchesFormattedWithHighlights?.length > 4 ? (
    <>
      {branchesFormattedWithHighlights?.slice(0, 3)}
      <Text>
        {Translate({
          context: "localizations",
          label: "additional_branches_available",
          vars: [branchesFormattedWithHighlights?.slice(3)?.length],
        })}
      </Text>
    </>
  ) : (
    <>{branchesFormattedWithHighlights}</>
  );
}

/**
 * {@link AgencyLocalizationItem} shows each agency found by {@link AgencyLocalizations}
 * @param {Object} props
 * @param {Object.<string, any>} props.context
 * @param {Object.<string, any>} props.modal
 * @param {string} props.agencyId
 * @param {boolean} props.localizationsIsLoading
 * @param {Array.<string>} props.pids
 * @param {string} props.query
 * @returns {React.ReactElement | null}
 */
export default function AgencyLocalizationItem({
  context,
  modal,
  agencyId,
  localizationsIsLoading,
  pids,
  query,
}) {
  const {
    agenciesFlatSorted: agenciesFlatSortedNoHighlights,
    agenciesIsLoading: singleAgencyIsLoading,
  } = useSingleAgency(
    agencyId &&
      pids && {
        pids: pids,
        agencyId: agencyId,
      }
  );

  const {
    branchesWithHighlights,
    agencyHighlight,
    branchesWithHighlightsIsLoading,
  } = useHighlightsForSingleAgency(
    !isEmpty(agencyId) &&
      !isEmpty(query) && {
        agencyId: agencyId,
        query: query,
      }
  );

  const agency = agenciesFlatSortedNoHighlights?.[0];

  const isLoading =
    localizationsIsLoading ||
    singleAgencyIsLoading ||
    branchesWithHighlightsIsLoading;

  return (
    <LocalizationItemBase
      library={agency}
      query={query}
      itemLoading={isLoading}
      modalPush={() =>
        modal.push("branchLocalizations", {
          ...context,
          title: agency?.agencyName,
          pids: pids,
          agencyId: agencyId,
        })
      }
      availabilityAccumulated={agency?.availabilityOnAgencyAccumulated}
    >
      {agencyHighlight ? (
        <Text type={"text2"}>
          {highlightMarkedWords(agencyHighlight, "text2", "text1")}
        </Text>
      ) : (
        <Text type="text2">{agency?.agencyName}</Text>
      )}
      {
        <>
          {isEmpty(query) && <DefaultShowingOfAgencyBranches agency={agency} />}
          {!isEmpty(query) && !agencyHighlight && (
            <FormattedBranchesWithHighlights
              branchesWithHighlights={branchesWithHighlights}
            />
          )}
        </>
      }
    </LocalizationItemBase>
  );
}
