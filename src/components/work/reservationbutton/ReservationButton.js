import Button from "@/components/base/button/Button";
import Translate from "@/components/base/translate";
import Text from "@/components/base/text/Text";
import styles from "./ReservationButton.module.css";
import Col from "react-bootstrap/Col";

// Translate Context
const context = { context: "overview" };
// the text on the button
let buttonText = "";

/**
 * infomedia url is specific for this gui - set an url on the online access object
 * @param onlineAccess
 * @return {*}
 */
function addToInfomedia(onlineAccess, title) {
  const addi = onlineAccess?.map((access) => {
    if (access.infomediaId) {
      access.url = `/infomedia/${title}/work-of:${access.pid}`;
    }
    return access;
  });

  return addi;
}

/**
 * Set texts BELOW reservation button - also sets the text IN the button
 * For infomedia text is set ABOVE the button ( @see ReservationButton )
 * @param selectedMaterial
 * @param skeleton
 * @return {JSX.Element|null}
 * @constructor
 */
export function ButtonTxt({ selectedMaterial, skeleton }) {
  const onlineAccess = selectedMaterial?.manifestations?.[0]?.onlineAccess;
  const online = onlineAccess?.length > 0;
  if (online && onlineAccess[0].infomediaId) {
    return null;
  } else if (online && onlineAccess[0].url) {
    return (
      <Col xs={12} className={styles.info}>
        <Text type="text3" skeleton={skeleton} lines={2}>
          {[
            Translate({ ...context, label: "onlineAccessAt" }),
            getBaseUrl(onlineAccess[0].url),
          ].join(" ")}
        </Text>
      </Col>
    );
  } else if (online && onlineAccess[0].issn) {
    return (
      <Col xs={12} className={styles.info}>
        <Text type="text3" skeleton={skeleton} lines={2}>
          {Translate({
            context: "options",
            label: "digital-copy-link-description",
          })}
        </Text>
      </Col>
    );
  } else {
    return (
      <>
        <Col xs={12} className={styles.info}>
          <Text type="text3" skeleton={skeleton} lines={2}>
            {Translate({ ...context, label: "addToCart-line1" })}
          </Text>
          <Text type="text3" skeleton={skeleton} lines={0}>
            {Translate({ ...context, label: "addToCart-line2" })}
          </Text>
        </Col>
      </>
    );
  }
}

/**
 * Seperat function for orderbutton
 * Check what kind of material (eg. online, not avialable etc)
 * and present appropiate button
 *
 * @param selectedMaterial
 *  Partial work - filtered by the materialtype selected by user (eg. bog)
 * @param skeleton
 *  show skeleton or not (bool)
 * @param login
 *  onclick handler if user is not logged in
 * @param onOnlineAccess
 *  onclick handler for online access
 * @param openOrderModal
 *  onclick handler for reservation
 * @param user
 *  The user
 * @return {JSX.Element}
 * @constructor
 */
export function OrderButton({
  selectedMaterial,
  onOnlineAccess,
  login,
  openOrderModal,
  user,
  workTypeTranslated,
  title,
}) {
  // The loan button is skeleton until we know if selected
  // material is physical or online
  if (!selectedMaterial) {
    return null;
  }
  const manifestations = selectedMaterial.manifestations;
  selectedMaterial = selectedMaterial.manifestations?.[0];
  let buttonSkeleton = typeof selectedMaterial?.onlineAccess === "undefined";

  /* order button acts on following scenarios:
  1. material is accessible online (no user login) -> go to online url
    a. online url
    b. webarchive
    c. infomedia access (needs login)
    d. digital copy (needs login)
  2. material can not be ordered - maybe it is too new or something else -> disable (with a reason?)
  3. user is not logged in -> go to login
  4. material is available for logged in library -> prepare order button with parameters
  5. material is not available -> disable
   */

  // online access ? - special handling of digital copy (onlineAccess[0].issn)
  if (
    selectedMaterial?.onlineAccess?.length > 0 &&
    !selectedMaterial.onlineAccess[0].issn
  ) {
    const enrichedOnlineAccess = addToInfomedia(
      selectedMaterial.onlineAccess,
      title
    );
    return (
      <>
        {selectedMaterial.onlineAccess[0].infomediaId && !user.isAuthenticated && (
          <Text type="text3" className={styles.textAboveButton}>
            {Translate({ ...context, label: "label_infomediaAccess" })}
          </Text>
        )}
        <Button
          className={styles.externalLink}
          skeleton={buttonSkeleton}
          onClick={() => onOnlineAccess(selectedMaterial.onlineAccess[0].url)}
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

  if (!checkRequestButtonIsTrue({ manifestations })) {
    // disabled button
    return <DisabledReservationButton buttonSkeleton={buttonSkeleton} />;
  }

  const pid = manifestations[0].pid;
  // all is well - material can be ordered - order button
  // special case - digital copy
  if (
    selectedMaterial?.onlineAccess?.length > 0 &&
    selectedMaterial.onlineAccess[0].issn
  ) {
    return (
      <Button
        skeleton={buttonSkeleton}
        onClick={() => alert("not implemented")}
        data_cy="button-order-overview-enabled"
      >
        {Translate({ context: "options", label: "digital-copy-link-title" })}
      </Button>
    );
  }

  return (
    <Button
      skeleton={buttonSkeleton}
      onClick={() => openOrderModal(pid)}
      data_cy="button-order-overview-enabled"
    >
      {Translate({ context: "general", label: "bestil" })}
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

export function checkRequestButtonIsTrue({ manifestations }) {
  if (!manifestations) {
    return false;
  }
  // is order possible ?
  let orderpossible = false;
  manifestations.every((manifest) => {
    if (manifest.admin?.requestButton) {
      orderpossible = true;
      // break every loop - only ONE manifestion needs to be orderable
      return false;
    }
    // continue every loop
    return true;
  });
  return orderpossible;
}

function DisabledReservationButton({ buttonSkeleton }) {
  return (
    <Button
      skeleton={buttonSkeleton}
      disabled={true}
      className={styles.disabledbutton}
      data_cy="button-order-overview"
    >
      {Translate({ context: "overview", label: "Order-disabled" })}
    </Button>
  );
}

export default OrderButton;
