import Link from "next/link";
import { useRouter } from "next/router";
import { createRef, useEffect, useRef, useState } from "react";
import Icon from "@/components/base/icon";
import cx from "classnames";
import styles from "./NavigationDropdown.module.css";
import Translate from "@/components/base/translate";
import { encodeString } from "@/lib/utils";
import animations from "@/components/base/animation/animations.module.css";

/**
 * This component creates a dropdown with links inside.
 * This component should standardize the accessability concerns in creating a mix between an accordion and a link list.
 */

function LinkDropdown({
  context,
  menuItems,
  uniqueIdButton = "linkmenu",
  uniqueIdMenu = "menuButton",
}) {
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
      setExpandMenu(true);
    }
    // either first element in list, or one next
    const toFocus =
      active === -1 || active === menuItems.length - 1 ? 0 : active + 1;

    if (itemRefs[toFocus] && itemRefs[toFocus].current) {
      const current = itemRefs[toFocus].current;
      current?.focus();
    }
  }

  async function tabPrevious() {
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
    <div
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
        className={cx(animations["on-hover"], animations["on-focus"], {
          [styles.menuButton]: true,
        })}
      >
        <div data-cy="menu-title">{menuTitle}</div>
        <span className={styles.chevron}>
          <Icon
            size={{ w: 2, h: 2 }}
            src={expandMenu ? "arrowUp.svg" : "arrowDown.svg"}
            className={cx(animations["h-elastic"], animations["f-elastic"])}
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
}

export default LinkDropdown;
