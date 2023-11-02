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

export function extractClassNameAndMessage(validated, failedSubmission) {
  // Get email messages (from validate object)
  const emailStatus = validated?.details?.hasMail?.status;
  const errorMessage = validated?.details?.hasMail?.message;

  // Check for email validation and email error messages
  const hasEmail = !!validated?.details?.hasMail?.status;

  // Email validation class
  const validClass =
    // eslint-disable-next-line css-modules/no-undef-class
    failedSubmission && !emailStatus ? styles.invalid : styles.valid;
  const customInvalidClass =
    // eslint-disable-next-line css-modules/no-undef-class
    failedSubmission && !emailStatus ? styles.invalidInput : "";

  // Set email input message if any
  const message = failedSubmission && errorMessage;

  const actionMessage =
    failedSubmission &&
    (validated?.details?.requireYear?.message ||
      (!hasEmail && validated?.details?.hasMail?.message));

  // eslint-disable-next-line css-modules/no-undef-class
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
