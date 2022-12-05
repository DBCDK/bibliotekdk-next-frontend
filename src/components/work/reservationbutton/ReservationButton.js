import useUser from "@/components/hooks/useUser";
import Button from "@/components/base/button/Button";
import Translate, { hasTranslation } from "@/components/base/translate";
import Text from "@/components/base/text/Text";
import styles from "./ReservationButton.module.css";
import { checkPreferredOnline } from "@/lib/Navigation";
import { useModal } from "@/components/_modal";
import { LOGIN_MODE } from "@/components/_modal/pages/loanerform/LoanerForm";
import {
  checkDigitalCopy,
  checkRequestButtonIsTrue,
  context,
} from "@/components/work/reservationbutton/utils";
import { useMemo } from "react";
import { onOnlineAccess, openOrderModal } from "@/components/work/utils";
import { AccessEnum } from "@/lib/enums";
import { useGetManifestationsForOrderButton } from "@/components/hooks/useWorkAndSelectedPids";
import { accessUtils } from "@/lib/accessFactory";

function workTypeTranslator(workTypes) {
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

// TODO: Refactor this mess at some point
function handleGoToLogin(access, user, modal, onOnlineAccess) {
  // if this is an infomedia article it should open in same window
  const urlTarget = access[0]?.id ? "_self" : "_blank";

  // check if we should open login modal on click
  const goToLogin =
    !user.isAuthenticated &&
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

function extractSimpleFields(work, selectedManifestation, access) {
  const workTypeTranslated = workTypeTranslator(work?.workTypes);
  const title = work?.titles?.main;
  const pid = selectedManifestation?.pid;

  const buttonSkeleton = !work || !selectedManifestation;

  // if we prefer online material button text should be different
  const onlineDisable = checkPreferredOnline(
    selectedManifestation?.materialTypes?.[0]?.specific
  );

  const loanIsPossibleOnAny = access && access?.length > 0;

  return {
    workTypeTranslated,
    title,
    pid,
    buttonSkeleton,
    onlineDisable,
    loanIsPossibleOnAny,
  };
}

function TextAboveButton({ access, user }) {
  return (
    (access?.[0]?.loginRequired ||
      access?.[0]?.__typename === "InfomediaService") &&
    !user.isAuthenticated && (
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
 * Seperat function for orderbutton
 * Check what kind of material (eg. online, not avialable etc)
 * and present appropriate button
 *
 * @param {string} workId given workId for querying
 * @param {function} onOnlineAccess
 *  callback onclick handler for online access
 * @param {function} openOrderModal
 *  onclick handler for reservation
 * @param {boolean} singleManifestation
 * @param {string} buttonType of button for base button component
 * @param {string} size of button for base button component
 *
 * @return {JSX.Element}
 * @constructor
 */
export function OrderButton({
  user,
  modal,
  work,
  manifestations,
  onOnlineAccess,
  openOrderModal,
  onHandleGoToLogin = (access) =>
    handleGoToLogin(access, user, modal, onOnlineAccess),
  singleManifestation,
  buttonType = "primary",
  size = "large",
}) {
  const { allEnrichedAccesses: access } = useMemo(() => {
    return accessUtils(manifestations);
  }, [manifestations]);

  const selectedManifestation = useMemo(() => {
    return manifestations?.find(
      (manifestation) => manifestation?.pid === access?.[0]?.pid
    );
  }, [manifestations, access]);

  const {
    workTypeTranslated,
    pid,
    buttonSkeleton,
    onlineDisable,
    loanIsPossibleOnAny,
  } = useMemo(
    () => extractSimpleFields(work, selectedManifestation, access),
    [work, selectedManifestation]
  );

  /** order button acts on following scenarios: */
  const caseScenarioMap = [
    /** (0) selectedManifestations does not exist for some reason */
    Boolean(
      selectedManifestation === null ||
        typeof selectedManifestation === "undefined" ||
        access === null
    ),
    /** (1) material is accessible online (no user login) -> go to online url
     * --- a. online url
     * --- b. webarchive
     * --- c. infomedia access (needs login)
     * --- d. digital copy (needs login)
     * ? online access ? - special handling of digital copy (access[0].issn) */
    Boolean(
      access?.length > 0 &&
        !access?.[0]?.issn &&
        access?.[0]?.__typename !== AccessEnum.INTER_LIBRARY_LOAN
    ),
    /** (2) material is available for logged in library
     * ---  --> prepare order button with parameters
     * ? All is well ? - material can be ordered - order button */
    Boolean(singleManifestation),
    /** (3) material can not be ordered
     * --- maybe it is too new or something else -> disable (with a reason?)
     * ? No online access ? - check if work can be ordered */
    Boolean(
      loanIsPossibleOnAny === false &&
        !checkRequestButtonIsTrue({ allEnrichedAccesses: access }) &&
        !checkDigitalCopy({ access: access })
    ),
    /** (4) material is not available -> disable */
    true,
  ];

  const buttonPropsMap = [
    /* (0) */
    {
      dataCy: "button-order-overview",
      disabled: true,
    },
    /* (1) */
    {
      dataCy: "button-order-overview",
      onClick: () => onHandleGoToLogin(access),
    },
    /* (2) */
    {
      onClick: () => openOrderModal(selectedManifestation),
      dataCy: `button-order-overview-enabled${pid}`,
    },
    /* (3) */
    {
      dataCy: "button-order-overview",
      disabled: true,
    },
    /* (4) */
    {
      onClick: () => openOrderModal(selectedManifestation),
      dataCy: `button-order-overview-enabled`,
    },
  ];

  const buttonTxtMap = [
    /* (0) */
    () =>
      Translate({
        context: "overview",
        label: onlineDisable ? "Order-online-disabled" : "Order-disabled",
      }),
    /* (1) */
    () =>
      [
        Translate({
          context: "overview",
          label: "goto",
        }),
        workTypeTranslated,
      ].join(" "),
    /* (2) */
    () =>
      Translate({
        context: "order",
        label: "specific-edition",
      }),
    /* (3) */
    () =>
      Translate({
        context: "overview",
        label: onlineDisable ? "Order-online-disabled" : "Order-disabled",
      }),
    /* (4) */
    () => Translate({ context: "general", label: "bestil" }),
  ];

  // Set the index, buttonProps, and buttonTxt
  const index = caseScenarioMap.findIndex((caseCheck) => caseCheck);
  const buttonProps = {
    className: styles.externalLink,
    skeleton: buttonPropsMap[index].disabled ? null : buttonSkeleton,
    type: buttonType,
    size: size,
    ...buttonPropsMap[index],
  };

  return (
    <>
      <TextAboveButton access={access} user={user} />
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
}) {
  const user = useUser();
  const modal = useModal();

  const {
    workResponse,
    manifestations,
    manifestationsResponse,
    selectedManifestationsPids,
  } = useGetManifestationsForOrderButton(workId, selectedPids);

  if (
    workResponse?.isLoading ||
    manifestationsResponse?.isLoading ||
    !selectedManifestationsPids
  ) {
    return (
      <Button
        className={styles.externalLink}
        skeleton={true}
        type={buttonType}
        size={size}
        dataCy={"button-order-overview-loading"}
      >
        {"loading"}
      </Button>
    );
  }

  return (
    <OrderButton
      user={user}
      modal={modal}
      work={workResponse.data?.work}
      manifestations={manifestations}
      onOnlineAccess={onOnlineAccess}
      openOrderModal={(manifestation) =>
        openOrderModal(modal, workId, singleManifestation, manifestation)
      }
      singleManifestation={singleManifestation}
      buttonType={buttonType}
      size={size}
    />
  );
}

export default ReservationButton;
