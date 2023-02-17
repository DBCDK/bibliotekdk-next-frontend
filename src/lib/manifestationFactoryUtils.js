import isEqual from "lodash/isEqual";
import uniqWith from "lodash/uniqWith";
import upperFirst from "lodash/upperFirst";
import groupBy from "lodash/groupBy";
import { getCoverImage } from "@/components/utils/getCoverImage";
import { comparableYear } from "@/lib/utils";

/**
 * MaterialTypeArray with additional manifestation details, possibly enriched,
 *   can any of these properties
 * @typedef {Array} MaterialTypesArray
 * @property {string} materialType
 */

/**
 * Format to array from url
 * @example formatMaterialTypesFromUrl("fisk / hest") => ["fisk", "hest"]
 * @param materialTypesUrl
 * @return {MaterialTypesArray}
 */
export function formatMaterialTypesFromUrl(materialTypesUrl) {
  return materialTypesUrl !== "" ? materialTypesUrl?.split(" / ") : [];
}

/**
 * Format to url from array
 * @example formatMaterialTypesToUrl(["fisk", "hest"]) => "fisk / hest"
 * @param materialTypeArray
 * @return {string}
 */
export function formatMaterialTypesToUrl(materialTypeArray) {
  return materialTypeArray?.join(" / ");
}

/**
 * Format to cypress (cypress/dataCy does not like space)
 * @example formatMaterialTypesToCypress(["fisk og hest", "ko og ged"]) => "fisk-og-hest/ko-og-ged"
 * @param materialTypeArray
 * @return {*}
 */
export function formatMaterialTypesToCypress(materialTypeArray) {
  return materialTypeArray?.join("/").replace(" ", "-");
}

/**
 * Format to presentation is MaterialTypesSwitcher and searchResult
 * @example formatMaterialTypesToPresentation(["fisk og hest", "ko og ged"]) => "Fisk og hest / Ko og ged"
 * @param materialTypeArray
 * @return {*}
 */
export function formatMaterialTypesToPresentation(materialTypeArray) {
  return materialTypeArray?.map((mat) => upperFirst(mat)).join(" / ");
}

/**
 * Material types in a flat array
 * @param manifestation
 * @return {*|*[]}
 */
export function flattenMaterialType(manifestation) {
  return (
    manifestation?.materialTypes?.flatMap(
      (materialType) => materialType?.specific
    ) || []
  );
}

/**
 * All materialTypeArrays for all given manifestations
 * @param manifestations
 * @return {*}
 */
export function flatMapMaterialTypes(manifestations) {
  return manifestations?.map(flattenMaterialType);
}

/**
 * Sorter for sorting by publication year
 * @param a
 * @param b
 * @return {number}
 */
export function sorterByPublicationYear(a, b) {
  return (
    comparableYear(b?.edition?.publicationYear?.display) -
    comparableYear(a?.edition?.publicationYear?.display)
  );
}

/**
 * All given manifestations grouped by materialTypes
 * @param manifestations
 * @param sorter
 * @return {Object}
 */
export function groupManifestations(
  manifestations,
  sorter = sorterByPublicationYear
) {
  return groupBy(
    manifestations?.sort(sorter)?.map((manifestation) => {
      return {
        ...manifestation,
        materialTypesArray: manifestation?.materialTypes
          ?.map((mat) => mat.specific)
          .sort(compareArraysOfStrings),
      };
    }),
    "materialTypesArray"
  );
}

/**
 * Comparison of strings of arrays (by danish language)
 *  MaterialTypeArrays can be compared against each other to
 *  have the proper order
 * @example compareArraysOfStrings(["fisk", "ko"], ["hest", "ged"]) => 0
 * @example compareArraysOfStrings(["fisk"], ["fisk", "ko"]) => 0
 * @example compareArraysOfStrings(["fisk", "ko"], ["fisk"]) => 1
 * @param a
 * @param b
 * @return {number}
 */
export function compareArraysOfStrings(a, b) {
  const jsonA = JSON.stringify(a).slice(1, -1);
  const jsonB = JSON.stringify(b).slice(1, -1);
  const emptyA = jsonA === "" ? 1 : 0;
  const emptyB = jsonB === "" ? 1 : 0;

  if (emptyA || emptyB) {
    return emptyA - emptyB;
  }

  const collator = Intl.Collator("da");
  return collator.compare(jsonA, jsonB);
}

