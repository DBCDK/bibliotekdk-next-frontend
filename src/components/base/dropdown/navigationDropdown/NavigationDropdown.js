import Link from "next/link";
import { useRouter } from "next/router";
import { createRef, useEffect, useRef, useState } from "react";
import Icon from "@/components/base/icon";
import cx from "classnames";
import styles from "./NavigationDropdown.module.css";
import Translate from "@/components/base/translate";
import { encodeString } from "@/lib/utils";
import animations from "css/animations";
import Text from "@/components/base/text";

/**
 * Navigation dropdown. Use this menu for a menu with redirects - not actions
 *
 * This component creates a dropdown with links inside.
 * This component should standardize the accessability concerns in creating a mix between an accordion and a link list.
 */

function LinkDropdown({ context, menuItems }) {
  const uniqueIdButton = "linkmenu";
  const uniqueIdMenu = "menuButton";
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

  function initializeItemRefs() {
    setItemRefs((itemRefs) =>
      Array(menuItems.length)
        .fill(null)
        .map((_, i) => itemRefs[i] || createRef())
    );
  }

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

  async function tabNext() {
    const active = itemRefs.findIndex(
      (ref) => ref.current === document.activeElement
    );
    if (active === -1) {
      //await does have effect despite warning and ensures that first item in list is set into focus
      await setExpandMenu(true);
    }
    // either first element in list, or one next
    const toFocus =
      active === -1 || active === menuItems.length - 1 ? 0 : active + 1;

    itemRefs[toFocus]?.current?.focus();
  }

  async function tabPrevious() {
    const active = itemRefs.findIndex(
      (ref) => ref.current === document.activeElement
    );

    if (active === -1) {
      //await does have effect despite warning and ensures that last item in list is set into focus
      await setExpandMenu(true);
    }
    // either last element in list, or one previous
    const toFocus =
      active === -1 || active === 0 ? menuItems.length - 1 : active - 1;

    itemRefs[toFocus]?.current?.focus();
  }

  /**
   * Handles keyboard navigation in dropdown menu
   * If arrowDown/right or up/left, we can click into next or previous item
   * @param {*} e
   */
  function onMenuKeyDown(e) {
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

  function onButtonClick(e) {
    if (e.key === "Enter") {
      setExpandMenu(!expandMenu);
    }
  }

  function onLinkClick(index) {
    if (isSelectedLink(index)) {
      setExpandMenu(false);
    }
  }

  function isSelectedLink(index) {
    return router.asPath.includes(
      encodeString(
        Translate({
          context: context,
          label: menuItems[index],
          requestedLang: "da",
        })
      )
    );
  }

  return (
    <nav
      className={cx(styles.wrapper, { [styles.wrapper_expanded]: expandMenu })}
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
        data-cy="mobile-menu-button"
        className={cx(
          animations["on-hover"],
          animations["on-focus"],
          styles.menuButton
        )}
      >
        <Text tag="div" type="text3" dataCy="menu-title">
          {menuTitle}
        </Text>
        <span className={styles.chevron}>
          <Icon
            size={{ w: 2, h: 2 }}
            src={"arrowUp.svg"}
            className={cx(
              styles.icon,
              animations["h-elastic"],
              animations["f-elastic"],
              {
                [styles.icon_open]: expandMenu,
              }
            )}
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
          data-cy="mobile-menu"
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
                ref={itemRefs[index]}
              >
                <a
                  onClick={() => onLinkClick(index)}
                  data-cy={`mobile-link-${menuItems[index]}`}
                  ref={itemRefs[index]}
                  className={cx({
                    [styles.menuItem]: true,
                    [styles.menuItem_selected]: isSelectedLink(index),
                  })}
                >
                  <Text tag="span" type="text3">
                    {Translate({
                      context: context,
                      label: menuItems[index],
                    })}
                  </Text>

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
    </nav>
  );
}

export default LinkDropdown;
