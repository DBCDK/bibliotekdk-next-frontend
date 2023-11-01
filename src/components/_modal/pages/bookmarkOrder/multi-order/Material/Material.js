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
import useBookmarks from "@/components/hooks/useBookmarks";

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
  // Check if the string contains " / "
  const splitString = materialType.split(" / ");
  let materialTypes;
  if (splitString.length > 1) {
    materialTypes = splitString.map((str) => str.toLowerCase());
  } else {
    materialTypes = [materialType.toLowerCase()];
  }
  const { flattenGroupedSortedManifestationsByType } =
    manifestationMaterialTypeFactory(mostRelevant);
  return flattenGroupedSortedManifestationsByType(materialTypes);
};

/**
 * Is missing article implementation
 * @param {Object} material
 * @param {Object} context
 * @returns {React.JSX.Element}
 */
const Material = ({ material, setMaterialsToShow, context }) => {
  const isSpecificEdition = !!material?.pid;
  const modal = useModal();
  const { deleteBookmarks } = useBookmarks();
  const [orderPossible, setOrderPossible] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState(
    BackgroundColorEnum.NEUTRAL
  );

  const { loanerInfo } = useUser();

  const manifestation = isSpecificEdition
    ? [material]
    : filterForRelevantMaterialTypes(
        material?.manifestations.mostRelevant,
        material?.materialType
      );

  const pids = isSpecificEdition
    ? [material?.pid]
    : manifestation.map((m) => m.pid) || [];

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

  const accesses = manifestation?.[0]?.access; //@TODO should i check all manifestations accesses here?
  const isDigitalCopy = checkDigitalCopy(accesses)?.[0];
  const isPeriodicaLike = getAreAccessesPeriodicaLike(manifestation)?.[0];

  let children = null;

  const inferredAccessTypes = inferAccessTypes(
    context?.periodicaForm,
    loanerInfo.pickupBranch,
    manifestation
  );

  const { availableAsDigitalCopy, isArticleRequest } = inferredAccessTypes;

  /**
   * Removes a bookmark from data base and from the list materialsToShow to show
   * materialsToShow is a copy of the acutal bookmarks and
   * used to trigger rerender of modal
   * @param {String} bookmarkId
   * @param {String} bookmarkKey
   */
  const deleteBookmark = (bookmarkId, bookmarkKey) => {
    deleteBookmarks([{ bookmarkId, key: bookmarkKey }]);
    setMaterialsToShow((prev) => prev.filter((m) => m.key !== bookmarkKey));
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
        <IconButton
          onClick={() => deleteBookmark(material.bookmarkId, material.key)}
        >
          {Translate({
            context: "bookmark",
            label: "remove",
          })}
        </IconButton>
      </>
    );
  }

  const isDeliveredByDigitalArticleService =
    isDigitalCopy &&
    availableAsDigitalCopy &&
    accesses[0]?.__typename !== AccessEnum.INTER_LIBRARY_LOAN; //take first access, since it has highest priority

  const { flattenedGroupedSortedManifestations } =
    manifestationMaterialTypeFactory(manifestation);

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

  const firstMoreInfoManifestation = flattenedGroupedSortedManifestations.find(
    (manifestation) => manifestation.cover.detail.startsWith("https://moreinfo")
  );

  // If none found, take the first manifestation in the array
  const firstManifestation =
    firstMoreInfoManifestation || flattenedGroupedSortedManifestations[0];

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
