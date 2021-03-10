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

    const [showMenus, setShowMenus] = useState(menus);
    const rowClicked = ({ group }) => {
      // toggle state of clicked group
      showMenus[group].open = !showMenus[group].open;
      // set new state(s)
      setShowMenus(showMenus);
    };

    return Object.keys(showMenus).map((group, index) => {
      console.log(showMenus, "FISK");
      return (
        <div className={styles.helpmenu} key={`group-${index}`}>
          <Text
            tabIndex="0"
            type="text1"
            lines={30}
            key={`helpmenu-${index}`}
            className={classNames(
              showMenus[group].open ? styles.active : styles.helpgroup
            )}
            onClick={() => {
              rowClicked({ group });
            }}
          >
            <span>
              <Icon size={{ w: 1, h: 1 }} src="arrowrightblue.svg" />
            </span>
            <span>{group}</span>
          </Text>
          <HelptTextMenuLinks
            menuItems={showMenus}
            group={group}
            helpTextId={helpTextId}
            key={`links-${index}`}
          />
        </div>
      );
    });
  }
}

function HelptTextMenuLinks({ menuItems, group, helpTextId }) {
  // @TODO style the link
  return menuItems[group].map((item, index) => (
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
        className={classNames(
          styles.helplink,
          menuItems[group][index].id === parseInt(helpTextId.helptxtId, "10")
            ? styles.active
            : ""
        )}
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
