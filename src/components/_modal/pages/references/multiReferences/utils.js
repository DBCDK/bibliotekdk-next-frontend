/**
 * Splits the list materialsMissingEdition into two lists:
 * - newPeriodicaFiltered: list of periodica materials, for which we cannot create references
 * - listWithoutPeriodica: list of remaining materials, for which we can create references
 * @param {Array<Object>} materialsMissingEdition
 * @returns {Object}
 */
export const splitList = (materialsMissingEdition) => {
  const periodicaManifestations = [];
  const nonPeriodicaManifestations = materialsMissingEdition.map((item) => {
    const manifestations = item.manifestations;
    // If 1 option, select it
    if (manifestations.length === 1) {
      const singleManifestation = manifestations[0];
      if (singleManifestation.workTypes?.[0] === "PERIODICA") {
        //TODO What about journals??
        // Periodica -
        periodicaManifestations.push(singleManifestation);
        return {
          ...item,
          toFilter: true,
        };
      }
      return {
        ...item,
        chosenPid: singleManifestation.pid,
      };
    } else return item;
  });
  return {
    periodicaManifestations,
    nonPeriodicaManifestations,
  };
};
