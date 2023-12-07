import isEqual from "lodash/isEqual";
import uniqWith from "lodash/uniqWith";
import upperFirst from "lodash/upperFirst";
import groupBy from "lodash/groupBy";
import { getCoverImage } from "@/components/utils/getCoverImage";
import { comparableYear } from "@/lib/utils";
import { getOrderedFlatMaterialTypes } from "@/lib/enums_MaterialTypes";
import { materialTypeError } from "@/lib/errorMessage.utils";

/** @type {Array.<string>} */
let manifestationWorkType = [];

/** @type {Array.<{display: SpecificDisplay, code: SpecificCode}>} */
let materialTypesOrderFromEnum = [];

let errorCount = 0;

/* Typedefs for JSDOC */
/**
 * MaterialTypes is an object containing specificDisplay, specificCode, generalDisplay, generalCode
 * @typedef {{specificDisplay: SpecificDisplay, specificCode: SpecificCode, generalDisplay: string, generalCode: string}} MaterialTypes
 * @example {specificDisplay: "bog", specificCode: "BOOK", generalDisplay: "bøger", generalCode: "BOOKS"}
 */
/**
 * MaterialTypeArray is an array of {@link MaterialTypes}
 * @typedef {Array.<MaterialTypes>} MaterialTypesArray
 * @example [
 *   {specificDisplay: "bog", specificCode: "BOOK", generalDisplay: "bøger", generalCode: "BOOKS"},
 *   {specificDisplay: "e-bog", specificCode: "EBOOK", generalDisplay: "e-bøger", generalCode: "EBOOKS"},
 * ]
 */
/**
 * SpecificDisplay is a string, but is supposed to map to specificDisplay in {@link MaterialTypes}
 * @typedef {string} SpecificDisplay
 * @example "bog"
 */
/**
 * SpecificDisplayArray is an array of {@link SpecificDisplay}.
 * @typedef {Array.<SpecificDisplay>} SpecificDisplayArray
 * @example ["bog", "e-bog"]
 */
/**
 * SpecificCode is a string, but is supposed to map to specificCode in {@link MaterialTypes}
 * @typedef {string} SpecificCode
 * @example "BOOK"
 */
/**
 * SpecificCodeArray is an array of {@link SpecificCode}.
 * @typedef {Array.<SpecificCode>} SpecificCodeArray
 * @example ["BOOK", "EBOOK"]
 */
/**
 * @typedef {Record.<string, Array.<Object.<string, any>>>} ManifestationByType
 */

/* Code */
/**
 * Format to array from url
 * @example formatMaterialTypesFromUrl("fisk / Hest") => ["fisk", "hest"]
 * @param {string} materialTypesUrl
 * @returns {SpecificDisplayArray}
 */
export function formatMaterialTypesFromUrl(materialTypesUrl) {
  return materialTypesUrl !== "" ? materialTypesUrl?.split(" / ") : [];
}

/**
 * Format to url from array
 * @example formatMaterialTypesToUrl(["fisk", "hest"]) => "fisk / hest"
 * @param {MaterialTypesArray|SpecificDisplayArray} materialTypeArray
 * @returns {string}
 */
export function formatMaterialTypesToUrl(materialTypeArray) {
  return materialTypeArray
    ?.map((mat) => (typeof mat === "string" ? mat : mat?.specificDisplay))
    .join(" / ");
}

/**
 * Format to cypress (cypress/dataCy does not like space)
 * @example formatMaterialTypesToCypress(["fisk og hest", "ko og ged"]) => "fisk-og-hest/ko-og-ged"
 * @param {MaterialTypesArray|SpecificDisplayArray} materialTypeArray
 * @returns {string}
 */
export function formatMaterialTypesToCypress(materialTypeArray) {
  return materialTypeArray
    ?.map((mat) => (typeof mat === "string" ? mat : mat?.specificDisplay))
    ?.join("/")
    .replace(" ", "-");
}

/**
 * Format to presentation is MaterialTypesSwitcher and searchResult
 * @example
     formatMaterialTypesToPresentation(
       ["fisk og hest", "ko og ged"]
     ) => "Fisk og hest / Ko og ged"
 * @example
     formatMaterialTypesToPresentation([
       { specificDisplay: "fisk og hest", specificCode: ..., generalDisplay: ..., generalCode: ... },
       { specificDisplay: "ko og ged", specificCode: ..., generalDisplay: ..., generalCode: ... }
     ]) => "Fisk og hest / Ko og ged"
 *
 * @param {MaterialTypesArray|SpecificDisplayArray|string} materialTypeArray
 * @returns {string}
 */
