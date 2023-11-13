import Bookmark from "@/components/base/bookmark/Bookmark";
import styles from "./BookmarkDropDown.module.css";
import Dropdown from "react-bootstrap/Dropdown";
import Text from "@/components/base/text/Text";

import React, { useEffect, useRef, useState } from "react";
import { cyKey } from "@/utils/trim";
import useBookmarks from "@/components/hooks/useBookmarks";
import Icon from "@/components/base/icon/Icon";
import BookmarkMedium from "@/public/icons/bookmark_small.svg";
import { formatMaterialTypesToPresentation } from "@/lib/manifestationFactoryUtils";
import { createEditionText } from "../../details/utils/details.utils";
import upperFirst from "lodash/upperFirst";

export function BookMarkMaterialSelector({
  materialTypes,
  workId,
  materialId = workId, // A reference to the bookmark materialId - workId or pid
  size = { w: 7, h: 7 },
  className,
  title,
  editions,
}) {
  const { bookmarks, setBookmark, isLoading } = useBookmarks();
  const [active, setActive] = useState(false);
  const [options, setOptions] = useState(
    materialTypes.map((mat) => formatMaterialTypesToPresentation(mat))
  );
  const isOpen = useRef(false);

  useEffect(() => {
    if (isOpen.current) {
      // on't change options if dropdown is open. Wait for close event.
      return;
    }

    revalidateEditions();
  }, [editions, bookmarks]);

  useEffect(() => {
    if (!isLoading) {
      let bookmarkIndex = -1;
      // this one is used to set the overall button to active or not (if one of the materialtypes is selected)
      if (options.length > 1) {
        bookmarkIndex = bookmarks?.findIndex(
          (bookm) => bookm.materialId === materialId || bookm.workId === workId
        );
      } else if (options.length === 1) {
        // if we have one material only we look for a specific key
        bookmarkIndex = bookmarks?.findIndex(
          (bookm) =>
            bookm.key ===
            materialId + formatMaterialTypesToPresentation(options[0])
        );
      }
      setActive(bookmarkIndex !== -1);
    }
  }, [options, isOpen.current]);

  const revalidateEditions = () => {
    const defaultOptions = materialTypes.map((mat) =>
      formatMaterialTypesToPresentation(mat)
    );

    if (!editions) {
      // Not needed to look for aditional dropdown items
      setOptions(defaultOptions);
      return;
    }

    const addedEditions = bookmarks?.filter(
      (bookmark) => bookmark.workId === workId
    );
    const bookmarkMatches = addedEditions
      ?.map((addedEdition) => {
        const edition = editions?.find(
          (edi) => edi.pid === addedEdition.materialId
        );
        if (!edition) {
          return null;
        }

        return {
          editionDisplayText:
            edition?.materialTypes?.[0]?.materialTypeSpecific?.display +
            ", " +
            createEditionText(edition),
          ...edition,
        };
      })
      .filter((i) => !!i);

    setOptions(defaultOptions.concat(bookmarkMatches));
  };

  const onSelect = (material, workId) => {
    let item;
    if (material.editionDisplayText) {
      // Edition logic
      item = {
        key: material.pid + formatMaterialTypesToPresentation(material),
        materialId: material.pid,
        workId: workId,
        materialType: formatMaterialTypesToPresentation(material),
        title,
      };
    } else {
      // Normal logic
      item = {
        key: materialId + formatMaterialTypesToPresentation(material),
        materialId: materialId,
        workId: workId,
        materialType: formatMaterialTypesToPresentation(material),
        title,
      };
    }

    setBookmark(item);
  };

  const onDropdownToggle = (event) => {
    // Store open state in ref, so we can wait with updating options untill dropdown is closed
    isOpen.current = event;

    if (event === false) {
      // On close - Empty options and revalidate editions - effect subscribes to options changes
      revalidateEditions();
    }
  };

  if (options.length === 1) {
    return (
      <Bookmark
        size={size}
        className={`${styles.bookmark} ${className}`}
        selected={active}
        onClick={(e) => {
          e.preventDefault();
          onSelect(options, workId);
        }}
      />
    );
  }

  return (
    <Dropdown
      className={`${styles.dropdownwrap} ${className}`}
      align="end"
      autoClose="outside"
      onToggle={onDropdownToggle}
    >
      <Dropdown.Toggle
        as="div"
        data-cy={cyKey({ name: "material-selector", prefix: "bookmark" })}
        variant="success"
        id="dropdown-basic"
      >
        <Bookmark
          size={size}
          onClick={(e) => e.preventDefault()}
          selected={active}
          className={styles.bookmark}
        />
      </Dropdown.Toggle>
      <Dropdown.Menu
        className={styles.dropdownmenu}
        drop="up"
        data-cy={cyKey({
          name: "material-selector-dropdown",
          prefix: "bookmark",
        })}
      >
        {options.map((material, index) => {
          let activeItem;
          if (material?.editionDisplayText) {
            activeItem =
              bookmarks?.findIndex(
                (book) =>
                  book.key ===
                  material.pid + formatMaterialTypesToPresentation(material)
              ) !== -1;
          } else {
            activeItem =
              bookmarks?.findIndex(
                (book) =>
                  book.key ===
                  workId + formatMaterialTypesToPresentation(material)
              ) !== -1;
          }

          return (
            <Dropdown.Item
              data-cy={`bookmark-${material}-${index}`}
              key={`bookmark-${index}`}
              className={`${styles.dropdownitem} ${
                activeItem ? styles.active : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                onSelect(material, workId);
              }}
            >
              <div className={styles.itemContainer}>
                <Text type="text3" className={styles.dropdownitemText}>
                  {material?.editionDisplayText
                    ? material.editionDisplayText
                    : formatMaterialTypesToPresentation(material)}
                </Text>

                <Icon size={{ w: 3, h: 3 }}>
                  <BookmarkMedium />
                </Icon>
              </div>
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default BookMarkMaterialSelector;
