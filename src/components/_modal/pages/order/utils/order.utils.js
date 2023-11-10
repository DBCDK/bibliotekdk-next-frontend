// eslint-disable-next-line no-restricted-imports
import styles from "@/components/_modal/pages/order/Order.module.css";

/**
 *
 * @param {string} value
 * @param {boolean} valid
 * @param {function} updateLoanerInfo
 * @param {function} setMail
 */
export function onMailChange(value, valid, updateLoanerInfo, setMail) {
  valid &&
    updateLoanerInfo &&
    updateLoanerInfo({ userParameters: { userMail: value } });
  // update mail in state
  const isValid = {
    status: valid,
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
 * Creates a key for each order
 * Used to check if user has already a specific material in same session
 * @param {String[]} orderPids [ '870970-basis:51900030',  '870970-basis:51900030']
 * @returns {string} '870970-basis:51900030/870970-basis:51900030'
 */
export function createOrderKey(orderPids) {
  console.log("to be created pids ", orderPids);
  return (orderPids && orderPids?.join("/")) || "";
}

export function setAlreadyOrdered(orderKey) {
  const alreadyOrdered = JSON.parse(
    sessionStorage.getItem("alreadyOrdered") || "[]"
  );
  console.log("orderKey", orderKey);

  alreadyOrdered.push(orderKey);
  sessionStorage.setItem("alreadyOrdered", JSON.stringify(alreadyOrdered));
}

/**
 * @param {string} orderKey
 * @return {boolean} true if orderKey is part of alreadyOrdered keys
 */
export function pidHasAlreadyBeenOrdered(orderKey) {
  console.log("orderKey", orderKey);
  return !!JSON.parse(
    sessionStorage.getItem("alreadyOrdered") || "[]"
  ).includes(orderKey);
}

export function removeOrderIdFromSession(orderKey) {
  const alreadyOrdered = JSON.parse(
    sessionStorage.getItem("alreadyOrdered") || "[]"
  );
  const index = alreadyOrdered.indexOf(orderKey);
  if (index > -1) {
    alreadyOrdered.splice(index, 1);
  }
  sessionStorage.setItem("alreadyOrdered", JSON.stringify(alreadyOrdered));
}