export function formatMaterialTypesToPresentation(materialTypeArray) {
  if (!Array.isArray(materialTypeArray)) {
    return materialTypeArray;
  }

  return (
    materialTypeArray
      ?.map((mat) =>
        upperFirst(typeof mat === "string" ? mat : mat?.specificDisplay)
      )
      .join(" / ") || null
  );
}

/**
 * Material types in a flat array
 * @param {Object.<string, any>} manifestation
 * @returns {MaterialTypesArray}
 */
export function flattenMaterialType(manifestation) {
  materialTypeError(manifestation);

  return (
    manifestation?.materialTypes
      ?.map((materialType) => {
        return {
          specificDisplay: materialType?.materialTypeSpecific?.display,
          specificCode: materialType?.materialTypeSpecific?.code,
          generalDisplay: materialType?.materialTypeGeneral?.display,
          generalCode: materialType?.materialTypeGeneral?.code,
        };
      })
      .sort((a, b) => compareMaterialTypeArrays([a], [b])) || []
  );
}

/**
 * All materialTypeArrays for all given manifestations
 * @param {Object.<string, any>} manifestations
 * @param manifestations
 * @returns {Array.<MaterialTypesArray>}
 */
export function flatMapMaterialTypes(manifestations) {
  return manifestations?.map(flattenMaterialType);
}

/**
 * {@link MaterialTypesArray} is turned into a {@link SpecificCodeArray}
 * @param {MaterialTypesArray|SpecificDisplayArray} materialTypeArray
 * @param {("specificDisplay"|"specificCode"|"generalDisplay"|"generalCode")} materialTypeField
 * @returns {SpecificDisplayArray}
 */
export function toFlatMaterialTypes(
  materialTypeArray,
  materialTypeField = "specificDisplay"
) {
  if (
    ![
      "specificDisplay",
      "specificCode",
      "generalDisplay",
      "generalCode",
    ].includes(materialTypeField)
  ) {
    materialTypeField = "specificDisplay";
  }

  return materialTypeArray?.map((mat) =>
    typeof mat === "string" ? mat : mat?.[materialTypeField]
  );
}

/**
 * Checks if the specificDetailsArray is in materialTypesArray
 * @param {SpecificCodeArray} simplifiedMaterialTypesArray
 * @param {MaterialTypesArray} materialTypesArray
 * @param {("specificDisplay"|"specificCode"|"generalDisplay"|"generalCode")} materialTypeField
 * @returns {boolean}
 */
export function inFlatMaterialTypes(
  simplifiedMaterialTypesArray,
  materialTypesArray,
  materialTypeField = "specificDisplay"
) {
  return isEqual(
    simplifiedMaterialTypesArray,
    toFlatMaterialTypes(materialTypesArray, materialTypeField)
  );
}

/**
 * Sorter for sorting by publication year
 * @param {Object.<string, any>} a
 * @param {Object.<string, any>} b
 * @returns {number}
 */
export function sorterByPublicationYear(a, b) {
  return (
    comparableYear(b?.edition?.publicationYear?.display) -
    comparableYear(a?.edition?.publicationYear?.display)
  );
}

/**
 * All given manifestations grouped by materialTypes
 * @param {Object.<string, any>} manifestations
 * @param {Function} sorter
 * @returns {ManifestationByType}
 */
export function groupManifestations(
  manifestations,
  sorter = sorterByPublicationYear
) {
  return groupBy(
    manifestations?.sort(sorter)?.map((manifestation) => {
      const materialTypesArray = flattenMaterialType(manifestation);
      return {
        ...manifestation,
        materialTypesArray: materialTypesArray,
        specificDisplayArray: materialTypesArray.map(
          (mat) => mat.specificDisplay
        ),
        ...(manifestation?.ownerWork?.workId && {
          workId: manifestation?.ownerWork?.workId,
        }),
      };
    }),
    "specificDisplayArray"
  );
}

/**
 * Gets the prioritisation of elements based on the custom sorting defined in
 * {@link getOrderedFlatMaterialTypes}. Also uses workType to prefer the order
 * @param {Array.<string>} materialTypesOrder
 * @param {Array.<string>} materialTypeArray
 * @returns {Array.<number>}
 */
export function getElementByCustomSorting(
  materialTypesOrder,
  materialTypeArray
) {
  // If the materialType is not in the array, index -1 becomes the highest index + 1
  return materialTypeArray
    .map((matArr) =>
      materialTypesOrder.findIndex((matOrder) => isEqual(matArr, matOrder))
    )
    .map((idx) => (idx === -1 ? materialTypesOrder.length : idx));
}

/**
 * Takes a stringArray and jsonify the content to make it string-comparable
 * @param {SpecificDisplayArray} stringArray
 * @returns {string}
 */
export function jsonify(stringArray) {
  return JSON.stringify(stringArray).slice(1, -1).replaceAll(`"`, "");
}

