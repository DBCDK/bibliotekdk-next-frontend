import React, { useState } from "react";
import Router from "next/router";
import Text from "@/components/base/text/Text";
import styles from "@/components/help/menu/HelpTextMenu.module.css";
import Icon from "@/components/base/icon/Icon";
import classNames from "classnames/bind";
import Link from "@/components/base/link";
import { useData } from "@/lib/api/api";
import { publishedHelptexts } from "@/lib/api/helptexts.fragments";
import PropTypes from "prop-types";
import { encodeString } from "@/lib/utils";

import { helpTextParseMenu } from "../utils.js";
import Skeleton from "@/components/base/skeleton";
import { getLangcode } from "@/components/base/translate/Translate";
import Translate from "@/components/base/translate";

/**
 * Other menu links
 *
 * @returns {component}
 */
function MenuLink({ label, href = "#!", active = false }) {
  const activeClass = active ? styles.active : "";
  const type = active ? "text1" : "text2";

  return (
    <div className={`${styles.link} ${activeClass}`}>
      <Link href={href}>
        <Text type={type}>{Translate({ context: "help", label })}</Text>
        <Icon src="arrowrightblue.svg" size={[1]} />
      </Link>
    </div>
  );
}

/**
 * Component to show helptext menu in groups
 * @param menus
 * @param groups
 * @param helpTextId
 * @return {*}
 * @constructor
 */
function HelpTextGroups({ menus, groups, helpTextId, className }) {
  const [expandedGroup, setExpandedGroup] = useState();

  return groups.map((group, index) => {
    const expanded = index === expandedGroup;

    // find the active link if this is a direct entry
    let activelink = false;

    activelink = menus[group.name].find(
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
          className={styles.helpgroup}
          onClick={() => {
            setExpandedGroup(index === expandedGroup ? null : index);
          }}
        >
          <Text type="text2" lines={30} key={`helpmenu-${index}`}>
            <span className={styles.helpicongroup}>
              <Icon
                size={{ w: 1, h: 1 }}
                src="arrowrightblue.svg"
                className={classNames(
                  expanded || activelink ? styles.helpiconrotate : ""
                )}
              />
            </span>
            <span>
              {Translate({ context: "helpmenu", label: `${group.name}` })}
            </span>
          </Text>
        </div>
        <div
          key={`dev-helpmenu-${index}`}
          className={classNames(expanded || activelink ? "" : styles.helphide)}
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
 * @return {JSX.Element}
 * @constructor
 */
export function HelpTextMenu({ helpTexts, helpTextId, ...props }) {
  const menus = helpTextParseMenu(helpTexts);
  const groups = Object.keys(menus).map((groupname, index) => {
    return { name: groupname };
  });

  const isFaqPage = Router.pathname.includes("/faq");

  return (
    <>
      <MenuLink label="Help and guides" href="/hjaelp" />
      <MenuLink label="faq-title" href="/hjaelp/faq" active={isFaqPage} />
      <HelpTextGroups
        {...props}
        menus={menus}
        helpTextId={helpTextId}
        groups={groups}
      />
    </>
  );
}

/**
 * Get a link for a helptext
 * @param menuItems
 * @param group
 * @param helpTextId
 * @return {*}
 * @constructor
 */
function HelptTextMenuLinks({ menuItems, group, helpTextId }) {
  return menuItems[group.name].map((item, index) => (
    <div className={styles.helplink} key={`div-menulink-${index}`}>
      <Link
        href={`/hjaelp/${encodeString(item.title)}/${item.id}`}
        key={`menulink-${index}`}
        className={classNames(
          menuItems[group.name][index].id === parseInt(helpTextId, "10")
            ? styles.helpactive
            : ""
        )}
      >
        <Text type="text2" lines={2}>
          {item.title}
          {menuItems[group.name][index].id === parseInt(helpTextId, "10") && (
            <span className={styles.helpiconlink}>
              <Icon size={{ w: 1, h: 1 }} src="arrowrightblue.svg" />
            </span>
          )}
        </Text>
      </Link>
    </div>
  ));
}

/**
 * Get all helptexts from api
 * @return {{isLoading, data}}
 */
function getPublishedHelpTexts() {
  const langcode = { language: getLangcode() };
  const { isLoading, data } = useData(publishedHelptexts(langcode));
  return { isLoading, data };
}

/**
 * Default export function for component
 * @param helpTextId
 * @return {JSX.Element|null}
 * @constructor
 */
export default function Wrap({ helpTextId, ...props }) {
  const { isLoading, data } = getPublishedHelpTexts();

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
