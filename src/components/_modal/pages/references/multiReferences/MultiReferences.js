import Translate from "@/components/base/translate/Translate";
import Top from "../../base/top/Top";
import LinksList from "../LinksList";
import useBookmarks, {
  usePopulateBookmarks,
} from "@/components/hooks/useBookmarks";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "./MultiReferences.module.css";
import Text from "@/components/base/text";
import cx from "classnames";
import { useModal } from "@/components/_modal/Modal";
import Material from "./Material";
import { useEffect, useState } from "react";
import MaterialCard from "@/components/base/materialcard/MaterialCard";
import { templateImageToLeft } from "@/components/base/materialcard/templates/templates";
import Checkbox from "@/components/base/forms/checkbox";
import { manifestationMaterialTypeFactory } from "@/lib/manifestationFactoryUtils";

export const CONTEXT = "multiReferences";
const CHECKBOX_TRESHHOLD = 20;

/**
 * Takes all materials that miss edition and finds maps their keys to their material types
 * @param {*} bookmarksMissingEdition
 * @param {*} bookmarks
 * @returns {Array} Array of objects with materialKey and materialType
 */
const mapMaterialKeysToSelectedMaterialTypes = ({
  bookmarksMissingEdition,
  bookmarks,
}) => {
  if (!bookmarksMissingEdition || !bookmarks) return [];
  return bookmarksMissingEdition.map((material) => {
    const materialType = bookmarks.find(
      (bookmark) => bookmark.key === material.key
    )?.materialType;
    if (materialType)
      return { materialKey: material.key, materialType: materialType };
  });
};

const SingleReference = ({
  bookmarkInList,
  materialKeyToMaterialTypes,
  chosenPid,
}) => {
  const { data: materials, isLoading } = usePopulateBookmarks(bookmarkInList);
  const material = materials[0];
  const materialType = materialKeyToMaterialTypes.find(
    (e) => e?.materialKey === bookmarkInList[0].key
  )?.materialType;

  if (isLoading) return null;

  const materialCardTemplate = () =>
    templateImageToLeft({
      /**
       * If chosenPid, we override what we can with the manifestation data,
       * to get precise image and edition text etc
       */

      material: chosenPid
        ? {
            ...material,
            ...material?.manifestations?.find((mani) => mani.pid === chosenPid),
            materialType: materialType,
          }
        : { ...material, materialType: materialType },
      singleManifestation: true,
      isPeriodicaLike: false, //we have filtered out periodicalike materials
      //isDigitalArticle doesnt matter, since we always show edition
    });

  return (
    <MaterialCard
      propAndChildrenTemplate={materialCardTemplate}
      colSizing={{ xs: 12 }}
    />
  );
};

/**
 * Modal that shows a collection of references that are missing edition
 * @returns {React.JSX.Element}
 */
