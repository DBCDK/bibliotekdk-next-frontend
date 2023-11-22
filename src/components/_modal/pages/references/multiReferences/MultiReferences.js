import Translate from "@/components/base/translate/Translate";
import Top from "../../base/top/Top";
import LinksList from "../LinksList";
import useBookmarks, {
  usePopulateBookmarks,
} from "@/components/hooks/useBookmarks";

/**
 * Modal that shows a collection of references that are missing edition
 * @returns
 */
export default function MultiReferences({ context }) {
  const { materials } = context;
  const materialKeysMissingEdition = materials.filter((material) => {
    if (material.materialId.startsWith("work-of")) return material.key;
  });
  const { data: materialsMissingEdition, isLoading } = usePopulateBookmarks(
    materialKeysMissingEdition
  );
  const { bookmarks } = useBookmarks();

  //in in materialKeysMissingEdition, find the corresponding materialtype from bookmarks
  // and return a dictionary that maps materialKeys to materialTypes
  //this is the type the user has chosen for the material
  const materialKeyToMaterialTypes = materialKeysMissingEdition.map(
    (material) => {
      const materialType = bookmarks.find(
        (bookmark) => bookmark.key === material.key
      ).materialType;
      if (materialType)
        return { materialKey: material.key, materialType: materialType };
    }
  );

  console.log("materialsMissingEdition", materialKeyToMaterialTypes);

  const children = null;
  const isPeriodicaLike = false;
  const isDigitalCopy = false;
  const isDeliveredByDigitalArticleService = false;
  return (
    <div className>
      <Top
        skeleton={isLoading}
        title={Translate({
          context: "multiReferences",
          label: "get-references",
          vars: [materials.length], //TODO take from context
        })}
      ></Top>
      {materialKeysMissingEdition.length > 0 &&
        !isLoading &&
        materialsMissingEdition.map((material) => {
          console.log("MATERIAL ", material);

          //NEXT: get the manifestation/s that match/es the chosen materialType

          const materialType = materialKeyToMaterialTypes.find(
            (e) => e.materialKey === material.key
          ).materialType;
          console.log("MAT TYPE ", materialType);

          const materialCardTemplate = (material) =>
            templateImageToLeft({
              material,
              singleManifestation,
              children, //TODO
              isPeriodicaLike,
              isDigitalCopy,
              isDeliveredByDigitalArticleService,
            });
          return <div key={material.workId}>{material.titles.main}</div>;
        })}
      <LinksList />
    </div>
  );
}
