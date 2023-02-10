import {
  formatMaterialTypesToPresentation,
  manifestationMaterialTypeFactory,
} from "@/lib/manifestationFactoryUtils";
import isEmpty from "lodash/isEmpty";

export function moveCarousel(indexChange, numManifestations, index) {
  return (numManifestations + index + indexChange) % numManifestations;
}

export function getManifestationsWithCorrectCover(manifestations) {
  const { uniqueMaterialTypes, manifestationsEnrichedWithDefaultFrontpage } =
    manifestationMaterialTypeFactory(manifestations);

  const { materialType, manifestations: manifestationsBeforeFilter } =
    manifestationsEnrichedWithDefaultFrontpage(uniqueMaterialTypes?.[0]);

  const manifestationsNotDefault = manifestationsBeforeFilter?.filter(
    (manifestation) => manifestation?.cover?.origin !== "default"
  );

  return {
    manifestationsWithCover: !isEmpty(manifestationsNotDefault)
      ? manifestationsNotDefault
      : [manifestationsBeforeFilter?.[0]],
    materialType: materialType,
  };
}

export function getTextDescription(materialType, manifestation) {
  return [
    formatMaterialTypesToPresentation(materialType),
    manifestation?.edition?.edition,
    manifestation?.edition?.publicationYear?.display,
  ]
    .filter((el) => !isEmpty(el))
    .join(", ");
}

export function scrollToElement(idx, passedId = "slide") {
  document.querySelector(`#${passedId}-${idx}`).scrollIntoView({
    behavior: "smooth",
    block: "nearest",
    inline: "center",
  });
}
