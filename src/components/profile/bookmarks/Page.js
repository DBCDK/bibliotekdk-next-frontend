import useBookmarks, {
  usePopulateBookmarks,
} from "@/components/hooks/useBookmarks";
import styles from "./Bookmark.module.css";
import Text from "@/components/base/text";
import Button from "@/components/base/button";
import MaterialRow from "../materialRow/MaterialRow";
import IconButton from "@/components/base/iconButton";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/base/forms/checkbox/Checkbox";
import ProfileLayout from "../profileLayout/ProfileLayout";
import Translate from "@/components/base/translate";
import MenuDropdown from "@/components/base/dropdown/menuDropdown/MenuDropdown";
import useBreakpoint from "@/components/hooks/useBreakpoint";
import List from "@/components/base/forms/list";

const CONTEXT = "bookmark";
const MENUITEMS = ["Bestil flere", "Hent referencer", "Fjern flere"];
const sortByItems = [
  { label: "latestAdded", key: "createdAt" },
  { label: "alphabeticalOrder", key: "title" },
];

const BookmarkPage = () => {
  const { bookmarks: bookmarksData, setSortBy } = useBookmarks();
  const { data } = usePopulateBookmarks(bookmarksData);
  const [activeStickyButton, setActiveStickyButton] = useState(null);
  const bookmarks = data?.works.filter((n) => n);
  const breakpoint = useBreakpoint();
  const [sortByValue, setSortByValue] = useState(sortByItems[0].key);
  const isMobile = breakpoint === "sm" || breakpoint === "xs";
  const [checkboxList, setCheckboxList] = useState();

  useEffect(() => {
    setSortBy(sortByValue);
  }, [sortByValue]);

  useEffect(() => {
    const bookmarks = data?.works.filter((n) => n); // Fix so long we can recieve null from populate
    setCheckboxList(
      bookmarks?.map((bookmark) => ({ id: bookmark.workId, isSelected: false }))
    );
  }, [data]);

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

  const isAllSelected =
    checkboxList?.length > 0 &&
    checkboxList?.filter((e) => e.isSelected === false).length === 0;
  const isNothingSelected =
    checkboxList?.filter((e) => e.isSelected === true).length === 0;

  return (
    <ProfileLayout
      title={Translate({
        context: CONTEXT,
        label: "page-title",
      })}
    >
      <div className={styles.dropdownWrapper}>
        {/* TODO - make modal? not sure */}
        <MenuDropdown options={MENUITEMS} onItemClick={onDropdownClick} />
      </div>

      {activeStickyButton && (
        <div className={styles.stickyButtonContainer}>
          <Button type="primary" className={styles.stickyButton}>
            {getStickyButtonText()}
          </Button>
        </div>
      )}

      <div className={styles.sortingRow}>
        <Text tag="small" type="small" className={styles.smallLabel}>
          {bookmarks?.length}{" "}
          {Translate({
            context: CONTEXT,
            label: "result-amount",
          })}
        </Text>
        <div>
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
        </div>
      </div>

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
        <IconButton disabled={isNothingSelected}>
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
              materialType={
                bookmark?.manifestations?.bestRepresentation?.materialTypes[0]
                  ?.specific
              }
              image={
                bookmark?.manifestations?.bestRepresentation?.cover?.thumbnail
              }
              id={bookmark?.workId}
              type="BOOKMARK"
              isSelected={checkboxList[idx]?.isSelected}
              onSelect={() =>
                setCheckboxList(
                  [...checkboxList].map((el, i) => {
                    if (i !== idx) return el;
                    else
                      return {
                        id: el.id,
                        isSelected: !el.isSelected,
                      };
                  })
                )
              }
            />
          ))}
      </div>
    </ProfileLayout>
  );
};

export default BookmarkPage;
