import LocalizationsBase from "@/components/_modal/pages/base/localizationsBase/LocalizationsBase";
import BranchLocalizationItem from "./branchLocalizationItem/BranchLocalizationItem";
import Translate from "@/components/base/translate";
import {
  AvailabilityEnum,
  dateIsLater,
  dateIsToday,
  useAgencyHoldingStatus,
  useSingleAgency,
} from "@/components/hooks/useHandleAgencyAccessData";
import styles from "./BranchLocalizations.module.css";
import Text from "@/components/base/text";
import Title from "@/components/base/title/Title";
import { AvailabilityLight } from "@/components/_modal/pages/base/localizationsBase/localizationItemBase/AvailabilityLight";
import { LinkForTheBranch } from "@/components/_modal/pages/branchDetails/branchDetailsStatus/BranchDetailsStatus";
import cx from "classnames";
import isEmpty from "lodash/isEmpty";

function OnlyInformationOnAgencyHoldings({
  agencyExpectedDelivery,
  pids,
  agency,
}) {
  const availabilityAccumulated = dateIsToday(agencyExpectedDelivery)
    ? AvailabilityEnum.NOW
    : dateIsLater(agencyExpectedDelivery)
    ? AvailabilityEnum.LATER
    : AvailabilityEnum.UNKNOWN;

  return (
    <div className={styles.agency_holdings_row_wrapper}>
      <AvailabilityLight
        availabilityAccumulated={availabilityAccumulated}
        pickupAllowed={agency?.pickupAllowed}
        style={{ marginTop: "var(--pt025)" }}
      />
      <div className={styles.agency_holdings_result}>
        <Text type="text2">
          {Translate({
            context: "localizations",
            label:
              agency?.pickupAllowed === false
                ? "agency_status_pickup_not_allowed"
                : availabilityAccumulated === AvailabilityEnum.LATER
                ? "agency_status_only_loan_later_possible"
                : availabilityAccumulated === AvailabilityEnum.NEVER
                ? "agency_status_pickup_not_allowed"
                : "no_status_about_the_following",
          })}
        </Text>
        <div className={cx(styles.link_for_branch)}>
          <LinkForTheBranch library={agency?.branches?.[0]} pids={pids} />
        </div>
      </div>
    </div>
  );
}

export default function BranchLocalizations({ context, modal }) {
  const { pids, agencyId } = context;

  const { agenciesFlatSorted } = useSingleAgency({
    pids: pids,
    agencyId: agencyId,
  });

  const agency = agenciesFlatSorted?.[0];

  const { agencyHoldingsIsRelevant, agencyExpectedDelivery } =
    useAgencyHoldingStatus({
      agencyId,
      pids,
    });

  const branchesKnownStatus = agency?.branches?.filter((branch) =>
    [
      AvailabilityEnum.NOW,
      AvailabilityEnum.LATER,
      AvailabilityEnum.NEVER,
    ].includes(branch.availabilityAccumulated)
  );

  const branchesUnknownStatus = agency?.branches?.filter(
    (branch) =>
      ![
        AvailabilityEnum.NOW,
        AvailabilityEnum.LATER,
        AvailabilityEnum.NEVER,
      ].includes(branch.availabilityAccumulated)
  );

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
        <Title type={"title6"} className={cx(styles.branch_status)}>
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

      {/*{agencyHoldingsIsRelevant && !isEmpty(branchesUnknownStatus) && (*/}
      {isEmpty(branchesKnownStatus) && !isEmpty(branchesUnknownStatus) && (
        <LocalizationsBase.Information>
          <OnlyInformationOnAgencyHoldings
            agencyHoldingsIsRelevant={agencyHoldingsIsRelevant}
            agencyExpectedDelivery={agencyExpectedDelivery}
            pids={pids}
            agency={agency}
          />
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
                  <LinkForTheBranch
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
