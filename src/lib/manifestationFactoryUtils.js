import { chain, isEqual, uniqWith, upperFirst } from "lodash";
import { getCoverImage } from "@/components/utils/getCoverImage";

/**
 * Format to array from url
 * @param materialTypesUrl
 * @return {*|*[]}
 */
export function formatMaterialTypesFromUrl(materialTypesUrl) {
  return materialTypesUrl !== "" ? materialTypesUrl?.split(" / ") : [];
}

/**
 * Format to url from array
 * @param materialTypeArray
 * @return {*}
 */
export function formatMaterialTypesToUrl(materialTypeArray) {
  return materialTypeArray?.join(" / ");
}

/**
 * Format to cypress (cypress/dataCy does not like non-ascii)
 * @param materialTypeArray
 * @return {*}
 */
export function formatMaterialTypesToCypress(materialTypeArray) {
  return materialTypeArray?.join("/").replace(" ", "-");
}

/**
 * Format to presentation is MaterialTypesSwitcher and searchResult
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
 * All given manifestations grouped by materialTypes
 * @param manifestations
 * @return {unknown}
 */
export function groupManifestations(manifestations) {
  return chain(manifestations)
    ?.map((manifestation) => {
      return {
        ...manifestation,
        materialTypesArray: manifestation?.materialTypes
          ?.map((mat) => mat.specific)
          .sort(),
      };
    })
    ?.groupBy("materialTypesArray")
    ?.value();
}

/**
 * Comparison of strings of arrays (by danish language)
 * @param a
 * @param b
 * @return {*|number}
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
 * All unique materialTypeArrays
 * @param flatMaterialTypes
 * @return {*}
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
 * Provide manifestationMaterialTypeFactory that controls manifestations sorted by type
 * @param manifestations
 * @return {{manifestationsByType: *, manifestationsEnrichedWithDefaultFrontpage: (function(*): {cover: ({detail: *}|{detail: null}), manifestations: *, materialType}), flatMaterialTypes: *, inUniqueMaterialTypes: (function(*): boolean), uniqueMaterialTypes: *, flatPidsByType: (function(*): *|*[])}}
 */
export function manifestationMaterialTypeFactory(manifestations) {
  const flatMaterialTypes = flatMapMaterialTypes(manifestations);
  const uniqueMaterialTypes = getUniqueMaterialTypes(flatMaterialTypes);
  const manifestationsByType = groupManifestations(manifestations);

  return {
    flatMaterialTypes: flatMaterialTypes,
    uniqueMaterialTypes: uniqueMaterialTypes,
    inUniqueMaterialTypes: (typeArr) =>
      getInUniqueMaterialTypes(typeArr, uniqueMaterialTypes),
    manifestationsByType: manifestationsByType,
    flatPidsByType: (typeArr) =>
      getFlatPidsByType(typeArr, manifestationsByType),
    manifestationsEnrichedWithDefaultFrontpage: (typeArr) =>
      enrichManifestationsWithDefaultFrontpages(typeArr, manifestationsByType),
  };
}
