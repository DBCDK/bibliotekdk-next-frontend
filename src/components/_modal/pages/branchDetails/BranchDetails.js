import LocalizationsBase from "@/components/_modal/pages/base/localizationsBase/LocalizationsBase";
import Translate from "@/components/base/translate";
import { useData } from "@/lib/api/api";
import * as manifestationFragments from "@/lib/api/manifestation.fragments";
import * as branchesFragments from "@/lib/api/branches.fragments";
import { manifestationMaterialTypeFactory } from "@/lib/manifestationFactoryUtils";
import uniq from "lodash/uniq";
import Text from "@/components/base/text/Text";
import Title from "@/components/base/title/Title";
import { IconLink } from "@/components/base/iconlink/IconLink";
import ExternalSvg from "@/public/icons/external_small.svg";
import animations from "@/components/base/animation/animations.module.css";
import styles from "./BranchDetails.module.css";
import cx from "classnames";
import BranchDetailsStatus from "@/components/_modal/pages/branchDetails/branchDetailsStatus/BranchDetailsStatus";
import isEmpty from "lodash/isEmpty";
import Button from "@/components/base/button/Button";
import * as PropTypes from "prop-types";
import { useGoToOrderWithBranch } from "@/components/hooks/useGoToOrderWithBranch";
import {
  HoldingStatusEnum,
  useHoldingsForAgency,
} from "@/components/hooks/useHoldings";
import { useOrderPolicyMessage } from "@/components/hooks/order";

/**
 * {@link OpeningHours} for {@link BranchDetails}
 * @param {Object} props
 * @param {Object.<string, any>} props.singleBranch
 * @returns {React.ReactElement | null}
 */
function OpeningHours({ singleBranch }) {
  return (
    <div className={cx(styles.fit_content, styles.path_blue)}>
      <Text type="text1">Åbningstider</Text>
      {!isEmpty(singleBranch?.openingHoursUrl) ? (
        <IconLink
          iconPlacement="right"
          iconSrc={ExternalSvg}
          iconAnimation={[animations["h-elastic"], animations["f-elastic"]]}
          textType="type2"
          href={`${singleBranch?.openingHoursUrl}`}
          target="_blank"
        >
          {Translate({
            context: "localizations",
            label: "see_opening_hours_of_the_library",
          })}
        </IconLink>
      ) : !isEmpty(singleBranch?.openingHours) ? (
        <Text type="text2" className={styles.break_word}>
          {singleBranch.openingHours}
        </Text>
      ) : (
        <Text type="text2">
          {Translate({
            context: "localizations",
            label: "no_information_about_opening_hours",
          })}
        </Text>
      )}
    </div>
  );
}

OpeningHours.propTypes = { singleBranch: PropTypes.any };

/**
 * {@link Address} for {@link BranchDetails}
 * @param {Object} props
 * @param {Object.<string, any>} props.singleBranch
 * @returns {React.ReactElement | null}
 */
function Address({ singleBranch }) {
  return (
    <div className={cx(styles.fit_content, styles.path_blue)}>
      <Text type="text1">Adresse</Text>
      {!singleBranch?.postalAddress &&
      !singleBranch?.postalCode &&
      !singleBranch?.city ? (
        <Text type="text2">
          {Translate({
            context: "localizations",
            label: "no_address_information",
          })}
        </Text>
      ) : (
        <>
          <Text type="text2">{singleBranch?.postalAddress}</Text>
          <Text type="text2">
            {singleBranch?.postalCode} {singleBranch?.city}
          </Text>
          <IconLink
            iconPlacement="right"
            iconSrc={ExternalSvg}
            iconAnimation={[animations["h-elastic"], animations["f-elastic"]]}
            textType="type2"
            href={`https://www.google.com/maps/place/${singleBranch?.postalAddress?.replace(
              "\r\n",
              "+"
            )}+${singleBranch?.postalCode}+${singleBranch?.city}`}
            target="_blank"
          >
            {Translate({
              context: "localizations",
              label: "see_in_google_maps",
            })}
          </IconLink>
        </>
      )}
    </div>
  );
}

Address.propTypes = { singleBranch: PropTypes.any };

/**
 * {@link ContactInformation} for {@link BranchDetails}
 * @param {Object} props
 * @param {Object.<string, any>} props.singleBranch
 * @returns {React.ReactElement | null}
 */
function ContactInformation({ singleBranch }) {
  return (
    <div className={cx(styles.fit_content, styles.path_blue)}>
      <Text type="text1">Kontakt</Text>
      {!singleBranch?.branchPhone && !singleBranch?.branchEmail ? (
        <Text type="text2">
          {Translate({
            context: "localizations",
            label: "no_contact_information",
          })}
        </Text>
      ) : (
        <>
          {singleBranch?.branchPhone && (
            <Text type="text2">
              {Translate({ context: "localizations", label: "phone" })}
              {": "}
              {singleBranch?.branchPhone}
            </Text>
          )}
          {singleBranch?.branchEmail && (
            <Text type="text2">
              {Translate({ context: "localizations", label: "email" })}
              {": "}
              {singleBranch?.branchEmail}
            </Text>
          )}
        </>
      )}
    </div>
  );
}

