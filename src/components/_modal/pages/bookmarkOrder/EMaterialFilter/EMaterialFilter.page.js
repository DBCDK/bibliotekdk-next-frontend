import Text from "@/components/base/text";
import Top from "../../base/top/Top";
import Button from "@/components/base/button";
import { useEffect, useState } from "react";
import styles from "./EMaterialFilter.module.css";
import Title from "@/components/base/title";
import Translate from "@/components/base/translate";
import useBookmarks, {
  usePopulateBookmarks,
} from "@/components/hooks/useBookmarks";
import { useModal } from "@/components/_modal/Modal";
import { getMaterialTypeForPresentation } from "@/lib/manifestationFactoryUtils";

const CONTEXT = "bookmark-order";

/**
 * Step 1 in the multiorder checkout flow
 * Filters all materials which can't be ordered due to it being e-material
 * Skips this step if nothing to filter
 */
const EMaterialFilter = ({ context, active }) => {
  const { bookmarks: allBookmarks, createdAtSort, titleSort } = useBookmarks();
  const {
    sortType,
    handleOrderFinished,
    materialsToOrder,
    materialsOnlineAvailable,
  } = context;
  const { data: materialsToProceedData } =
    usePopulateBookmarks(materialsToOrder);
  const { data: materialsOnlineAvailableData } = usePopulateBookmarks(
    materialsOnlineAvailable
  );

  const modal = useModal();
  const [materialsToFilter, setMaterialsToFilter] = useState();
  const [materialsToProceed, setMaterialsToProceed] = useState();
  const isLoading = !materialsToFilter || !materialsToProceedData;

  //console.log("sTUF ", materialsToOrder, materialsOnlineAvailable);

  //find materials that can be phisically ordered
  useEffect(() => {
    if (!active) {
      // On close, reset states to force rerender
      setMaterialsToProceed(null);
      return;
    }
    const materials = materialsToProceedData.map((mat) => {
      const bookmark = allBookmarks?.find((bm) => bm.key === mat.key);
      return {
        ...bookmark,
        ...mat,
      };
    });
    let filteredMaterialsSorted = [];

    if (sortType === "title") {
      filteredMaterialsSorted = titleSort(materials); //pider instead of materials?
    } else {
      filteredMaterialsSorted = createdAtSort(materials);
    }
    setMaterialsToProceed(filteredMaterialsSorted);
  }, [active, materialsToProceedData]);

  //find online materials that should not be ordered
  useEffect(() => {
    if (!active) {
      // On close, reset states to force rerender
      setMaterialsToFilter(null);
      return;
    }
    const materials = materialsOnlineAvailableData.map((mat) => {
      const bookmark = allBookmarks?.find((bm) => bm.key === mat.key);
      return {
        ...bookmark,
        ...mat,
      };
    });
    let filteredMaterialsSorted = [];
    if (sortType === "title") {
      filteredMaterialsSorted = titleSort(materials);
    } else {
      filteredMaterialsSorted = createdAtSort(materials);
    }
    setMaterialsToFilter(filteredMaterialsSorted);
    if (filteredMaterialsSorted.length === 0) {
      // Nothing to filter - Redirect directly
      modal.push("multiorder", {
        materials: materialsToProceed,
        closeModalOnBack: true,
        handleOrderFinished: handleOrderFinished,
      });
    }
  }, [active, materialsOnlineAvailableData]);

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
              {getMaterialTypeForPresentation(
                mat?.manifestations?.[0].materialTypes
              )}
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
            materialsToProceedData?.length === 0
              ? "efilter-back-text"
              : materialsToProceedData?.length === 1
              ? "efilter-proceed-text-singular"
              : "efilter-proceed-text"
          }
          vars={[materialsToProceedData?.length]}
        />
      </Text>

      <Button
        type="primary"
        size="large"
        skeleton={isLoading}
        onClick={
          materialsToProceedData?.length === 0 ? onBackClick : onNextClick
        }
        className={styles.nextButton}
      >
        <Translate
          context={CONTEXT}
          label={
            materialsToProceedData?.length === 0
              ? "efilter-back"
              : "efilter-proceed"
          }
        />
      </Button>
    </div>
  );
};
export default EMaterialFilter;
