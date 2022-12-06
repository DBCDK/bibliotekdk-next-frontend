import { isEqual, upperFirst } from "lodash";
import Tag from "@/components/base/forms/tag";
import { formatMaterialTypesToCypress } from "@/lib/manifestationFactoryFunctions";

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
        {materialTypeArray?.map((mat, index) => {
          return (
            upperFirst(mat) +
            (index < materialTypeArray.length - 1 ? " / " : "")
          );
        })}
      </Tag>
    );
  });
}
