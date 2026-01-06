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
 * @param {Object} modal
 * @param {string} title
 * @param {string} mode
 * @param {string} originUrl
 * @param {Array} pids
 * @param {Array} selectedAccesses
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
  redirectPath = null,
  originUrl = undefined,
  pids = undefined,
  selectedAccesses = undefined,
  workId = undefined,
  singleManifestation = undefined,
  callbackUID = undefined,
}) {
  modal.push("login", {
    title,
    mode,
    originUrl,
    pids,
    selectedAccesses,
    workId,
    redirectPath,
    singleManifestation,
    callbackUID,
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

// Whitelist of allowed internal redirect endpoints
const REDIRECT_PATH_WHITELIST = new Set(["/api/redirect"]);

const getWhitelistedRedirectPath = (path) => {
  return REDIRECT_PATH_WHITELIST.has(path) ? path : "/api/redirect";
};

function getAbsoluteInternalUrl(path) {
  const safePath = getWhitelistedRedirectPath(path);
  return `${window.location.origin}${safePath}`;
}

/**
 * Get a callback url to return to after sign in.
 *
 * Modes:
 *  1) Default: return to current page (window.location.href) [minus modal param]
 *  2) Redirect handler: return to an internal redirect endpoint (whitelisted) as ABSOLUTE url
 *
 * @param {string|null} pickupBranch
 * @param {string|null} callbackUID
 * @param {Object} opts
 * @param {string|null} opts.redirectPath - if set, callback becomes absolute redirect handler URL
 * @returns {string}
 */
export function getCallbackUrl(pickupBranch, callbackUID, opts = {}) {
  const { redirectPath = null } = opts;

  let callback;
  if (redirectPath) {
    // absolute callback url
    callback = getAbsoluteInternalUrl(redirectPath);
  } else {
    // Default: current page, but remove modal param if any
    callback = window.location.href;
    const regex = /[&|?]modal=[0-9]*/;
    callback = callback.replace(regex, "");
  }

  // append modal if any callbackUID is given
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
