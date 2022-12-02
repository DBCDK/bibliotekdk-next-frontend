import { isEqual, upperFirst } from "lodash";
import Tag from "@/components/base/forms/tag";

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
      >
        {materialTypeArray?.map((mat, index) => {
          return (
            <span key={mat}>
              {upperFirst(mat)}
              {index < materialTypeArray.length - 1 && <>&nbsp;/&nbsp;</>}
            </span>
          );
        })}
      </Tag>
    );
  });
}
