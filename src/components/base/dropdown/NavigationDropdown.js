import { encodeString } from "@/lib/utils";
import Dropdown from "react-bootstrap/Dropdown";

import Icon from "@/components/base/icon";
import Text from "@/components/base/text";

import Translate from "@/components/base/translate";
import { useState, useEffect } from "react";
import styles from "./NavigationDropdown.module.css";
import classNames from "classnames/bind";
import { useRouter } from "next/router";
import Link from "../link/Link";

function DropdownToggle({ menuTitle: menuTitle }) {
  return (
    <Dropdown.Toggle
      variant="success"
      id="dropdown-basic"
      className={styles.dropdownToggle}
    >
      <Text tag="span" type="text3" className={styles.text}>
        {menuTitle}
        <Icon
          size={{ w: 1, h: 1 }}
          src="arrowrightblue.svg"
          //className={styles.dropdownIcon}
          alt=""
        />
      </Text>
    </Dropdown.Toggle>
  );
}

export default function NavigationDropdown({ context, menuItems }) {
  const router = useRouter();
  const menuTitle = Translate({
    context: context,
    label: "profileMenu",
  });
  const [selected, setSelected] = useState(0);

  return (
    <Dropdown type="nav" role="navigation" className={styles.dropdownWrap}>
      <DropdownToggle menuTitle={menuTitle} />
      <Dropdown.Menu className={styles.dropdownMenu} role="list">
        {menuItems.map((item, i) => (
          <DropdownItem
            key={`nav-item-${i}`}
            item={item}
            i={i}
            menuItems={menuItems}
            selected={selected}
            setSelected={setSelected}
            context={context}
            router={router}
          />
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

function DropdownItem({
  item,
  menuItems,
  selected,
  setSelected,
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
    <li
      className={classNames(
        selected === i ? styles.linkBackgroundSelected : ""
      )}
    >
      <Link
        dataCy={`mobile-link-${item}`}
        href={`/profil/${urlEnding}`}
        border={{ border: false }}
        className={classNames(
          styles.link,
          selected === i ? styles.linkSelected : ""
        )}
      >
        <Text
          tag="span"
          type="text3"
          className={classNames(
            styles.text,
            selected === i ? styles.textSelected : styles.textNotSelected
          )}
        >
          {Translate({
            context: context,
            label: menuItems[i],
          })}
          {selected === i && (
            <Icon
              size={{ w: 1, h: 1 }} //TODO
              src="checkmark.svg"
              alt=""
            />
          )}
        </Text>
      </Link>
    </li>
  );
}
