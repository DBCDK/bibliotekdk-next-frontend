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
import { accessFactory } from "@/lib/accessFactoryUtils";
import { useEffect, useState } from "react";

export const CONTEXT = "multiReferences";

/**
 * Takes all materials that miss edition and finds maps their keys to their material types
 * @param {*} materialKeysMissingEdition
 * @param {*} bookmarks
 * @returns {Array} Array of objects with materialKey and materialType
 */
const mapMaterialKeysToSelectedMaterialTypes = ({
  materialKeysMissingEdition,
  bookmarks,
}) => {
  if (!materialKeysMissingEdition || !bookmarks) return [];
  return materialKeysMissingEdition.map((material) => {
    const materialType = bookmarks.find(
      (bookmark) => bookmark.key === material.key
    )?.materialType;
    if (materialType)
      return { materialKey: material.key, materialType: materialType };
  });
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
  const materialPids = materials
    .filter((material) => !material.materialId.startsWith("work-of"))
    .map((material) => material.materialId);
  const { data: materialsMissingEdition, isLoading } = usePopulateBookmarks(
    bookmarksMissingEdition
  );
  const { bookmarks } = useBookmarks();
  const [activeMaterialChoices, setActiveMaterialChoices] = useState(
    bookmarksMissingEdition
  );
  const [periodicaFiltered, setPeriodicaFiltered] = useState([]);

  const materialKeyToMaterialTypes = mapMaterialKeysToSelectedMaterialTypes({
    materialKeysMissingEdition: bookmarksMissingEdition,
    bookmarks,
  });

  const filteredManifestationsForMaterialType = (workData) => {
    // Filter only the selected material type
    const filteredManifestations = workData.manifestations.mostRelevant.filter(
      (mani) =>
        mani.materialTypes?.[0]?.materialTypeSpecific?.display?.toLowerCase() ===
        workData.materialType?.toLowerCase()
    );

    return {
      ...workData,
      manifestations: { mostRelevant: filteredManifestations },
    };
  };

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

      const manifestations = matchingData.manifestations.mostRelevant;

      // If 1 option, select it
      if (manifestations.length === 1) {
        const singleManifestation = manifestations[0];
        if (singleManifestation.workTypes?.[0] === "PERIODICA") {
          // Periodica - Filter from list
          newPeriodicaFiltered.push(singleManifestation);
          return null;
        }

        return {
          ...bookmark,
          chosenPid: singleManifestation.pid,
        };
      } else return bookmark;
    });

    setPeriodicaFiltered(newPeriodicaFiltered);
    setActiveMaterialChoices(newList);
  }, [modal.isVisible, isLoading]);

  // Filter all who user has chosen an edition
  const missingActionMaterials = materialsMissingEdition.filter(
    (_, i) => !activeMaterialChoices?.[i]?.chosenPid
  );

  const disableLinks = missingActionMaterials.length > 0;
  const showReferencesMissing = disableLinks && !isLoading;

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

  const onEditionPick = (pid, materialKey) => {
    modal.prev();
    const activeChoices = [...activeMaterialChoices];
    const index = activeChoices.findIndex((c) => c.key === materialKey);
    activeChoices[index] = { chosenPid: pid, ...activeChoices[index] };
    setActiveMaterialChoices([...activeChoices]); // Spread to copy object - rerenders since new object
  };

  const onActionClick = (material, materialType, materialKey) => {
    modal.push("editionPicker", {
      material: filteredManifestationsForMaterialType(material),
      materialType,
      onEditionPick,
      materialKey,
    });
  };

  return (
    <div>
      <Top
        skeleton={isLoading}
        title={title}
        className={{
          top: cx(styles.container, styles.top),
        }}
      />

      {periodicaFiltered.length > 0 && (
        <div className={styles.periodicaMessage}>
          <Text type="text1" className={styles.periodicaMessageTitle}>
            Tidsskrifter har et dataformat, der ikke kan hentes som referencer.
            Dvs. disse bliver ikke downloadet/eksporteret:
          </Text>
          <ul className={styles.periodicaList}>
            {periodicaFiltered.map((item) => (
              <li className={styles.periodicaListItem}>
                <Text type="text1">{item.titles?.full?.[0]}</Text>
                <Text type="text2">
                  {item.materialTypes?.[0]?.materialTypeSpecific?.display}
                </Text>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showReferencesMissing && (
        <Text
          type="text3"
          className={cx(styles.missingEditionText, styles.container)}
        >
          {missingEditionText}
        </Text>
      )}
      {showReferencesMissing &&
        missingActionMaterials.map((material) => (
          <Material
            key={material.key}
            materialKey={material.key}
            material={material}
            materialKeyToMaterialTypes={materialKeyToMaterialTypes}
            modal={modal}
            onActionClick={onActionClick}
          />
        ))}
      <div
        className={cx(styles.container, {
          [styles.exportButtons]: !showReferencesMissing,
        })}
      >
        {showReferencesMissing && (
          <Text type="text3" className={styles.chooseEditionText}>
            {Translate({
              context: CONTEXT,
              label: "choose-edition",
            })}
          </Text>
        )}
        <LinksList
          pids={[
            ...materialPids,
            ...activeMaterialChoices
              .filter((mat) => !!mat)
              .map((mat) => mat.chosenPid)
              .filter((mat) => !!mat),
          ]}
          disabled={disableLinks}
        />
      </div>
    </div>
  );
}
