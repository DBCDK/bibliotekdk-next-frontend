import Bookmark from "@/components/base/bookmark/Bookmark";
import styles from "./BookmarkDropDown.module.css";
import Dropdown from "react-bootstrap/Dropdown";
import Text from "@/components/base/text/Text";

import React, { useEffect, useState } from "react";
import { cyKey } from "@/utils/trim";
import useBookmarks from "@/components/hooks/useBookmarks";
import Icon from "@/components/base/icon/Icon";
import BookmarkMedium from "@/public/icons/bookmark_small.svg";

export function BookMarkMaterialSelector({
  materialTypes,
  workId,
  size = { w: 7, h: 7 },
}) {
  const bookmarkClick = () => {};

  const { bookmark, setBookmark, isLoading } = useBookmarks();

  const onSelect = (material, workId) => {
    const item = {
      key: workId + material,
      id: workId,
      materialType: material[0],
    };
    setBookmark(item);
  };

  const [active, setActive] = useState(false);
  const options = materialTypes.map((mat) => mat);

  useEffect(() => {
    if (!isLoading) {
      let bookmarkIndex = -1;
      // this one is used to set the overall button to active or not (if one of the materialtypes is selected)
      if (options.length > 1) {
        bookmarkIndex = bookmark?.findIndex((bookm) => bookm.id === workId);
      } else if (options.length === 1) {
        // if we have one material only we look for a specific key
        bookmarkIndex = bookmark?.findIndex(
          (bookm) => bookm.key === workId + options[0]
        );
      }
      setActive(bookmarkIndex !== -1);
    }
  }, [bookmark]);

  if (options.length === 1) {
    return (
      <Bookmark
        size={size}
        className={styles.bookmark}
        selected={active}
        onClick={() => {
          onSelect(options[0], workId);
        }}
      />
    );
  }

  return (
    <Dropdown className={`${styles.dropdownwrap} `} align="end">
      <Dropdown.Toggle
        as="div"
        data-cy={cyKey({ name: "material-selector", prefix: "bookmark" })}
        variant="success"
        id="dropdown-basic"
      >
        <Bookmark
          size={size}
          onClick={bookmarkClick}
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
          const activeItem =
            bookmark?.findIndex((book) => book.key === workId + material[0]) !==
            -1;
          return (
            <Dropdown.Item
              data-cy={`bookmark-${material}-${index}`}
              key={`bookmark-${index}`}
              className={`${styles.dropdownitem} ${
                activeItem ? styles.active : ""
              }`}
              onClick={() => {
                onSelect(material, workId);
              }}
            >
              <div className={styles.itemContainer}>
                <Text type="text3">{material}</Text>

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

export default function wrapper({ materialTypes, workId, size }) {
  return (
    <BookMarkMaterialSelector
      materialTypes={materialTypes}
      workId={workId}
      size={size}
    />
  );
}
