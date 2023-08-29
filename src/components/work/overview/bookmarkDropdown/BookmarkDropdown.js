import Bookmark from "@/components/base/bookmark/Bookmark";
import styles from "./BookmarkDropDown.module.css";
import Dropdown from "react-bootstrap/Dropdown";
import Text from "@/components/base/text/Text";

import React, { useEffect, useState } from "react";
import { cyKey } from "@/utils/trim";
import useBookmarks from "@/components/hooks/useBookmarks";
import Icon from "@/components/base/icon/Icon";
import BookmarkMedium from "@/public/icons/bookmark_small.svg";

export function BookMarkMaterialSelector({ materialTypes, workId }) {
  const bookmarkClick = () => {};

  const { bookmark, setBookmark, isLoading } = useBookmarks();

  const onSelect = (material, workId) => {
    const item = { key: workId + material, id: workId, materialType: material };
    setBookmark(item);
  };

  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      const bookmarkIndex = bookmark?.findIndex((bookm) => bookm.id === workId);
      setActive(bookmarkIndex !== -1);
    }
  }, [bookmark]);

  const options = materialTypes.map((mat) => mat);

  if (options.length === 1) {
    return (
      <Bookmark
        size={{ w: 6, h: 6 }}
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
          size={{ w: 7, h: 7 }}
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
            bookmark?.findIndex((book) => book.key === workId + material) !==
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

export default function wrapper({ materialTypes, workId }) {
  return (
    <BookMarkMaterialSelector materialTypes={materialTypes} workId={workId} />
  );
}
