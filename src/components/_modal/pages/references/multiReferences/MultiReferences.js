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
import MaterialCard from "@/components/base/materialcard/MaterialCard";
import { templateImageToLeft } from "@/components/base/materialcard/templates/templates";

export const CONTEXT = "multiReferences";

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

const SingleReference = ({ bookmarkInList, materialKeyToMaterialTypes }) => {
  const { data: materials, isLoading } = usePopulateBookmarks(bookmarkInList);

  const material = materials[0];
  const materialType = materialKeyToMaterialTypes.find(
    (e) => e?.materialKey === bookmarkInList[0].key
  )?.materialType;

  if (isLoading) return null;

  const materialCardTemplate = () =>
    templateImageToLeft({
      material: { ...material, materialType: materialType },
      singleManifestation: true,
      isPeriodicaLike: false, //we have filtered out periodicalike materials
      //isDigitalArticle doesnt matter, since we always show edition
    });

  return (
    <MaterialCard
      propAndChildrenTemplate={materialCardTemplate}
      propAndChildrenInput={{
        imageLeft: true,
        workId: material?.ownerWork?.workId,
        fullTitle: material?.titles?.full[0],
        image_src: material?.image?.url,
      }}
      colSizing={{ xs: 12 }}
    />
  );
};

const MissingReferencesList = ({
  bookmarksMissingEdition,
  numberMaterials,
  modal,
  materialKeyToMaterialTypes,
}) => {
  const { data: materialsMissingReferences, isLoading } = usePopulateBookmarks(
    bookmarksMissingEdition
  );

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

  if (isLoading) return null; //TODO loading state?
  return (
    <>
      <Text
        type="text3"
        className={cx(styles.missingEditionText, styles.container)}
      >
        {missingEditionText}
      </Text>
      {materialsMissingReferences.map((material) => (
        <Material
          key={material.key}
          material={material}
          materialKeyToMaterialTypes={materialKeyToMaterialTypes}
          modal={modal}
        />
      ))}
    </>
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

  const { bookmarks } = useBookmarks();

  const materialKeyToMaterialTypes = mapMaterialKeysToSelectedMaterialTypes({
    bookmarksMissingEdition: materials,
    bookmarks: bookmarks,
  });

  //TODO materialPids should come from a state when we update the missing pids
  const materialPids = materials
    .filter((material) => !material.materialId.startsWith("work-of"))
    .map((material) => material.materialId);

  const hasMissingReferences = bookmarksMissingEdition?.length > 0;

  const isSingleReference = materials.length === 1 && !hasMissingReferences;

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

  return (
    <div>
      <Top
        title={title}
        className={{
          top: cx(styles.container, styles.top),
        }}
      ></Top>
      {isSingleReference && (
        <SingleReference
          bookmarkInList={materials}
          bookmarks={bookmarks}
          materialKeyToMaterialTypes={materialKeyToMaterialTypes}
        />
      )}

      {hasMissingReferences && (
        <MissingReferencesList
          bookmarksMissingEdition={bookmarksMissingEdition}
          numberMaterials={numberMaterials}
          modal={modal}
          materialKeyToMaterialTypes={materialKeyToMaterialTypes}
        />
      )}

      <div
        className={cx(styles.container, {
          [styles.exportButtonsMobile]: !hasMissingReferences,
          [styles.paddingExportButtons]: isSingleReference,
        })}
      >
        {hasMissingReferences && (
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
