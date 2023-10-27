import Tag from "@/components/base/forms/tag";
import {
  formatMaterialTypesToCypress,
  formatMaterialTypesToPresentation,
  flattenToMaterialTypeStringArray,
  inMaterialTypesArrays,
} from "@/lib/manifestationFactoryUtils";

export function MaterialTypeSwitcher({
  uniqueMaterialTypes,
  skeleton,
  onTypeChange,
  type,
}) {
  // Handle selectedMaterial
  function handleSelectedMaterial(materialTypeArray, type) {
    // Update query param callback
    if (!inMaterialTypesArrays(type, materialTypeArray)) {
      onTypeChange({
        type: flattenToMaterialTypeStringArray(materialTypeArray),
      });
    }
  }

  return uniqueMaterialTypes?.map((materialTypeArray) => {
    //  Sets isSelected flag if button should be selected
    return (
      <Tag
        key={formatMaterialTypesToCypress(materialTypeArray)}
        selected={inMaterialTypesArrays(type, materialTypeArray)}
        onClick={() => handleSelectedMaterial(materialTypeArray, type)}
        skeleton={skeleton}
        dataCy={"tag-" + formatMaterialTypesToCypress(materialTypeArray)}
      >
        {formatMaterialTypesToPresentation(materialTypeArray)}
      </Tag>
    );
  });
}
