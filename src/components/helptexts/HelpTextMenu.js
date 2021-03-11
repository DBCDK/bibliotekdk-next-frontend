import React, { useState } from "react";
import Text from "@/components/base/text/Text";
import styles from "@/components/helptexts/HelpTexts.module.css";
import Icon from "@/components/base/icon/Icon";
import classNames from "classnames/bind";
import Link from "@/components/base/link";
import { getPublishedHelpTexts } from "@/components/helptexts/HelpText";

function HelpTextGroups({ menus, groups, helpTextId }) {
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

export function HelpTextMenu({ helpTexts, helpTextId }) {
  const menus = helpTextParseMenu(helpTexts);
  const groups = Object.keys(menus).map((group, index) => {
    return { name: group, open: false };
  });

  return (
    <HelpTextGroups menus={menus} helpTextId={helpTextId} groups={groups} />
  );
}

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
        href={{ pathname: `/helptexts/${item.id}`, query: {} }}
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

function setGroupElement(heltptext) {
  return {
    id: heltptext.nid,
    title: heltptext.title,
  };
}

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

export default function Wrapper({ helpTextID }) {
  const { isLoading, data } = getPublishedHelpTexts();
  if (!data || !data.nodeQuery || !data.nodeQuery.entities || data.error) {
    // @TODO skeleton
    return null;
  }

  const allHelpTexts = data.nodeQuery.entities;
  return <HelpTextMenu helpTexts={allHelpTexts} helpTextId={helpTextID} />;
}
