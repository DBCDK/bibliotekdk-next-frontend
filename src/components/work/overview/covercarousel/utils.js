import {
  formatMaterialTypesToPresentation,
  manifestationMaterialTypeFactory,
} from "@/lib/manifestationFactoryUtils";
import isEmpty from "lodash/isEmpty";
import range from "lodash/range";
import at from "lodash/at";
import ceil from "lodash/ceil";

export function moveCarousel(indexChange, numManifestations, index) {
  return (numManifestations + index + indexChange) % numManifestations;
}

export function getManifestationWithoutDefaultCover(manifestations) {
  return manifestations
    ? manifestations?.filter(
        (manifestation) => manifestation?.cover?.origin !== "default"
      )
    : [];
}

export function getManifestationsWithCorrectCover(manifestations) {
  const { uniqueMaterialTypes, manifestationsEnrichedWithDefaultFrontpage } =
    manifestationMaterialTypeFactory(manifestations);

  const { materialTypesArray, manifestations: manifestationsBeforeFilter } =
    manifestationsEnrichedWithDefaultFrontpage(uniqueMaterialTypes?.[0]);

  const manifestationsNotDefault = getManifestationWithoutDefaultCover(
    manifestationsBeforeFilter
  );

  return {
    manifestationsWithCover: !isEmpty(manifestationsNotDefault)
      ? manifestationsNotDefault
      : [manifestationsBeforeFilter?.[0]],
    materialType: materialTypesArray,
  };
}

export function getTextDescription(materialType, manifestation) {
  // we only show a description if cover origins from moreinfo webservice
  if (manifestation?.cover?.origin !== "fbiinfo") {
    return "";
  }
  return [
    formatMaterialTypesToPresentation(materialType),
    manifestation?.edition?.edition,
    manifestation?.edition?.publicationYear?.display,
  ]
    .filter((el) => !isEmpty(el))
    .join(", ");
}

/**
 * Get a subset of elements in an array.
 *  Used to get evenly spread out indices of given array
 *  In a deterministic manner. Used in {@link getIndicesForCoverCarousel}
 * @param arr
 * @param len
 * @returns {React.JSX.Element}
 */
function getEvenlySpacedOutIndices(arr, len) {
  const stepSize = ceil(arr.length / len);
  const indices = range(stepSize, arr.length, stepSize);
  return indices.length < len ? at(arr, [0, ...indices]) : at(arr, indices);
}

/**
 * Gives an array of indices in a given range 0 to length
 *  The first and last 2 indices are provides always
 *  The rest are evenly spread out by {@link getEvenlySpacedOutIndices}
 * @param length
 * @returns {*[]|*}
 */
export function getIndicesForCoverCarousel(length) {
  const rangeInMiddle = range(2, length - 3);
  const samples = getEvenlySpacedOutIndices(rangeInMiddle, 6);

  return length > 10
    ? [0, 1, ...samples, length - 2, length - 1]
    : range(0, length - 1);
}
