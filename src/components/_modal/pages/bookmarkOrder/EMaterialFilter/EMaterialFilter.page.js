import Text from "@/components/base/text";
import Top from "../../base/top/Top";
import Button from "@/components/base/button";
import { useEffect, useRef, useState } from "react";
import EMaterialAnalyzer from "./EMaterialAnalyzer";
import styles from "./EMaterialFilter.module.css";
import Title from "@/components/base/title";
import Translate from "@/components/base/translate";
import useBookmarks, {
  usePopulateBookmarksNew2,
} from "@/components/hooks/useBookmarks";
import { useModal } from "@/components/_modal/Modal";
import { constructMaterialType } from "@/lib/manifestationFactoryUtils";

const CONTEXT = "bookmark-order";

/**
 * Step 1 in the multiorder checkout flow
 * Filters all materials which can't be ordered due to it being e-material
 * Skips this step if nothing to filter
 */
const EMaterialFilter = ({ context, active }) => {
  const { bookmarks, createdAtSort, titleSort } = useBookmarks();
  const { materials: materialKeys, sortType, handleOrderFinished } = context;
  const { data: materialsData } = usePopulateBookmarksNew2(materialKeys);
  const [materials, setMaterials] = useState([]);
  const modal = useModal();
  const analyzeRef = useRef();
  const [materialsToFilter, setMaterialsToFilter] = useState();
  const [materialsToProceed, setMaterialsToProceed] = useState();
  const isLoading = !materialsToFilter || !materialsToProceed;

  useEffect(() => {
    const materials = materialsData.map((mat) => {
      const bookmark = bookmarks?.find((bm) => bm.key === mat.key);
      return {
        ...bookmark,
        ...mat,
      };
    });
    setMaterials(materials);
  }, [materialsData]);

  useEffect(() => {
    if (!active) {
      // On close, reset states to force rerender
      setMaterialsToFilter(null);
      setMaterialsToProceed(null);
      return;
    }
    if (!analyzeRef?.current) return;
    // Secure only running once
    if (!!materialsToFilter || !!materialsToProceed) return;
    if (materials.length !== materialKeys.length) return;

    const timer = setTimeout(() => {
      // Ensure that EMaterialAnalyzers are done rendering
      const elements = Array.from(analyzeRef.current.children);
      const filteredMaterials = elements
        .filter(
          (element) =>
            element.getAttribute("data-accessable-ematerial") === "true"
        )
        .map((element) =>
          materials.find(
            (mat) => mat.key === element.getAttribute("data-material-key")
          )
        );
      const toProceed = elements
        .filter(
          (element) =>
            element.getAttribute("data-accessable-ematerial") === "false"
        )
        .map((element) =>
          materials.find(
            (mat) => mat.key === element.getAttribute("data-material-key")
          )
        );

      let filteredMaterialsSorted;
      let toProceedSorted;
      if (sortType === "title") {
        filteredMaterialsSorted = titleSort(filteredMaterials); //pider instead of materials?
        toProceedSorted = titleSort(toProceed);
      } else if (sortType === "createdAt") {
        filteredMaterialsSorted = createdAtSort(filteredMaterials);
        toProceedSorted = createdAtSort(toProceed);
      }

      setMaterialsToFilter(filteredMaterialsSorted);
      setMaterialsToProceed(toProceedSorted);

      if (filteredMaterials.length === 0) {
        // Nothing to filter - Redirect directly
        modal.push("multiorder", {
          materials: toProceedSorted,
          closeModalOnBack: true,
          handleOrderFinished: handleOrderFinished,
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [active, analyzeRef.current, materials]);

  //TODO 2214
  // const createIds = (materials) => {
  //   return materials.map((mat) => {
  //     return {
  //       isSpecific: !!mat.pid,
  //       workId: mat.workId,
  //       pids: mat.pid ? [mat.pid] : mat.manifestations.map((man) => man.pid),
  //     };
  //   });
  // };

  const onNextClick = () => {
    modal.push("multiorder", {
      materials: materialsToProceed,
      handleOrderFinished: handleOrderFinished,
    });
  };

  const onBackClick = () => {
    modal.clear();
  };

  return (
    <div className={styles.eMaterialFilter}>
      <div ref={analyzeRef} className="visually-hidden">
        {/**
         * Workaround since hooks can't be called a dynamic amount of times.
         * This way we render a analyze component for each material & are able to reuse hooks.
         * Visually-hidden
         */}
        {materials.map((mat) => (
          <EMaterialAnalyzer material={mat} key={mat.key} />
        ))}
      </div>
      <Top
        skeleton={isLoading}
        title={Translate({
          context: CONTEXT,
          label: "efilter-title",
        })}
        titleTag="h2"
        className={{ top: styles.top }}
      />
      <Title
        skeleton={isLoading}
        tag="h3"
        type="title6"
        className={styles.subHeading}
        lines={1}
      >
        <Translate
          context={CONTEXT}
          label={
            materialsToFilter?.length === 1
              ? "efilter-subheading-singular"
              : "efilter-subheading"
          }
          vars={[materialsToFilter?.length]}
        />
      </Title>
      <ul className={styles.filterList}>
        {materialsToFilter?.map((mat) => (
          <li className={styles.filterItem} key={mat.key}>
            <Title tag="h4" type="text1">
              {mat.titles?.main?.[0]}
            </Title>
            <Text type="text2">
              {constructMaterialType(mat?.manifestations?.[0].materialTypes)}
            </Text>
          </li>
        ))}
      </ul>
      <Text
        skeleton={isLoading}
        className={styles.nextPageDescription}
        lines={1}
      >
        <Translate
          context={CONTEXT}
          label={
            materialsToProceed?.length === 0
              ? "efilter-back-text"
              : materialsToProceed?.length === 1
              ? "efilter-proceed-text-singular"
              : "efilter-proceed-text"
          }
          vars={[materialsToProceed?.length]}
        />
      </Text>

      <Button
        type="primary"
        size="large"
        skeleton={isLoading}
        onClick={materialsToProceed?.length === 0 ? onBackClick : onNextClick}
        className={styles.nextButton}
      >
        <Translate
          context={CONTEXT}
          label={
            materialsToProceed?.length === 0
              ? "efilter-back"
              : "efilter-proceed"
          }
        />
      </Button>
    </div>
  );
};
export default EMaterialFilter;
