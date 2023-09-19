import Button from "@/components/base/button/Button";
import Translate, { hasTranslation } from "@/components/base/translate";
import Text from "@/components/base/text/Text";
import styles from "./ReservationButton.module.css";
import { useModal } from "@/components/_modal";
import { LOGIN_MODE } from "@/components/_modal/pages/loanerform/LoanerForm";
import { context } from "@/components/work/reservationbutton/utils";
import { useMemo } from "react";
import {
  onOnlineAccess,
  openOrderModal,
  useBranchUserAndHasDigitalAccess,
} from "@/components/work/utils";
import { MaterialTypeEnum } from "@/lib/enums_MaterialTypes";
import { useGetManifestationsForOrderButton } from "@/components/hooks/useWorkAndSelectedPids";
import {
  accessFactory,
  checkDigitalCopy,
  checkPhysicalCopy,
} from "@/lib/accessFactoryUtils";
import isEmpty from "lodash/isEmpty";
import uniq from "lodash/uniq";
import { useAuthentication } from "@/components/hooks/user/useAuthentication";

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

function isOnlineTranslator(materialTypeArray) {
  const overrideWithIsOnline =
    materialTypeArray?.filter((specificMaterialType) =>
      [MaterialTypeEnum.EBOG, MaterialTypeEnum["LYDBOG (NET)"]].includes(
        specificMaterialType
      )
    ).length > 0;

  return overrideWithIsOnline
    ? Translate({
        context: "workTypeDistinctForm",
        label: "isOnline",
      })
    : "";
}

export function workTypeTranslator(workTypes) {
  const workType = workTypes?.[0] || "fallback";
  return hasTranslation({
    context: "workTypeDistinctForm",
    label: workType.toLowerCase(),
  })
    ? Translate({
        context: "workTypeDistinctForm",
        label: workType.toLowerCase(),
      })
    : Translate({
        context: "workTypeDistinctForm",
        label: "fallback",
      });
}

function handleGoToLogin(access, isAuthenticated, modal, onOnlineAccess) {
  // if this is an infomedia article it should open in same window
  const urlTarget = access[0]?.id ? "_self" : "_blank";

  // check if we should open login modal on click
  const goToLogin =
    !isAuthenticated &&
    access[0]?.url &&
    access[0]?.loginRequired &&
    (access[0]?.url?.indexOf("ebookcentral") !== -1 ||
      access[0]?.url?.indexOf("ebscohost") !== -1);

  return goToLogin
    ? modal?.push("login", {
        mode: LOGIN_MODE.DDA,
        originUrl: access[0]?.origin,
      })
    : onOnlineAccess(access[0]?.url, urlTarget);
}

/**
 * Seperat function for orderbutton
 * Check what kind of material (eg. online, not avialable etc)
 * and present appropriate button
 *
 * @param {string} workId given workId for querying
 * @param {function} onOnlineAccess
 *  callback onclick handler for online access
 * @param {function} openOrderModal
 *  onclick handler for reservation
 * @param {string} buttonType of button for base button component
 * @param {string} size of button for base button component
 *
 * @return {JSX.Element}
 * @constructor
 */
