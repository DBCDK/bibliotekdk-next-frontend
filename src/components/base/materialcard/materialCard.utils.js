export const BackgroundColorEnum = Object.freeze({
  NEUTRAL: "NEUTRAL",
  YELLOW: "YELLOW",
  RED: "RED",
});

export const StatusEnum = Object.freeze({
  NONE: "NONE",
  NOT_AVAILABLE: "NOT-AVAILABLE",
  DIGITAL: "DIGITAL",
  NEEDS_EDITION: "NEEDS-EDITION",
});

/**
 *
 * @param {Boolean} isPeriodicaLike
 * @param {Boolean} hasPeriodicaForm
 * @param {Boolean} notAvailableAtLibrary
 * @returns
 */
export function findBackgroundColor({
  isPeriodicaLike,
  hasPeriodicaForm,
  notAvailableAtLibrary,
}) {
  if (isPeriodicaLike && !hasPeriodicaForm) {
    return BackgroundColorEnum.YELLOW;
  }
  if (notAvailableAtLibrary) {
    return BackgroundColorEnum.RED;
  }
  return BackgroundColorEnum.NEUTRAL;
}
