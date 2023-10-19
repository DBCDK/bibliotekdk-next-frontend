import useBookmarks, {
  usePopulateBookmarks,
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
import { updateQueryParams } from "@/lib/utils";
import { useRouter } from "next/router";

const CONTEXT = "bookmark";
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
    <List.Group className={styles.sortingContainer} disableGroupOutline>
      {sortByItems.map(({ label, key }) => (
        <List.Radio
          className={styles.sortingItem}
          key={key}
          selected={sortByValue === key}
          onSelect={() => setSortByValue(key)}
          label={key}
        >
          <Text>{Translate({ context: "profile", label: label })}</Text>
        </List.Radio>
      ))}
    </List.Group>
  );
};

const BookmarkPage = () => {
  const {
    paginatedBookmarks: bookmarksData,
    setSortBy,
    deleteBookmarks,
    currentPage,
    totalPages,
    setCurrentPage,
    count,
    isLoading: bookmarsDataLoading,
  } = useBookmarks();
  const { data: bookmarks, isLoading: bookmarsPopulaationLoading } =
    usePopulateBookmarks(bookmarksData);
  const [activeStickyButton, setActiveStickyButton] = useState(null);
  const breakpoint = useBreakpoint();
  const [sortByValue, setSortByValue] = useState(null);
  const isMobile = breakpoint === "sm" || breakpoint === "xs";
  const [checkboxList, setCheckboxList] = useState();
  const scrollToElement = useRef(null);
  const router = useRouter();
  const { page } = router.query;

  useEffect(() => {
    setSortBy(sortByValue);
  }, [sortByValue]);

  useEffect(() => {
    let savedValue = sessionStorage.getItem("sortByValue");
    //if there is no saved values in sessionstorage, use createdAt sorting as default
    setSortByValue(savedValue || sortByItems[0].key);
    //if page is passed in url, set it as currentpage
    if (page) {
      setCurrentPage(page);
    }
  }, []);

  useEffect(() => {
    setCheckboxList(
      bookmarks?.map((bookmark) => ({
        key: bookmark.key,
        bookmarkId: bookmark.bookmarkId,
        isSelected: false,
      }))
    );
  }, [bookmarks.length]);

  const handleRadioChange = (value) => {
    setSortByValue(value);
    sessionStorage.setItem("sortByValue", value);
  };

  const onSelectAll = () => {
    const hasUnselectedElements =
      checkboxList.filter((e) => e.isSelected === false).length > 0;
    if (hasUnselectedElements)
      setCheckboxList(checkboxList.map((el) => ({ ...el, isSelected: true })));
    else
      setCheckboxList(checkboxList.map((el) => ({ ...el, isSelected: false })));
  };

  const onDropdownClick = (idx) => {
    setActiveStickyButton(idx + ""); // Stringify, to prevent 0 == null behaviour
  };

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
    const selectedBookmarks = checkboxList.filter((i) => i.isSelected === true);
    deleteBookmarks(selectedBookmarks);
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
    //set page in url parameter
    updateQueryParams({ params: { page: newPage }, router });
    //update page in useBookmarkhook
    setCurrentPage(newPage);
  };

  const isAllSelected =
    checkboxList?.length > 0 &&
    checkboxList?.filter((e) => e.isSelected === false).length === 0;
  const isNothingSelected =
    checkboxList?.filter((e) => e.isSelected === true).length === 0;

  if (bookmarsDataLoading || bookmarsPopulaationLoading) {
    return (
      <ProfileLayout
        title={Translate({
          context: CONTEXT,
          label: "page-title",
        })}
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <MaterialRow skeleton key={`bookmark-#${i}`} id={`bookmark-#${i}`} />
        ))}
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

      <div className={styles.dropdownWrapper}>
        {/* TODO - make modal? not sure */}
        <MenuDropdown options={MENUITEMS} onItemClick={onDropdownClick} />
      </div>

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
        >
          <Checkbox
            checked={isAllSelected}
            disabled={checkboxList?.length === 0}
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
          disabled={isNothingSelected}
          className={styles.orderButton}
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
      <div className={styles.listContainer}>
        {checkboxList &&
          bookmarks?.map((bookmark, idx) => (
            <MaterialRow
              key={`bookmark-list-${idx}`}
              hasCheckbox={!isMobile || activeStickyButton !== null}
              title={bookmark?.titles?.main[0] || ""}
              creator={bookmark?.creators[0]?.display}
              materialType={bookmark.materialType}
              image={
                bookmark?.cover?.thumbnail ??
                bookmark?.manifestations?.bestRepresentation?.cover?.thumbnail
              }
              id={bookmark?.materialId}
              edition={constructEditionText(bookmark)}
              workId={
                bookmark?.pid ? bookmark?.ownerWork?.workId : bookmark?.workId
              }
              pid={bookmark?.pid}
              allManifestations={bookmark?.manifestations?.mostRelevant}
              type="BOOKMARK"
              isSelected={checkboxList[idx]?.isSelected}
              onBookmarkDelete={() =>
                deleteBookmarks([
                  { bookmarkId: bookmark.bookmarkId, key: bookmark.key },
                ])
              }
              onSelect={() =>
                setCheckboxList(
                  [...checkboxList].map((el, i) => {
                    if (i !== idx) return el;
                    else
                      return {
                        ...el,
                        isSelected: !el.isSelected,
                      };
                  })
                )
              }
            />
          ))}
      </div>
      {totalPages > 1 && (
        <Pagination
          numPages={totalPages}
          currentPage={parseInt(currentPage, 10)}
          className={styles.pagination}
          onChange={onPageChange}
        />
      )}
    </ProfileLayout>
  );
};

export default BookmarkPage;
