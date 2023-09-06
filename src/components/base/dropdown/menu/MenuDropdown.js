import Link from "next/link";
import { useRouter } from "next/router";
import { createRef, useEffect, useRef, useState } from "react";

import cx from "classnames";
import styles from "./MenuDropdown.module.scss";
import ConditionalWrapper from "@/components/base/conditionalwrapper";

/*type MenuOption = {
  text: string;
  link: string;
};*/

/*interface ILinkDropdown extends HTMLAttributes<HTMLDivElement> {
  menuOptions: MenuOption[];
  uniqueIdButton?: string;
  uniqueIdMenu?: string;
  version?: "large" | "small";
  active?: number;
  onItemClick?: (e?: MouseEvent | KeyboardEvent) => void;
  linkProps?: Omit<LinkProps, "href">;
  isHeader?: boolean;
}*/

/**
 * This component creates a dropdown with links inside.
 *
 * There is 2 variants of the dropdown, small and large. Both contain a list of links, which switches the user's active page on activation
 * This component should standardize the accessability concerns in creating a mix between an accordion and a link list.
 *
 * There has been some debate whether this should be considered an accordion or a menu or perhaps a controlled region.
 * In this case we went for a menu, as it seemed most appropriate.
 *
 * The challenge with menus are the key handling, which require handling of arrow keys, home and end
 * See https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/menu_role
 */

const LinkDropdown = ({
  uniqueIdButton = "linkmenu",
  uniqueIdMenu = "menubutton",
  menuOptions,
  version = "large",
  active = 0,
  onItemClick,
  linkProps,
  className,
  isHeader = false,
}) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [itemRefs, setItemRefs] = useState([]);

  useEffect(() => {
    // Update with active page
    setItemRefs((itemRefs) =>
      Array(menuOptions.length)
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
      active === -1 || active === menuOptions.length - 1 ? 0 : active + 1;
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
      active === -1 || active === 0 ? menuOptions.length - 1 : active - 1;

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
        const lastIndex = menuOptions.length - 1;
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

  const getContent = () => {
    if (version === "large") {
      return menuOptions.find((option) => router.asPath.startsWith(option.link))
        ?.text;
    } else if (version === "small") {
      return menuOptions[active].text;
    }
  };

  const isLinkActive = (item) => {
    if (version === "large") {
      return router.asPath.startsWith(item.link);
    } else if (version === "small") {
      return menuOptions[active].link === item.link;
    }
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
        aria-expanded={isMenuOpen}
        tabIndex={0}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        onKeyDown={onButtonClick}
        className={cx({
          [styles.menuButton]: true,
          [styles.menuButton_small]: version === "small",
          [styles.menuButton_active]: isMenuOpen,
        })}
      >
        <ConditionalWrapper
          condition={isHeader}
          wrapper={(children) => (
            <h1 className={styles.headerTag}>{children}</h1>
          )}
        >
          <>{getContent()}</>
        </ConditionalWrapper>
        <span
          className={cx({
            [styles.chevron]: true,
            [styles.chevron_small]: version === "small",
            [styles.chevron_active]: isMenuOpen,
          })}
        >
          {/* <ChevronIcon /> */}
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
          menuOptions.map((item, index) => (
            <Link
              key={item.link}
              role="menuitem"
              href={item.link}
              className={cx({
                [styles.menuItem]: true,
                [styles.menuItem_small]: version === "small",
                [styles.menuItem_active]: isLinkActive(item),
              })}
              onClick={onLinkClick}
              ref={itemRefs[index]}
              // data-cy={`link-dropdown-${cleanUrl(item.text)}`}
              {...linkProps}
            >
              {item.text}
              {isLinkActive(item) && (
                <span className={styles.checkmark} role="presentation">
                  {/* <CheckmarkIcon /> */}
                </span>
              )}
            </Link>
          ))}
      </ul>
    </div>
  );
};

export default LinkDropdown;
