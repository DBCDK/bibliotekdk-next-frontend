import LocalizationsBase from "@/components/_modal/pages/base/localizationsBase/LocalizationsBase";
import BranchLocalizationItem from "./branchLocalizationItem/BranchLocalizationItem";
import Translate from "@/components/base/translate";
import {
  AvailabilityEnum,
  useSingleAgency,
} from "@/components/hooks/useHandleAgencyAccessData";
import styles from "./BranchLocalizations.module.css";
import Text from "@/components/base/text";
import Title from "@/components/base/title/Title";
import { AvailabilityLight } from "@/components/_modal/pages/base/localizationsBase/localizationItemBase/AvailabilityLight";
import cx from "classnames";
import isEmpty from "lodash/isEmpty";
import { LinkForBranch } from "@/components/_modal/pages/base/localizationsBase/linkForBranch/LinkForBranch";

function getLabel(agency, onlyHoldingsOnAgency) {
  const availabilityOnAgencyAccumulated =
    agency?.availabilityOnAgencyAccumulated;

  return agency?.pickupAllowed === false &&
    [AvailabilityEnum.NOT_OWNED, AvailabilityEnum.NOT_OWNED_FFU].includes(
      availabilityOnAgencyAccumulated
    )
    ? "agency_does_not_own_material_and_pickup_not_allowed"
    : agency?.pickupAllowed === false
    ? "agency_status_pickup_not_allowed"
    : onlyHoldingsOnAgency
    ? "agency_holdings_but_no_branches"
    : availabilityOnAgencyAccumulated === AvailabilityEnum.NOW
    ? "agency_status_only_home_at_one_or_more"
    : availabilityOnAgencyAccumulated === AvailabilityEnum.LATER
    ? "agency_status_only_loan_later_possible"
    : availabilityOnAgencyAccumulated === AvailabilityEnum.NEVER
    ? "agency_no_loaner_status_was_provided"
    : availabilityOnAgencyAccumulated === AvailabilityEnum.NOT_OWNED_FFU
    ? "agency_does_not_own_material__FFU"
    : availabilityOnAgencyAccumulated === AvailabilityEnum.NOT_OWNED
    ? "agency_does_not_own_material"
    : "no_status_about_the_following__status_message";
}

/**
 * {@link SpecificInformationOnAgency} presents Agency information for {@link BranchLocalizations}
 * @param {Object} props
 * @param {Array.<string>} props.pids
 * @param {Object} props.agency
 * @param {boolean} props.onlyHoldingsOnAgency
 * @returns {React.ReactElement | null}
 */
