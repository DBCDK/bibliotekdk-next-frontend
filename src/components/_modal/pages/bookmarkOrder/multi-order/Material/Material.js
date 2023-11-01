import { accessFactory } from "@/lib/accessFactoryUtils";
import {
  manifestationMaterialTypeFactory,
  formatMaterialTypesFromUrl,
} from "@/lib/manifestationFactoryUtils";
import isEmpty from "lodash/isEmpty";
import MaterialCard from "@/components/base/materialcard/MaterialCard";
import { templateImageToLeft } from "@/components/base/materialcard/templates/templates";
import ChoosePeriodicaCopyRow from "@/components/_modal/pages/edition/choosePeriodicaCopyRow/ChoosePeriodicaCopyRow.js";
import { translateArticleType } from "@/components/_modal/pages/edition/utils.js";
import { inferAccessTypes } from "@/components/_modal/pages/edition/utils.js";
import useUser from "@/components/hooks/useUser";
import { useModal } from "@/components/_modal/Modal";
import { AccessEnum } from "@/lib/enums";
import {
  BackgroundColorEnum,
  findBackgroundColor,
} from "@/components/base/materialcard/materialCard.utils";
import { useData } from "@/lib/api/api";
import * as branchesFragments from "@/lib/api/branches.fragments";
import { useEffect, useState } from "react";
import styles from "./Material.module.css";
import Translate from "@/components/base/translate";
import Text from "@/components/base/text";
import IconButton from "@/components/base/iconButton";
import { getManifestationWithoutDefaultCover } from "@/components/work/overview/covercarousel/utils";

/**
 * At this point, we have manifestation of all the different material types
 * Here we filter for the materialtype the user has selected
 * If we have compound material types (such as "den grimme ælling Bog / Lydoptagelse (cd)"), we have to split them up
 * @param {Object[]} mostRelevant
 * @param {String} materialType
 * @returns {Object[]}
 */
const filterForRelevantMaterialTypes = (mostRelevant, materialType) => {
  if (!mostRelevant || !materialType) return [];

  const materialTypes = formatMaterialTypesFromUrl(materialType);
  const { flattenGroupedSortedManifestationsByType } =
    manifestationMaterialTypeFactory(mostRelevant);
  return flattenGroupedSortedManifestationsByType(materialTypes);
};

/**
 * Is missing article implementation
 * @param {Object} material
 * @param {Function} setMaterialsToOrder
 * @param {Object} context
 * @returns {React.JSX.Element}
 */
const Material = ({ material, setMaterialsToOrder, context }) => {
  const isSpecificEdition = !!material?.pid;
  const modal = useModal();
  const [orderPossible, setOrderPossible] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState(
    BackgroundColorEnum.NEUTRAL
  );

  const { loanerInfo } = useUser();

  const manifestations = isSpecificEdition
    ? [material]
    : filterForRelevantMaterialTypes(
        material?.manifestations.mostRelevant,
        material?.materialType
      );

  const pids = isSpecificEdition
    ? [material?.pid]
    : manifestations.map((m) => m.pid) || [];

  const { data: orderPolicyData, isLoading: orderPolicyIsLoading } = useData(
    pids &&
      pids.length > 0 &&
      branchesFragments.checkOrderPolicy({
        pids: pids,
        branchId: loanerInfo.pickupBranch,
      })
  );
  useEffect(() => {
    if (orderPolicyData && orderPolicyData.branches) {
      setOrderPossible(
        orderPolicyData.branches.result[0].orderPolicy.orderPossible
      );
    }
    setBackgroundColor(
      findBackgroundColor({
        isPeriodicaLike,
        periodicaForm: context?.periodicaForm,
        notAvailableAtLibrary: orderPolicyIsLoading
          ? false //if we dont have data yet, we dont want red background
          : !orderPolicyData?.branches?.result?.[0]?.orderPolicy?.orderPossible,
      })
    );
  }, [orderPolicyData, orderPolicyIsLoading, context?.periodicaForm]);

  const { allEnrichedAccesses: accesses } = accessFactory(manifestations);

  let children = null;

  const inferredAccessTypes = inferAccessTypes(
    context?.periodicaForm,
    loanerInfo.pickupBranch,
    manifestations
  );

  const {
    availableAsDigitalCopy,
    isArticleRequest,
    isDigitalCopy,
    isPeriodicaLike,
  } = inferredAccessTypes;

  const deleteBookmarkFromOrderList = (bookmarkKey) => {
    setMaterialsToOrder((prev) => prev.filter((m) => m.key !== bookmarkKey));
  };

  if (isPeriodicaLike) {
    const articleTypeTranslation = translateArticleType({
      isDigitalCopy,
      availableAsDigitalCopy,
      selectedAccesses: accesses[0], //take first access, since it has highest priority
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

  if (!orderPossible) {
    children = (
      <>
        <Text className={styles.orderNotPossible} type="text4">
          {Translate({
            context: "materialcard",
            label: "order-not-possible",
          })}
        </Text>
        <IconButton onClick={() => deleteBookmarkFromOrderList(material.key)}>
          {Translate({
            context: "bookmark",
            label: "remove",
          })}
        </IconButton>
      </>
    );
  }

  const isDeliveredByDigitalArticleService =
    availableAsDigitalCopy &&
    accesses[0]?.__typename === AccessEnum.DIGITAL_ARTICLE_SERVICE; //take first access, since it has highest priority

  const { flattenedGroupedSortedManifestations } =
    manifestationMaterialTypeFactory(manifestations);

  const materialCardTemplate = (/** @type {Object} */ material) =>
    templateImageToLeft({
      material,
      singleManifestation: isSpecificEdition,
      children,
      isPeriodicaLike,
      isDigitalCopy,
      isDeliveredByDigitalArticleService,
      backgroundColor,
    });

  // If we have manifestations with cover, take the first one
  const manifestationsWithCover = getManifestationWithoutDefaultCover(
    flattenedGroupedSortedManifestations
  );

  // If no cover found, take the first manifestation in the array
  const firstManifestation = !isEmpty(manifestationsWithCover)
    ? manifestationsWithCover[0]
    : flattenedGroupedSortedManifestations[0];

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
