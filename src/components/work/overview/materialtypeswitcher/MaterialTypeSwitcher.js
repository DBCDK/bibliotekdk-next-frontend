import Tag from "@/components/base/forms/tag";
import {
  formatMaterialTypesToCypress,
  formatMaterialTypesToPresentation,
  toFlatMaterialTypes,
  inFlatMaterialTypes,
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
    if (!inFlatMaterialTypes(type, materialTypeArray)) {
      onTypeChange({
        type: toFlatMaterialTypes(materialTypeArray),
      });
    }
  }

  return uniqueMaterialTypes?.map((materialTypeArray) => {
    //  Sets isSelected flag if button should be selected
    return (
      <Tag
        key={formatMaterialTypesToCypress(materialTypeArray)}
        selected={inFlatMaterialTypes(type, materialTypeArray)}
        onClick={() => handleSelectedMaterial(materialTypeArray, type)}
        skeleton={skeleton}
        dataCy={"tag-" + formatMaterialTypesToCypress(materialTypeArray)}
      >
        {/*{JSON.stringify(materialTypeArray)}*/}
        {formatMaterialTypesToPresentation(materialTypeArray)}
      </Tag>
    );
  });
}
