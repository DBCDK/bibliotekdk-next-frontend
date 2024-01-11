import Text from "@/components/base/text";
import Top from "../../base/top/Top";
import Button from "@/components/base/button";
import styles from "./EMaterialFilter.module.css";
import Title from "@/components/base/title";
import Translate from "@/components/base/translate";
import { useModal } from "@/components/_modal/Modal";
import { getMaterialTypeForPresentation } from "@/lib/manifestationFactoryUtils";
import useBookmarks, {
  usePopulateBookmarks,
} from "@/components/hooks/useBookmarks";
import { useEffect, useState } from "react";
import { mergeBookmarksWithPopulatedData } from "@/components/profile/bookmarks/bookmarks.utils";
const CONTEXT = "bookmark-order";
const SKELETON_ROW_AMOUNT = 3;

/**
 * Shows all the materials that are available online and therefor cannot be ordered
 * Skips this step if nothing to filter
 */
const EMaterialFilter = ({ context, active }) => {
  const {
    sortType,
    handleOrderFinished,
    bookmarksToOrder,
    bookmarksOnlineAvailable,
  } = context;

  const modal = useModal();
  const { createdAtSort, titleSort } = useBookmarks();
  const { data: populatedBookmarks, isLoading: isPopulating } =
    usePopulateBookmarks(bookmarksOnlineAvailable);

  const [isLoading, setIsLoading] = useState(
    !bookmarksOnlineAvailable || isPopulating
  );
  const [sortedMaterials, setSortedMaterials] = useState([]);

  useEffect(() => {
    setIsLoading(!bookmarksOnlineAvailable || isPopulating);
  }, [isPopulating]);

  useEffect(() => {
    if (!active) {
      setSortedMaterials([]);
      return;
    }
    if (isPopulating) return;

    const materials = mergeBookmarksWithPopulatedData(
      bookmarksOnlineAvailable,
      populatedBookmarks
    );

    const sortedList =
      sortType === "title" ? titleSort(materials) : createdAtSort(materials);

    setSortedMaterials(sortedList);
  }, [active, populatedBookmarks, sortType]);

  const onNextClick = () => {
    modal.push("multiorder", {
      sortType: sortType,
      bookmarksToOrder: bookmarksToOrder,
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
      {bookmarksOnlineAvailable?.length > 0 && (
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
              bookmarksOnlineAvailable?.length === 1
                ? "efilter-subheading-singular"
                : "efilter-subheading"
            }
            vars={[bookmarksOnlineAvailable?.length]}
          />
        </Title>
      )}
      {isLoading ? (
        [...Array(SKELETON_ROW_AMOUNT).keys()].map((_, i) => (
          <Text skeleton={true} key={"skeleton-row-" + i} />
        ))
      ) : (
        <ul className={styles.filterList}>
          {sortedMaterials?.map((mat) => (
            <li className={styles.filterItem} key={mat.key}>
              <Title tag="h4" type="text1">
                {mat.titles?.main?.[0]}
              </Title>
              <Text type="text2">
                {getMaterialTypeForPresentation(
                  mat?.manifestations?.[0]?.materialTypes
                )}
              </Text>
            </li>
          ))}
        </ul>
      )}

      <Text
        skeleton={isLoading}
        className={styles.nextPageDescription}
        lines={1}
      >
        <Translate
          context={CONTEXT}
          label={
            bookmarksToOrder?.length === 0
              ? "efilter-back-text"
              : bookmarksToOrder?.length === 1
              ? "efilter-proceed-text-singular"
              : "efilter-proceed-text"
          }
          vars={[bookmarksToOrder?.length]}
        />
      </Text>

      <Button
        type="primary"
        size="large"
        skeleton={isLoading}
        onClick={bookmarksToOrder?.length === 0 ? onBackClick : onNextClick}
        className={styles.nextButton}
        dataCy="multiorder-next-button"
      >
        <Translate
          context={CONTEXT}
          label={
            bookmarksToOrder?.length === 0 ? "efilter-back" : "efilter-proceed"
          }
        />
      </Button>
    </div>
  );
};
export default EMaterialFilter;
