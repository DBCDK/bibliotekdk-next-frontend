import useBookmarks, {
  usePopulateBookmarks,
} from "@/components/hooks/useBookmarks";
import styles from "./Bookmark.module.css";
import Text from "@/components/base/text";
import Button from "@/components/base/button";
import MaterialRow from "../materialRow/MaterialRow";
import IconButton from "@/components/base/iconButton";
import {
  useEffect,
  useRef,
  forwardRef,
  useState,
  useImperativeHandle,
} from "react";
import { Checkbox } from "@/components/base/forms/checkbox/Checkbox";
import ProfileLayout from "../profileLayout/ProfileLayout";
import Translate from "@/components/base/translate";
import MenuDropdown from "@/components/base/dropdown/menuDropdown/MenuDropdown";
import useBreakpoint from "@/components/hooks/useBreakpoint";
import List from "@/components/base/forms/list";
import Pagination from "@/components/search/pagination/Pagination";
import { createEditionText } from "@/components/work/details/utils/details.utils";
import { useModal } from "@/components/_modal";
import Skeleton from "@/components/base/skeleton/Skeleton";
import { openLoginModal } from "@/components/_modal/pages/login/utils";
import useAuthentication from "@/components/hooks/user/useAuthentication";
import { getMaterialTypeForPresentation } from "@/lib/manifestationFactoryUtils";
import { getSessionStorageItem, setSessionStorageItem } from "@/lib/utils";
import { useAnalyzeMaterial } from "@/components/hooks/useAnalyzeMaterial";

const CONTEXT = "bookmark";
const ORDER_TRESHHOLD = 25;
const MENUITEMS = ["Bestil flere", "Hent referencer", "Fjern flere"];
const sortByItems = [
  { label: "latestAdded", key: "createdAt" },
  { label: "alphabeticalOrder", key: "title" },
];

/**
 *
 * Radio buttons to choose how to sort Bookmarks
 * @returns
 */
const SortButtons = ({ sortByItems, setSortByValue, sortByValue }) => {
  return (
    <div className={styles.sortingContainer}>
      {sortByItems.map(({ label, key }) => (
        <List.Radio
          className={styles.sortingItem}
          key={key}
          selected={sortByValue === key}
          onSelect={() => setSortByValue(key)}
        >
          <Text type="text3" tag="span">
            {Translate({ context: "profile", label: label })}
          </Text>
        </List.Radio>
      ))}
    </div>
  );
};

const containsIds = (ids, key) => {
  if (!ids || !key) return false;
  if (!Array.isArray(ids)) return ids === key;
  const x = ids.findIndex((id) => {
    return id === key;
  });
  return x > -1;
};

const seperateOnlineAndPhysical = ({ refs, checkboxList }) => {
  const materialsOnlineAvailable = [];
  const bookmarksToOrder = [];
  refs.forEach((item) => {
    if (item.isAccessibleOnline) {
      const match = checkboxList.find((bm) => bm.key === item.bookmarkKey);
      match ? materialsOnlineAvailable.push(match) : "";
    } else {
      const match = checkboxList.find((bm) => bm.key === item.bookmarkKey);
      match ? bookmarksToOrder.push(match) : "";
    }
  });
  return { materialsOnlineAvailable, bookmarksToOrder };
};

// eslint-disable-next-line react/display-name
const AnalyseItemAvailability = forwardRef(({ bookmark, bookmarkKey }, ref) => {
  const { pid, workId, materialId, manifestations } = bookmark;
  const isAccessibleOnline = useAnalyzeMaterial({
    manifestations,
    pid,
    workId,
    key: materialId,
  });

  useImperativeHandle(
    ref,
    () => {
      return {
        isAccessibleOnline,
        bookmarkKey,
      };
    },
    [isAccessibleOnline]
  );
});

