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
import { getLanguage } from "@/components/base/translate/Translate";
import Translate from "@/components/base/translate";
import { LinkOnlyInternalAnimations } from "@/components/base/link/Link";

/**
 * Other menu links
 *
 * @returns {JSX.Element}
 */
function MenuLink({ label, href = "#!", active = false }) {
  const activeClass = active ? styles.active : "";
  const type = active ? "text1" : "text2";

  return (
    <div className={`${styles.link} ${activeClass}`}>
      <Link
        href={href}
        dataCy="menu-fixed-links"
        data_use_new_underline={true}
        data_display={"inline"}
      >
        <Text type={type}>{Translate({ context: "help", label })}</Text>
      </Link>
      <Icon src="arrowrightblue.svg" size={1} />
    </div>
  );
}

/**
 * Component to show helptext menu in groups
 * @param menus
 * @param groups
 * @param helpTextId
 * @param className
 * @return {*}
 * @constructor
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
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export function HelpTextMenu({ helpTexts, helpTextId, ...props }) {
  const menus = helpTextParseMenu(helpTexts);
  const groups = Object.keys(menus).map((groupname) => {
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
      <LinkOnlyInternalAnimations
        href={`/hjaelp/${encodeString(item.title)}/${item.id}`}
        key={`menulink-${index}`}
        className={classNames(
          menuItems[group.name][index].id === parseInt(helpTextId, "10")
            ? styles.helpactive
            : ""
        )}
      >
        <Text type="text2" lines={2}>
          <Link data_use_new_underline={true} data_display={"inline"}>
            {item.title}
            {menuItems[group.name][index].id === parseInt(helpTextId, "10") && (
              <span className={styles.helpiconlink}>
                <Icon size={{ w: 1, h: 1 }} src="arrowrightblue.svg" />
              </span>
            )}
          </Link>
        </Text>
      </LinkOnlyInternalAnimations>
    </div>
  ));
}

/**
 * Default export function for component
 * @param helpTextId
 * @param props
 * @return {JSX.Element|null}
 * @constructor
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
