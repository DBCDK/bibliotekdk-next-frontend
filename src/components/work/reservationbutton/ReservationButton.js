import Button from "@/components/base/button/Button";
import Translate from "@/components/base/translate";
import Text from "@/components/base/text/Text";
import styles from "./ReservationButton.module.css";
import { useModal } from "@/components/_modal";
import {
  constructButtonText,
  context,
  handleGoToLogin,
  sortEreolFirst,
} from "@/components/work/reservationbutton/utils";
import useAuthentication from "@/components/hooks/user/useAuthentication";
import { useManifestationAccess } from "@/components/hooks/useManifestationAccess";
import { useData } from "@/lib/api/api";
import { overviewWork } from "@/lib/api/work.fragments";
import { useManifestationData, useOrderFlow } from "@/components/hooks/order";
import isEmpty from "lodash/isEmpty";
import { AccessEnum } from "@/lib/enums";
import { useHoldingsForAgency } from "@/components/hooks/useHoldings";
import useAgencyFromSubdomain from "@/components/hooks/useSubdomainToAgency";

function TextAboveButton({ access, isAuthenticated }) {
  return (
    (access?.[0]?.loginRequired ||
      access?.[0]?.__typename === "InfomediaService") &&
    !isAuthenticated && (
      <Text
        type="text3"
        className={styles.textAboveButton}
        dataCy={"text-above-order-button"}
      >
        {Translate({ ...context, label: "url_login_required" })}
      </Text>
    )
  );
}

/**
 *
 * @param {string} workId
 * @param {Array.<string>} selectedPids
 * @param {boolean} singleManifestation
 * @param {string} buttonType
 * @param {string} size
 * @param {string} shortText
 * @param {string|null} overrideButtonText
 * @param {string} className
 * @param {any} handleOrderFinished
 * @returns {JSX.Element}
 * @constructor
 */
function ReservationButtonWrapper({
  workId,
  selectedPids,
  singleManifestation = false,
  buttonType = "primary",
  size = "large",
  shortText,
  overrideButtonText = null,
  className,
  handleOrderFinished = undefined,
  bookmarkKey,
}) {
  const { data: workData, isLoadingWorkData } = useData(
    workId && overviewWork({ workId })
  );

  const { agency } = useAgencyFromSubdomain();
  const {
    access,
    hasPhysicalCopy,
    hasDigitalCopy,
    isLoading: isLoadingAccess,
  } = useManifestationAccess({
    pids: selectedPids,
  });

  const {
    physicalUnitPids: physicalPids,
    isLoading: isLoadingManifestationData,
  } = useManifestationData({ pids: selectedPids });

  const { branches } = useHoldingsForAgency({
    pids: selectedPids,
    agencyId: agency?.agencyId,
  });
  const branch = branches?.find(
    (branch) => branch?.branchId === agency?.branchId
  );

  const illSupported = hasPhysicalCopy;
  const requireLocalizations = !illSupported && physicalPids?.length > 0;

  const workTypes = workData?.work?.workTypes;
  const materialTypes = workData?.work?.materialTypes?.map(
    (type) => type?.materialTypeGeneral?.code
  );

  const {
    isAuthenticated,
    isGuestUser,
    isLoading: isLoadingAuthentication,
  } = useAuthentication();
  const modal = useModal();

  if (
    !workId ||
    !selectedPids ||
    selectedPids?.length === 0 ||
    isLoadingAuthentication ||
    isLoadingWorkData ||
    isLoadingAccess ||
    (requireLocalizations && isLoadingManifestationData)
  ) {
    return (
      <div className={styles.wrapper}>
        <Button
          skeleton={true}
          type={buttonType}
          size={size}
          dataCy={"button-order-overview-loading"}
          className={className}
        >
          {"loading"}
        </Button>
      </div>
    );
  }

  return (
    <ReservationButton
      {...{
        access,
        isAuthenticated,
        isGuestUser,
        buttonType,
        size,
        pids: selectedPids,
        shortText,
        singleManifestation,
        workId,
        overrideButtonText,
        modal,
        handleOrderFinished,
        workTypes,
        materialTypes,
        hasPhysicalCopy,
        hasDigitalCopy,
        bookmarkKey,
        branch,
      }}
    />
  );
}

export default ReservationButtonWrapper;

/**
 * For testing purpose we separate the rendered button from the skeleton
 * to be able to give mocked access obj to button
 * @param {Object} access
 * @param {Object} user
 * @param {string} buttonType
 * @param {string} size
 * @param {Array.<string>} pids
 * @param {boolean} singleManifestation
 * @param {Array.<Object.<string, any>>} allEnrichedAccesses
 * @param {string} workId
 * @param {string|null} overrideButtonText
 * @returns {React.JSX.Element}
 */
export const ReservationButton = ({
  access,
  isAuthenticated,
  buttonType,
  size,
  overrideButtonText = null,
  branch,
  workTypes,
  materialTypes,
  modal,
  pids,
}) => {
  access = sortEreolFirst(access);
  const { start } = useOrderFlow();
  // this is studiesøg - we always have an agency :)
  const { agency } = useAgencyFromSubdomain();

  console.log(access, "ACCESS");

  const getProps = () => {
    const lookupUrl = branch?.holdings?.lookupUrl;
    if (lookupUrl) {
      return {
        props: {
          dataCy: "button-order-overview-enabled",
          onClick: () => {
            window.open(lookupUrl, "_blank");
          },
        },
        text: Translate({ context: "overview", label: "see_location" }),
        preferSecondary: false,
      };
    }

    const hasDigitalCopy = access.find(
      (acc) => acc.__typename === AccessEnum.DIGITAL_ARTICLE_SERVICE
    );

    // is this an access url ?
    const onlineAccessUrl = Boolean(
      access?.filter((entry) => entry?.url && entry?.origin !== "www.dfi.dk")
        .length > 0
    );
    // props for button - online access with login options
    const onlineAccessProps = {
      skeleton: !access,
      dataCy: "button-order-overview",
      onClick: () => handleGoToLogin(modal, access, isAuthenticated),
    };
    //ACCESS_URL,INFOMEDIA,EREOL
    if (onlineAccessUrl) {
      return {
        props: onlineAccessProps,
        text: constructButtonText(workTypes, materialTypes),
      };
    }
    // order digital copy ?
    const digitalCopyProps = {
      skeleton: isEmpty(access),
      dataCy: `button-order-overview-enabled`,
      onClick: () => {
        start({ orders: [{ pids }], initialBranch: agency });
      },
    };
    if (hasDigitalCopy) {
      return {
        props: digitalCopyProps,
        text: Translate({
          context: "overview",
          label: "button-order-digital-copy",
        }),
      };
    }
    return {
      props: {
        dataCy: "button-order-no-localizations-disabled",
        disabled: true,
      },
      text: Translate({
        context: "overview",
        label: "button-order-no-localizations-disabled",
      }),
      preferSecondary: false,
    };
  };

  const { props, text, preferSecondary } = getProps();

  return (
    <>
      <TextAboveButton access={access} isAuthenticated={isAuthenticated} />

      <div className={styles.wrapper}>
        <Button
          type={preferSecondary ? "secondary" : buttonType}
          size={size}
          {...props}
        >
          {overrideButtonText ?? text}
        </Button>
      </div>
    </>
  );
};
