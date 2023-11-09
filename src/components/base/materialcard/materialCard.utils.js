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
 *
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
  if (
    (isPeriodicaLike && !hasPeriodicaForm) ||
    (hasAlreadyBeenOrdered && !isPeriodicaLike)
  ) {
    return BackgroundColorEnum.YELLOW;
  }
  if (notAvailableAtLibrary) {
    return BackgroundColorEnum.RED;
  }
  return BackgroundColorEnum.NEUTRAL;
}
