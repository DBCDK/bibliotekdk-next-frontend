import Tag from "@/components/base/forms/tag";
import {
  formatMaterialTypesToCypress,
  formatMaterialTypesToPresentation,
  formatToStringListOfMaterialTypeField,
  materialTypeFieldInMaterialTypesArray,
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
    if (!materialTypeFieldInMaterialTypesArray(type, materialTypeArray)) {
      onTypeChange({
        type: formatToStringListOfMaterialTypeField(materialTypeArray),
      });
    }
  }

  return uniqueMaterialTypes?.map((materialTypeArray) => {
    //  Sets isSelected flag if button should be selected
    return (
      <Tag
        key={formatMaterialTypesToCypress(materialTypeArray)}
        selected={materialTypeFieldInMaterialTypesArray(
          type,
          materialTypeArray
        )}
        onClick={() => handleSelectedMaterial(materialTypeArray, type)}
        skeleton={skeleton}
        dataCy={"tag-" + formatMaterialTypesToCypress(materialTypeArray)}
      >
        {formatMaterialTypesToPresentation(materialTypeArray)}
      </Tag>
    );
  });
}
