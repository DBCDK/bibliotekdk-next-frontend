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

  const materialKeyToMaterialTypes = mapMaterialKeysToSelectedMaterialTypes({
    materialKeysMissingEdition: bookmarksMissingEdition,
    bookmarks,
  });

  const showReferencesMissing =
    bookmarksMissingEdition.length > 0 && !isLoading;

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
          vars: [bookmarksMissingEdition.length],
        });

  const onActionClick = (material) => {
    modal.push("editionPicker", {material: material});
  } 

  return (
    <div>
      <Top
        skeleton={isLoading}
        title={title}
        className={{
          top: cx(styles.container, styles.top),
        }}
      />

      {showReferencesMissing && (
        <Text
          type="text3"
          className={cx(styles.missingEditionText, styles.container)}
        >
          {missingEditionText}
        </Text>
      )}
      {showReferencesMissing &&
        materialsMissingEdition.map((material) => (
          <Material
            key={material.key}
            material={material}
            materialKeyToMaterialTypes={materialKeyToMaterialTypes}
            modal={modal}
            onActionClick={() => onActionClick(material)}
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
          pids={materialPids}
          disabled={bookmarksMissingEdition?.length > 0}
        />
      </div>
    </div>
  );
}
