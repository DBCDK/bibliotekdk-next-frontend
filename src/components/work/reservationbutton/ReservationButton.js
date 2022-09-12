import Button from "@/components/base/button/Button";
import Translate from "@/components/base/translate";
import Text from "@/components/base/text/Text";
import styles from "./ReservationButton.module.css";
import Col from "react-bootstrap/Col";
import { getIsPeriodicaLike } from "@/lib/utils";
import { preferredOnline } from "@/lib/Navigation";
import { useModal } from "@/components/_modal";

// Translate Context
const context = { context: "overview" };

/**
 * infomedia url is specific for this gui - set an url on the online access object
 * @param onlineAccess
 * @return {*}
 */
function addToInfomedia(onlineAccess, title) {
  const addi = onlineAccess?.map((access) => {
    if (access.infomediaId) {
      access.url = `/infomedia/${title}/work-of:${access.pid}`;
      access.accessType = "infomedia";
    }
    return access;
  });

  return addi;
}

/**
 * Find and return the manifestation we want on the reservation button.
 * If manifestation has an online url it is the preferred - for easy access
 * @param manifestations
 * @return {*}
 */
function selectMaterial(manifestations) {
  // check if onlineacces. if so get the first manifestation with an online url - if any
  let selectedmanifestation;
  let url;
  manifestations?.every((manifest) => {
    // outer loop -> manifestations
    if (manifest.onlineAccess?.length > 0) {
      // inner loop -> onlineaccess
      manifest.onlineAccess.every((access) => {
        // special case: "dfi.dk" is not a 'real' onlineaccess
        if (access.url && access.url.indexOf("dfi.dk") === -1) {
          url = access.url;
          // we found an online access -> break inner loop
          return false;
        }
        // continue inner loop
        return true;
      });
      if (url) {
        // outer loop -> check if url has been set - if so
        // this is the manifestation we are looking for
        selectedmanifestation = manifest;
        // break outer loop
        return false;
      }
    }
    // continue outer loop
    return true;
  });
  // if a manifestion with an url has been found it will be returned - if not
  // return the first manifestation in array
  return selectedmanifestation || manifestations?.[0];
}

/**
 * Set texts BELOW reservation button - also sets the text IN the button
 * For infomedia text is set ABOVE the button ( @see ReservationButton )
 * @param selectedMaterial
 * @param skeleton
 * @return {JSX.Element|null}
 * @constructor
 */
export function ButtonTxt({ selectedMaterial, skeleton, work }) {
  if (!selectedMaterial?.manifestations) {
    return null;
  }
  const manifestations = selectedMaterial?.manifestations;
  selectedMaterial = selectMaterial(manifestations);

  let onlineAccess = selectedMaterial?.onlineAccess;

  const online = onlineAccess?.length > 0;
  const isPeriodicaLike = getIsPeriodicaLike(work);

  if (online && onlineAccess[0].infomediaId) {
    return null;
  } else if (online && onlineAccess[0].url) {
    return (
      <Col xs={12} className={styles.info}>
        <Text type="text3" skeleton={skeleton} lines={2}>
          {[
            Translate({ ...context, label: "onlineAccessAt" }),
            onlineAccess[0].origin || getBaseUrl(onlineAccess[0].url),
          ].join(" ")}
        </Text>
      </Col>
    );
  } else if (isPeriodicaLike) {
    return (
      <Col xs={12} className={styles.info}>
        <Text type="text3" skeleton={skeleton} lines={2}>
          {Translate({
            context: "options",
            label: "periodica-link-description",
          })}
        </Text>
      </Col>
    );
  } else if (checkRequestButtonIsTrue({ manifestations })) {
    return (
      <>
        <Col xs={12} className={styles.info}>
          <Text type="text3" skeleton={skeleton} lines={2}>
            {Translate({ ...context, label: "addToCart-line1" })}
          </Text>
        </Col>
      </>
    );
  } else {
    return null;
  }
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
 * @param singlemanifestion
 * @return {JSX.Element}
 * @constructor
 */
export function OrderButton({
  selectedMaterial,
  onOnlineAccess,
  openOrderModal,
  user,
  workTypeTranslated,
  title,
  singleManifestion = false,
  type = "primary",
  size = "large",
}) {
  // The loan button is skeleton until we know if selected
  // material is physical or online
  if (!selectedMaterial) {
    return null;
  }

  const modal = useModal();

  const manifestations = selectedMaterial.manifestations;
  if (!singleManifestion) {
    selectedMaterial = selectMaterial(manifestations);
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

  // online access ? - special handling of digital copy (onlineAccess[0].issn)
  if (
    selectedMaterial?.onlineAccess?.length > 0 &&
    !selectedMaterial.onlineAccess[0].issn
  ) {
    // add url to infomedia - if any
    addToInfomedia(selectedMaterial.onlineAccess, title);
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
        {selectedMaterial.onlineAccess[0]?.accessType ===
          "urlInternetRestricted" && (
          <Text type="text3" className={styles.textAboveButton}>
            {Translate({ ...context, label: "url_login_required" })}
          </Text>
        )}
        {/* Check if user is authenticated to view infomedia article */}
        {selectedMaterial.onlineAccess[0].infomediaId && !user.isAuthenticated && (
          <Text type="text3" className={styles.textAboveButton}>
            {Translate({ ...context, label: "label_infomediaAccess" })}
          </Text>
        )}
        <Button
          className={styles.externalLink}
          skeleton={buttonSkeleton}
          onClick={() => {
            goToLogin
              ? modal?.push("login")
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
 * Example:
 *
 * getBaseUrl("https://fjernleje.filmstriben.dk/some-movie");
 * yields: "fjernleje.filmstriben.dk"
 *
 * @param {string} url
 * @returns {string}
 */
function getBaseUrl(url) {
  if (!url) {
    return "";
  }
  const match = url.match(/(http|https):\/\/(www\.)?(.*?\..*?)(\/|\?|$)/i);
  if (match) {
    return match[3];
  }
  return url;
}

/**
 * Check if work can be ordered - run through given manifestations - if one
 * is reservable -> return true, if not return false
 *
 * @param manifestations
 * @return {boolean}
 */
export function checkRequestButtonIsTrue({ manifestations }) {
  // pjo 14/6 - bug 1020 - sort out some materialtypes - would be better to do
  // somewhere else
  const notReservable = ["Biograffilm", "Udstilling", "Teateropførelse"];
  return !!manifestations?.find(
    (manifestation) =>
      manifestation?.admin?.requestButton &&
      !notReservable.includes(manifestation?.materialType)
  );
}

/**
 * Check if order of digital copy is an option - if one af the manifestions in work
 * has an issn (International Standard Serial Number) return true, if not return false
 * @param manifestations
 * @return {boolean}
 */
function checkDigitalCopy({ manifestations }) {
  return !!manifestations?.find((manifestation) =>
    manifestation?.onlineAccess?.find((access) => access?.issn)
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
  const text = onlinedisable
    ? Translate({ context: "overview", label: "Order-online-disabled" })
    : Translate({ context: "overview", label: "Order-disabled" });
  return (
    <Button
      skeleton={buttonSkeleton}
      disabled={true}
      className={styles.disabledbutton}
      dataCy="button-order-overview"
      type={type}
    >
      {text}
    </Button>
  );
}

export default OrderButton;
