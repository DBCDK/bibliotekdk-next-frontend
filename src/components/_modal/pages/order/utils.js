import styles from "@/components/_modal/pages/order/Order.module.css";

/**
 *
 * @param {*} value
 * @param {*} valid
 * @param updateLoanerInfo
 * @param setMail
 */
export function onMailChange(value, valid, updateLoanerInfo, setMail) {
  valid.status &&
    updateLoanerInfo &&
    updateLoanerInfo({ userParameters: { userMail: value } });
  // update mail in state
  setMail({ value, valid });
}

/**
 *
 * @param pid
 * @param work
 * @param singleManifestation
 * @returns {*[]}
 */
export function getOrderPids(pid, work, singleManifestation) {
  // Work props
  const manifestations = work?.manifestations?.all;

  // Material by pid
  const material = manifestations?.filter(
    (manifestation) => manifestation.pid === pid
  );

  const materialsSameType = manifestations?.filter((manifestation) => {
    return (
      manifestation?.materialType === material?.materialType &&
      (!material?.accessTypes?.find(
        (accessType) => accessType?.display !== "fysisk"
      ) ||
        material?.access?.find((singleAccess) => singleAccess.loanIsPossible))
    );
  });

  let orderPids;
  if (singleManifestation) {
    orderPids = [pid];
  } else {
    orderPids = materialsSameType?.map((m) => m.pid);
  }
  return orderPids;
}

export function extractClassNameAndMessage(validated, failedSubmission) {
  // Get email messages (from validate object)
  const emailStatus = validated?.details?.hasMail?.status;
  const errorMessage = validated?.details?.hasMail?.message;

  // Check for email validation and email error messages
  const hasEmail = !!validated?.details?.hasMail?.status;

  // Email validation class
  const validClass =
    failedSubmission && !emailStatus ? styles.invalid : styles.valid;
  const customInvalidClass =
    failedSubmission && !emailStatus ? styles.invalidInput : "";

  // Set email input message if any
  const message = failedSubmission && errorMessage;

  const actionMessage =
    failedSubmission &&
    (validated?.details?.requireYear?.message ||
      (!hasEmail && validated?.details?.hasMail?.message));

  const invalidClass = actionMessage ? styles.invalid : "";

  return {
    emailStatus,
    errorMessage,
    hasEmail,
    validClass,
    customInvalidClass,
    message,
    actionMessage,
    invalidClass,
  };
}
