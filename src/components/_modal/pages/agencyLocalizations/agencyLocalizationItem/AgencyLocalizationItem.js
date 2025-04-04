import Text from "@/components/base/text/Text";
import LocalizationItemBase from "@/components/_modal/pages/base/localizationsBase/localizationItemBase/LocalizationItemBase";
import { useHighlightsForSingleAgency } from "@/components/hooks/useHandleAgencyAccessData";
import isEmpty from "lodash/isEmpty";
import { highlightMarkedWords } from "@/components/_modal/utils";
import Translate from "@/components/base/translate";
import { getLibraryType, LibraryTypeEnum } from "@/lib/utils";
import {
  HoldingStatusEnum,
  useHoldingsForAgency,
} from "@/components/hooks/useHoldings";
import { useInView } from "react-intersection-observer";

/**
 * When there is no query, show this default agencyBranches, which are branches that have holdings
 * @param {Object} props
 * @param {Object.<string, any>} props.agency
 * @returns {React.ReactElement | null}
 */
function DefaultShowingOfAgencyBranches({ agencyId, pids }) {
  const { branchesKnownStatus, branchesByAvailability } = useHoldingsForAgency({
    agencyId,
    pids,
  });
  const mostAvailableBranch = branchesByAvailability?.[0];
  const mostAvailableStatus = mostAvailableBranch?.holdings?.status;
  const holdingsMessage = mostAvailableBranch?.holdingsMessage;

  const numberOfBranchesWithAvailable = branchesKnownStatus?.filter((branch) =>
    [
      HoldingStatusEnum.ON_SHELF,
      HoldingStatusEnum.ON_SHELF_NOT_FOR_LOAN,
    ].includes(branch?.holdings?.status)
  )?.length;

  const libraryType = getLibraryType(agencyId);

  if (numberOfBranchesWithAvailable > 0) {
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

          {numberOfBranchesWithAvailable > 0 &&
            " " +
              Translate({
                context: "localizations",
                label:
                  LibraryTypeEnum.DANISH_PUBLIC_LIBRARY !== libraryType
                    ? "or_more_branches"
                    : numberOfBranchesWithAvailable > 1
                    ? "branches"
                    : "branch",
              })}
          {mostAvailableBranch?.isLoanRestricted
            ? Translate({
                context: "localizations",
                label: "home_loan_restricted",
              })
            : mostAvailableStatus === HoldingStatusEnum.ON_SHELF_NOT_FOR_LOAN
            ? Translate({
                context: "localizations",
                label: "home_not_for_loan",
              })
            : null}
        </Text>
      </>
    );
  }

  if (mostAvailableStatus === HoldingStatusEnum.NOT_ON_SHELF) {
    return <Text clamp={true}>{holdingsMessage}</Text>;
  }

  // TODO: Fix NEVER, should be NO_RESPONSE
  // This covers NEVER and all other (others shouldn't happen)
  return (
    <Text clamp={true}>
      {Translate({
        context: "localizations",
        label: "agency_shelf_status_unknown",
      })}
    </Text>
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
  pids,
  query,
  localizationsIsLoading,
}) {
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
  });
  const { branchesByAvailability, isLoading: branchesIsLoading } =
    useHoldingsForAgency({ agencyId: inView && agencyId, pids });

  const branch = branchesByAvailability?.[0];

  const {
    branchesWithHighlights,
    agencyHighlight,
    branchesWithHighlightsIsLoading,
  } = useHighlightsForSingleAgency(
    !isEmpty(agencyId) &&
      !isEmpty(query) && {
        agencyId: inView && agencyId,
        query: query,
      }
  );

  const isLoading =
    !agencyId ||
    !pids ||
    branchesIsLoading ||
    branchesWithHighlightsIsLoading ||
    localizationsIsLoading ||
    !inView;

  return (
    <div ref={ref}>
      <LocalizationItemBase
        library={branch}
        branch={branch}
        query={query}
        itemLoading={isLoading}
        modalPush={() =>
          modal.push("branchLocalizations", {
            ...context,
            title: branch?.agencyName,
            pids: pids,
            agencyId: agencyId,
          })
        }
      >
        {agencyHighlight ? (
          <Text type={"text2"}>
            {highlightMarkedWords(agencyHighlight, "text2", "text1")}
          </Text>
        ) : (
          <Text type="text2">{branch?.agencyName}</Text>
        )}
        {inView && (
          <>
            {isEmpty(query) && (
              <DefaultShowingOfAgencyBranches agencyId={agencyId} pids={pids} />
            )}
            {!isEmpty(query) && !agencyHighlight && (
              <FormattedBranchesWithHighlights
                branchesWithHighlights={branchesWithHighlights}
              />
            )}
          </>
        )}
      </LocalizationItemBase>
    </div>
  );
}