export function getComparisonBySort(aBySort, bBySort) {
  if (aBySort.length === 0 || bBySort.length === 0) {
    return bBySort.length - aBySort.length;
  }

  for (let i = 0; i < Math.min(aBySort.length, bBySort.length); i++) {
    if (aBySort[i] !== bBySort[i]) {
      return aBySort - bBySort;
    }
  }
  return 0;
}

/**
 * Compares specificDisplay arrays
 * @param {SpecificDisplayArray} a
 * @param {SpecificDisplayArray} b
 * @param {Array.<{display: SpecificDisplay, code: SpecificCode}>} materialTypesOrder
 * @returns {number}
 */
export function compareSpecificDisplayArrays(
  a,
  b,
  materialTypesOrder = materialTypesOrderFromEnum || []
) {
  const materialTypesOrderCode = materialTypesOrder.map((mat) => mat.display);

  const aBySort = getElementByCustomSorting(materialTypesOrderCode, a);
  const bBySort = getElementByCustomSorting(materialTypesOrderCode, b);

  const comparedBySorts = getComparisonBySort(aBySort, bBySort);

  if (comparedBySorts !== 0) {
    return comparedBySorts;
  }

  const specificDisplayJsonA = jsonify(a);
  const specificDisplayJsonB = jsonify(b);

  const emptyA = specificDisplayJsonA === "" ? 1 : 0;
  const emptyB = specificDisplayJsonB === "" ? 1 : 0;

  if (emptyA || emptyB) {
    return emptyA - emptyB;
  }

  const collator = Intl.Collator("da");
  return collator.compare(specificDisplayJsonA, specificDisplayJsonB);
}

/**
 * Comparison of strings of arrays (by danish language)
 *  MaterialTypeArrays can be compared against each other to
 *  have the proper order
 * @example
     compareMaterialTypeArrays([
       { specificDisplay: "fisk", specificCode: "FISH", generalDisplay: ..., generalCode: ... },
       { specificDisplay: "ko", specificCode: "COW", generalDisplay: ..., generalCode: ... },
     ], [
       { specificDisplay: "hest", specificCode: "HORSE", generalDisplay: ..., generalCode: ... },
       { specificDisplay: "ged", specificCode: "GOAT", generalDisplay: ..., generalCode: ... },
     ]) => 0
 * @example
     compareMaterialTypeArrays([
       { specificDisplay: "fisk", specificCode: "FISH", generalDisplay: ..., generalCode: ... },
     ], [
       { specificDisplay: "fisk", specificCode: "FISH", generalDisplay: ..., generalCode: ... },
       { specificDisplay: "ko", specificCode: "COW", generalDisplay: ..., generalCode: ... },
     ]) => 0
 * @example
     compareMaterialTypeArrays([
       { specificDisplay: "fisk", specificCode: "FISH", generalDisplay: ..., generalCode: ... },
       { specificDisplay: "ko", specificCode: "COW", generalDisplay: ..., generalCode: ... },
     ], [
       { specificDisplay: "fisk", specificCode: "FISH", generalDisplay: ..., generalCode: ... },
     ]) => 1
 * @param {MaterialTypesArray} a
 * @param {MaterialTypesArray} b
 * @param {Array.<{display: SpecificDisplay, code: SpecificCode}>} materialTypesOrder
 * @returns {number}
 */
export function compareMaterialTypeArrays(
  a,
  b,
  materialTypesOrder = materialTypesOrderFromEnum || []
) {
  const materialTypesOrderCode = materialTypesOrder.map((mat) => mat.code);

  const aBySort = getElementByCustomSorting(
    materialTypesOrderCode,
    toFlatMaterialTypes(a, "specificCode")
  );
  const bBySort = getElementByCustomSorting(
    materialTypesOrderCode,
    toFlatMaterialTypes(b, "specificCode")
  );

  const comparedBySorts = getComparisonBySort(aBySort, bBySort);

  if (comparedBySorts !== 0) {
    return comparedBySorts;
  }

  return compareSpecificDisplayArrays(
    toFlatMaterialTypes(a, "specificDisplay"),
    toFlatMaterialTypes(b, "specificDisplay")
  );
}

/**
 * Provides all unique materialTypeArrays from a given array of materialTypeArrays
 *  Sorting is also done by sort using {@link compareMaterialTypeArrays}
 * @param {Array.<MaterialTypesArray>} arrayOfMaterialTypesArray
 * @returns {Array.<MaterialTypesArray>}
 */
