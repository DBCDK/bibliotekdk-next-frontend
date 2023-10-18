import isEqual from "lodash/isEqual";
import Tag from "@/components/base/forms/tag";
import {
  formatMaterialTypesToCypress,
  formatMaterialTypesToPresentation,
  formatToStringListOfMaterialTypeField,
} from "@/lib/manifestationFactoryUtils";

export function MaterialTypeSwitcher({
  uniqueMaterialTypes,
  skeleton,
  onTypeChange,
  type,
}) {
  // Handle selectedMaterial
  function handleSelectedMaterial(materialTypeArrayAsSpecificDisplay, type) {
    // Update query param callback
    if (!isEqual(type, materialTypeArrayAsSpecificDisplay)) {
      onTypeChange({ type: materialTypeArrayAsSpecificDisplay });
    }
  }

  return uniqueMaterialTypes?.map((materialTypeArray) => {
    const materialTypeArrayAsSpecificDisplay =
      formatToStringListOfMaterialTypeField(
        materialTypeArray,
        "specificDisplay"
      );

    //  Sets isSelected flag if button should be selected
    return (
      <Tag
        key={formatMaterialTypesToCypress(materialTypeArray)}
        selected={isEqual(materialTypeArrayAsSpecificDisplay, type)}
        onClick={() =>
          handleSelectedMaterial(materialTypeArrayAsSpecificDisplay, type)
        }
        skeleton={skeleton}
        dataCy={"tag-" + formatMaterialTypesToCypress(materialTypeArray)}
      >
        {formatMaterialTypesToPresentation(materialTypeArray)}
      </Tag>
    );
  });
}
