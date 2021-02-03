import { useState, useEffect } from "react";

import { materials, actions } from "@/components/navigation";
import { cyKey } from "@/utils/trim";

import Title from "@/components/base/title";
import Link from "@/components/base/link";
import Translate from "@/components/base/translate";

import { Arrow } from "@/components/article/preview";

import styles from "./Menu.module.css";

function Menu({ visible = false }) {
  const context = { context: "navigation" };

  // Expanded status
  const [expanded, setExpanded] = useState(false);

  //  Close expanded categories on Modal close
  useEffect(() => {
    if (!visible) {
      setExpanded(false);
    }
  }, [visible]);

  const expandedClass = expanded ? styles.expanded : "";

  return (
    <div className={`${styles.menu} ${expandedClass}`}>
      <a className={styles.trigger} onClick={() => setExpanded(!expanded)}>
        <Title type="title3">
          {Translate({ ...context, label: "categories" })}
        </Title>
        <Arrow className={styles.arrow} />
      </a>

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
                <li>
                  <Title type="title3">
                    {Translate({ ...context, label: a.label })}
                  </Title>
                </li>
              </Link>
            );
          })}
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
                <li>
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

export default Menu;
