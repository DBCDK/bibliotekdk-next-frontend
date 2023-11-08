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
  StatusEnum,
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
import {
  createOrderKey,
  pidHasAlreadyBeenOrdered,
} from "../../../order/utils/order.utils";

/**
 * At this point, we have manifestation of all the different material types
 * Here we filter for the materialtype the user has selected
 * If we have compound material types (such as "den grimme ælling Bog / Lydoptagelse (cd)"), we have to split them up
 * @param {Object[]} mostRelevant
 * @param {String} materialType
 * @returns {Object[]}
 */
export const filterForRelevantMaterialTypes = (mostRelevant, materialType) => {
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
 * @param {Object} periodicaForms
 * @returns {React.JSX.Element}
 */
const Material = ({
  material,
  setMaterialsToOrder,
  periodicaForms,
  backgroundColorOverride = BackgroundColorEnum.NEUTRAL,
}) => {
  //@TODO get manifestations in same manner for both edition and works via useData
  const isSpecificEdition = !!material?.pid;
  const modal = useModal();
  const [orderPossible, setOrderPossible] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState(
    backgroundColorOverride
  );

  const { loanerInfo } = useUser();
  const periodicaForm = periodicaForms?.[material.key];

  const manifestations = isSpecificEdition
    ? [material]
    : filterForRelevantMaterialTypes(
        material?.manifestations.mostRelevant,
        material?.materialType
      );

  const pids = isSpecificEdition
    ? [material?.pid]
    : manifestations.map((m) => m.pid) || [];

  const oderKey = createOrderKey(pids);
  const alreadyOrdered = pidHasAlreadyBeenOrdered(oderKey);

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
    if (backgroundColorOverride !== BackgroundColorEnum.NEUTRAL) return; // If we override, dont reset background

    setBackgroundColor(
      findBackgroundColor({
        isPeriodicaLike,
        hasPeriodicaForm: !!periodicaForm,
        notAvailableAtLibrary: orderPolicyIsLoading
          ? false //if we dont have data yet, we dont want red background
          : !orderPolicyData?.branches?.result?.[0]?.orderPolicy?.orderPossible,
      })
    );
  }, [orderPolicyData, orderPolicyIsLoading, periodicaForm]);

  const { allEnrichedAccesses: accesses } = accessFactory(manifestations);

  const inferredAccessTypes = inferAccessTypes(
    periodicaForm,
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

  const articleTypeTranslation = translateArticleType({
    isDigitalCopy,
    availableAsDigitalCopy,
    selectedAccesses: accesses[0], //take first access, since it has highest priority
    isArticleRequest,
    hasPeriodicaForm: !!periodicaForm,
  });

  const children = [];

  if (isPeriodicaLike) {
    children.push(
      <ChoosePeriodicaCopyRow
        key={material.key}
        multiOrderPeriodicaForms={periodicaForms}
        materialKey={material.key}
        modal={modal}
        articleTypeTranslation={articleTypeTranslation}
      />
    );
  }

  if (backgroundColorOverride === BackgroundColorEnum.RED) {
    children.push(
      <Text type="text4" className={styles.errorLabel}>
        <Translate context="materialcard" label="error-ordering" />
      </Text>
    );

    if (!orderPossible) {
      children.push(
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
      hideEditionText: backgroundColorOverride === BackgroundColorEnum.RED,
    });

  // If we have manifestations with cover, take the first one
  const manifestationsWithCover = getManifestationWithoutDefaultCover(
    flattenedGroupedSortedManifestations
  );

  // If no cover found, take the first manifestation in the array
  const firstManifestation = !isEmpty(manifestationsWithCover)
    ? manifestationsWithCover[0]
    : flattenedGroupedSortedManifestations[0];

  const getStatus = () => {
    switch (backgroundColor) {
      case BackgroundColorEnum.RED:
        return StatusEnum.NOT_AVAILABLE;
      case BackgroundColorEnum.YELLOW:
        return StatusEnum.NEEDS_EDITION;
      case BackgroundColorEnum.NEUTRAL:
        if (isDeliveredByDigitalArticleService) return StatusEnum.DIGITAL;
        else return StatusEnum.NONE;
      default:
        return StatusEnum.NONE;
    }
  };

  const rootProps = {
    "data-status": getStatus(),
    "data-material-key": material.key,
  };

  return (
    flattenedGroupedSortedManifestations &&
    !isEmpty(flattenedGroupedSortedManifestations) && (
      <MaterialCard
        propAndChildrenTemplate={materialCardTemplate}
        propAndChildrenInput={firstManifestation}
        colSizing={{ xs: 12 }}
        rootProps={rootProps}
      />
    )
  );
};

export default Material;
