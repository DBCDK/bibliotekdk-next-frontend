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
    >
      <DropdownToggle
        menuTitle={menuTitle}
        onClick={() => setExpandMenu(!expandMenu)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setExpandMenu(!expandMenu);
          }
        }}
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

function DropdownToggle({ onClick, menuTitle: menuTitle }) {
  return (
    <Dropdown.Toggle
      variant="success"
      id="dropdown-basic"
      className={styles.dropdownToggle}
      onClick={onClick}
    >
      <Text
        tag="span"
        type="text3"
        className={styles.text}
        dataCy={"toggle-text"}
      >
        {menuTitle}
        <Icon
          size={{ w: 1, h: 1 }}
          src="arrowrightblue.svg"
          className={styles.dropdownIcon}
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
      role="list"
      data-cy="dropdown-menu"
    >
      {menuItems.map((item, i) => (
        <DropdownItem
          key={`nav-item-${i}`}
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
            <Icon size={{ w: 1, h: 1 }} src="checkmark.svg" alt="" />
          )}
        </Text>
      </Link>
    </li>
  );
}
