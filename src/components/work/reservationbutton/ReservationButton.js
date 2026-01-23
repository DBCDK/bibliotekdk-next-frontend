import Button from "@/components/base/button/Button";
import Translate from "@/components/base/translate";
import Text from "@/components/base/text/Text";
import styles from "./ReservationButton.module.css";
import { useModal } from "@/components/_modal";
import {
  constructButtonText,
  context,
  handleGoToLogin,
  sortPublizonFirst,
} from "@/components/work/reservationbutton/utils";
import isEmpty from "lodash/isEmpty";
import useAuthentication from "@/components/hooks/user/useAuthentication";
import { useManifestationAccess } from "@/components/hooks/useManifestationAccess";
import { useData } from "@/lib/api/api";
import { overviewWork } from "@/lib/api/work.fragments";
import { useManifestationData, useOrderFlow } from "@/components/hooks/order";
import Icon from "@/components/base/icon";

import ExternalSvg from "@/public/icons/external_small_cc.svg";

function TextAboveButton({ access, isAuthenticated }) {
  const a0 = access?.[0];

  const loginRequired =
    a0?.loginRequired || ["InfomediaService"].includes(a0?.__typename);

  if (!loginRequired || isAuthenticated) return null;

  return (
    <Text
      type="text3"
      className={styles.textAboveButton}
      dataCy="text-above-order-button"
    >
      {Translate({ ...context, label: "url_login_required" })}
    </Text>
  );
}

/**
 *
 * @param {string} workId
 * @param {Array.<string>} selectedPids
 * @param {boolean} singleManifestation
 * @param {boolean} exactEdition
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
  exactEdition = false,
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
    materialTypesMap,
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
    isFolkUser,
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
        materialTypesMap,
        isFolkUser,
        isAuthenticated,
        isGuestUser,
        buttonType,
        size,
        pids: selectedPids,
        shortText,
        singleManifestation,
        exactEdition,
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
  materialTypesMap,
  isAuthenticated,
  isFolkUser,
  buttonType,
  size,
  pids,
  shortText = false, // Shorten material text
  overrideButtonText = null,
  modal,
  workTypes,
  materialTypes,
  hasPhysicalCopy,
  exactEdition = false,
  bookmarkKey,
}) => {
  access = sortPublizonFirst(access);

  const { start } = useOrderFlow();
  const noSelectedManifestations = Boolean(isEmpty(access));

  // pjo 15/08/24 - added filter for dfi.dk - it is not a real accessUrl
  const onlineMaterialWithoutLoginOrLoginAtUrl = Boolean(
    access?.filter((entry) => entry?.url && entry?.origin !== "www.dfi.dk")
      .length > 0
  );

  const infomediaAccess = Boolean(
    access?.filter(
      (entry) => entry?.url && entry?.__typename === "InfomediaService"
    ).length > 0
  );

  const publizonAccess = Boolean(
    access?.filter((entry) => entry?.__typename === "Publizon").length > 0
  );

  const type = materialTypesMap?.[access?.[0]?.pids?.[0]];

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
    href: access?.[0]?.url,
    asLink: true,
  };

  // INFOMEDIA
  const accessibleOnlineWithLoginProps = {
    skeleton: !access,
    dataCy: "button-order-overview",
    onClick: () =>
      handleGoToLogin(modal, access, isAuthenticated, isFolkUser, type),
  };

  const loginRequiredProps = {
    skeleton: isEmpty(access),
    dataCy: `button-order-overview-enabled`,
    onClick: () => {
      start({ orders: [{ pids, bookmarkKey: bookmarkKey, exactEdition }] });
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

    if (infomediaAccess) {
      return {
        props: accessibleOnlineWithLoginProps,
        text: constructButtonText(workTypes, materialTypes, shortText),
        preferSecondary: false,
      };
    }

    if (publizonAccess) {
      console.log("buttonType", buttonType);
      return {
        props: accessibleOnlineWithLoginProps,
        text: Translate({
          context: "overview",
          label: "publizon-local-library-btn",
        }),
        icon: <ExternalSvg size={3} className={styles.icon} />,
        preferSecondary: false,
      };
    }

    //ACCESS_URL
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

  const { props, text, icon, preferSecondary } = getProps();

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
          {icon ?? null}
        </Button>
      </div>
    </>
  );
};
