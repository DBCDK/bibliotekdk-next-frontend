import * as loanMutations from "@/lib/api/loans.mutations";
import isEmpty from "lodash/isEmpty";
import isString from "lodash/isString";
import { getCanonicalWorkUrl } from "@/lib/utils";

export async function handleRenewLoan({ loanId, agencyId, loanMutation }) {
  await loanMutation.post(
    loanMutations.renewLoan({
      loanId,
      agencyId,
    })
  );
}

/**
 * handles updates in mutation object on loans and reservations page
 * Its called in two places, depending on if on desktop or mobile
 * @param {Object} loanMutation
 * @param {function} setHasRenewError
 * @param {function} setRenewed
 * @param {function} setRenewedDueDateString
 */
export async function handleLoanMutationUpdates(
  loanMutation,
  setHasRenewError,
  setRenewed,
  setRenewedDueDateString
) {
  const { error, data, isLoading } = loanMutation;

  //error not handled inside fbi-api or error while mutating
  if (error) {
    setHasRenewError(true);
    return;
  }
  if (isLoading || !data) return;

  if (data.renewLoan?.renewed && data?.renewLoan?.dueDate) {
    setRenewed(true);
    setRenewedDueDateString(data.renewLoan.dueDate);
  }
  if (data.renewLoan?.renewed === false) {
    //error handled inside fbi-api
    setHasRenewError(true);
  }
}

/**
 * Get an url for materials in profile pages - loans, reservation, orderhistory, cart
 * @param workId
 * @param pid
 * @param materialTypeAsUrl
 * @param titles
 * @param creators
 * @param scrollToEdition
 * @returns {{query: {workId}, pathname: string}|string}
 */
export function getWorkUrlForProfile({
  workId,
  pid = null,
  materialTypeAsUrl = "",
  titles,
  creators,
  scrollToEdition = false,
}) {
  if (!workId) {
    if (pid && !isEmpty(pid) && isPid(pid)) {
      return `/work/${pid}`;
    }
    return "";
  }

  if (!titles || isEmpty(titles) || !creators || isEmpty(creators)) {
    return `/work/${workId}`;
  }

  // Pathname
  const pathname = getCanonicalWorkUrl({
    title: titles?.main?.[0],
    creators: creators,
    id: workId,
  });

  // MaterialTypes
  const chosenMaterialType =
    materialTypeAsUrl && !isEmpty(materialTypeAsUrl) && materialTypeAsUrl;

  const query = {
    workId: workId,
    ...(chosenMaterialType && { type: chosenMaterialType }),
  };

  return {
    pathname: pathname,
    query: query,
    ...(scrollToEdition && pid && isPid(pid) && { hash: pid }),
  };
}

/**
 * check if given pid actually is a pid (eg 870970-basis:123456)
 * @param {string} pid
 */
export function isPid(pid) {
  if (!isString(pid)) {
    return false;
  }
  // a pid consists of a localization (eg. 870970, a base (eg. basis) and a localid(eg. 123456)
  // We also have to accommodate eg. 800010-katalog:99121952643105763

  // Explanation:
  // * ^ : start of string
  // * ([0-9]{6,}) : At least 6 DIGITS for a agency or branch or whatever, denoted by {6,}
  // * (-) : Agency/Branch id and rest must be separated by a "-"
  // * ([0-9A-Za-z]+) : A base (basis, katalog, etc.) must have at least 1 character
  // * (:) : Agency/Branch id + base must be followed with ":" before faust/isbn/localId
  // * ([0-9A-Za-z]+) : Faust, ISBN, localId, whatever must have at least 1 character denoted by +
  // * $ : end of string
  const regex = /^([0-9]{6,})(-)([0-9A-Za-z]+)(:)([0-9A-Za-z]+)$/g;

  // We should cover all pids
  return !!pid.trim().match(regex);
}

/**
 * handles updates in mutation object on loans and reservations page
 * Its called in two places, depending on if on desktop or mobile
 * @param {Object} orderMutation
 * @param {function} setHasDeleteError
 * @param {function} setRemovedOrderId
 * @param {function} updateUserStatusInfo
 */
export async function handleOrderMutationUpdates(
  orderMutation,
  setHasDeleteError,
  setRemovedOrderId,
  updateUserStatusInfo
) {
  const { error, data, isLoading } = orderMutation;

  //error not handled inside fbi-api or error while mutating
  if (error) {
    setHasDeleteError(true);
    return;
  }

  if (isLoading || !data) return;

  //order was successfully deleted
  if (data.deleteOrder?.deleted) {
    setRemovedOrderId();
    await updateUserStatusInfo("ORDER");
    return;
  }
  //error deleting order inside fbi-api
  if (data.deleteOrder?.deleted === false) {
    setHasDeleteError(true);
  }
}
