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
import isEmpty from "lodash/isEmpty";
import useAuthentication from "@/components/hooks/user/useAuthentication";
import { useManifestationAccess } from "@/components/hooks/useManifestationAccess";
import { useData } from "@/lib/api/api";
import { overviewWork } from "@/lib/api/work.fragments";
import { useManifestationData, useOrderFlow } from "@/components/hooks/order";
import * as localizationsFragments from "@/lib/api/localizations.fragments";

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
    (requireLocalizations &&
      (isLoadingLocalizations || isLoadingManifestationData))
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
  pids,
  shortText = false, // Shorten material text
  overrideButtonText = null,
  modal,
  workTypes,
  materialTypes,
  hasPhysicalCopy,
  bookmarkKey,
}) => {
  access = sortEreolFirst(access);

  const { start } = useOrderFlow();
  const noSelectedManifestations = Boolean(isEmpty(access));

  // pjo 15/08/24 - added filter for dfi.dk - it is not a real accessUrl
  const onlineMaterialWithoutLoginOrLoginAtUrl = Boolean(
    access?.filter((entry) => entry?.url && entry?.origin !== "www.dfi.dk")
      .length > 0
  );

  const noSelectedManifestationsProps = {
    dataCy: "button-order-overview-disabled",
    disabled: true,
  };

  let noSelectedManifestationsLabel;
  if (!hasPhysicalCopy) {
    noSelectedManifestationsLabel = "Order-disabled-but-owned";
  } else if (hasPhysicalCopy) {
    noSelectedManifestationsLabel = "Order-disabled";
  } else {
    noSelectedManifestationsLabel = "Order-online-disabled";
  }
  const noSelectedManifestationsTxt = Translate({
    context: "overview",
    label: noSelectedManifestationsLabel,
  });

  const accessibleOnlineAndNoLoginProps = {
    skeleton: !access,
    dataCy: "button-order-overview",
    onClick: () => handleGoToLogin(modal, access, isAuthenticated),
  };

  const loginRequiredProps = {
    skeleton: isEmpty(access),
    dataCy: `button-order-overview-enabled`,
    onClick: () => {
      start({ orders: [{ pids, bookmarkKey: bookmarkKey }] });
    },
  };

  const loginRequiredText = Translate({
    context: "general",
    label: "bestil",
  });

  /**
   * Get props for the button based on the case scenario
   * @returns {Object} props and text for button
   */
  const getProps = () => {
    if (noSelectedManifestations) {
      return {
        props: noSelectedManifestationsProps,
        text: noSelectedManifestationsTxt,
        preferSecondary: false,
      };
    }

    //ACCESS_URL,INFOMEDIA,EREOL
    if (onlineMaterialWithoutLoginOrLoginAtUrl) {
      return {
        props: accessibleOnlineAndNoLoginProps,
        text: constructButtonText(workTypes, materialTypes, shortText),
        preferSecondary: shortText, // Becomes secondary button if button links to material (not ordering)
      };
    }

    //DIGITAL_ARTICLE_SERVICE, INTER_LIBRARY_LOAN
    return {
      props: loginRequiredProps,
      text: loginRequiredText,
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
