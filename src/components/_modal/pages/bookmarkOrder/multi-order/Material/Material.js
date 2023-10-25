import { accessFactory } from "@/lib/accessFactoryUtils";
import { manifestationMaterialTypeFactory } from "@/lib/manifestationFactoryUtils";
import isEmpty from "lodash/isEmpty";
import MaterialCard from "@/components/base/materialcard/MaterialCard";
import { templateImageToLeft } from "@/components/base/materialcard/templates/templates";

const Material = ({ material }) => {
  const { manifestations } = material;

  //TODO remove check once huskeliste can handle specific editions
  if (!manifestations?.mostRelevant) return null;
  const { digitalCopyArray, isPeriodicaLikeArray } = accessFactory(
    manifestations?.mostRelevant
  );

  const isDigitalCopy = digitalCopyArray?.find((single) => single === true);
  //const isPhysicalCopy = physicalCopyArray?.find((single) => single === true);
  const isPeriodicaLike = isPeriodicaLikeArray?.find(
    (single) => single === true
  );

  if (isPeriodicaLike) {
    console.log("PERIODICA LIKE");
  }

  const children = null; //Check if we have article or not
  const { flattenedGroupedSortedManifestations } =
    manifestationMaterialTypeFactory(manifestations.mostRelevant);

  const materialCardTemplate = (/** @type {Object} */ material) =>
    templateImageToLeft({
      material,
      singleManifestation: flattenedGroupedSortedManifestations?.length > 1, //TODO: how do we know its a specific edition?
      children,
      isPeriodicaLike,
      isDigitalCopy,
    });

  const firstManifestation = flattenedGroupedSortedManifestations[0];
  return (
    <div>
      {flattenedGroupedSortedManifestations &&
        !isEmpty(flattenedGroupedSortedManifestations) && (
          <MaterialCard
            propAndChildrenTemplate={materialCardTemplate}
            propAndChildrenInput={firstManifestation}
            colSizing={{ xs: 12 }}
          />
        )}
    </div>
  );
};

export default Material;
