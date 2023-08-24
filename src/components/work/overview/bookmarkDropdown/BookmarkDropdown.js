import Bookmark from "@/components/base/bookmark/Bookmark";
import styles from "./BookmarkDropDown.module.css";
import Dropdown from "react-bootstrap/Dropdown";
import Text from "@/components/base/text/Text";

import React, { useEffect, useState } from "react";
import { cyKey } from "@/utils/trim";
import useBookmarks from "@/components/hooks/useBookmarks";

function BookMarkMaterialSelector({ options, workId }) {
  const bookmarkClick = () => {};

  const { bookmark, setBookmark, isLoading } = useBookmarks();

  console.log(bookmark, "BOOKMARK");
  const onSelect = async (material, workId) => {
    const item = { key: workId + material, id: workId, materialType: material };
    await setBookmark(item);
  };

  const [active, setActive] = useState(false);
  useEffect(() => {
    if (!isLoading) {
      console.log(bookmark, typeof bookmark, "USE EFFECT BOOKMARK");
      const bookmarked = bookmark?.find((bookm) => bookm.id === workId);
      setActive(!!bookmarked);
    }
  }, [bookmark]);

  console.log(active, "BOOKMARKED");

  return (
    <Dropdown className={`${styles.dropdownwrap} `} align="end">
      <Dropdown.Toggle
        as="div"
        data-cy={cyKey({ name: "material-selector", prefix: "header" })}
        variant="success"
        id="dropdown-basic"
      >
        <Bookmark
          onClick={bookmarkClick}
          className={`${active ? styles.active : ""} ${styles.bookmark}`}
        />
      </Dropdown.Toggle>
      <Dropdown.Menu className={styles.dropdownmenu} drop="up">
        {options.map((material) => {
          return (
            <>
              <Dropdown.Item
                as="div"
                tabIndex="-1"
                data-cy={`bookmark-${material}`}
                key={`bookmark-${material}`}
                className={styles.dropdownitem}
                onClick={() => {
                  onSelect(material, workId);
                }}
              >
                <Text type="text3">{material}</Text>
              </Dropdown.Item>
            </>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default function wrapper({ materialTypes, workId }) {
  console.log(materialTypes, "MATTRYPES");

  const options = materialTypes.map((mat) => mat.join(", "));

  // @TODO material types
  return (
    <>
      <BookMarkMaterialSelector options={options} workId={workId} />
    </>
  );
}
