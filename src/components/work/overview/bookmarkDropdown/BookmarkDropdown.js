import Bookmark from "@/components/base/bookmark/Bookmark";
import styles from "./BookmarkDropDown.module.css";
import Dropdown from "react-bootstrap/Dropdown";
import Text from "@/components/base/text/Text";

import React, { useEffect, useState } from "react";
import { cyKey } from "@/utils/trim";
import useBookmarks from "@/components/hooks/user/useBookmarks";

export function BookMarkMaterialSelector({ materialTypes, workId }) {
  const bookmarkClick = () => {};

  const { bookmark, setBookmark, isLoading } = useBookmarks();

  const onSelect = async (material, workId) => {
    const item = { key: workId + material, id: workId, materialType: material };
    await setBookmark(item);
  };

  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      const bookmarkIndex = bookmark?.findIndex((bookm) => bookm.id === workId);
      setActive(bookmarkIndex !== -1);
    }
  }, [bookmark]);

  const options = materialTypes.map((mat) => mat);

  return (
    <Dropdown className={`${styles.dropdownwrap} `} align="end">
      <Dropdown.Toggle
        as="div"
        data-cy={cyKey({ name: "material-selector", prefix: "bookmark" })}
        variant="success"
        id="dropdown-basic"
      >
        <Bookmark onClick={bookmarkClick} selected={active} />
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
          return (
            <Dropdown.Item
              as="div"
              tabIndex="-1"
              data-cy={`bookmark-${material}-${index}`}
              key={`bookmark-${index}`}
              className={`${styles.dropdownitem} ${
                bookmark?.findIndex(
                  (book) => book.key === workId + material
                ) !== -1
                  ? styles.active
                  : ""
              }`}
              onClick={() => {
                onSelect(material, workId);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSelect(material, workId);
                }
              }}
            >
              <Text type="text3">{material}</Text>
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
