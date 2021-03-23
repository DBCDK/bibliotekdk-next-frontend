import React, { useState } from "react";
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

/**
 * Component to show helptext menu in groups
 * @param menus
 * @param groups
 * @param helpTextId
 * @return {*}
 * @constructor
 */
function HelpTextGroups({ menus, groups, helpTextId, className }) {
  // use state to handle clickevent on group
  const [showGroups, setShowGroups] = useState(groups);
  const rowClicked = (index) => {
    let groupStates = [...groups];

    groupStates.forEach((group, idx) => {
      if (idx !== index) {
        group.open = false;
      }
    });
    // toggle state of clicked group
    groupStates[index].open = !groupStates[index].open;
    // set new state(s)
    setShowGroups(groupStates);
  };

  return showGroups.map((group, index) => {
    // find the active link if this is a direct entry
    let activelink = false;

    activelink = menus[group.name].find(
      ({ id }) => parseInt(helpTextId, "10") === id
    );

    return (
      <div key={`group-${index}`} className={className} data-cy="help-menu">
        <div
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              rowClicked(index);
            }
          }}
          className={styles.helpgroup}
          onClick={() => {
            rowClicked(index);
          }}
        >
          <Text type="text2" lines={30} key={`helpmenu-${index}`}>
            <span className={styles.helpicongroup}>
              <Icon
                size={{ w: 1, h: 1 }}
                src="arrowrightblue.svg"
                className={classNames(
                  group.open || activelink ? styles.helpiconrotate : ""
                )}
              />
            </span>
            <span>{group.name}</span>
          </Text>
        </div>
        <div
          key={`dev-helpmenu-${index}`}
          className={classNames(
            group.open || activelink ? "" : styles.helphide
          )}
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
    return { name: groupname, open: false };
  });

  return (
    <HelpTextGroups
      {...props}
      menus={menus}
      helpTextId={helpTextId}
      groups={groups}
    />
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
  const { isLoading, data } = useData(publishedHelptexts());
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
