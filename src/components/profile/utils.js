import * as loanMutations from "@/lib/api/loans.mutations";
import isEmpty from "lodash/isEmpty";
import isString from "lodash/isString";

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
 * @param materialId
 * @param materialType
 * @returns {"/work/?type="|string}
 */
export function getWorkUrlForProfile({
  workId = "",
  pid = "",
  materialId = "",
  materialType = "",
  scrollToEdition = false,
}) {
  // pid is given
  if (!isEmpty(pid) && isPid(pid)) {
    return `/linkme.php?rec.id=${pid}&scrollToEdition=${scrollToEdition}`;
  }
  // @TODO - materialId may be a localid - that is NOT a faust number
  // we check if given id is 8 digits - as a faust always is .. but .. is that good enough ..
  // a localid might also be 8 digits - and not be a faust
  // this might be a faust
  if (materialId.length === 8) {
    // we assume that this is a faust
    return `/linkme.php?faust=${materialId}`;
  }
  // workid is given
  if (!isEmpty(workId)) {
    return `/work/${workId}${
      materialType ? "?type=" + materialType.toLowerCase() : ""
    }`;
  }

  // we give up -
  // @TODO sometime soon localid's may be handled in complex search so we can look up some good ids :)
  return null;
}

/**
 * check if given pid actually is a pid (eg 870970-basis:123456)
 * @param String pid
 */
export function isPid(pid) {
  if (!isString(pid)) {
    return false;
  }
  // a pid consists of a localization (eg. 870970, a base (eg. basis) and a localid(eg. 123456)
  const parts = pid?.split(":");

  // there should be 2 parts
  if (!(parts?.length === 2)) {
    return false;
  }
  // first part should be a localization (6 digits)
  const regex = /^[0-9]{8}$/g;
  // success or give up
  return !!parts[1].trim().match(regex);
}

/**
 * handles updates in mutation object on loans and reservations page
 * Its called in two places, depending on if on desktop or mobile
 * @param {Object} loanMutation
 * @param {function} setHasError
 * @param {function} setRemovedOrderId
 * @param {function} updateUserStatusInfo
 */
export async function handleOrderMutationUpdates(
  orderMutation,
  setHasError,
  setRemovedOrderId,
  updateUserStatusInfo
) {
  const { error, data, isLoading } = orderMutation;

  //error not handled inside fbi-api or error while mutating
  if (error) {
    setHasError(true);
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
    setHasError(true);
  }
}
