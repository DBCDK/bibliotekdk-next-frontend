import { isEqual } from "lodash";
import Tag from "@/components/base/forms/tag";
import {
  formatMaterialTypesToCypress,
  formatMaterialTypesToPresentation,
} from "@/lib/manifestationFactoryUtils";

export function MaterialTypeSwitcher({
  uniqueMaterialTypes,
  skeleton,
  onTypeChange,
  type,
}) {
  // Handle selectedMaterial
  function handleSelectedMaterial(materialType, type) {
    // Update query param callback
    if (!isEqual(type, materialType)) {
      onTypeChange({ type: materialType });
    }
  }

  return uniqueMaterialTypes?.map((materialTypeArray) => {
    //  Sets isSelected flag if button should be selected
    return (
      <Tag
        key={materialTypeArray.join(",")}
        selected={isEqual(materialTypeArray, type)}
        onClick={() => handleSelectedMaterial(materialTypeArray, type)}
        skeleton={skeleton}
        dataCy={"tag-" + formatMaterialTypesToCypress(materialTypeArray)}
      >
        {formatMaterialTypesToPresentation(materialTypeArray)}
      </Tag>
    );
  });
}
