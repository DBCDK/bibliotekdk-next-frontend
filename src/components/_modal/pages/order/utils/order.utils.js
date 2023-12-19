// eslint-disable-next-line no-restricted-imports
import styles from "@/components/_modal/pages/order/Order.module.css";
import { getSessionStorageItem, removeSessionStorageItem, setSessionStorageItem } from "@/lib/utils";

/**
 *
 * @param {string} value
 * @param {boolean} valid
 * @param {function} updateLoanerInfo
 * @param {function} setMail
 */
export function onMailChange(value, valid, updateLoanerInfo, setMail) {
  valid?.status &&
    updateLoanerInfo &&
    updateLoanerInfo({ userParameters: { userMail: value } });
  // update mail in state
  const isValid = {
    status: valid?.status,
    message: valid ? null : "wrong-email-field",
  };
  setMail({ value, valid: isValid });
}

/**
 * Retrieves styling and messages for form errors based on
 * mail validation
 * year validation (article)
 * duplicate order validation
 * @param {Object} validated
 * @param {Boolean} hasValidationErrors
 * @returns
 */
export function getStylingAndErrorMessage(validated, hasValidationErrors) {
  // Get email messages
  const emailStatus = validated?.details?.hasMail?.status;
  const errorMessage = validated?.details?.hasMail?.message;

  // Check for email validation and email error messages
  const hasEmail = !!emailStatus;

  // Email validation class
  const validClass =
    // eslint-disable-next-line css-modules/no-undef-class
    hasValidationErrors && !emailStatus ? styles.invalid : styles.valid;

  // Set email input message if any
  const message = hasValidationErrors && errorMessage;

  const actionMessage =
    hasValidationErrors &&
    (validated?.details?.requireYear?.message ||
      (!hasEmail && errorMessage) ||
      validated?.details?.firstOrder?.message);

  // eslint-disable-next-line css-modules/no-undef-class
  const invalidClass = actionMessage ? styles.invalid : "";

  return {
    validClass,
    message,
    actionMessage,
    invalidClass,
  };
}

/**
 * If workId isnt already in sessionStorage, add it
 * @param {String} workId
 */
export function setAlreadyOrdered(workId) {
  const alreadyOrdered = JSON.parse(getSessionStorageItem("alreadyOrdered") || "[]");
  const isAlreaydOrdered = alreadyOrdered.includes(workId);
  if (!isAlreaydOrdered) {
    alreadyOrdered.push(workId);
    setSessionStorageItem("alreadyOrdered", JSON.stringify(alreadyOrdered));
  }
}

/**
 * @param {string} workId
 * @return {boolean} true if workId is part of alreadyOrdered keys
 */
export function workHasAlreadyBeenOrdered(workId) {
  const storage = JSON.parse(getSessionStorageItem("alreadyOrdered") || "[]");
  const alreadyOrdered = storage.includes(workId);
  return alreadyOrdered;
}

export function removeWorkIdFromSession(workId) {
  const alreadyOrdered = JSON.parse(getSessionStorageItem("alreadyOrdered") || "[]");
  const index = alreadyOrdered.indexOf(workId);
  if (index > -1) {
    alreadyOrdered.splice(index, 1);
  }
  setSessionStorageItem("alreadyOrdered", JSON.stringify(alreadyOrdered));
}

export function removeAlreadyOrderedFromSession() {
  removeSessionStorageItem("alreadyOrdered");
}
