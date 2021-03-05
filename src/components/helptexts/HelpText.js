import { useData } from "@/lib/api/api";
import { publishedHelptexts } from "@/lib/api/helptexts.fragments.js";
import Title from "@/components/base/title";
import Text from "@/components/base/text";
import styles from "./HelpTexts.module.css";
import Link from "@/components/base/link";
import classNames from "classnames/bind";
import React, { useState } from "react";
import Icon from "@/components/base/icon";
import { Row } from "react-bootstrap";

export function getPublishedHelpTexts() {
  const { isLoading, data } = useData(publishedHelptexts());
  return { isLoading, data };
}

export function HelpText({ helptext }) {
  if (helptext.title && helptext.body) {
    return (
      <React.Fragment>
        <Title type="title4">{helptext.title}</Title>
        <Text type="text2" lines={30}>
          <span dangerouslySetInnerHTML={{ __html: helptext.body.value }} />
        </Text>
      </React.Fragment>
    );
  } else {
    return null;
  }
}

export function HelpTextMenu({ helpTextId }) {
  // @TODO use helptxtId to activate a menu
  // get all helptexts
  const { isLoading, data } = getPublishedHelpTexts();

  // @TODO datacheck
  if (isLoading) {
    return null;
  } else {
    const menus = helpTextParseMenu(data.nodeQuery.entities);
    return Object.keys(menus).map((menu, index) => (
      <div className={styles.helpmenu} key={`menu-${index}`}>
        <Text
          tabIndex="0"
          type="text1"
          lines={30}
          key={index}
          className={classNames(menu.open ? styles.active : styles.helplink)}
        >
          <span>
            <Icon size={{ w: 1, h: 1 }} src="arrowrightblue.svg" />
          </span>
          <span>{menu}</span>
        </Text>
        <HelptTextMenuLinks
          parent={menu}
          menuItems={menus}
          item={menu}
          helpTextId={helpTextId}
          key={`links-${index}`}
        />
      </div>
    ));
  }
}

function HelptTextMenuLinks({ parent, menuItems, item, helpTextId }) {
  // @TODO style the link
  return menuItems[item].map((item, index) => (
    <div>
      <span>
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
        className={styles.helplink}
      />
    </div>
  ));
}

function helpTextParseMenu(helptTexts) {
  // sort helptexts by group
  const structuredHelpTexts = {};
  let element = {};
  let group;
  helptTexts.forEach((helptext, idx) => {
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

function setGroupElement(heltptext) {
  return {
    id: heltptext.nid,
    title: heltptext.title,
  };
}

export default function Wrapper(props) {
  const { helptexts } = getPublishedHelpTexts();
  return <HelpText {...props} helptexts={helptexts} />;
}
