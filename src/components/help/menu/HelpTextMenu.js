import React, { useState } from "react";
import Router from "next/router";
import Text from "@/components/base/text/Text";
import styles from "./HelpTextMenu.module.css";
import Icon from "@/components/base/icon/Icon";
import cx from "classnames";
import Link from "@/components/base/link";
import { useData } from "@/lib/api/api";
import { publishedHelptexts } from "@/lib/api/helptexts.fragments";
import PropTypes from "prop-types";
import { encodeString } from "@/lib/utils";

import { helpTextParseMenu } from "../utils.js";
import Skeleton from "@/components/base/skeleton";
import { getLanguage } from "@/components/base/translate/Translate";
import Translate from "@/components/base/translate";

/**
 * Other menu links
 *
 * @returns {React.JSX.Element}
 */
function MenuLink({ label, href = "#!", active = false }) {
  const type = active ? "text1" : "text2";

  return (
    <div className={styles.link}>
      <Link href={href} dataCy="menu-fixed-links">
        <Text type={type} tag="span">
          {Translate({ context: "help", label })}
        </Text>
      </Link>
      {active && (
        <span className={styles.helpiconlink}>
          <Icon src="arrowrightblue.svg" size={1} />
        </span>
      )}
    </div>
  );
}

/**
 * Component to show helptext menu in groups
 * @param menus
 * @param groups
 * @param helpTextId
 * @param className
 * @returns {React.JSX.Element}
 */
function HelpTextGroups({ menus, groups, helpTextId, className }) {
  const [expandedGroup, setExpandedGroup] = useState();

  return groups.map((group, index) => {
    const expanded = index === expandedGroup;

    const activelink = menus[group.name].find(
      ({ id }) => parseInt(helpTextId, "10") === id
    );

    return (
      <div
        key={`group-${group.name}-${index}`}
        className={className}
        data-cy="help-menu"
      >
        <div
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              setExpandedGroup(index === expandedGroup ? null : index);
            }
          }}
          onClick={() => {
            setExpandedGroup(index === expandedGroup ? null : index);
          }}
        >
          <Text
            type={expanded || activelink ? "text1" : "text2"}
            lines={30}
            key={`helpmenu-${index}`}
          >
            <span className={styles.helpicongroup}>
              <Icon
                size={{ w: 1, h: 1 }}
                src="arrowrightblue.svg"
                className={expanded || activelink ? styles.helpiconrotate : ""}
              />
            </span>
            <Link>
              {Translate({ context: "helpmenu", label: `${group.name}` })}
            </Link>
          </Text>
        </div>
        <div
          key={`dev-helpmenu-${index}`}
          className={cx({
            [styles.helphide]: !(expanded || activelink),
          })}
        >
          <HelptTextMenuLinks
            menuItems={menus}
            group={group}
            helpTextId={helpTextId}
            key={`links-${index}`}
          />
        </div>
      </div>
    );
  });
}

/**
 * Entry function for helptext menu, parse helptext in menu groups - return the menu
 * @param helpTexts
 * @param helpTextId
 * @param props
 * @returns {React.JSX.Element}
 */
export function HelpTextMenu({ helpTexts, helpTextId, ...props }) {
  const menus = helpTextParseMenu(helpTexts);
  const groups = Object.keys(menus).map((groupname) => {
    return { name: groupname };
  });

  const isFaqPage = Router.pathname.includes("/faq");

  return (
    <div className={styles.container}>
      <MenuLink label="Help and guides" href="/hjaelp" />
      <MenuLink label="faq-title" href="/hjaelp/faq" active={isFaqPage} />
      <HelpTextGroups
        {...props}
        menus={menus}
        helpTextId={helpTextId}
        groups={groups}
      />
    </div>
  );
}

/**
 * Get a link for a helptext
 * @param menuItems
 * @param group
 * @param helpTextId
 * @returns {React.JSX.Element}
 */
function HelptTextMenuLinks({ menuItems, group, helpTextId }) {
  return menuItems[group.name].map((item, index) => {
    const active = item.id === parseInt(helpTextId, "10");

    return (
      <div className={styles.helplink} key={`div-menulink-${index}`}>
        <Link
          href={`/hjaelp/${encodeString(item.title)}/${item.id}`}
          key={`menulink-${index}`}
        >
          <Text type={active ? "text1" : "text2"} lines={2} tag="span">
            {item.title}
          </Text>
        </Link>
        {active && (
          <span className={styles.helpiconlink}>
            <Icon size={{ w: 1, h: 1 }} src="arrowrightblue.svg" />
          </span>
        )}
      </div>
    );
  });
}

/**
 * Default export function for component
 * @param helpTextId
 * @param props
 * @returns {React.ReactElement|null}
 */
export default function Wrap({ helpTextId, ...props }) {
  const { isLoading, data } = useData(
    publishedHelptexts({ language: getLanguage() })
  );

  if (isLoading) {
    return <Skeleton className={styles.helpskeleton} lines={8} />;
  }

  if (!data || !data.nodeQuery || !data.nodeQuery.entities || data.error) {
    // @TODO some error here .. message for user .. log ??
    return null;
  }

  const allHelpTexts = data.nodeQuery.entities;

  return (
    <HelpTextMenu {...props} helpTexts={allHelpTexts} helpTextId={helpTextId} />
  );
}

HelpTextMenu.propTypes = {
  helpTexts: PropTypes.array,
  helpTextId: PropTypes.string,
};