export default function MultiReferences({ context }) {
  const { materials } = context;
  const modal = useModal();

  const bookmarksMissingEdition = materials.filter((material) =>
    material.materialId.startsWith("work-of")
  );
  const { data: materialsMissingEdition, isLoading } = usePopulateBookmarks(
    bookmarksMissingEdition
  );
  const { bookmarks } = useBookmarks();
  const [activeMaterialChoices, setActiveMaterialChoices] = useState(
    bookmarksMissingEdition
  );

  const [periodicaFiltered, setPeriodicaFiltered] = useState([]);

  const materialKeyToMaterialTypes = mapMaterialKeysToSelectedMaterialTypes({
    bookmarksMissingEdition: materials,
    bookmarks: bookmarks,
  });

  const filteredManifestationsForMaterialType = (workData) => {
    if (workData.manifestations?.length === 1) {
      /**
       *  Only 1 manifestation, we pick it.
       * Some cases like article (online) we get 2 material types in materialTypeSpecific.
       * And here we bypass issues with double material types if they only have 1 manifestation anyway
       * This might be avoidable when we in the future upgrade bookmarks to use JED 1.1 and the CODE field in materialTypeSpecific
       */
      return workData;
    }
    // Filter only the selected material type //TODO BIBDK2021-2214
    const filteredManifestations = workData.manifestations.filter(
      (mani) =>
        mani.materialTypes?.[0]?.materialTypeSpecific?.display?.toLowerCase() ===
        workData.materialType?.toLowerCase()
    );

    return {
      ...workData,
      manifestations: filteredManifestations,
    };
  };

  // Filter all who user has chosen an edition
  const missingActionMaterials = materialsMissingEdition.filter(
    (_, i) =>
      !activeMaterialChoices?.[i]?.chosenPid &&
      !activeMaterialChoices?.[i]?.toFilter
  );

  const [hasAutoCheckbox, setHasAutoCheckbox] = useState(false); // Static state
  const isOnlyPeriodica = periodicaFiltered.length === materials.length;

  const withNewestPidsSelected = missingActionMaterials.filter((mat) => {
    const choice = activeMaterialChoices.find((o) => o.key === mat.key);
    if (!choice) return true;
    return !choice.newestPid;
  });
  const disableLinks = withNewestPidsSelected.length > 0 || isOnlyPeriodica;
  const hasMissingReferences = disableLinks && !isLoading;
  const isSingleReference =
    materials.length === 1 &&
    !hasMissingReferences &&
    periodicaFiltered.length !== 1;

  const materialPids = materials
    .filter((material) => !material.materialId.startsWith("work-of"))
    .map((material) => material.materialId);
  const isAutoCheckboxSelected =
    missingActionMaterials.length > CHECKBOX_TRESHHOLD;

  const numberMaterials = materials.length;
  const title =
    numberMaterials === 1
      ? Translate({
          context: CONTEXT,
          label: "get-reference",
        })
      : Translate({
          context: CONTEXT,
          label: "get-references",
          vars: [numberMaterials],
        });

  const missingEditionText =
    numberMaterials === 1
      ? Translate({
          context: CONTEXT,
          label: "missing-edition-singular",
        })
      : Translate({
          context: CONTEXT,
          label: "missing-edition",
          vars: [missingActionMaterials.length],
        });

  useEffect(() => {
    /**
     * Preselect edition if only 1 edition available for bookmark material type
     */

    if (isLoading) return;
    if (modal.isVisible === false) {
      // Reset
      setActiveMaterialChoices([]);
      return;
    }

    const filteredManifestations = materialsMissingEdition.map((item) =>
      filteredManifestationsForMaterialType(item)
    );
    const newPeriodicaFiltered = [];
    const newList = bookmarksMissingEdition.map((bookmark) => {
      const matchingData = filteredManifestations.find(
        (dataItem) => bookmark.key === dataItem.key
      );

      if (!matchingData) {
        return bookmark;
      }

      const manifestations = matchingData.manifestations;

      // If 1 option, select it
      if (manifestations.length === 1) {
        const singleManifestation = manifestations[0];
        if (singleManifestation.workTypes?.[0] === "PERIODICA") {
          // Periodica - Filter from list
          newPeriodicaFiltered.push(singleManifestation);
          return {
            ...bookmark,
            toFilter: true,
          };
        }

        return {
          ...bookmark,
          chosenPid: singleManifestation.pid,
        };
      } else return bookmark;
    });

    setHasAutoCheckbox(
      newList.filter((i) => !i.chosenPid).length > CHECKBOX_TRESHHOLD
    );
    setPeriodicaFiltered(newPeriodicaFiltered);
    setActiveMaterialChoices(newList);
  }, [modal.isVisible, isLoading]);

  const onEditionPick = (pid, materialKey) => {
    modal.prev();
    const activeChoices = activeMaterialChoices;
    const index = activeChoices.findIndex((c) => c.key === materialKey);
    activeChoices[index] = { chosenPid: pid, ...activeChoices[index] };
    setActiveMaterialChoices([...activeChoices]); // Spread to copy object - rerenders since new object
  };

  const onActionClick = (material, materialType, materialKey) => {
    modal.push("editionPicker", {
      material,
      materialType,
      onEditionPick,
      materialKey,
    });
  };

  const onDeleteClick = (key) => {
    const activeChoices = activeMaterialChoices;
    const index = activeChoices.findIndex((c) => c.key === key);
    activeChoices[index] = { toFilter: true, ...activeChoices[index] };
    setActiveMaterialChoices([...activeChoices]); // Spread to copy object - rerenders since new object
  };

  const onAutoAll = (e) => {
    if (e) {
      // Auto select newest editions
      const activeChoices = activeMaterialChoices;
      missingActionMaterials.forEach((item) => {
        const filteredManifestationsWorkData =
          filteredManifestationsForMaterialType(item);
        const manifestationsForMaterialType =
          filteredManifestationsWorkData?.manifestations;
        const { flattenedGroupedSortedManifestations } =
          manifestationMaterialTypeFactory(manifestationsForMaterialType);
        // Take newest manifestation pid
        const pidToSelect = flattenedGroupedSortedManifestations[0].pid;
        const index = activeChoices.findIndex((c) => c.key === item.key);
        activeChoices[index] = {
          ...activeChoices[index],
          newestPid: pidToSelect,
        };
      });
      setActiveMaterialChoices([...activeChoices]); // Spread to copy object - rerenders since new object
    } else {
      // Deselect auto selection
      const activeChoices = activeMaterialChoices.map((item) => ({
        ...item,
        newestPid: null,
      }));
      setActiveMaterialChoices([...activeChoices]); // Spread to copy object - rerenders since new object
    }
  };
  return (
    <div>
      <Top
        title={title}
        className={{
          top: cx(styles.container, styles.top),
        }}
      />

      {periodicaFiltered.length > 0 && (
        <div className={styles.periodicaMessage}>
          <Text type="text1" className={styles.periodicaMessageTitle}>
            <Translate context="multiReferences" label="periodicaMessage" />
          </Text>
          <ul className={styles.periodicaList}>
            {periodicaFiltered.map((item) => (
              <li className={styles.periodicaListItem} key={item.pid}>
                <Text type="text1">{item.titles?.full?.[0]}</Text>
                <Text type="text2" className={styles.periodicaMatType}>
                  {item.materialTypes?.[0]?.materialTypeSpecific?.display}
                </Text>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isSingleReference && (
        <SingleReference
          bookmarkInList={materials}
          bookmarks={bookmarks}
          materialKeyToMaterialTypes={materialKeyToMaterialTypes}
          chosenPid={activeMaterialChoices?.[0]?.chosenPid}
        />
      )}

      {hasAutoCheckbox && (
        <div className={styles.autoCheckbox}>
          <Text type="text1">
            <Translate
              context={CONTEXT}
              label="missing-materials-too-many"
              vars={[missingActionMaterials.length]}
            />
          </Text>
          <div className={styles.checkboxRow}>
            <Checkbox className={styles.checkbox} onChange={onAutoAll} />
            <Text type="text2">
              <Translate context={CONTEXT} label="choose-automatically" />
            </Text>
          </div>
        </div>
      )}

      {hasMissingReferences && !hasAutoCheckbox && (
        <>
          <Text
            type="text3"
            className={cx(styles.missingEditionText, styles.container)}
          >
            {missingEditionText}
          </Text>
          {missingActionMaterials
            .filter(
              // Filter periodica materials
              (mat) =>
                !activeMaterialChoices.find((o) => o.key === mat.key)?.toFilter
            )
            .map((material) => (
              <Material
                key={material.key}
                materialKey={material.key}
                material={material}
                modal={modal}
                onActionClick={onActionClick}
                onDeleteClick={onDeleteClick}
                hideDelete={materials.length === 1}
              />
            ))}
        </>
      )}

      <div
        className={cx(styles.container, {
          [styles.exportButtonsMobile]: !hasMissingReferences,
          [styles.paddingExportButtons]:
            isAutoCheckboxSelected ||
            isSingleReference ||
            (!hasMissingReferences &&
              periodicaFiltered.length > 0 &&
              !isOnlyPeriodica),
        })}
      >
        {hasMissingReferences && !isAutoCheckboxSelected && (
          <Text type="text3" className={styles.chooseEditionText}>
            {Translate({
              context: CONTEXT,
              label: "choose-edition",
            })}
          </Text>
        )}
        {isOnlyPeriodica && (
          <Text type="text3" className={styles.chooseEditionText}>
            {Translate({
              context: CONTEXT,
              label: "material-not-supported",
            })}
          </Text>
        )}
        <LinksList
          pids={[
            ...materialPids,
            ...activeMaterialChoices
              .filter((mat) => !mat.toFilter) // Filter periodica materials
              .map((mat) => mat.chosenPid || mat.newestPid) // Remap to pid list
              .filter((mat) => !!mat), // remove null pids
          ]}
          disabled={disableLinks}
        />
      </div>

      {hasAutoCheckbox && (
        <div className={styles.infoMessage}>
          <Text type="text1" tag="span">
            <Translate context={CONTEXT} label="info-label-bold" />
          </Text>
          <Text type="text2" tag="span">
            <Translate context={CONTEXT} label="info-label" />
          </Text>
        </div>
      )}
    </div>
  );
}