/**
 * {@link BranchDetails} shows the details of the Branch, including {@link MaterialCard}, {@link BranchDetailsStatus},
 * {@link OpeningHours}, {@link Address}, and {@link ContactInformation}
 * @param {Object} props
 * @param {Object<string, any>} props.context
 * @returns {React.ReactElement | null}
 */
export default function BranchDetails({ context }) {
  const { pids, branchId, agencyId } = context;

  const { branches, holdingsIsLoading } = useHoldingsForAgency({
    pids: pids,
    agencyId: agencyId,
  });
  const branch = branches?.find((branch) => branch?.branchId === branchId);

  const { data: orderPolicyData, isLoading: orderPolicyIsLoading } = useData(
    pids &&
      pids.length > 0 &&
      branchesFragments.checkOrderPolicy({ pids: pids, branchId: branchId })
  );

  const orderPolicyMessage = useOrderPolicyMessage({ pids, branchId });

  const orderPolicyForBranches = orderPolicyData?.branches?.result?.map(
    (branch) => {
      return {
        branchId: branch?.branchId,
        orderPossible: branch?.orderPolicy?.orderPossible,
        orderPossibleReason: branch?.orderPolicy?.orderPossibleReason,
      };
    }
  );

  const orderPolicyForBranch = orderPolicyForBranches?.[0];

  const { data: manifestationsData, isLoading: manifestationsIsLoading } =
    useData(
      pids &&
        pids.length > 0 &&
        manifestationFragments.editionManifestations({
          pid: pids,
        })
    );
  const {
    flattenedGroupedSortedManifestations: manifestationsBeforeEnriching,
  } = manifestationMaterialTypeFactory(manifestationsData?.manifestations);

  const manifestations = manifestationsBeforeEnriching.map((manifestation) => {
    return {
      ...manifestation,
    };
  });

  const workIds = uniq(
    manifestations?.map((manifestation) => {
      return manifestation.ownerWork?.workId;
    })
  );
  const workId = workIds?.[0];

  // we pass an orderobject instead of pids
  const orders = [{ pids: pids }];
  const { handleOnSelectEnriched, borrowerCheckIsLoading } =
    useGoToOrderWithBranch({
      context: context,
      orders: orders,
      workId: workId,
      branchWithoutBorrowerCheck: branch,
    });

  const branchDetailsLoading =
    holdingsIsLoading || manifestationsIsLoading || orderPolicyIsLoading;

  const buttonSize = "medium";

  if (!branchDetailsLoading && orderPolicyForBranches?.length > 1) {
    throw new Error(`Error: Der burde være præcis 1 branchId, men der er flere 
        ${orderPolicyForBranches
          ?.map((branch) => branch?.branchId)
          .join(", ")}`);
  }

  if (!branchDetailsLoading && workIds.length !== 1) {
    throw new Error(
      `Error: Der burde være præcis 1 workId, men der er ${workIds.length}`
    );
  }

  return (
    <LocalizationsBase context={context} pids={pids}>
      <LocalizationsBase.Information>
        <Title type={"title6"} className={cx(styles.branch_status)}>
          Status
        </Title>
        <div aria-hidden={true} className={styles.padding_element_pt_two} />
        <BranchDetailsStatus branch={branch} pids={pids} />
      </LocalizationsBase.Information>
      {!branchDetailsLoading &&
      (!branch?.pickupAllowed ||
        !orderPolicyForBranch?.orderPossible ||
        branch?.temporarilyClosed === true) ? (
        <LocalizationsBase.HighlightedArea>
          <Text type={"text2"}>
            {orderPolicyMessage
              ? orderPolicyMessage
              : Translate({
                  context: "localizations",
                  label: "obs_not_orders_to_here",
                })}
          </Text>
          {!!branch?.temporarilyClosedReason && (
            <Text type={"text2"}>{branch?.temporarilyClosedReason}</Text>
          )}
        </LocalizationsBase.HighlightedArea>
      ) : (
        <>
          <LocalizationsBase.Information
            className={cx(styles.reservationButton_container)}
          >
            {!branchDetailsLoading && !borrowerCheckIsLoading ? (
              <Button
                type={"primary"}
                size={buttonSize}
                onClick={handleOnSelectEnriched}
              >
                {Translate({
                  context: "localizations",
                  label: "order_to_here",
                })}
              </Button>
            ) : (
              <Button
                size={buttonSize}
                skeleton={branchDetailsLoading || borrowerCheckIsLoading}
              >
                {"loading"}
              </Button>
            )}
          </LocalizationsBase.Information>
          {!branchDetailsLoading &&
            branch?.holdings?.status !== HoldingStatusEnum.ON_SHELF && (
              <LocalizationsBase.Subheader>
                {Translate({
                  context: "localizations",
                  label: "reminder_can_be_ordered_from_anywhere",
                })}
              </LocalizationsBase.Subheader>
            )}
        </>
      )}
      <LocalizationsBase.Information>
        <Title type={"title6"} className={cx(styles.about_the_branch)}>
          {Translate({ context: "localizations", label: "about_the_branch" })}
        </Title>
        <OpeningHours singleBranch={branch} />
        <Address singleBranch={branch} />
        <ContactInformation singleBranch={branch} />
      </LocalizationsBase.Information>
    </LocalizationsBase>
  );
}
