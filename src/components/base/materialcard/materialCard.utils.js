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
