import useBookmarks, {
  usePopulateBookmarksNew2,
} from "@/components/hooks/useBookmarks";
import styles from "./Bookmark.module.css";
import Text from "@/components/base/text";
import Button from "@/components/base/button";
import MaterialRow from "../materialRow/MaterialRow";
import IconButton from "@/components/base/iconButton";
import { useEffect, useRef, useState } from "react";
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
import { flatMapMaterialTypes } from "@/lib/manifestationFactoryUtils";

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

const BookmarkPage = () => {
  const {
    bookmarks: allBookmarksData,
    paginatedBookmarks: bookmarksData,
    setSortBy,
    deleteBookmarks,
    currentPage,
    totalPages,
    setCurrentPage,
    count,
    isLoading: bookmarsDataLoading,
  } = useBookmarks();
  const { data: bookmarks, isLoading: isPopulateLoading } =
    usePopulateBookmarksNew2(bookmarksData); //TODO first to exchange

  console.log("BOOKMARKS WITHOut TYPE? ", bookmarks);
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
    let savedValue = sessionStorage.getItem("sortByValue");
    //if there is no saved values in sessionstorage, use createdAt sorting as default
    setSortByValue(savedValue || sortByItems[0].key);
  }, []);

  const onToggleCheckbox = (key) => {
    const index = checkboxList.findIndex((item) => item.key === key);
    const exists = index > -1;
    const newList = [...checkboxList]; // Force object copy - to tell react that this is a new state & update

    if (exists) {
      // Delete
      newList.splice(index, 1);
    } else {
      const bookmarkData = allBookmarksData.find((bm) => bm.key === key);
      // Add
      newList.push({
        key: key,
        materialId: bookmarkData.materialId,
        materialType: bookmarkData.materialType,
      });
    }

    setCheckboxList(newList);
  };

  const onOrderManyClick = () => {
    setTimeout(() => {
      if (isAuthenticated) {
        modal.push("ematerialfilter", {
          materials: checkboxList,
          sortType: sortByValue,
          handleOrderFinished: handleOrderFinished,
        });
      } else {
        openLoginModal({ modal }); //TODO check this flow
      }
    }, 300);
  };

  const onGetReferencesClick = () => {
    modal.push("multiReferences", {
      materials: checkboxList,
    });
  };

  const handleRadioChange = (value) => {
    setSortByValue(value);
    sessionStorage.setItem("sortByValue", value);
  };

  const onSelectAll = () => {
    const hasUnselectedElements = checkboxList.length < allBookmarksData.length;
    if (hasUnselectedElements)
      setCheckboxList(
        allBookmarksData.map((el) => ({
          key: el.key,
          materialId: el.materialId,
          materialType: el.materialType,
        }))
      );
    else setCheckboxList([]);
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
        return "Bestil";
      case "1":
        return "Hent referencer";
      case "2":
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
    const toDelete = allBookmarksData
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
    return createEditionText(bookmark);
  };
  const onPageChange = async (newPage) => {
    const isSmallScreen = breakpoint == "xs";

    if (newPage > totalPages) {
      newPage = totalPages;
    }
    if (!isSmallScreen) {
      scrollToTop();
    }
    setCurrentPage(newPage);
  };

  const isAllSelected = checkboxList?.length === allBookmarksData?.length;
  const isNothingSelected = checkboxList.length === 0;

  console.log("bookmarks ", bookmarsDataLoading, isPopulateLoading);

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

  //TODO her mangler jeg materialtypesSpecific for tidsskrifter (edition)
  console.log("bookmarks", bookmarks.length);

  const makeMaterialType = (materialTypes) => {
    const specificDisplayMaterialTypes = materialTypes.map((materialType) => {
      return materialType.materialTypeSpecific.display;
    });
    return specificDisplayMaterialTypes.join(" / ");
  };
  return (
    <ProfileLayout
      title={Translate({
        context: CONTEXT,
        label: "page-title",
      })}
    >
      <div ref={scrollToElement} />

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
            disabled={bookmarks?.length === 0}
            id="bookmarkpage-select-all"
            aria-labelledby="bookmarkpage-select-all-label"
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
        {bookmarks?.map(
          (
            bookmark,
            idx /// why not loading?
          ) => (
            <MaterialRow
              key={`bookmark-list-${idx}`}
              hasCheckbox={!isMobile || activeStickyButton !== null}
              title={bookmark?.manifestations?.[0]?.titles?.full || ""}
              creator={
                bookmark?.manifestations?.[0]?.ownerWork.creators[0]?.display
              }
              materialType={makeMaterialType(
                bookmark.manifestations?.[0]?.materialTypes
              )}
              image={bookmark?.manifestations?.[0]?.cover?.thumbnail}
              id={bookmark?.materialId}
              edition={constructEditionText(bookmark)}
              workId={
                bookmark?.pid ? bookmark?.ownerWork?.workId : bookmark?.workId
              }
              pid={bookmark?.pid}
              allManifestations={bookmark?.manifestations}
              type="BOOKMARK"
              isSelected={
                checkboxList.findIndex((item) => item.key === bookmark.key) > -1
              }
              onBookmarkDelete={() =>
                deleteBookmarks([
                  { bookmarkId: bookmark.bookmarkId, key: bookmark.key },
                ])
              }
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
          )
        )}
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
