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
  checkRequestButtonIsTrue,
  context,
  selectMaterial_TempUsingAlfaApi,
} from "@/components/work/reservationbutton/utils";
import { encodeTitleCreator, infomediaUrl } from "@/lib/utils";

function workTypeTranslator(workTypes) {
  const workType = workTypes?.[0] || "fallback";
  return hasTranslation({
    context: "workTypeDistinctForm",
    label: workType,
  })
    ? Translate({
        context: "workTypeDistinctForm",
        label: workType,
      })
    : Translate({
        context: "workTypeDistinctForm",
        label: "fallback",
      });
}

function selectMaterialBasedOnType(materialTypes, type) {
  // Creates MaterialTypes as an index
  const materialTypesMap = {};
  materialTypes?.forEach((m) => {
    materialTypesMap[m.materialType] = m;
  });

  return materialTypesMap[type] || materialTypes?.[0] || false;
}

function handleGoToLogin(access, user, modal, onOnlineAccess, title) {
  function addToInfomedia(onlineAccess, title) {
    onlineAccess?.map((access) => {
      if (access?.infomediaId) {
        access.url = infomediaUrl(
          encodeTitleCreator(title),
          `work-of:${access.pid}`,
          access.infomediaId
        );
        access.accessType = "infomedia";
      }
      return access;
    });
  }
  // add url to infomedia - if any
  addToInfomedia(access, title);

  // if this is an infomedia article it should open in same window
  const urlTarget = access[0]?.infomediaId ? "_self" : "_blank";

  // check if we should open login modal on click
  const goToLogin =
    access[0]?.accessType === "urlInternetRestricted" &&
    (access[0]?.url.indexOf("ebookcentral") !== -1 ||
      access[0]?.url.indexOf("ebscohost") !== -1) &&
    !user.isAuthenticated;

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
 * @param {string} type current type looked at
 * @param {function} onOnlineAccess
 *  callback onclick handler for online access
 * @param {function} openOrderModal
 *  onclick handler for reservation
 * @param {boolean} singleManifestion
 * @param {string} type of button for base button component
 * @param {string} size of button for base button component
 *
 * @return {JSX.Element}
 * @constructor
 */
export function OrderButton({
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

  const { data } = useData(workId && workFragments.buttonTxt2({ workId }));

  const selectedMaterials = selectMaterialBasedOnType(
    data?.work?.materialTypes,
    chosenMaterialType
  );

  const workTypeTranslated = workTypeTranslator(data?.work?.workTypes);
  const title = data?.work?.title;

  let selectedManifestations = selectedMaterials;

  const manifestations = selectedMaterials.manifestations;
  if (!singleManifestion) {
    selectedManifestations = selectMaterial_TempUsingAlfaApi(manifestations);
  }

  const buttonSkeleton =
    typeof selectedManifestations?.onlineAccess === "undefined";

  const access = selectedManifestations?.onlineAccess;

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

  // QUICK DECISION: if this is single manifestation AND the manifestation can NOT be ordered
  // we show no Reservation button - @TODO should we show online accesss etc. ???
  if (singleManifestion && !checkRequestButtonIsTrue({ manifestations })) {
    return <></>;
  }

  // The loan button is skeleton until we know if selected
  // material is physical or online
  if (!selectedMaterials) {
    return <></>;
  }

  // if we prefer online material button text should be different
  let onlinedisable = preferredOnline.includes(
    manifestations?.[0]?.materialType
  );

  // All is well - material can be ordered - order button
  const pid = manifestations?.[0]?.pid;

  const translationMap = [
    Boolean(access?.length > 0 && !access?.[0]?.issn),
    Boolean(
      !checkRequestButtonIsTrue({ manifestations }) &&
        !checkDigitalCopy({ manifestations })
    ),
    Boolean(singleManifestion),
    true,
  ];

  const buttonPropsMap = [
    {
      onClick: () =>
        handleGoToLogin(access, user, modal, onOnlineAccess, title),
    },
    {
      dataCy: "button-order-overview",
      disabled: true,
    },
    {
      onClick: () => pid && openOrderModal(pid),
      dataCy: `button-order-overview-enabled${pid}`,
    },
    {
      onClick: () => pid && openOrderModal(pid),
      dataCy: `button-order-overview-enabled`,
    },
  ];

  const buttonTxtMap = [
    () =>
      [
        Translate({
          context: "overview",
          label: "goto",
        }),
        workTypeTranslated,
      ].join(" "),
    () =>
      Translate({
        context: "overview",
        label: onlinedisable ? "Order-online-disabled" : "Order-disabled",
      }),
    () =>
      Translate({
        context: "order",
        label: "specific-edition",
      }),
    () => Translate({ context: "general", label: "bestil" }),
  ];

  // Set the index, buttonProps, and buttonTxt
  const index = translationMap.findIndex((caseCheck) => caseCheck);

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
      {(access[0]?.accessType === "urlInternetRestricted" ||
        access[0]?.infomediaId) &&
        !user.isAuthenticated && (
          <Text type="text3" className={styles.textAboveButton}>
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
    !checkDigitalCopy({ manifestations })
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

export default OrderButton;
