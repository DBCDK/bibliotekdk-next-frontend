import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";
import useUser from "@/components/hooks/useUser";
import Button from "@/components/base/button/Button";
import Translate, { hasTranslation } from "@/components/base/translate";
import Text from "@/components/base/text/Text";
import styles from "./ReservationButton.module.css";
import { preferredOnline } from "@/lib/Navigation";
import { useModal } from "@/components/_modal";
import { LOGIN_MODE } from "@/components/_modal/pages/loanerform/LoanerForm";
import {
  addToInfomedia_TempUsingAlfaApi,
  checkDigitalCopy,
  checkDigitalCopy_TempUsingAlfaApi,
  checkRequestButtonIsTrue,
  context,
  selectMaterial,
  selectMaterial_TempUsingAlfaApi,
  selectMaterialBasedOnType,
} from "@/components/work/reservationbutton/utils";
import { encodeTitleCreator, infomediaUrl } from "@/lib/utils";
import { useMemo } from "react";

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

function handleGoToLogin(
  data,
  selectedManifestations,
  user,
  modal,
  onOnlineAccess
) {
  const { access, pid, accessTypeCode, title } = extractSimpleFields(
    data,
    selectedManifestations
  );

  function addToInfomedia(access, pid, title) {
    access?.map((access) => {
      if (access?.__typename === "InfomediaSerivce" && access?.id !== null) {
        access.url = infomediaUrl(
          encodeTitleCreator(title),
          `work-of:${pid}`,
          access.id
        );
        access.accessType = "infomedia";
      }
      return access;
    });
  }
  // add url to infomedia - if any
  addToInfomedia(access, pid, title);

  // if this is an infomedia article it should open in same window
  const urlTarget = access[0]?.id ? "_self" : "_blank";

  // check if we should open login modal on click
  const goToLogin =
    !user.isAuthenticated &&
    accessTypeCode === "ONLINE" &&
    access[0]?.loginRequired &&
    (access[0]?.url.indexOf("ebookcentral") !== -1 ||
      access[0]?.url.indexOf("ebscohost") !== -1);

  return goToLogin
    ? modal?.push("login", {
        mode: LOGIN_MODE.DDA,
        originUrl: access[0]?.origin,
      })
    : onOnlineAccess(access[0]?.url, urlTarget);
}

function extractSimpleFields(work, selectedManifestations) {
  const workTypeTranslated = workTypeTranslator(work?.workTypes);
  const title = work?.titles?.main;
  const pid = selectedManifestations?.pid;
  const accessTypeCode = selectedManifestations?.accessTypes?.code;

  const access = selectedManifestations?.access;
  const buttonSkeleton =
    selectedManifestations !== null && typeof access === "undefined";

  // if we prefer online material button text should be different
  let onlineDisable = preferredOnline.includes(work?.materialTypes?.specific);

  const loanIsPossibleOnAny = access && access?.length > 0;

  return {
    workTypeTranslated,
    title,
    pid,
    accessTypeCode,
    access,
    buttonSkeleton,
    onlineDisable,
    loanIsPossibleOnAny,
  };
}

