export const BackgroundColorEnum = Object.freeze({
  NEUTRAL: "NEUTRAL",
  YELLOW: "YELLOW",
  RED: "RED",
  TRANSPARENT: "TRANSPARENT",
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
