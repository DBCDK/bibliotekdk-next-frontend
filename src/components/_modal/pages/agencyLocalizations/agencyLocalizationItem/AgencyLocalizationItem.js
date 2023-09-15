import cx from "classnames";
import styles from "./AgencyLocalizationItem.module.css";
import Text from "@/components/base/text/Text";
import LocalizationItemBase from "@/components/_modal/pages/base/localizationsBase/localizationItemBase/LocalizationItemBase";
import {
  useSingleAgency,
  AvailabilityEnum,
} from "@/components/hooks/useHandleAgencyAccessData";
import isEmpty from "lodash/isEmpty";
import { highlightMarkedWords } from "@/components/_modal/utils";
import Translate from "@/components/base/translate";
import { getLibraryType, LibraryType } from "@/lib/utils";

const textProps = {
  className: cx(styles.text),
  clamp: true,
  lines: 2,
};

function DefaultShowingOfAgencies({ agency }) {
  const numberOfBranchesWithAvailable = agency?.branches?.filter(
    (branch) => branch?.availabilityAccumulated === AvailabilityEnum.NOW
  ).length;

  const publicLibrary = getLibraryType(agency?.agencyId);

  return (
    <>
      <Text {...textProps}>
        {Translate({
          context: "localizations",
          label:
            numberOfBranchesWithAvailable > 1
              ? "home_at_branches"
              : "home_at_1_branch",
          vars: [numberOfBranchesWithAvailable],
        })}
        {" " +
          Translate({
            context: "localizations",
            label:
              LibraryType.DANISH_PUBLIC_LIBRARY !== publicLibrary
                ? "or_more_branches"
                : numberOfBranchesWithAvailable > 1
                ? "branches"
                : "branch",
          })}
      </Text>
    </>
  );
}
function QueriedShowingOfAgencies({ agency }) {
  const branchesWithHighlights = agency?.branches
    .map((branch) => {
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
        <Text key={index}>
          {branch.branchName}
          {branch.postalCode && ", "}
          {branch.postalCode}
          {branch.city && ", "}
          {branch.city}
        </Text>
      );
    });

  return branchesWithHighlights?.length > 4 ? (
    <>
      {branchesWithHighlights?.slice(0, 3)}
      <Text>
        {Translate({
          context: "localizations",
          label: "additional_branches_available",
          vars: [branchesWithHighlights?.slice(3)?.length],
        })}
      </Text>
    </>
  ) : (
    <>{branchesWithHighlights}</>
  );
}

export default function AgencyLocalizationItem({
  context,
  modal,
  agencyId,
  localizationsIsLoading,
  pids,
  query,
}) {
  const { agenciesFlatSorted, agenciesIsLoading: singleAgencyIsLoading } =
    useSingleAgency(
      agencyId &&
        pids && {
          pids: pids,
          agencyId: agencyId,
          query: query,
        }
    );

  const agency = agenciesFlatSorted?.[0];

  const agencyHighlight = agency?.branches?.[0]?.highlights?.find(
    (highlight) => highlight.key === "agencyName"
  )?.value;

  const isLoading = localizationsIsLoading || singleAgencyIsLoading;

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
    >
      AgencyId: {agencyId}
      {agencyHighlight ? (
        <Text className={styles.text} type={"text2"}>
          {highlightMarkedWords(agencyHighlight)}
        </Text>
      ) : (
        <Text {...textProps} type="text2">
          {agency?.agencyName}
        </Text>
      )}
      {isEmpty(query) && <DefaultShowingOfAgencies agency={agency} />}
      {!isEmpty(query) && !agencyHighlight && (
        <QueriedShowingOfAgencies agency={agency} />
      )}
    </LocalizationItemBase>
  );
}
