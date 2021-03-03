import { useData } from "@/lib/api/api";
import { publishedHelptexts } from "@/lib/api/helptexts.fragments.js";
import Title from "@/components/base/title";
import Text from "@/components/base/text";
import styles from "./HelpTexts.module.css";
import Link from "@/components/base/link";

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
  if (isLoading) {
    return null;
  } else {
    const menus = helpTextParseMenu(data.nodeQuery.entities);
    return Object.keys(menus).map((menu, index) => (
      <div className={styles.helpmenu} key={`menu-${index}`}>
        <Text
          type="text1"
          lines={30}
          key={index}
          className={styles.helpmenugroup}
        >
          <span>{menu}</span>
        </Text>
        <HelptTextMenuLinks
          menuItems={menus}
          item={menu}
          key={`links-${index}`}
        />
      </div>
    ));
  }
}

function HelptTextMenuLinks({ menuItems, item }) {
  // @TODO style the link
  return menuItems[item].map((item, index) => (
    <Link
      children={
        <Text type="text3" lines={2}>
          {item.title}
        </Text>
      }
      className={styles.helplink}
      href={{ pathname: `/helptexts/${item.id}`, query: {} }}
      key={`menulink-${index}`}
    />
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