/**
 * Seperat function for orderbutton
 * Check what kind of material (eg. online, not avialable etc)
 * and present appropriate button
 *
 * @param {string} workId given workId for querying
 * @param {string} chosenMaterialType current type looked at
 * @param {function} onOnlineAccess
 *  callback onclick handler for online access
 * @param {function} openOrderModal
 *  onclick handler for reservation
 * @param {boolean} singleManifestion
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
  chosenMaterialType,
  onOnlineAccess,
  openOrderModal,
  singleManifestion = false,
  buttonType = "primary",
  size = "large",
}) {
  const selectedMaterial = selectMaterialBasedOnType(
    work?.manifestations?.all,
    chosenMaterialType
  );
  let selectedManifestation = selectedMaterial;
  if (!singleManifestion) {
    selectedManifestation = selectMaterial(selectedMaterial);
  }

  const {
    workTypeTranslated,
    pid,
    accessTypeCode,
    access,
    buttonSkeleton,
    onlineDisable,
    loanIsPossibleOnAny,
  } = useMemo(
    () => extractSimpleFields(work, selectedManifestation),
    [work, selectedManifestation]
  );

  // QUICK DECISION: if this is single manifestation AND the manifestation can NOT be ordered
  // we show no Reservation button - @TODO should we show online accesss etc. ???
  if (
    singleManifestion &&
    (!loanIsPossibleOnAny ||
      !checkRequestButtonIsTrue({ manifestations: selectedMaterial }))
  ) {
    return <></>;
  }

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
        access?.[0]?.__typename !== "InterLibraryLoan"
    ),
    /** (2) material can not be ordered
     * --- maybe it is too new or something else -> disable (with a reason?)
     * ? No online access ? - check if work can be ordered */
    Boolean(
      loanIsPossibleOnAny === false &&
        !checkRequestButtonIsTrue({ manifestations: selectedMaterial }) &&
        !checkDigitalCopy({ manifestations: selectedMaterial })
    ),
    /** (3) material is available for logged in library
     * ---  --> prepare order button with parameters
     * ? All is well ? - material can be ordered - order button */
    Boolean(singleManifestion),
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
      onClick: () =>
        handleGoToLogin(
          work,
          selectedManifestation,
          user,
          modal,
          onOnlineAccess
        ),
    },
    /* (2) */
    {
      dataCy: "button-order-overview",
      disabled: true,
    },
    /* (3) */
    {
      onClick: () => pid && openOrderModal(pid),
      dataCy: `button-order-overview-enabled${pid}`,
    },
    /* (4) */
    {
      onClick: () => pid && openOrderModal(pid),
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
        context: "overview",
        label: onlineDisable ? "Order-online-disabled" : "Order-disabled",
      }),
    /* (3) */
    () =>
      Translate({
        context: "order",
        label: "specific-edition",
      }),
    /* (4) */
    () => Translate({ context: "general", label: "bestil" }),
  ];

  // Set the index, buttonProps, and buttonTxt
  const index = caseScenarioMap.findIndex((caseCheck) => caseCheck);
  const buttonProps = {
    className: styles.externalLink,
    skeleton: buttonSkeleton,
    type: buttonType,
    size: size,
    ...buttonPropsMap[index],
  };
  const buttonTxt = buttonTxtMap[index];

  return (
    <>
      {((accessTypeCode === "ONLINE" && access?.[0]?.loginRequired) ||
        access?.[0]?.__typename === "InfomediaService") &&
        !user.isAuthenticated && (
          <Text
            type="text3"
            className={styles.textAboveButton}
            dataCy={"text-above-order-button"}
          >
            {Translate({ ...context, label: "url_login_required" })}
          </Text>
        )}
      <Button {...buttonProps}>{buttonTxt()}</Button>
    </>
  );
}

/**
 * Seperat function for orderbutton
 * Check what kind of material (eg. online, not avialable etc)
 * and present appropriate button
 *
 * @param selectedMaterial
 *  Partial work - filtered by the materialtype selected by user (eg. bog)
 * @param onOnlineAccess
 *  onclick handler for online access
 * @param openOrderModal
 *  onclick handler for reservation
 *  @param workTypeTranslated
 *   translated worktype
 *  @param title
 *
 * @param user
 *  The user
 * @return {JSX.Element}
 * @constructor
 */