const BookmarkPage = () => {
  const itemsRef = useRef([]);
  const {
    bookmarks: allBookmarks,
    paginatedBookmarks: bookmarksData,
    setSortBy,
    deleteBookmarks,
    currentPage,
    totalPages,
    setCurrentPage,
    count,
    isLoading: bookmarsDataLoading,
  } = useBookmarks();
  const { data: populatedBookmarks, isLoading: isPopulateLoading } =
    usePopulateBookmarks(bookmarksData);
  const [activeStickyButton, setActiveStickyButton] = useState(null);
  const breakpoint = useBreakpoint();
  const [sortByValue, setSortByValue] = useState(null);
  const isMobile = breakpoint === "sm" || breakpoint === "xs";
  const [checkboxList, setCheckboxList] = useState([]);
  const scrollToElement = useRef(null);
  const { isAuthenticated } = useAuthentication();
  const modal = useModal();
  const [successfullyCreatedIds, setSuccessfullyCreatedIds] = useState([]);
  const [failureAtCreationIds, setFailureAtCreationIds] = useState([]);
  /**
   * Callback that marks materials as successfully created/failed in bookmarklist
   * when we close the receipt
   * @param {String[]} successfullyCreated
   * @param {String[]} failedAtCreation
   */
  function handleOrderFinished(successfullyCreated, failedAtCreation) {
    setCheckboxList([]);
    setSuccessfullyCreatedIds((prev) => [...prev, ...successfullyCreated]);
    setFailureAtCreationIds((prev) => [...prev, ...failedAtCreation]);
  }

  useEffect(() => {
    setSortBy(sortByValue);
  }, [sortByValue]);

  useEffect(() => {
    let savedValue = getSessionStorageItem("sortByValue");
    //if there is no saved values in sessionstorage, use createdAt sorting as default
    setSortByValue(savedValue || sortByItems[0].key);
  }, []);

  //remove dead reference when we toggle checkboxes or select all
  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, checkboxList.length);
  }, [checkboxList]);

  const onToggleCheckbox = (key) => {
    const index = checkboxList.findIndex((item) => item.key === key);
    const exists = index > -1;
    const newList = [...checkboxList]; // Force object copy - to tell react that this is a new state & update

    if (exists) {
      // Delete
      newList.splice(index, 1);
    } else {
      const bookmarkData = populatedBookmarks.find((bm) => bm.key === key);
      // Add
      newList.push({
        ...bookmarkData,
        key: key,
        materialId: bookmarkData.materialId,
        workId: bookmarkData.workId,
        materialType: bookmarkData.materialType,
        bookmarkId: bookmarkData.bookmarkId,
      });
    }

    setCheckboxList(newList);
  };

  const onOrderManyClick = () => {
    const { materialsOnlineAvailable, bookmarksToOrder } =
      seperateOnlineAndPhysical({
        refs: itemsRef.current,
        checkboxList,
      });

    if (isAuthenticated) {
      if (materialsOnlineAvailable?.length > 0) {
        modal.push("ematerialfilter", {
          bookmarksToOrder,
          materialsOnlineAvailable,
          sortType: sortByValue,
          handleOrderFinished: handleOrderFinished,
        });
      } else {
        modal.push("multiorder", {
          bookmarksToOrder: bookmarksToOrder,
          sortType: sortByValue,
          handleOrderFinished: handleOrderFinished,
        });
      }
    } else {
      openLoginModal({ modal });
    }
  };

  const onGetReferencesClick = () => {
    modal.push("multiReferences", {
      materials: checkboxList,
    });
  };

  const handleRadioChange = (value) => {
    setSortByValue(value);
    setSessionStorageItem("sortByValue", value);
  };

  const onSelectAll = () => {
    const hasUnselectedElements = checkboxList.length < allBookmarks.length;
    if (hasUnselectedElements)
      setCheckboxList(
        allBookmarks.map((bm) => {
          const bookmarkData = populatedBookmarks.find(
            (pbm) => pbm.key === bm.key
          );
          return {
            ...bookmarkData,
            key: bm.key,
            materialId: bm.materialId,
            workId: bm.workId,
            materialType: bm.materialType,
            bookmarkId: bm.bookmarkId,
          };
        })
      );
    else {
      setCheckboxList([]);
    }
  };

  const onDropdownClick = (idx) => {
    setActiveStickyButton(idx + ""); // Stringify, to prevent 0 == null behaviour
  };

  /**
   *
   * @returns @TODO translate
   */
  const onStickyClick = () => {
    switch (activeStickyButton) {
      case "0":
        //bestil
        return onOrderManyClick();
      case "1":
        // referencer
        return onGetReferencesClick();
      case "2":
        // slet
        return onDeleteSelected();
      default:
        console.error("button not bound correctly");
    }
  };

  const getStickyButtonText = () => {
    switch (activeStickyButton) {
      case "0":
        return "Bestil";
      case "1":
        return "Hent referencer";
      case "2":
        return "Fjern";
    }
  };

  const onDeleteSelected = () => {
    const toDelete = allBookmarks
      .filter(
        (bm) => checkboxList.findIndex((item) => item.key === bm.key) > -1
      )
      .map((bm) => ({
        bookmarkId: bm.bookmarkId,
        key: bm.key,
        materialType: bm.materialType,
      }));
    deleteBookmarks(toDelete);
  };
  /**
   * scrolls to the top of the page
   */
  const scrollToTop = () => {
    scrollToElement?.current?.scrollIntoView({ behavior: "smooth" });
  };

  const constructEditionText = (bookmark) => {
    if (!bookmark.pid) {
      return null;
    }
    /**
     * Matches string construction on work page
     */
    return createEditionText(bookmark?.manifestations?.[0]);
  };
  const onPageChange = async (newPage) => {
    const isSmallScreen = breakpoint === "xs";

    if (newPage > totalPages) {
      newPage = totalPages;
    }
    if (!isSmallScreen) {
      scrollToTop();
    }
    setCurrentPage(newPage);
  };

  const onDeleteBookmark = (bookmark) => {
    if (checkboxList.indexOf((bm) => bm.bookmarkId === bookmark.bookmarkId)) {
      setCheckboxList((prev) =>
        prev.filter((bm) => bm.bookmarkId !== bookmark.bookmarkId)
      );
    }
    deleteBookmarks([{ bookmarkId: bookmark.bookmarkId, key: bookmark.key }]);
  };

  const isAllSelected = checkboxList?.length === allBookmarks?.length;
  const isNothingSelected = checkboxList.length === 0;

  if (bookmarsDataLoading || isPopulateLoading) {
    return (
      <ProfileLayout
        title={Translate({
          context: CONTEXT,
          label: "page-title",
        })}
      >
        <div className={styles.skeletonContainer}>
          <div className={styles.skeletonTopContainer}>
            <Skeleton lines={1} className={styles.skeletonText} />
            <Skeleton lines={1} className={styles.skeletonText} />
          </div>

          <div className={styles.skeletonButtonContainer}>
            {isMobile ? (
              <Skeleton lines={2} className={styles.skeletonText} />
            ) : (
              <>
                <Skeleton lines={1} className={styles.skeletonText} />
                <Button skeleton />
                <Button skeleton />
              </>
            )}
          </div>
          {Array.from({ length: 20 }).map((_, i) => (
            <MaterialRow
              skeleton
              key={`bookmark-#${i}`}
              id={`bookmark-#${i}`}
            />
          ))}
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout
      title={Translate({
        context: CONTEXT,
        label: "page-title",
      })}
    >
      <div ref={scrollToElement} />
      {/*
        Mounts bookmark ref to get the online availability status of the marked bookmark
        */}
      <>
        {checkboxList.map((item, idx) => (
          <AnalyseItemAvailability
            key={`checkedItem-ref-${idx}`}
            bookmark={item}
            bookmarkKey={item?.key}
            ref={(el) => (itemsRef.current[idx] = el)}
          />
        ))}
      </>

      {activeStickyButton ? (
        <IconButton
          textType="text1"
          className={styles.closeStickySituation}
          onClick={() => setActiveStickyButton(null)}
        >
          <Translate context="general" label="close" />
        </IconButton>
      ) : (
        <div className={styles.dropdownWrapper}>
          <MenuDropdown options={MENUITEMS} onItemClick={onDropdownClick} />
        </div>
      )}

      {activeStickyButton && (
        <div className={styles.stickyButtonContainer}>
          <Button
            type="primary"
            className={styles.stickyButton}
            onClick={onStickyClick}
          >
            {getStickyButtonText()}
          </Button>
        </div>
      )}

      <div className={styles.sortingRow}>
        <Text tag="small" type="text3" className={styles.smallLabel}>
          {count}{" "}
          {Translate({
            context: CONTEXT,
            label: "result-amount",
          })}
        </Text>
        {!isMobile && (
          <SortButtons
            sortByItems={sortByItems}
            sortByValue={sortByValue}
            setSortByValue={handleRadioChange}
          />
        )}
      </div>
      {isMobile && (
        <SortButtons
          sortByItems={sortByItems}
          sortByValue={sortByValue}
          setSortByValue={handleRadioChange}
        />
      )}

      <div className={styles.buttonControls}>
        <div
          role="checkbox"
          tabIndex={0}
          aria-checked={isAllSelected}
          className={styles.selectAllButton}
          onClick={onSelectAll}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSelectAll();
            }
          }}
        >
          <Checkbox
            checked={isAllSelected}
            disabled={populatedBookmarks?.length === 0}
            id="bookmarkpage-select-all"
            ariaLabelledBy="bookmarkpage-select-all-label"
            ariaLabel={Translate({
              context: CONTEXT,
              label: "select-all",
            })}
            tabIndex="-1"
            readOnly
            className={styles.selectAll}
          />
          <Text type="text3" tag="label" id="bookmarkpage-select-all-label">
            {Translate({
              context: CONTEXT,
              label: "select-all",
            })}
          </Text>
        </div>
        <Button
          size="small"
          disabled={isNothingSelected || checkboxList.length > ORDER_TRESHHOLD}
          className={styles.orderButton}
          onClick={onOrderManyClick}
        >
          {Translate({
            context: CONTEXT,
            label: "order",
          })}
        </Button>
        <Button
          size="small"
          type="secondary"
          disabled={isNothingSelected}
          className={styles.referenceButton}
          onClick={onGetReferencesClick}
        >
          {Translate({
            context: CONTEXT,
            label: "select-action",
          })}
        </Button>
        <IconButton disabled={isNothingSelected} onClick={onDeleteSelected}>
          {Translate({
            context: CONTEXT,
            label: "remove",
          })}
        </IconButton>
      </div>

      {checkboxList.length > ORDER_TRESHHOLD && (
        <div className={styles.treshholdWarning}>
          <Text type="text2" tag="div">
            <Translate context="bookmark" label="treshhold-error" />
          </Text>
        </div>
      )}

      <div className={styles.listContainer}>
        {populatedBookmarks?.map((bookmark, idx) => (
          <MaterialRow
            key={`bookmark-list-${idx}`}
            bookmarkKey={bookmark?.key}
            hasCheckbox={!isMobile || activeStickyButton !== null}
            title={bookmark?.manifestations?.[0]?.titles?.full?.[0] || ""}
            titles={bookmark?.manifestations?.[0]?.titles}
            creator={
              bookmark?.manifestations?.[0]?.ownerWork.creators[0]?.display
            }
            creators={bookmark?.manifestations?.[0]?.ownerWork.creators}
            materialType={getMaterialTypeForPresentation(
              bookmark.manifestations?.[0]?.materialTypes
            )}
            image={bookmark?.manifestations?.[0]?.cover?.thumbnail}
            id={bookmark?.materialId}
            edition={constructEditionText(bookmark)}
            workId={bookmark?.workId}
            pid={bookmark?.pid}
            allManifestations={bookmark?.manifestations}
            type="BOOKMARK"
            isSelected={
              checkboxList.findIndex((item) => item.key === bookmark.key) > -1
            }
            onBookmarkDelete={() => onDeleteBookmark(bookmark)}
            onSelect={() => onToggleCheckbox(bookmark.key)}
            showFailedAtCreation={containsIds(
              failureAtCreationIds,
              bookmark.key
            )}
            showSuccessfullyOrdered={containsIds(
              successfullyCreatedIds,
              bookmark.key
            )}
            handleOrderFinished={handleOrderFinished}
          />
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination
          numPages={totalPages}
          currentPage={currentPage}
          className={styles.pagination}
          onChange={onPageChange}
        />
      )}
    </ProfileLayout>
  );
};

export default BookmarkPage;
