import Translate from "@/components/base/translate";

export const LOGIN_MODE = {
  ORDER_PHYSICAL: "orderPhysical",
  SUBSCRIPTION: "subscription",
  DIGITAL_COPY: "digitalCopy", //subcategory of subscription
  PLAIN_LOGIN: "plainLogin",
  INFOMEDIA: "infomedia",
  DDA: "demand_driven_acquisition",
};

/**
 * If we order a physical copy or a digital copy, we always show the loanerform
 * If the mode neither of the two modes above, we check if the library supports borrowerCheck
 * If not, we show the loginNotSupported modal, we can order stuff for these libraries, but we cannot login/validate via them
 * @param {string} mode
 * @returns {boolean}
 */
export const showLoanerForm = (mode) => {
  return mode === LOGIN_MODE.ORDER_PHYSICAL || mode === LOGIN_MODE.SUBSCRIPTION;
};

//TODO: do we still need this?
export const isOrderPossible = ({ mode, branch }) => {
  if (!branch) return false;
  // QUICKFIX - .. to avoid api check ..  all public libraries have access to dda - no other
  // Færøerne skal ikke tjekkes
  if (mode === LOGIN_MODE.DDA) {
    return (
      branch?.agencyId?.startsWith("7") && branch.orderPolicy?.orderPossible
    );
  }
  return branch.orderPolicy?.orderPossible;
};

/**
 * Open login modal
 * @param {obj} modal
 * @param {string} title
 * @param {string} mode
 * @param {string} originUrl
 * @param {array} pids
 * @param {array} selectedAccesses
 * @param {string} workId
 * @param {string} singleManifestation
 */
export function openLoginModal({
  modal,
  mode = LOGIN_MODE.PLAIN_LOGIN,
  title = Translate({
    context: "header",
    label: "login",
  }),
  originUrl = undefined,
  pids = undefined,
  selectedAccesses = undefined,
  workId = undefined,
  singleManifestation = undefined,
  callbackUID = undefined,
}) {
  modal.push("login", {
    title: title,
    mode: mode,
    originUrl,
    pids: pids,
    selectedAccesses: selectedAccesses,
    workId: workId,
    singleManifestation: singleManifestation,
    callbackUID: callbackUID,
  });
}

/**
 *
 * @param {string} string
 * @returns {string}
 */
function getOperator(string) {
  return string.includes("?") ? "&" : "?";
}

/**
 * Get a callback url to return to after sign in.
 *
 * OBS: this code is also responsible for setting **pickup branch** after login.
 *
 * Remove modals except for the third one.
 *     scenarios:
 *     a. user logins from a page eg. infomedia
 *     b. user logins from a modal eg. pickup
 *       remove modal from callbackurl - if any
 *       if user is coming from order button, we have callbackUID from oder modal in store and attach it to url to open order modal after login
 *
 * @param modal
 * @param pickupBranch
 * @returns {string}
 */
export function getCallbackUrl(pickupBranch, callbackUID) {
  let callback = window.location.href;
  // remove modal from callback - if any
  const regex = /[&|?]modal=[0-9]*/;
  callback = callback.replace(regex, "");

  // append modal if any callbackUID is given
  // In case we want to open a specific modal after login, we append the modal UID to the url
  if (callbackUID) {
    const operator = getOperator(callback);
    callback += operator + `modal=${callbackUID}`;
  }

  // append pickupAgency if any given
  if (pickupBranch) {
    const operator = getOperator(callback);
    callback += operator + `setPickupAgency=${pickupBranch}`;
  }

  return callback;
}
