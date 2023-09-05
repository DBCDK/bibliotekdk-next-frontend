import useBookmarks, {
  populateBookmarks,
} from "@/components/hooks/useBookmarks";
import styles from "./Bookmark.module.css";
import Text from "@/components/base/text";
import Button from "@/components/base/button";
import MaterialRow from "../materialRow/MaterialRow";
import IconButton from "@/components/base/iconButton";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/base/forms/checkbox/Checkbox";
import ProfileLayout from "../profileLayout/ProfileLayout";

const BookmarkPage = () => {
  const { bookmarks: bookmarkCookies } = useBookmarks();
  const { data } = populateBookmarks(bookmarkCookies);
  const bookmarks = data?.works.filter((n) => n);
  const [checkboxList, setCheckboxList] = useState();

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

  const isAllSelected = checkboxList?.filter((e) => e.isSelected === false).length === 0;
  const isNothingSelected = checkboxList?.filter((e) => e.isSelected === true).length === 0;

  return (
    <ProfileLayout title="Huskeliste">
      <Text tag="small" type="small" className={styles.smallLabel}>
        {bookmarks?.length} materialer
      </Text>
      <div className={styles.buttonControls}>
        <div
          role="checkbox"
          tabIndex={0}
          aria-checked={isAllSelected}
          className={styles.selectAllButton}
          onClick={onSelectAll}
        >
          <Checkbox
            checked={
              isAllSelected
            }
            id="bookmarkpage-select-all"
            aria-labelledby="bookmarkpage-select-all-label"
            tabIndex="-1"
            readOnly
            className={styles.selectAll}
          />
          <Text type="text3" tag="label" id="bookmarkpage-select-all-label">
            Vælg alle
          </Text>
        </div>
        <Button
          size="small"
          disabled={
            isNothingSelected
          }
          className={styles.orderButton}
        >
          Bestil
        </Button>
        <Button
          size="small"
          type="secondary"
          disabled={
            isNothingSelected
          }
          className={styles.referenceButton}
        >
          Referencer
        </Button>
        <IconButton
          disabled={
            isNothingSelected
          }
          className={styles.removeButton}
        >
          Fjern
        </IconButton>
      </div>
      <div className={styles.listContainer}>
        {checkboxList &&
          bookmarks?.map((bookmark, idx) => (
            <MaterialRow
              key={`bookmark-list-${idx}`}
              hasCheckbox
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
              creationYear="2000"
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
