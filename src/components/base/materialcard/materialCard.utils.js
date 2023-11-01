export const BackgroundColorEnum = Object.freeze({
  NEUTRAL: "NEUTRAL",
  YELLOW: "YELLOW",
  RED: "RED",
});

export function findBackgroundColor({
  isPeriodicaLike,
  periodicaForm,
  notAvailableAtLibrary,
}) {
  if (isPeriodicaLike && !periodicaForm) {
    return BackgroundColorEnum.YELLOW;
  }
  if (notAvailableAtLibrary) {
    return BackgroundColorEnum.RED;
  }
  return BackgroundColorEnum.NEUTRAL;
}