function SpecificInformationOnAgency({ pids, agency, onlyHoldingsOnAgency }) {
  const availabilityOnAgencyAccumulated =
    agency?.availabilityOnAgencyAccumulated;

  return (
    <div className={styles.agency_holdings_row_wrapper}>
      <AvailabilityLight
        availabilityAccumulated={availabilityOnAgencyAccumulated}
      />
      <div className={styles.agency_holdings_result}>
        <Text type="text2">
          {Translate({
            context: "localizations",
            label: getLabel(agency, onlyHoldingsOnAgency),
            vars: [
              ...(onlyHoldingsOnAgency ||
              [
                AvailabilityEnum.NOT_OWNED,
                AvailabilityEnum.NOT_OWNED_FFU,
              ].includes(availabilityOnAgencyAccumulated)
                ? [agency.agencyName]
                : []),
            ],
          })}
        </Text>
        {![AvailabilityEnum.NOT_OWNED, AvailabilityEnum.NOT_OWNED_FFU].includes(
          availabilityOnAgencyAccumulated
        ) && (
          <div className={cx(styles.link_for_branch)}>
            <LinkForBranch library={agency?.branches?.[0]} pids={pids} />
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * {@link BranchLocalizations} presents the branches in an agency.
 *   It uses {@link LocalizationsBase} and its compounded components
 *   {@link SpecificInformationOnAgency} presents information on Agency level, when no branch information is available
 * @param {Object} props
 * @param {Object.<string, any>} props.context
 * @param {Object.<string, any>} props.modal
 * @returns {React.ReactElement | null}
 */
export default function BranchLocalizations({ context, modal }) {
  const { pids, agencyId } = context;

  const { agenciesFlatSorted } = useSingleAgency({
    pids: pids,
    agencyId: agencyId,
  });

  const agency = agenciesFlatSorted?.[0];

  const branchesKnownStatus = agency?.branches?.filter((branch) =>
    [
      AvailabilityEnum.NOW,
      AvailabilityEnum.LATER,
      AvailabilityEnum.NOT_OWNED,
    ].includes(branch.availabilityAccumulated)
  );

  const branchesUnknownStatus = agency?.branches?.filter(
    (branch) =>
      // Matches NEVER, NOT_OWNED_FFU, UNKNOWN
      ![
        AvailabilityEnum.NOW,
        AvailabilityEnum.LATER,
        AvailabilityEnum.NOT_OWNED,
      ].includes(branch.availabilityAccumulated)
  );

  const availabilityAccumulated = agency?.availabilityAccumulated;
  const availabilityOnAgencyAccumulated =
    agency?.availabilityOnAgencyAccumulated;
  const onlyHoldingsOnAgency =
    availabilityOnAgencyAccumulated === AvailabilityEnum.NOW &&
    availabilityAccumulated !== availabilityOnAgencyAccumulated;

  return (
    <LocalizationsBase
      modal={modal}
      context={context}
      libraries={agency}
      pids={pids}
      subheader={Translate({
        context: "localizations",
        label: "reminder_can_be_ordered_from_anywhere",
      })}
    >
      <LocalizationsBase.Information>
        <Title type={"title6"} className={styles.status}>
          Status
        </Title>
      </LocalizationsBase.Information>
      <LocalizationsBase.List>
        {branchesKnownStatus?.map((branch, index) => (
          <li key={JSON.stringify(branch.branchId + "-" + index)}>
            <BranchLocalizationItem
              context={context}
              branchId={branch.branchId}
              pids={pids}
              modal={modal}
              manifestations={context.manifestations}
            />
          </li>
        ))}
      </LocalizationsBase.List>

      {(availabilityOnAgencyAccumulated === AvailabilityEnum.NOT_OWNED ||
        onlyHoldingsOnAgency) && (
        <LocalizationsBase.Information>
          <Title type={"title6"} className={styles.supplementary_status}>
            {Translate({
              context: "localizations",
              label: "supplementary_status",
            })}
          </Title>
          <SpecificInformationOnAgency
            pids={pids}
            agency={agency}
            onlyHoldingsOnAgency={onlyHoldingsOnAgency}
          />
        </LocalizationsBase.Information>
      )}

      {isEmpty(branchesKnownStatus) && !isEmpty(branchesUnknownStatus) && (
        <LocalizationsBase.Information>
          <SpecificInformationOnAgency pids={pids} agency={agency} />
        </LocalizationsBase.Information>
      )}
      {!isEmpty(branchesUnknownStatus) && (
        <>
          <LocalizationsBase.Information>
            <Title type="title6" className={styles.no_status}>
              {Translate({
                context: "localizations",
                label: "no_status_about_the_following",
              })}
            </Title>
            {!isEmpty(branchesKnownStatus) &&
              !isEmpty(branchesUnknownStatus) && (
                <div className={cx(styles.link_for_branch)}>
                  <LinkForBranch
                    library={agency?.branches?.[0]}
                    pids={pids}
                    textType="text3"
                  />
                </div>
              )}
          </LocalizationsBase.Information>
          <LocalizationsBase.List className={cx(styles.list)}>
            {branchesUnknownStatus?.map((branch, index) => (
              <li key={JSON.stringify(branch.branchId + "-" + index)}>
                <BranchLocalizationItem
                  context={context}
                  branchId={branch.branchId}
                  pids={pids}
                  modal={modal}
                  manifestations={context.manifestations}
                  primitiveDisplay={true}
                />
              </li>
            ))}
          </LocalizationsBase.List>
        </>
      )}
    </LocalizationsBase>
  );
}
