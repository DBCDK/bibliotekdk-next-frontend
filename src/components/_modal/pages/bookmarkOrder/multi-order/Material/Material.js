import { accessFactory } from "@/lib/accessFactoryUtils";
import { manifestationMaterialTypeFactory } from "@/lib/manifestationFactoryUtils";
import isEmpty from "lodash/isEmpty";
import MaterialCard from "@/components/base/materialcard/MaterialCard";
import { templateImageToLeft } from "@/components/base/materialcard/templates/templates";

/**
 * At this point, we have manifestation of all the different material types
 * Here we filter for the materialtype the user has selected
 * @param {Object[]} mostRelevant
 * @param {String} materialType
 * @returns {Object[]}
 */
const filterForRelevantMaterialTypes = (mostRelevant, materialType) => {
  if (!mostRelevant || !materialType) return [];
  return mostRelevant.filter((single) => {
    return single.materialTypes.some(
      (t) => t.materialTypeSpecific.display === materialType.toLowerCase()
    );
  });
};

/**
 * Is missing article implementation
 * @param {Object} material
 * @returns {React.JSX.Element}
 */
const Material = ({ material }) => {
  const isSpecificEdition = !!material?.pid;

  const manifestation = isSpecificEdition
    ? [material]
    : filterForRelevantMaterialTypes(
        material?.manifestations.mostRelevant,
        material?.materialType
      );

  const { digitalCopyArray, isPeriodicaLikeArray } = accessFactory([
    manifestation,
  ]);

  const isDigitalCopy = digitalCopyArray?.find((single) => single === true);
  const isPeriodicaLike = isPeriodicaLikeArray?.find(
    (single) => single === true
  );

  if (isPeriodicaLike) {
    //TODO implement periodica like
    alert("implement periodia like");
  }

  const children = null; //Check if we have article or not
  const { flattenedGroupedSortedManifestations } =
    manifestationMaterialTypeFactory(manifestation);

  const materialCardTemplate = (/** @type {Object} */ material) =>
    templateImageToLeft({
      material,
      singleManifestation: isSpecificEdition,
      children,
      isPeriodicaLike,
      isDigitalCopy,
    });

  const firstManifestation = flattenedGroupedSortedManifestations[0];
  return (
    <>
      {flattenedGroupedSortedManifestations &&
        !isEmpty(flattenedGroupedSortedManifestations) && (
          <MaterialCard
            propAndChildrenTemplate={materialCardTemplate}
            propAndChildrenInput={firstManifestation}
            colSizing={{ xs: 12 }}
          />
        )}
    </>
  );
};

export default Material;
