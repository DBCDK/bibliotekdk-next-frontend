import Link from "next/link";
import { useRouter } from "next/router";
import { createRef, useEffect, useRef, useState } from "react";
import Icon from "@/components/base/icon";
import cx from "classnames";
import styles from "./NavigationDropdown2.module.css";
import Translate from "@/components/base/translate";
import { encodeString } from "@/lib/utils";

/**
 * This component creates a dropdown with links inside.
 *
 * There is 2 variants of the dropdown, small and large. Both contain a list of links, which switches the user's active page on activation
 * This component should standardize the accessability concerns in creating a mix between an accordion and a link list.
 */

const LinkDropdown = ({
  uniqueIdButton = "linkmenu",
  uniqueIdMenu = "menubutton",
  version = "large",
  active = 0,
  onItemClick,
  linkProps,
  className,
  context,
  menuItems,
}) => {
  const menuTitle = Translate({
    context: context,
    label: "profileMenu",
  });
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [itemRefs, setItemRefs] = useState([]);

  useEffect(() => {
    // Update with active page
    setItemRefs((itemRefs) =>
      Array(menuItems.length)
        .fill([])
        .map((_, i) => itemRefs[i] || createRef())
    );
  }, []);

  useEffect(() => {
    // Detect clicks outside of menu
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const tabNext = async () => {
    const active = itemRefs.findIndex(
      (ref) => ref.current === document.activeElement
    );
    if (active === -1) {
      await setIsMenuOpen(true);
    }
    // either first element in list, or one next
    const toFocus =
      active === -1 || active === menuItems.length - 1 ? 0 : active + 1;
    if (active === -1) {
      setIsMenuOpen(true);
    }

    if (itemRefs[toFocus] && itemRefs[toFocus].current) {
      const current = itemRefs[toFocus].current;
      current?.focus();
    }
  };

  const tabPrevious = async () => {
    const active = itemRefs.findIndex(
      (ref) => ref.current === document.activeElement
    );
    if (active === -1) {
      await setIsMenuOpen(true);
    }
    // either last element in list, or one previous
    const toFocus =
      active === -1 || active === 0 ? menuItems.length - 1 : active - 1;

    if (itemRefs[toFocus] && itemRefs[toFocus].current) {
      const current = itemRefs[toFocus].current;
      current?.focus();
    }
  };

  const onMenuKeyDown = (e) => {
    switch (e.key) {
      case "Escape":
        setIsMenuOpen(false);
        break;
      case "ArrowUp":
      case "ArrowLeft":
        tabPrevious();
        break;
      case "ArrowRight":
      case "ArrowDown":
        tabNext();
        break;
      case "Tab": {
        const lastIndex = menuItems.length - 1;
        if (itemRefs[lastIndex] && itemRefs[lastIndex].current) {
          const current = itemRefs[lastIndex].current;
          if (current === document.activeElement) {
            setIsMenuOpen(false);
          }
        }
        break;
      }
    }
  };

  const onButtonClick = (e) => {
    if (e.key === "Enter") {
      setIsMenuOpen(!isMenuOpen);
    }
  };

  const onLinkClick = (e) => {
    if (onItemClick) {
      onItemClick(e);
    }

    setIsMenuOpen(false);
  };

  const isLinkActive = (index) => {
    return router.asPath.includes(
      encodeString(
        Translate({
          context: context,
          label: menuItems[index],
          requestedLang: "da",
        })
      )
    );
  };

  return (
    <div
      className={cx(className, {
        [styles.wrapper]: true,
        [styles.wrapper_small]: version === "small",
      })}
      ref={menuRef}
      tabIndex={0}
      onKeyDown={onMenuKeyDown}
    >
      <div
        role="button"
        id={uniqueIdMenu}
        aria-haspopup="true"
        aria-controls={uniqueIdButton}
        aria-expanded={isMenuOpen}
        tabIndex={1}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        onKeyDown={onButtonClick}
        className={cx({
          [styles.menuButton]: true,
          [styles.menuButton_small]: version === "small",
          [styles.menuButton_active]: isMenuOpen,
        })}
      >
        <div>{menuTitle}</div>
        <span
          className={cx({
            [styles.chevron]: true,
            [styles.chevron_small]: version === "small",
            [styles.chevron_active]: isMenuOpen,
          })}
        >
          <Icon
            size={{ w: 2, h: 2 }}
            src="arrowDown.svg"
            className={cx({
              [styles.dropdownIconRotate]: true, //expandMenu,
            })}
            alt=""
          />
        </span>
      </div>

      <ul
        id={uniqueIdButton}
        role="menu"
        aria-labelledby={uniqueIdMenu}
        className={cx({
          [styles.menu]: true,
          [styles.menu_small]: version === "small",
          [styles.menu_active]: isMenuOpen,
        })}
      >
        {isMenuOpen &&
          menuItems.map((item, index) => (
            <Link
              key={`/profil/${index}`} //TODO
              role="menuitem"
              href={encodeString(
                Translate({
                  context: context,
                  label: menuItems[index],
                  requestedLang: "da",
                })
              )}
              className={cx({
                [styles.menuItem]: true,
                [styles.menuItem_small]: version === "small",
                [styles.menuItem_active]: isLinkActive(index),
              })}
              onClick={onLinkClick}
              ref={itemRefs[index]}
              // data-cy={`link-dropdown-${cleanUrl(item.text)}`}
              {...linkProps}
            >
              <span style={{ display: "flex" }}>
                {Translate({
                  context: context,
                  label: menuItems[index],
                })}
                {isLinkActive(item) && (
                  <span className={styles.checkmark} role="presentation">
                    <Icon size={{ w: 1, h: 1 }} src="checkmark.svg" alt="" />
                  </span>
                )}
              </span>
            </Link>
          ))}
      </ul>
    </div>
  );
};

export default LinkDropdown;
