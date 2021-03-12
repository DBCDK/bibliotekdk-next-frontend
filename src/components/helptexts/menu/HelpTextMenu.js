import React, { useState } from "react";
import Text from "@/components/base/text/Text";
import styles from "@/components/helptexts/HelpTexts.module.css";
import Icon from "@/components/base/icon/Icon";
import classNames from "classnames/bind";
import Link from "@/components/base/link";
import { useData } from "@/lib/api/api";
import { publishedHelptexts } from "@/lib/api/helptexts.fragments";
import PropTypes from "prop-types";

/**
 * Component to show helptext menu in groups
 * @param menus
 * @param groups
 * @param helpTextId
 * @return {*}
 * @constructor
 */
function HelpTextGroups({ menus, groups, helpTextId }) {
  // use state to handle clickevent on group
  const [showGroups, setShowGroups] = useState(groups);
  const rowClicked = ({ index }) => {
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
      <div key={`group-${index}`}>
        <Text
          tabIndex="0"
          type="text1"
          lines={30}
          key={`helpmenu-${index}`}
          className={styles.helpgroup}
          onClick={() => {
            rowClicked({ index });
          }}
        >
          <span className={styles.helpicon}>
            <Icon size={{ w: 1, h: 1 }} src="arrowrightblue.svg" />
          </span>
          <span>{group.name}</span>
        </Text>
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
export function HelpTextMenu({ helpTexts, helpTextId }) {
  const menus = helpTextParseMenu(helpTexts);
  const groups = Object.keys(menus).map((groupname, index) => {
    return { name: groupname, open: false };
  });

  return (
    <HelpTextGroups menus={menus} helpTextId={helpTextId} groups={groups} />
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
      <span className={styles.helpicon}>
        <Icon size={{ w: 1, h: 1 }} src="arrowrightblue.svg" />
      </span>
      <Link
        children={
          <Text type="text3" lines={2}>
            {item.title}
          </Text>
        }
        href={{ pathname: `/help/${item.title}/${item.id}`, query: {} }}
        key={`menulink-${index}`}
        className={classNames(
          menuItems[group.name][index].id === parseInt(helpTextId, "10")
            ? styles.helpactive
            : ""
        )}
      />
    </div>
  ));
}

/**
 * Defines an element in a help group
 * @param heltptext
 * @return {{id: (number|string|*), title}}
 */
function setGroupElement(heltptext) {
  return {
    id: heltptext.nid,
    title: heltptext.title,
  };
}

/**
 * Parse helptexts by groups
 * @param helpTexts
 * @return {{}}
 *  eg. {Søgning:[{id:25, title:fisk}. {id:1,title:hest}]}
 */
function helpTextParseMenu(helpTexts) {
  // sort helptexts by group
  const structuredHelpTexts = {};
  let element = {};
  let group;
  helpTexts.forEach((helptext, idx) => {
    element = setGroupElement(helptext);
    group = helptext.fieldHelpTextGroup;
    if (structuredHelpTexts[group]) {
      structuredHelpTexts[group].push(element);
    } else {
      structuredHelpTexts[group] = [element];
    }
  });
  return structuredHelpTexts;
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
 * @param helpTextID
 * @return {JSX.Element|null}
 * @constructor
 */
export default function Wrap({ helpTextID }) {
  const { isLoading, data } = getPublishedHelpTexts();
  if (!data || !data.nodeQuery || !data.nodeQuery.entities || data.error) {
    // @TODO skeleton
    return null;
  }
  const allHelpTexts = data.nodeQuery.entities;
  return <HelpTextMenu helpTexts={allHelpTexts} helpTextId={helpTextID} />;
}

HelpTextMenu.propTypes = {
  helpTexts: PropTypes.object,
  helpTextId: PropTypes.string,
};
