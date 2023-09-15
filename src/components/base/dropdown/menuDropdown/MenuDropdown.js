import Button from "@/components/base/button";
import { createRef, useEffect, useRef, useState } from "react";
import cx from "classnames";
import styles from "./MenuDropdown.module.css";

const MenuDropdown = ({
  options,
  onItemClick: onParentClick,
  uniqueIdButton = "menudropdown-button",
  uniqueIdMenu = "menudropdown-menu",
}) => {
  const menuRef = useRef(null);
  const [itemRefs, setItemRefs] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Update with active page
    setItemRefs((itemRefs) =>
      Array(options.length)
        .fill([])
        .map((_, i) => itemRefs[i] || createRef())
    );
  }, []);

  useEffect(() => {
    // Detect clicks outside of menu
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current?.contains(event.target)) {
        setIsOpen(false);
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
      await setIsOpen(true);
    }
    // either first element in list, or one next
    const toFocus =
      active === -1 || active === options.length - 1 ? 0 : active + 1;
    if (active === -1) {
      setIsOpen(true);
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
      await setIsOpen(true);
    }
    // either last element in list, or one previous
    const toFocus =
      active === -1 || active === 0 ? options.length - 1 : active - 1;

    if (itemRefs[toFocus] && itemRefs[toFocus].current) {
      const current = itemRefs[toFocus].current;
      current?.focus();
    }
  };

  const onMenuKeyDown = (e) => {
    switch (e.key) {
      case "Escape":
        setIsOpen(false);
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
        const lastIndex = options.length - 1;
        if (itemRefs[lastIndex] && itemRefs[lastIndex].current) {
          const current = itemRefs[lastIndex].current;
          if (current === document.activeElement) {
            setIsOpen(false);
          }
        }
        break;
      }
    }
  };

  const onItemClick = (idx) => {
    if (onParentClick) {
      onParentClick(idx);
    }
    setIsOpen(false);
  };

  return (
    <div className={styles.container} onKeyDown={onMenuKeyDown} ref={menuRef}>
      <Button
        type="secondary"
        size="small"
        onClick={() => setIsOpen(!isOpen)}
        id={uniqueIdMenu}
        aria-haspopup="true"
        aria-controls={uniqueIdButton}
        aria-expanded={isOpen}
      >
        Administrer
      </Button>

      <ul
        id={uniqueIdButton}
        role="menu"
        aria-labelledby={uniqueIdMenu}
        className={cx(styles.menu, {
          [styles.menu_open]: isOpen,
        })}
      >
        {options.map((option, i) => (
          <div
            key={`option-${option}`}
            role="menuitem"
            tabIndex={0}
            onClick={() => onItemClick(i)}
            className={styles.menuitem}
            ref={itemRefs[i]}
          >
            {option}
          </div>
        ))}
      </ul>
    </div>
  );
};

export default MenuDropdown;