export function getUniqueMaterialTypes(arrayOfMaterialTypesArray) {
  // We use sort because we actually want to keep the unique arrays sorted
  return uniqWith(arrayOfMaterialTypesArray, (a, b) =>
    isEqual(
      a.sort((a1, a2) => compareMaterialTypeArrays([a1], [a2])),
      b.sort((b1, b2) => compareMaterialTypeArrays([b1], [b2]))
    )
  )
    ?.sort(compareMaterialTypeArrays)
    ?.filter((arr) => arr.length > 0);
}

/**
 * Search for a materialTypeArray within given unique materialTypes for manifestations
 * @param {(SpecificDisplayArray|SpecificCodeArray)} typeArr
 * @param {Array.<MaterialTypesArray>} uniqueMaterialTypes
 * @returns {boolean}
 */
export function getInUniqueMaterialTypes(typeArr, uniqueMaterialTypes) {
  return (
    uniqueMaterialTypes?.findIndex(
      (materialTypesArr) =>
        inFlatMaterialTypes(typeArr, materialTypesArr, "specificDisplay") ||
        inFlatMaterialTypes(typeArr, materialTypesArr, "specificCode") ||
        inFlatMaterialTypes(typeArr, materialTypesArr, "generalCode") ||
        inFlatMaterialTypes(typeArr, materialTypesArr, "generalDisplay")
    ) > -1
  );
}

/**
 * Get all pids from manifestations with a specific materialTypeArray
 * @param {SpecificDisplayArray} typeArr
 * @param {Object.<string, Array.<Object.<string, any>>>} manifestationsByType
 * @returns {Array.<string>}
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
 * @param {MaterialTypesArray} materialTypesArray
 * @param {ManifestationByType} manifestationsByType
 * @returns {{cover: ({detail: *}|{detail: null}), manifestations: Array.<Object.<string, any>>, materialType}}
 */
export function enrichManifestationsWithDefaultFrontpages(
  materialTypesArray,
  manifestationsByType
) {
  const typeArrAsSpecificDefaultList = toFlatMaterialTypes(materialTypesArray);

  const coverImage = getCoverImage(
    manifestationsByType[typeArrAsSpecificDefaultList]
  );

  return {
    cover: coverImage,
    manifestations: manifestationsByType[typeArrAsSpecificDefaultList],
    materialTypesArray: materialTypesArray,
  };
}

/**
 * Function used for BibliographicData, for showing all manifestations of a work
 * @param {ManifestationByType} manifestationsByType
 * @returns {Array.<Object.<string, any>>}
 */
export function flattenGroupedSortedManifestations(manifestationsByType) {
  return Object.entries(manifestationsByType)
    ?.sort((a, b) =>
      compareSpecificDisplayArrays(a[0].split(","), b[0].split(","))
    )
    ?.flatMap((group) => {
      return group[1];
    });
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
 * @returns {{flattenGroupedSortedManifestationsByType: (function(*): *[]), manifestationsByType, manifestationsEnrichedWithDefaultFrontpage: (function(*): {cover: ({detail: *}|{detail: null}), manifestations: *, materialType}), flattenedGroupedSortedManifestations: *[], flatMaterialTypes: *, inUniqueMaterialTypes: (function(*): boolean), uniqueMaterialTypes: Array<MaterialTypesArray>, flatPidsByType: (function(*): *|*[])}}
 */
export function manifestationMaterialTypeFactory(manifestations) {
  manifestations?.length > 0 &&
    materialTypeError(manifestations?.[0], errorCount);

  manifestationWorkType = manifestations?.[0]?.ownerWork?.workTypes || [];
  materialTypesOrderFromEnum = getOrderedFlatMaterialTypes(
    manifestationWorkType
  );
  const arrayOfMaterialTypesArray = flatMapMaterialTypes(manifestations);
  const uniqueMaterialTypes = getUniqueMaterialTypes(arrayOfMaterialTypesArray);

  const manifestationsByType = groupManifestations(manifestations);
  const flattenedGroupedSortedManifestations =
    flattenGroupedSortedManifestations(manifestationsByType);

  return {
    flatMaterialTypes: arrayOfMaterialTypesArray,
    uniqueMaterialTypes: uniqueMaterialTypes,
    inUniqueMaterialTypes: (typeArr) =>
      getInUniqueMaterialTypes(typeArr, uniqueMaterialTypes),
    manifestationsByType: manifestationsByType,
    flatPidsByType: (typeArr) =>
      getFlatPidsByType(typeArr, manifestationsByType),
    flattenedGroupedSortedManifestations: flattenedGroupedSortedManifestations,
    flattenGroupedSortedManifestationsByType: (typeArr) =>
      flattenGroupedSortedManifestations({
        [typeArr]: manifestationsByType[typeArr],
      }),
    manifestationsEnrichedWithDefaultFrontpage: (materialTypeArray) =>
      enrichManifestationsWithDefaultFrontpages(
        materialTypeArray,
        manifestationsByType
      ),
  };
}
