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
export const showLogin = (mode) => {
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
 */
export function openLoginModal({
  modal,
  mode = LOGIN_MODE.PLAIN_LOGIN,
  title = Translate({
    context: "header",
    label: "login",
  }),
}) {
  modal.push("login", {
    title: title,
    mode: mode,
  });
}
