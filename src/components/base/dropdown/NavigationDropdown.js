import { encodeString } from "@/lib/utils";
import Dropdown from "react-bootstrap/Dropdown";

import Icon from "@/components/base/icon";
import Text from "@/components/base/text";

import Translate from "@/components/base/translate";
import { useState, useEffect } from "react";
import styles from "./NavigationDropdown.module.css";
import { useRouter } from "next/router";
import Link from "../link/Link";
import cx from "classnames";

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
        onClick={() => setExpandMenu(!expandMenu)}
        onKeyDown={(e) => {
          console.log("key", e.key);

          if (e.key === "Enter") {
            console.log("open or close ", !expandMenu);
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

function DropdownToggle({ onClick, onKeyDown, menuTitle, expandMenu }) {
  return (
    <Dropdown.Toggle
      variant="success"
      id="menubutton"
      className={styles.dropdownToggle}
      onClick={onClick}
      onKeyDown={(e) => {
        console.log(e.key);
        if (e.key === "Enter") {
          onKeyDown(e);
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
      role="menu"
      aria-labelledby="menubutton"
      data-cy="dropdown-menu"
    >
      {menuItems.map((item, i) => (
        <DropdownItem
          key={`menu-item-${item}`} //TODO use url?
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
  const urlEnding = encodeString(
    Translate({
      context: context,
      label: menuItems[i],
      requestedLang: "da",
    })
  );

  useEffect(() => {
    if (router.asPath.includes(urlEnding) && selected !== i) {
      setSelected(i);
    }
  }, [router.asPath]);

  return (
    // we use Link instead of Dropdown.Item, since Dropdown.Item rerenders entire page and makes site blink
    <li className={cx({ [styles.linkBackgroundSelected]: selected === i })}>
      <Link
        dataCy={`mobile-link-${item}`}
        href={`/profil/${urlEnding}`}
        border={false}
        role="menuitem"
        key={`/profil/${urlEnding}`}
        className={cx(styles.link, { [styles.linkSelected]: selected === i })}
        onClick={() => {
          if (selected === i) {
            setExpandMenu(false);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && selected === i) {
            setExpandMenu(false);
          }
        }}
      >
        <Text tag="span" type="text3" className={styles.text}>
          {Translate({
            context: context,
            label: menuItems[i],
          })}
          {selected === i && (
            <Icon
              size={{ w: "1_5", h: "1_5" }}
              src="checkmark.svg"
              alt=""
              role="presentation"
            />
          )}
        </Text>
      </Link>
    </li>
  );
}
