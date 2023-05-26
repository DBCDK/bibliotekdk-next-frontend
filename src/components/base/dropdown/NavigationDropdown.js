import { encodeString } from "@/lib/utils";
import Dropdown from "react-bootstrap/Dropdown";

import Icon from "@/components/base/icon";
import Text from "@/components/base/text";

import Translate from "@/components/base/translate";
import { useState, useRef, useEffect } from "react";
import styles from "./NavigationDropdown.module.css";
import classNames from "classnames/bind";
import { useRouter } from "next/router";
import Link from "../link/Link";

export default function NavigationDropdown({ context, menuItems }) {
  const ref = useRef(null);
  const router = useRouter();
  const [selected, setSelected] = useState(0);

  return (
    <Dropdown
      type="nav"
      role="navigation"
      className={styles.dropdownWrap}
      ref={ref}
    >
      <Dropdown.Toggle
        variant="success"
        id="dropdown-basic"
        className={styles.dropdownToggle}
      >
        <Text tag="span" type="text3" className={styles.text}>
          {Translate({
            context: context,
            label: "profileMenu",
          })}
          <Icon
            size={{ w: 1, h: 1 }}
            src="arrowrightblue.svg"
            className={styles.dropdownIcon}
            alt=""
          />
        </Text>
      </Dropdown.Toggle>
      <Dropdown.Menu className={styles.dropdownMenu}>
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
    if (router.asPath.includes(urlEnding)) {
      setSelected(i);
    }
  }, [router.asPath]);

  return (
    // we use Link instead of Dropdown.Item, since Dropdown.Item rerenders entire page and makes site blink
    <div
      className={classNames(
        selected === i ? styles.linkBackgroundSelected : ""
      )}
    >
      <Link
        dataCy={`mobile-link-${item}`}
        href={`/profil/${urlEnding}`}
        className={classNames(
          styles.link,
          selected === i ? styles.itemSelected : ""
        )}
        onClick={() => setSelected(i)}
      >
        <Text tag="span" type="text3" className={styles.text}>
          {Translate({
            context: context,
            label: menuItems[i],
          })}
          {selected === i && (
            <Icon
              size={{ w: 1.5, h: 1.5 }}
              className={styles.navItemIcon}
              src="checkmark.svg"
              alt=""
            />
          )}
        </Text>
      </Link>
    </div>
  );
}
