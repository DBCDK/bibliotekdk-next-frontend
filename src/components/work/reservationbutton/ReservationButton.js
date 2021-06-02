import Button from "@/components/base/button/Button";
import styles from "@/components/work/overview/Overview.module.css";
import Icon from "@/components/base/icon/Icon";
import Translate from "@/components/base/translate";
import { useData } from "@/lib/api/api";
import * as manifestationFragments from "@/lib/api/manifestation.fragments";
import includes from "lodash/includes";

// Translate Context
const context = { context: "overview" };
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
 * @param onlineAccess
 *  onclick handler for online access
 * @param openOrderModal
 *  onclick handler for reservation
 * @param user
 *  The user
 * @param available
 *  Is the material available or not (bool)
 * @param availabilityLoading
 *  Is availability loading (bool)
 * @return {JSX.Element}
 * @constructor
 */
export function OrderButton({
  selectedMaterial,
  onlineAccess,
  login,
  openOrderModal,
  user,
  availability = {},
}) {
  // The loan button is skeleton until we know if selected
  // material is physical or online
  if (!selectedMaterial) {
    return null;
  }

  const materialType = selectedMaterial.materialType;
  const manifestations = selectedMaterial.manifestations;

  selectedMaterial = selectedMaterial.manifestations?.[0];
  let buttonSkeleton = typeof selectedMaterial?.onlineAccess === "undefined";

  /* order button acts on following scenarios:
  1. material is accessible online (no user login) -> go to online url
  2. material can not be ordered - maybe it is too new or something else -> disable (with a reason?)
  3. user is not logged in -> go to login
  4. material is available for logged in library -> prepare order button with parameters
  5. material is not available -> disable
   */

  // online access ?
  if (selectedMaterial?.onlineAccess) {
    return (
      <Button
        className={styles.externalLink}
        skeleton={buttonSkeleton}
        onClick={() => onlineAccess(selectedMaterial?.onlineAccess[0]?.url)}
      >
        <Icon src={"external.svg"} skeleton={buttonSkeleton} />
        {Translate({
          ...context,
          label:
            materialType === "Ebog"
              ? "onlineAccessEbook"
              : materialType?.includes("Lydbog")
              ? "onlineAccessAudiobook"
              : "onlineAccessUnknown",
        })}
      </Button>
    );
  }

  // can material be ordered ?
  if (!checkRequestButtonIsTrue({ manifestations })) {
    // disabled button
    return <DisabledReservationButton buttonSkeleton={buttonSkeleton} />;
  }
  // is user logged in
  if (!user.isAuthenticated) {
    // login button
    return (
      <Button
        skeleton={buttonSkeleton}
        onClick={() => login()}
        data_cy="button-order-overview"
      >
        {Translate({ ...context, label: "Order (not logged in)" })}
      </Button>
    );
  }
  // user is logged in - check availability
  // @see wrap function - if user is logged in the availability object
  // finished loading - material can not be ordered - disable buttons
  let available = false;
  if (!availability.isLoading) {
    console.log(availability, "AVAILAIBIBLI");

    available = checkAvailability({
      error: availability.error,
      data: availability.data,
      materialType: materialType,
    });
  }
  if (availability.isLoading || !available) {
    // disabled button
    return (
      <DisabledReservationButton buttonSkeleton={availability.isLoading} />
    );
  }
  const pid = manifestations[0].pid;
  // all is well - material can be ordered - order button

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

function checkRequestButtonIsTrue({ manifestations }) {
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

function checkAvailability({ error, data, materialType }) {
  if (error && !process.env.STORYBOOK_ACTIVE) {
    console.log(error, "ERROR");
    console.log(`availability check failed with error: ${error}`, "ERROR");
    return false;
  }

  // for now we only support ordering books
  const supportedMaterialTypes = ["Bog"];
  if (!includes(supportedMaterialTypes, materialType)) {
    return false;
  }

  // check availability response
  // @TODO check with nanna or rikke to verify
  return (
    data &&
    data.manifestation &&
    data.manifestation.availability &&
    data.manifestation.availability.orderPossible
  );
}

export default function wrap(props) {
  console.log({ ...props }, "PRPS");

  const { selectedMaterial, onlineAccess, login, openOrderModal, user } = props;
  let availability = { error: null, data: null, isLoading: false };
  if (user.isAuthenticated) {
    // user is logged in - check && set availability
    const pid = selectedMaterial.manifestations[0].pid;
    const { data, error, isLoacing, isSlow } = (availability = useData(
      manifestationFragments.availability({ pid })
    ));
  }

  return (
    <OrderButton
      selectedMaterial={selectedMaterial}
      onlineAccess={onlineAccess}
      login={login}
      openOrderModal={openOrderModal}
      user={user}
      availability={availability}
    />
  );
}
