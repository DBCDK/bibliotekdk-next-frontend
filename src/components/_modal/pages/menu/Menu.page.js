import PropTypes from "prop-types";

import Language from "@/components/base/language";

import { actions } from "@/lib/Navigation";
import { cyKey } from "@/utils/trim";

import Top from "../base/top";

import Title from "@/components/base/title";
import Text from "@/components/base/text";
import Link from "@/components/base/link";

import Translate from "@/components/base/translate";

import styles from "./Menu.module.css";

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */

function Menu({ modal }) {
  return (
    <div className={`${styles.menu}`} data-cy="menu-modal">
      <Top
        modal={modal}
        title={Translate({ context: "modal", label: "title-menu" })}
        className={{
          top: styles.top,
          close: styles.close,
          back: styles.back,
        }}
      />
      <ul>
        {actions.map((a) => {
          const title = Translate({
            context: "navigation",
            label: a.label,
          });
          // BETA-1 hide non working menu items @see lib/Navigation.js
          const hiddenClass = a.hidden ? styles.hidden : "";
          // Link tabIndex can also be removed when hiddenClass is no longer needed
          return (
            <li key={a.label} className={hiddenClass}>
              <Title type="title5" tag="h2">
                <Link
                  className={`${styles.link}`}
                  title={title}
                  href={a.href}
                  dataCy={cyKey({
                    name: a.label,
                    prefix: "menu-link",
                  })}
                >
                  {title}
                </Link>
              </Title>
            </li>
          );
        })}
        <li className={styles.language}>
          <Language>
            <Link className={styles.link} dataCy="menu-link-language">
              <Text type="text2">
                {Translate({ context: "general", label: "language" })}
              </Text>
            </Link>
          </Language>
        </li>
      </ul>
    </div>
  );
}

// PropTypes for component
Menu.propTypes = {
  active: PropTypes.bool,
  modal: PropTypes.object,
  context: PropTypes.object,
};

export default Menu;
