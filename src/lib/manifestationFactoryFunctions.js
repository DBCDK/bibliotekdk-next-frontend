import { chain, isEqual, uniqWith } from "lodash";
import { getCoverImage } from "@/components/utils/getCoverImage";

export function formatMaterialTypesFromUrl(materialTypesUrl) {
  return materialTypesUrl !== "" ? materialTypesUrl?.split(" / ") : [];
}

export function formatMaterialTypesToUrl(materialTypeArray) {
  return materialTypeArray?.join(" / ");
}

export function formatMaterialTypesToCypress(materialTypeArray) {
  return materialTypeArray?.join("/").replace(" ", "-");
}

export function flattenMaterialType(manifestation) {
  return (
    manifestation?.materialTypes?.flatMap(
      (materialType) => materialType?.specific
    ) || []
  );
}

export function flatMapMaterialTypes(manifestations) {
  return manifestations?.map(flattenMaterialType);
}

export function groupManifestations(manifestations) {
  return chain(manifestations)
    ?.map((manifestation) => {
      return {
        ...manifestation,
        materialTypesArray: manifestation?.materialTypes?.map(
          (mat) => mat.specific
        ),
      };
    })
    ?.groupBy("materialTypesArray")
    ?.value();
}

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

export function getUniqueMaterialTypes(flatMaterialTypes) {
  // We use sort because we actually want to keep the unique arrays sorted
  return uniqWith(flatMaterialTypes, (a, b) => isEqual(a.sort(), b.sort()))
    ?.sort(compareArraysOfStrings)
    ?.filter((arr) => arr.length > 0);
}

export function getInUniqueMaterialTypes(typeArr, uniqueMaterialTypes) {
  return (
    uniqueMaterialTypes?.findIndex((materialTypesArr) =>
      isEqual(materialTypesArr, typeArr)
    ) > -1
  );
}

export function getFlatPidsByType(typeArr, manifestationsByType) {
  return (
    manifestationsByType?.[typeArr]?.flatMap(
      (manifestation) => manifestation.pid
    ) || []
  );
}

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

export function manifestationMaterialTypeUtils(manifestations) {
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