export function OrderButton_TempUsingAlfaApi({
  selectedMaterial: selectedMaterialBeforeAltering,
  onOnlineAccess,
  openOrderModal,
  user,
  workTypeTranslated,
  title,
  singleManifestion = false,
  type = "primary",
  size = "large",
}) {
  let selectedMaterial = selectedMaterialBeforeAltering;

  const modal = useModal();

  const manifestations = selectedMaterialBeforeAltering.manifestations;
  if (!singleManifestion) {
    selectedMaterial = selectMaterial_TempUsingAlfaApi(manifestations);
  }

  // QUICK DECISION: if this is single manifestation AND the manifestation can NOT be ordered
  // we show no Reservation button - @TODO should we show online accesss etc. ???
  if (singleManifestion && !checkRequestButtonIsTrue({ manifestations })) {
    return null;
  }

  let buttonSkeleton = typeof selectedMaterial?.onlineAccess === "undefined";

  /* order button acts on following scenarios:
  1. material is accessible online (no user login) -> go to online url
    a. online url
    b. webarchive
    c. infomedia access (needs login)
    d. digital copy (needs login)
  2. material can not be ordered - maybe it is too new or something else -> disable (with a reason?)
  3. material is available for logged in library -> prepare order button with parameters
  4. material is not available -> disable
   */

  // The loan button is skeleton until we know if selected
  // material is physical or online
  if (!selectedMaterialBeforeAltering) {
    return null;
  }

  // online access ? - special handling of digital copy (onlineAccess[0].issn)
  if (
    selectedMaterial?.onlineAccess?.length > 0 &&
    !selectedMaterial.onlineAccess[0].issn
  ) {
    // add url to infomedia - if any
    addToInfomedia_TempUsingAlfaApi(selectedMaterial.onlineAccess, title);
    // if this is an infomedia article it should open in same window
    const urlTarget = selectedMaterial.onlineAccess[0]?.infomediaId
      ? "_self"
      : "_blank";

    // check if we should open login modal on click
    const goToLogin =
      selectedMaterial.onlineAccess[0]?.accessType ===
        "urlInternetRestricted" &&
      (selectedMaterial.onlineAccess[0]?.url.indexOf("ebookcentral") !== -1 ||
        selectedMaterial.onlineAccess[0]?.url.indexOf("ebscohost") !== -1) &&
      !user.isAuthenticated;

    return (
      <>
        {/* Check if internet access requires a login */}
        {(selectedMaterial.onlineAccess[0]?.accessType ===
          "urlInternetRestricted" ||
          selectedMaterial.onlineAccess[0]?.infomediaId) &&
          !user.isAuthenticated && (
            <Text type="text3" className={styles.textAboveButton}>
              {Translate({ ...context, label: "url_login_required" })}
            </Text>
          )}
        <Button
          className={styles.externalLink}
          skeleton={buttonSkeleton}
          onClick={() => {
            goToLogin
              ? modal?.push("login", {
                  mode: LOGIN_MODE.DDA,
                  originUrl: selectedMaterial.onlineAccess[0]?.origin,
                })
              : onOnlineAccess(selectedMaterial.onlineAccess[0].url, urlTarget);
          }}
          type={type}
        >
          {[
            Translate({
              context: "overview",
              label: "goto",
            }),
            workTypeTranslated,
          ].join(" ")}
        </Button>
      </>
    );
  }

  /* No online access - check if work can be ordered  */
  if (
    !checkRequestButtonIsTrue({ manifestations }) &&
    !checkDigitalCopy_TempUsingAlfaApi({ manifestations })
  ) {
    // if we prefer online material button text should be different
    let onlinedisable =
      manifestations &&
      manifestations[0] &&
      preferredOnline.includes(manifestations[0].materialType);
    // order is not possible/allowed - disable
    return (
      <DisabledReservationButton
        buttonSkeleton={buttonSkeleton}
        type={type}
        onlinedisable={onlinedisable}
      />
    );
  }

  // All is well - material can be ordered - order button
  const pid = manifestations[0].pid;
  let buttonTxt;

  if (singleManifestion) {
    // request is for a specific edition
    buttonTxt = Translate({
      context: "order",
      label: "specific-edition",
    });
  } else {
    buttonTxt = Translate({ context: "general", label: "bestil" });
  }
  return (
    <Button
      skeleton={buttonSkeleton}
      onClick={() => openOrderModal(pid)}
      dataCy={`button-order-overview-enabled${singleManifestion ? pid : ""}`}
      type={type}
      size={size}
    >
      {buttonTxt}
    </Button>
  );
}

/**
 * If order is not possible - show a disabled reservation button
 * @param buttonSkeleton
 * @param type
 * @param onlinedisable
 * @return {JSX.Element}
 * @constructor
 */
function DisabledReservationButton({ buttonSkeleton, type, onlinedisable }) {
  return (
    <Button
      skeleton={buttonSkeleton}
      disabled={true}
      className={styles.disabledbutton}
      dataCy="button-order-overview"
      type={type}
    >
      {Translate({
        context: "overview",
        label: onlinedisable ? "Order-online-disabled" : "Order-disabled",
      })}
    </Button>
  );
}

function ReservationButton({
  workId,
  chosenMaterialType,
  onOnlineAccess,
  openOrderModal,
  singleManifestion = false,
  buttonType = "primary",
  size = "large",
}) {
  const user = useUser();
  const modal = useModal();

  const { data } = useData(workId && workFragments.buttonTxt({ workId }));

  return (
    <OrderButton
      user={user}
      modal={modal}
      work={data?.work}
      chosenMaterialType={chosenMaterialType}
      onOnlineAccess={onOnlineAccess}
      openOrderModal={openOrderModal}
      singleManifestion={singleManifestion}
      buttonType={buttonType}
      size={size}
    />
  );
}

export default ReservationButton;
