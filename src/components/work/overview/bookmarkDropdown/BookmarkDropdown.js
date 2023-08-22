import Bookmark from "@/components/base/bookmark/Bookmark";
import styles from "./BookmarkDropDown.module.css";
import Dropdown from "react-bootstrap/Dropdown";
import Text from "@/components/base/text/Text";
import Translate from "@/components/base/translate";
import React from "react";
import { cyKey } from "@/utils/trim";
import Icon from "@/components/base/icon/Icon";

function BookMarkMaterialSelector({ materialTypes }) {
  console.log(materialTypes, "MATTRYPES");
  const bookmarkClick = () => {};
  const options = ["fisk", "!hest"];
  return (
    <Dropdown className={`${styles.dropdownwrap} `}>
      <Dropdown.Toggle
        data-cy={cyKey({ name: "material-selector", prefix: "header" })}
        variant="success"
        id="dropdown-basic"
      >
        <Bookmark onClick={bookmarkClick} />
      </Dropdown.Toggle>
      <Dropdown.Menu className={styles.dropdownmenu}>
        {options.map((elem) => {
          console.log(elem, "ELEM");
          return (
            <Dropdown.Item
              tabIndex="-1"
              data-cy={`item-${elem}`}
              key={`materialdropdown-${elem}`}
              className={styles.dropdownitem}
              onClick={() => {
                onSelect(elem);
              }}
            >
              <Text tag="span" type="text3">
                {Translate({
                  context: "facets",
                  label: `label-${elem}`,
                })}
              </Text>
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default function wrapper({ materialTypes }) {
  // @TODO material types
  return (
    <>
      <BookMarkMaterialSelector materialTypes={materialTypes} />
    </>
  );
}
