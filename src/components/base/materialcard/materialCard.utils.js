export const BackgroundColorEnum = Object.freeze({
  NEUTRAL: "NEUTRAL",
  YELLOW: "YELLOW",
  RED: "RED",
  UNI_RED: "UNI_RED",
});

export const StatusEnum = Object.freeze({
  NONE: "NONE",
  NOT_AVAILABLE: "NOT-AVAILABLE",
  DIGITAL: "DIGITAL",
  NEEDS_EDITION: "NEEDS-EDITION",
  HAS_BEEN_ORDERED: "HAS_BEEN_ORDERED",
});

/**
 * Defines materialcard background color depending on material status
 * @param {Boolean} hasAlreadyBeenOrdered
 * @param {Boolean} isPeriodicaLike
 * @param {Boolean} hasPeriodicaForm
 * @param {Boolean} notAvailableAtLibrary
 * @returns
 */
export function findBackgroundColor({
  hasAlreadyBeenOrdered,
  isPeriodicaLike,
  hasPeriodicaForm,
  notAvailableAtLibrary,
}) {
  if (notAvailableAtLibrary) {
    return BackgroundColorEnum.RED;
  }
  if (
    (isPeriodicaLike && !hasPeriodicaForm) ||
    (hasAlreadyBeenOrdered && !isPeriodicaLike)
  ) {
    return BackgroundColorEnum.YELLOW;
  }
  return BackgroundColorEnum.NEUTRAL;
}
