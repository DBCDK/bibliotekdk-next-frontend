import { LOGIN_MODE } from "@/components/_modal/pages/loanerform/LoanerForm";
import Translate from "@/components/base/translate";

/**
 * If we order a physical copy or a digital copy, we always show the loanerform
 * If the mode neither of the two modes above, we check if the library supports borrowerCheck
 * If not, we show the loginNotSupported modal, we can order stuff for these libraries, but we cannot login/validate via them
 * @param {string} mode
 * @returns {boolean}
 */
export const showLogin = (mode) => {
  return mode === LOGIN_MODE.ORDER_PHYSICAL && mode === LOGIN_MODE.SUBSCRIPTION;
};

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
  title = Translate({
    context: "header",
    label: "login",
  }),
  mode = LOGIN_MODE.PLAIN_LOGIN,
}) {
  console.log("utils", mode);
  modal.push("login", {
    title: title,
    mode: mode,
  });
}
