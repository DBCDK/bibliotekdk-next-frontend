import { encodeString } from "@/lib/utils";
import Dropdown from "react-bootstrap/Dropdown";

import Icon from "@/components/base/icon";
import Text from "@/components/base/text";

import Translate from "@/components/base/translate";
import { useState, useEffect, useRef } from "react";
import styles from "./NavigationDropdown.module.css";
import { useRouter } from "next/router";
import Link from "../link/Link";
import cx from "classnames";
import { set } from "lodash";

export default function NavigationDropdown({ context, menuItems }) {
  const router = useRouter();
  const menuTitle = Translate({
    context: context,
    label: "profileMenu",
  });
  const [selected, setSelected] = useState(0);
  const [expandMenu, setExpandMenu] = useState(false);

  return (
    <Dropdown
      show={expandMenu}
      type="nav"
      role="navigation"
      className={styles.dropdownWrap}
      tabIndex={-1}
    >
      <DropdownToggle
        menuTitle={menuTitle}
        handleClick={() => setExpandMenu(!expandMenu)}
        handleKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            setExpandMenu(!expandMenu);
          }
        }}
        expandMenu={expandMenu}
      />
      <DropdownMenu
        menuItems={menuItems}
        selected={selected}
        setSelected={setSelected}
        expandMenu={expandMenu}
        setExpandMenu={setExpandMenu}
        context={context}
        router={router}
      />
    </Dropdown>
  );
}

function DropdownToggle({ handleClick, handleKeyDown, menuTitle, expandMenu }) {
  return (
    <Dropdown.Toggle
      variant="success"
      id="navigationbutton"
      className={styles.dropdownToggle}
      aria-expanded={expandMenu}
      aria-haspopup="true"
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleKeyDown(e);
        }
      }}
    >
      <Text
        tag="span"
        type="text3"
        className={styles.text}
        dataCy={"toggle-text"}
      >
        {menuTitle}
        <Icon
          size={{ w: 2, h: 2 }}
          src="arrowDown.svg"
          className={cx({
            [styles.dropdownIconRotate]: expandMenu,
          })}
          alt=""
        />
      </Text>
    </Dropdown.Toggle>
  );
}

function DropdownMenu({
  menuItems,
  selected,
  setSelected,
  expandMenu,
  setExpandMenu,
  context,
  router,
}) {
  return (
    <Dropdown.Menu
      show={expandMenu}
      className={styles.dropdownMenu}
      role="navigation"
      aria-labelledby="navigationbutton"
      data-cy="dropdown-nav"
      tabIndex={-1}
    >
      {menuItems.map((item, i) => (
        <DropdownItem
          key={`nav-item-${item}`} //TODO use url?
          item={item}
          i={i}
          menuItems={menuItems}
          selected={selected}
          setSelected={setSelected}
          setExpandMenu={setExpandMenu}
          context={context}
          router={router}
        />
      ))}
    </Dropdown.Menu>
  );
}

function DropdownItem({
  item,
  menuItems,
  selected,
  setSelected,
  setExpandMenu,
  context,
  i,
  router,
}) {
  const listItemRef = useRef(null);

  const urlEnding = encodeString(
    Translate({
      context: context,
      label: menuItems[i],
      requestedLang: "da",
    })
  );

  // useEffect(() => {
  //   if (router.asPath.includes(urlEnding) && selected !== i) {
  //     setSelected(i);
  //   }
  // }, [router.asPath]);

  // useEffect(() => {
  //   if (selected === i) {
  //     listItemRef.current.focus();
  //   }
  // }, [selected, i]);

  useEffect(() => {
    if (listItemRef.current) {
      listItemRef.current.focus();
    }
  }, []);

  /**
   * Handles keyboard navigation in dropdown menu
   * If arrowDown or up, we can click into next or previous item
   * @param {*} e
   */
  function handleKeyDown(e) {
    if (e.key === "ArrowDown" && i < menuItems.length - 1) {
      e.preventDefault();
      const nextItem = listItemRef.current.nextSibling;
      if (nextItem) {
        nextItem.focus();
      }
    } else if (e.key === "ArrowUp" && i > 0) {
      e.preventDefault();
      const prevItem = listItemRef.current.previousSibling;
      if (prevItem) {
        prevItem.focus();
      }
    } else if (e.key === "Enter") {
      listItemRef.current.blur();
      setExpandMenu(false);
      setSelected(i);
    }
  }

  return (
    // we use Link instead of Dropdown.Item, since Dropdown.Item rerenders entire page and makes site blink
    <li
      className={cx(styles.linkBackground, {
        [styles.linkBackgroundSelected]: selected === i,
      })}
      ref={listItemRef}
      onKeyDown={(e) => {
        handleKeyDown(e);
      }}
      tabIndex={0}
    >
      <div role="button" tabIndex={-1}>
        <Link //TODO we have to have onclick here
          role="menuitem"
          className={styles.link}
          dataCy={`mobile-link-${item}`}
          href={`/profil/${urlEnding}`}
          border={false}
          key={`/profil/${urlEnding}`}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              selected === i ? setSelected(-1) : setSelected(i);
            }
          }}
          // onClick={() => {
          //   selected === i ? setSelected(-1) : setSelected(i);
          // }}
        >
          <Text tag="span" type="text3" className={styles.text}>
            {Translate({
              context: context,
              label: menuItems[i],
            })}
            {selected === i && (
              <Icon
                size={{ w: "1_5", h: "1_5" }}
                src="checkmark_blue.svg"
                alt=""
                role="presentation"
              />
            )}
          </Text>
        </Link>
      </div>
    </li>
  );
}