/**
 * Provides all unique materialTypeArrays from a given array of materialTypeArrays
 *  Sorting is also done by sort using {@link compareArraysOfStrings}
 * @param flatMaterialTypes
 * @return {Array<MaterialTypesArray>}
 */
export function getUniqueMaterialTypes(flatMaterialTypes) {
  // We use sort because we actually want to keep the unique arrays sorted
  return uniqWith(flatMaterialTypes, (a, b) => isEqual(a.sort(), b.sort()))
    ?.sort(compareArraysOfStrings)
    ?.filter((arr) => arr.length > 0);
}

/**
 * Search for a materialTypeArray within given unique materialTypes for manifestations
 * @param typeArr
 * @param uniqueMaterialTypes
 * @return {boolean}
 */
export function getInUniqueMaterialTypes(typeArr, uniqueMaterialTypes) {
  return (
    uniqueMaterialTypes?.findIndex((materialTypesArr) =>
      isEqual(materialTypesArr, typeArr)
    ) > -1
  );
}

/**
 * Get all pids from manifestations with a specific materialTypeArray
 * @param typeArr
 * @param manifestationsByType
 * @return {*|*[]}
 */
export function getFlatPidsByType(typeArr, manifestationsByType) {
  return (
    (typeArr &&
      manifestationsByType &&
      manifestationsByType?.[typeArr]?.flatMap(
        (manifestation) => manifestation.pid
      )) ||
    []
  );
}

/**
 * Enrich manifestations with default cover image
 * @param type
 * @param manifestations
 * @return {{cover: ({detail: *}|{detail: null}), manifestations: *, materialType}}
 */
export function enrichManifestationsWithDefaultFrontpages(
  type,
  manifestations
) {
  const coverImage = getCoverImage(manifestations[type]);

  return {
    cover: coverImage,
    manifestations: manifestations[type],
    materialType: type,
  };
}

/**
 * Function used for BibliographicData, for showing all manifestations of a work
 * @param manifestationsByType
 * @return {unknown[]}
 */
export function flattenGroupedSortedManifestations(manifestationsByType) {
  return Object.entries(manifestationsByType).flatMap((group) => group[1]);
}

/**
 * Provide manifestationMaterialTypeFactory that controls manifestations sorted by type
 * - flatMaterialTypes derived from {@link flatMapMaterialTypes}
 * - uniqueMaterialTypes derived from {@link getUniqueMaterialTypes}
 * - inUniqueMaterialTypes derived from {@link getInUniqueMaterialTypes}
 * - manifestationsByType derived from {@link groupManifestations}
 * - flatPidsByType derived from {@link getFlatPidsByType}
 * - flattenedGroupedSortedManifestations derived from {@link flattenGroupedSortedManifestations}
 * - manifestationsEnrichedWithDefaultFrontpage derived from {@link enrichManifestationsWithDefaultFrontpages}
 * @param manifestations
 * @return {{manifestationsByType: *, manifestationsEnrichedWithDefaultFrontpage: (function(*): {cover: ({detail: *}|{detail: null}), manifestations: *, materialType}), flatMaterialTypes: *, inUniqueMaterialTypes: (function(*): boolean), uniqueMaterialTypes: *, flatPidsByType: (function(*): *|*[]), flattenedGroupedSortedManifestations: *, manifestationsEnrichedWithDefaultFrontpage: *}}}
 */
export function manifestationMaterialTypeFactory(manifestations) {
  const flatMaterialTypes = flatMapMaterialTypes(manifestations);
  const uniqueMaterialTypes = getUniqueMaterialTypes(flatMaterialTypes);
  const manifestationsByType = groupManifestations(manifestations);
  const flattenedGroupedSortedManifestations =
    flattenGroupedSortedManifestations(manifestationsByType);

  return {
    flatMaterialTypes: flatMaterialTypes,
    uniqueMaterialTypes: uniqueMaterialTypes,
    inUniqueMaterialTypes: (typeArr) =>
      getInUniqueMaterialTypes(typeArr, uniqueMaterialTypes),
    manifestationsByType: manifestationsByType,
    flatPidsByType: (typeArr) =>
      getFlatPidsByType(typeArr, manifestationsByType),
    flattenedGroupedSortedManifestations: flattenedGroupedSortedManifestations,
    manifestationsEnrichedWithDefaultFrontpage: (typeArr) =>
      enrichManifestationsWithDefaultFrontpages(typeArr, manifestationsByType),
  };
}
