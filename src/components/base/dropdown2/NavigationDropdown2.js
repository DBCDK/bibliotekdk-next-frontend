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
  version = "small",
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
  const [expandMenu, setExpandMenu] = useState(false);
  const menuRef = useRef(null);
  const [itemRefs, setItemRefs] = useState([]);

  useEffect(() => {
    initializeItemRefs();
  }, []);

  const initializeItemRefs = () => {
    setItemRefs((itemRefs) =>
      Array(menuItems.length)
        .fill(null)
        .map((_, i) => itemRefs[i] || createRef())
    );
  };

  useEffect(() => {
    // Detect clicks outside of menu
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setExpandMenu(false);
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
      setExpandMenu(true);
    }
    // either first element in list, or one next
    const toFocus =
      active === -1 || active === menuItems.length - 1 ? 0 : active + 1;
    if (active === -1) {
      //todo delete?
      setExpandMenu(true);
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
      setExpandMenu(true);
    }
    // either last element in list, or one previous
    const toFocus =
      active === -1 || active === 0 ? menuItems.length - 1 : active - 1;

    if (itemRefs[toFocus] && itemRefs[toFocus].current) {
      const current = itemRefs[toFocus].current;
      current?.focus();
    }
  };

  /**
   * TODO add last item goes to first item when clicking down/right and the other way around
   * TODO from start button come to first item
   * Handles keyboard navigation in dropdown menu, especially for firefox
   * If arrowDown or up, we can click into next or previous item
   * @param {*} e
   */
  function onMenuKeyDown(e, i) {
    switch (e.key) {
      case "Escape":
        setExpandMenu(false);
        break;
      case "ArrowDown":
      case "ArrowRight":
        e.preventDefault();
        tabNext();
        break;
      case "ArrowUp":
      case "ArrowLeft":
        tabPrevious();
        break;
      case "Tab": {
        const lastIndex = menuItems.length - 1;
        if (itemRefs[lastIndex] && itemRefs[lastIndex].current) {
          const current = itemRefs[lastIndex].current;
          if (current === document.activeElement) {
            setExpandMenu(false);
          }
        }
        break;
      }
    }
  }

  const onButtonClick = (e) => {
    if (e.key === "Enter") {
      setExpandMenu(!expandMenu);
    }
  };

  const onLinkClick = (e) => {
    if (onItemClick) {
      onItemClick(e);
    }
    setExpandMenu(false);
  };

  const isSelectedLink = (index) => {
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
      onKeyDown={onMenuKeyDown}
    >
      <div
        role="button"
        id={uniqueIdMenu}
        aria-haspopup="true"
        aria-controls={uniqueIdButton}
        aria-expanded={expandMenu}
        tabIndex={0}
        onClick={() => setExpandMenu(!expandMenu)}
        onKeyDown={onButtonClick}
        className={cx({
          [styles.dropdownToggle]: true,
          [styles.menuButton_small]: version === "small",
          [styles.menuButton_active]: expandMenu,
        })}
      >
        <div>{menuTitle}</div>
        <span
          className={cx({
            [styles.chevron]: true,
            [styles.chevron_small]: version === "small",
            [styles.chevron_active]: expandMenu,
          })}
        >
          <Icon
            size={{ w: 2, h: 2 }}
            src="arrowDown.svg"
            className={cx({
              [styles.dropdownIconRotate]: expandMenu,
            })}
            alt=""
          />
        </span>
      </div>

      {expandMenu && (
        <ul
          id={uniqueIdButton}
          role="menu"
          aria-labelledby={uniqueIdMenu}
          className={styles.menu}
        >
          {menuItems.map((item, index) => {
            const link = encodeString(
              Translate({
                context: context,
                label: menuItems[index],
                requestedLang: "da",
              })
            );
            return (
              <Link
                key={`/profil/${link}`}
                role="menuitem"
                href={link}
                onClick={onLinkClick}
                ref={itemRefs[index]}
                // data-cy={`link-dropdown-${cleanUrl(item.text)}`}
                {...linkProps}
              >
                <a
                  onClick={onLinkClick}
                  ref={itemRefs[index]}
                  className={cx({
                    [styles.menuItem]: true,
                    [styles.menuItem_small]: version === "small",
                    [styles.menuItem_selected]: isSelectedLink(index),
                  })}
                >
                  {Translate({
                    context: context,
                    label: menuItems[index],
                  })}
                  {isSelectedLink(index) && (
                    <span className={styles.checkmark} role="presentation">
                      <Icon
                        size={{ w: "1_5", h: "1_5" }}
                        src="checkmark_blue.svg"
                        alt=""
                      />
                    </span>
                  )}
                </a>
              </Link>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default LinkDropdown;
