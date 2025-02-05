import LocalizationsBase from "@/components/_modal/pages/base/localizationsBase/LocalizationsBase";
import BranchLocalizationItem from "./branchLocalizationItem/BranchLocalizationItem";
import Translate from "@/components/base/translate";
import styles from "./BranchLocalizations.module.css";
import Text from "@/components/base/text";
import Title from "@/components/base/title/Title";
import { AvailabilityLight } from "@/components/_modal/pages/base/localizationsBase/localizationItemBase/AvailabilityLight";
import cx from "classnames";
import isEmpty from "lodash/isEmpty";
import { LinkForBranch } from "@/components/_modal/pages/base/localizationsBase/linkForBranch/LinkForBranch";

import { useHoldingsForAgency } from "@/components/hooks/useHoldings";

/**
 * {@link SpecificInformationOnAgency} presents Agency information for {@link BranchLocalizations}
 * @param {Object} props
 * @param {Array.<string>} props.pids
 * @param {Object} props.agency
 * @param {boolean} props.onlyHoldingsOnAgency
 * @returns {React.ReactElement | null}
 */
function SpecificInformationOnAgency({ pids, agency }) {
  const availabilityOnAgencyAccumulated =
    agency?.availabilityOnAgencyAccumulated;

  return (
    <div className={styles.agency_holdings_row_wrapper}>
      <AvailabilityLight
        // We're only interested in the agency in this situation
        availabilityLightProps={{
          availabilityAccumulated: availabilityOnAgencyAccumulated,
        }}
      />
      <div className={styles.agency_holdings_result}>
        <Text type="text2">
          {Translate({
            context: "localizations",
            label: "no_status_about_the_following__status_message",
          })}
        </Text>
        <div className={cx(styles.link_for_branch)}>
          <LinkForBranch library={agency} pids={pids} />
        </div>
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

  const {
    branchesKnownStatus,
    branchesUnknownStatus,
    branchesByAvailability,
    ownedByAgency,
    agencyMessage,
  } = useHoldingsForAgency({
    agencyId,
    pids,
  });

  const agency = branchesByAvailability?.[0];

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
      ownedByAgency={ownedByAgency}
    >
      {agencyMessage && (
        <LocalizationsBase.Information
          className={styles.expectedAgencyReturnDate}
        >
          <Title type={"title6"} className={styles.status}>
            {Translate({
              context: "holdings",
              label: "heading_NOT_ON_SHELF_HAS_RETURN_DATE",
            })}
          </Title>
          <Text type="text2">{agencyMessage}</Text>
        </LocalizationsBase.Information>
      )}
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
              agencyId={branch.agencyId}
              pids={pids}
              modal={modal}
              manifestations={context.manifestations}
            />
          </li>
        ))}
      </LocalizationsBase.List>
      {/* Status when there are no branchesWithKnownStatus */}
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
                    library={agency}
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
                  agencyId={branch.agencyId}
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