export function OrderButton({
  isAuthenticated,
  modal,
  access,
  singleManifestation = false,
  onOnlineAccess,
  openOrderModal,
  onHandleGoToLogin = () =>
    handleGoToLogin(access, isAuthenticated, modal, onOnlineAccess),
  buttonType = "primary",
  size = "large",
}) {
  const physicalCopy = checkPhysicalCopy([access?.[0]])?.[0];
  const digitalCopy = checkDigitalCopy([access?.[0]])?.[0];

  const isOnlineTranslated = singleManifestation
    ? isOnlineTranslator(access?.[0]?.materialTypesArray, singleManifestation)
    : "";
  const workTypeTranslated = workTypeTranslator(access?.[0]?.workTypes);

  /** order button acts on following scenarios: */
  const caseScenarioMap = [
    /** (0) selectedManifestations does not exist for some reason */
    Boolean(isEmpty(access)),
    /** (1) material is accessible online (no user login or will prompt at destination) -> go to online url
     * --- a. ACCESS_URL
     * --- b. INFOMEDIA
     * --- c. EREOL
     * */
    Boolean(access?.length > 0 && !digitalCopy && !physicalCopy),
    /** (2) material is available as loan either:
     * --- d. DIGITAL_ARTICLE_SERVICE
     * --- e. INTER_LIBRARY_LOAN
     * */
    true,
  ];

  const buttonPropsMap = [
    /* (0) */
    {
      dataCy: "button-order-overview-disabled",
      disabled: true,
    },
    /* (1) */
    {
      dataCy: "button-order-overview",
      onClick: () => onHandleGoToLogin(access),
    },
    /* (2) */
    {
      dataCy: `button-order-overview-enabled`,
      onClick: openOrderModal,
    },
  ];

  const buttonTxtMap = [
    /* (0) */
    () =>
      Translate({
        context: "overview",
        label: !physicalCopy ? "Order-online-disabled" : "Order-disabled",
      }),
    /* (1) */
    () =>
      [
        Translate({
          context: "overview",
          label: "goto",
        }),
        isOnlineTranslated || workTypeTranslated,
      ].join(" "),
    /* (2) */
    () => Translate({ context: "general", label: "bestil" }),
  ];

  // Set the index, buttonProps, and buttonTxt
  const index = caseScenarioMap.findIndex((caseCheck) => caseCheck);
  const buttonProps = {
    skeleton: buttonPropsMap[index].disabled ? null : !access,
    type: buttonType,
    size: size,
    ...buttonPropsMap[index],
  };

  return (
    <>
      <TextAboveButton access={access} isAuthenticated={isAuthenticated} />
      <Button {...buttonProps}>{buttonTxtMap[index]()}</Button>
    </>
  );
}

function ReservationButton({
  workId,
  selectedPids,
  singleManifestation = false,
  buttonType = "primary",
  size = "large",
  className,
}) {
  const { isAuthenticated } = useAuthentication();

  const modal = useModal();

  const { workResponse, manifestations, manifestationsResponse } =
    useGetManifestationsForOrderButton(workId, selectedPids);

  const { branchIsLoading, hasDigitalAccess } =
    useBranchUserAndHasDigitalAccess(selectedPids);

  const { getAllAllowedEnrichedAccessSorted, allEnrichedAccesses } = useMemo(
    () => accessFactory(manifestations),
    [manifestations]
  );

  const access = useMemo(
    () => getAllAllowedEnrichedAccessSorted(hasDigitalAccess) || [],
    [workResponse?.data?.work, manifestations, hasDigitalAccess]
  );

  const pids = uniq(
    allEnrichedAccesses?.map((singleAccess) => singleAccess?.pid)
  );

  if (
    !workId ||
    !selectedPids ||
    !workResponse ||
    !manifestationsResponse ||
    manifestationsResponse?.isLoading ||
    workResponse?.isLoading ||
    branchIsLoading
  ) {
    return (
      <Button
        skeleton={true}
        type={buttonType}
        size={size}
        dataCy={"button-order-overview-loading"}
        className={className}
      >
        {"loading"}
      </Button>
    );
  }

  return (
    <OrderButton
      isAuthenticated={isAuthenticated}
      modal={modal}
      access={access}
      singleManifestation={singleManifestation}
      onOnlineAccess={onOnlineAccess}
      openOrderModal={() =>
        openOrderModal({
          modal: modal,
          pids: pids,
          selectedAccesses: allEnrichedAccesses,
          workId: workId,
          singleManifestation: singleManifestation,
        })
      }
      buttonType={buttonType}
      size={size}
      hasDigitalAccess={hasDigitalAccess}
    />
  );
}

export default ReservationButton;
