import useBookmarks, {
  usePopulateBookmarks,
} from "@/components/hooks/useBookmarks";
import styles from "./Bookmark.module.css";
import Text from "@/components/base/text";
import Button from "@/components/base/button";
import MaterialRow from "../materialRow/MaterialRow";
import ErrorRow from "../errorRow/ErrorRow";
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
import Skeleton from "@/components/base/skeleton/Skeleton";
import { getSessionStorageItem, setSessionStorageItem } from "@/lib/utils";
import { useAnalyzeMaterial } from "@/components/hooks/useAnalyzeMaterial";
import { useOrderFlow } from "@/components/hooks/order";
import { useModal } from "@/components/_modal";
import CloseSvg from "@/public/icons/close.svg";

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

const AnalyseItemAvailability = forwardRef(function AnalyseItemAvailability(
  { bookmark },
  ref
) {
  const { pid, workId, materialId, manifestations, key } = bookmark;
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
        bookmarkKey: key,
      };
    },
    [isAccessibleOnline]
  );
});

const BookmarkPage = () => {
  const modal = useModal();
  const itemsRef = useRef([]);
  const {
    paginatedBookmarks: bookmarksData,
    setSortBy,
    deleteBookmarks,
    currentPage,
    totalPages,
    setCurrentPage,
    count,
    isLoading: bookmarsDataLoading,
    error: bookmarksError,
    retry,
  } = useBookmarks({ list: true });

  const receipt =
    modal?.stack?.find((item) => item.id === "multireceipt")?.context || {};
  const { successMaterials, failedMaterials } = receipt;

  const { data: populatedBookmarks, isLoading: isPopulateLoading } =
    usePopulateBookmarks(bookmarksData);
  const [activeStickyButton, setActiveStickyButton] = useState(null);
  const breakpoint = useBreakpoint();
  const [sortByValue, setSortByValue] = useState(null);
  const isMobile = ["xs", "sm", "md"].includes(breakpoint);
  const [checkboxList, setCheckboxList] = useState([]);
  const scrollToElement = useRef(null);
  const [successfullyCreatedIds, setSuccessfullyCreatedIds] = useState([]);
  const [failureAtCreationIds, setFailureAtCreationIds] = useState([]);
  const { start } = useOrderFlow();
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
    if (successMaterials && failedMaterials) {
      handleOrderFinished(successMaterials, failedMaterials);
    }
  }, [successMaterials, failedMaterials]);

  useEffect(() => {
    setSortBy(sortByValue);
  }, [sortByValue]);

  useEffect(() => {
    //if there is one item in the last page and the user deletes that, we should go back to the previous page.
    if (
      !bookmarsDataLoading &&
      !bookmarksError &&
      currentPage > Math.max(1, totalPages)
    ) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [totalPages, bookmarsDataLoading, bookmarksError]);

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
    if (checkboxList.some((bookmark) => !bookmark.hasMaterial)) return;
    const orders = checkboxList?.map((order) => ({
      pids: order?.manifestations?.map((manifestation) => manifestation?.pid),
      bookmarkKey: order?.key,
    }));
    if (orders?.length > 0) {
      start({ orders });
    }
  };

  const onGetReferencesClick = () => {
    if (checkboxList.some((bookmark) => !bookmark.hasMaterial)) return;
    modal.push("multiReferences", {
      materials: checkboxList,
    });
  };

  const handleRadioChange = (value) => {
    setSortByValue(value);
    setSessionStorageItem("sortByValue", value);
  };

  const onSelectAll = () => {
    const visibleKeys = new Set(
      populatedBookmarks.map((bookmark) => bookmark.key)
    );
    const selectedKeys = new Set(checkboxList.map((bookmark) => bookmark.key));
    const allVisibleSelected = populatedBookmarks.every((bookmark) =>
      selectedKeys.has(bookmark.key)
    );
    setCheckboxList(
      allVisibleSelected
        ? checkboxList.filter((bookmark) => !visibleKeys.has(bookmark.key))
        : [
            ...checkboxList,
            ...populatedBookmarks.filter(
              (bookmark) => !selectedKeys.has(bookmark.key)
            ),
          ]
    );
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

  const onDeleteSelected = async () => {
    const deletedKeys = await deleteBookmarks(checkboxList);
    setCheckboxList((previous) =>
      previous.filter((bookmark) => !deletedKeys.includes(bookmark.key))
    );
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
  const onPageChange = async (newPage, scroll = true) => {
    if (newPage > totalPages) {
      newPage = totalPages;
    }
    if (!isMobile && scroll) {
      scrollToTop();
    }
    setCurrentPage(newPage);
  };

  const onDeleteBookmark = async (bookmark) => {
    const deletedKeys = await deleteBookmarks([bookmark]);
    setCheckboxList((previous) =>
      previous.filter((item) => !deletedKeys.includes(item.key))
    );
  };

  const isAllSelected = populatedBookmarks.every((bookmark) =>
    checkboxList.some((item) => item.key === bookmark.key)
  );
  const isNothingSelected = checkboxList.length === 0;
  const hasUnavailableSelection = checkboxList.some(
    (bookmark) => !bookmark.hasMaterial
  );

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
      {bookmarksError && (
        <ErrorRow
          text={
            <>
              {Translate({ context: "receipt", label: "errorOccured" })}{" "}
              <Button size="small" onClick={retry}>
                {Translate({ context: "general", label: "retry" })}
              </Button>
            </>
          }
        />
      )}
      {/*
        Mounts bookmark ref to get the online availability status of the marked bookmark
        */}
      <>
        {checkboxList
          .filter((item) => item.hasMaterial)
          .map((item, idx) => (
            <AnalyseItemAvailability
              key={`checkedItem-ref-${idx}`}
              bookmark={item}
              ref={(el) => (itemsRef.current[idx] = el)}
            />
          ))}
      </>

      {activeStickyButton ? (
        <IconButton
          icon={<CloseSvg />}
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
            disabled={
              isNothingSelected ||
              (activeStickyButton !== "2" && hasUnavailableSelection)
            }
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
          aria-checked={isAllSelected && populatedBookmarks?.length > 0}
          className={styles.selectAllButton}
          onClick={onSelectAll}
          data-cy="bookmarks-select-all-checkbox"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSelectAll();
            }
          }}
        >
          <Checkbox
            checked={isAllSelected && populatedBookmarks?.length > 0}
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
          disabled={
            isNothingSelected ||
            hasUnavailableSelection ||
            checkboxList.length > ORDER_TRESHHOLD
          }
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
          disabled={isNothingSelected || hasUnavailableSelection}
          className={styles.referenceButton}
          onClick={onGetReferencesClick}
        >
          {Translate({
            context: CONTEXT,
            label: "select-action",
          })}
        </Button>
        <IconButton
          icon={<CloseSvg />}
          disabled={isNothingSelected}
          onClick={onDeleteSelected}
          dataCy="bookmarks-remove-from-list"
        >
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
        {populatedBookmarks?.map((bookmark) => {
          return (
            <MaterialRow
              key={bookmark.key}
              bookmarkKey={bookmark?.key}
              hasCheckbox={!isMobile || activeStickyButton !== null}
              title={bookmark.title}
              titles={bookmark.titles}
              creator={bookmark.creator}
              creators={bookmark.creators}
              materialType={bookmark.materialTypeLabel}
              image={bookmark.image}
              hasMaterial={bookmark.hasMaterial}
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
          );
        })}
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
