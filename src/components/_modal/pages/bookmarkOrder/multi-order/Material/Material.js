import {
  getAreAccessesPeriodicaLike,
  checkDigitalCopy,
} from "@/lib/accessFactoryUtils";
import { manifestationMaterialTypeFactory } from "@/lib/manifestationFactoryUtils";
import isEmpty from "lodash/isEmpty";
import MaterialCard from "@/components/base/materialcard/MaterialCard";
import { templateImageToLeft } from "@/components/base/materialcard/templates/templates";
import ChoosePeriodicaCopyRow from "@/components/_modal/pages/edition/choosePeriodicaCopyRow/ChoosePeriodicaCopyRow.js";
import { translateArticleType } from "@/components/_modal/pages/edition/utils.js";
import { inferAccessTypes } from "@/components/_modal/pages/edition/utils.js";
import useUser from "@/components/hooks/useUser";
import { useModal } from "@/components/_modal/Modal";

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
 * @param {Object} context
 * @returns {React.JSX.Element}
 */
const Material = ({ material, context }) => {
  const isSpecificEdition = !!material?.pid;
  const modal = useModal();

  const { loanerInfo } = useUser();

  const manifestation = isSpecificEdition
    ? [material]
    : filterForRelevantMaterialTypes(
        material?.manifestations.mostRelevant,
        material?.materialType
      );

  const isDigitalCopy = checkDigitalCopy(manifestation)?.[0];
  const isPeriodicaLike = getAreAccessesPeriodicaLike(manifestation)?.[0];

  let children = null;

  if (isPeriodicaLike) {
    const inferredAccessTypes = inferAccessTypes(
      context?.periodicaForm,
      loanerInfo.pickupBranch,
      [manifestation]
    );

    const { availableAsDigitalCopy, isArticleRequest } = inferredAccessTypes;

    const articleTypeTranslation = translateArticleType({
      isDigitalCopy,
      availableAsDigitalCopy,
      selectedAccesses: context?.selectedAccesses,
      isArticleRequest,
      periodicaForm: context?.periodicaForm,
    });
    children = (
      <ChoosePeriodicaCopyRow
        periodicaForm={context?.periodicaForm}
        modal={modal}
        articleTypeTranslation={articleTypeTranslation}
      />
    );
  }

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
    flattenedGroupedSortedManifestations &&
    !isEmpty(flattenedGroupedSortedManifestations) && (
      <MaterialCard
        propAndChildrenTemplate={materialCardTemplate}
        propAndChildrenInput={firstManifestation}
        colSizing={{ xs: 12 }}
      />
    )
  );
};

export default Material;
