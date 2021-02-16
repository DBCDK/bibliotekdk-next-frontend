import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { materials, actions } from "@/components/navigation";
import { cyKey } from "@/utils/trim";

import Title from "@/components/base/title";
import Link from "@/components/base/link";
import Translate from "@/components/base/translate";

import AnimationLine from "@/components/base/animation/line";

import { Arrow } from "@/components/article/preview";

import styles from "./Menu.module.css";

/**
 * The Component function
 *
 * @param {obj} props
 * @param {obj} props.isVisible modal is currently active/visible
 * See propTypes for specific props and types
 *
 * @returns {component}
 */

function Menu({ isVisible = false, onLang = null }) {
  const context = { context: "navigation" };

  // Expanded status
  const [expanded, setExpanded] = useState(false);

  //  Close expanded categories on Modal close
  useEffect(() => {
    if (!isVisible) {
      setExpanded(false);
    }
  }, [isVisible]);

  const expandedClass = expanded ? styles.expanded : "";

  return (
    <div className={`${styles.menu} ${expandedClass}`} data-cy="menu-modal">
      <div
        className={styles.trigger}
        tabIndex={isVisible ? "0" : "-1"}
        onClick={(e) => setExpanded(!expanded)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.keyCode === 13) {
            setExpanded(!expanded);
          }
        }}
      >
        <Link
          onClick={(e) => e.preventDefault()}
          border={false}
          tabIndex={"-1"}
          className={styles.link}
          dataCy={cyKey({
            name: "categories",
            prefix: "menu-link",
          })}
        >
          <Title type="title3">
            {Translate({ ...context, label: "categories" })}
          </Title>
          <AnimationLine />
        </Link>
        <Arrow className={styles.arrow} />
      </div>

      <div className={`${styles.wrap}`}>
        <ul aria-hidden={expanded}>
          {actions.map((a) => {
            const title = Translate({ ...context, label: a.label });

            return (
              <li key={a.label}>
                <Link
                  className={styles.link}
                  tabIndex={!expanded && isVisible ? "0" : "-1"}
                  title={title}
                  href={a.href}
                  dataCy={cyKey({
                    name: a.label,
                    prefix: "menu-link",
                  })}
                >
                  <Title type="title3">{title}</Title>
                </Link>
              </li>
            );
          })}
          <li className={styles.language}>
            <Link
              onClick={(e) => {
                e.preventDefault();
                onLang && onLang();
              }}
              className={styles.link}
              tabIndex={!expanded && isVisible ? "0" : "-1"}
              dataCy={cyKey({
                name: "language",
                prefix: "menu-link",
              })}
            >
              {Translate({ context: "general", label: "language" })}
            </Link>
          </li>
        </ul>
        <ul aria-hidden={!expanded}>
          {materials.map((m) => {
            return (
              <li key={m.label}>
                <Link
                  className={styles.link}
                  tabIndex={expanded && isVisible ? "0" : "-1"}
                  href={m.href}
                  dataCy={cyKey({
                    name: m.label,
                    prefix: "menu-link",
                  })}
                >
                  <Title type="title3">
                    {Translate({ context: "general", label: m.label })}
                  </Title>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

// PropTypes for component
Menu.propTypes = {
  isVisible: PropTypes.bool,
  onClose: PropTypes.func,
  onLang: PropTypes.func,
};

export default Menu;
