import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { materials, actions } from "@/components/navigation";
import { cyKey } from "@/utils/trim";

import Title from "@/components/base/title";
import Link from "@/components/base/link";
import Translate from "@/components/base/translate";

import { Arrow } from "@/components/article/preview";

import styles from "./Menu.module.css";

/**
 * The Component function
 *
 * @param {obj} props
 * @param {obj} props.isVisible // modal is currently active/visible
 * See propTypes for specific props and types
 *
 * @returns {component}
 */

function Menu({ isVisible = false }) {
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
    <div className={`${styles.menu} ${expandedClass}`}>
      <div
        className={styles.trigger}
        tabindex={isVisible ? "0" : "-1"}
        onClick={() => setExpanded(!expanded)}
        onKeyDown={(e) => {
          console.log("e", e);
          if (e.key === "Enter" || e.keyCode === 13) {
            setExpanded(!expanded);
          }
        }}
      >
        <Title type="title3">
          {Translate({ ...context, label: "categories" })}
        </Title>
        <Arrow className={styles.arrow} />
      </div>

      <div className={`${styles.wrap}`}>
        <ul>
          {actions.map((a) => {
            return (
              <Link
                a={false}
                key={a.label}
                href={a.href}
                dataCy={cyKey({
                  name: a.label,
                  prefix: "header-link",
                })}
              >
                <li tabindex={!expanded && isVisible ? "0" : "-1"}>
                  <Title type="title3">
                    {Translate({ ...context, label: a.label })}
                  </Title>
                </li>
              </Link>
            );
          })}
          <li
            className={styles.language}
            tabindex={!expanded && isVisible ? "0" : "-1"}
          >
            English
          </li>
        </ul>
        <ul>
          {materials.map((m) => {
            return (
              <Link
                a={false}
                key={m.label}
                href={m.href}
                dataCy={cyKey({
                  name: m.label,
                  prefix: "header-link",
                })}
              >
                <li tabindex={isVisible && expanded ? "0" : "-1"}>
                  <Title type="title3">
                    {Translate({ ...context, label: m.label })}
                  </Title>
                </li>
              </Link>
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
};

export default Menu;
