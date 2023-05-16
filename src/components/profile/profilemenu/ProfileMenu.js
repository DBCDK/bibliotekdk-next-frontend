import Text from "@/components/base/text/Text";
import Title from "@/components/base/title";
import Link from "@/components/base/link";
import Icon from "@/components/base/icon/Icon";
import styles from "@/components/profile/profilemenu/ProfileMenu.module.css";
import Translate from "@/components/base/translate/Translate";
import { useEffect, useState } from "react";
import classNames from "classnames/bind";

const links = ["loansAndReservations", "myLibraries"];

/**
 * Other menu links
 *
 * @returns {JSX.Element}
 */
function MenuLink({ label, href = "#!", setActiveLink, active }) {
  const activeClass = active ? styles.active : "";
  const type = active ? "title4" : "title5";

  return (
    <div className={`${styles.link} ${activeClass}`}>
      <Link
        href={href}
        dataCy="menu-fixed-links"
        onClick={() => setActiveLink(links[1])}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            setActiveLink(links[1]);
          }
        }}
      >
        <Title type={type}>{Translate({ context: "profile", label })}</Title>
      </Link>
      <Icon src="arrowrightblue.svg" size={1} />
    </div>
  );
}

/**
 * One group of menu links
 * for example "Lån og reserveringer", which contains subcategories: "Lån", "Reserveringer", "Mellemværende"
 * @param menuItems
 * @param group
 * @return {*}
 * @constructor
 */
function MenuGroup({ menuItems, group, activeIndex, setActiveIndex }) {
  return menuItems[group.name].map((item, index) => {
    const title = Translate({
      context: "profile",
      label: `${item.title}`,
    });
    const titleDanish = Translate({
      context: "profile",
      label: `${item.title}`,
      requestedLang: "da",
    });
    return (
      <div className={styles.helplink} key={`div-menulink-${index}`}>
        <Link
          href={`/profil/laan-og-reserveringer#${titleDanish.toLowerCase()}`}
          key={`menulink-${index}`}
          className={`${styles.subLink} ${classNames(
            item.id === activeIndex ? styles.helpactive : ""
          )}`}
          onClick={() => setActiveIndex(item.id)}
        >
          <Text type="text2">{title}</Text>
          {item.id === activeIndex && (
            <span className={styles.helpiconlink}>
              <Icon size={{ w: 1, h: 1 }} src="arrowrightblue.svg" />
            </span>
          )}
        </Link>
      </div>
    );
  });
}

/**
 * List of menu groups that contain links
 * @param menus
 * @param groups
 * @param className
 * @param setActiveLink
 * @param active
 * @return {*}
 * @constructor
 */
function MenuGroups({ menus, groups, className, setActiveLink, active }) {
  const [expandedGroup, setExpandedGroup] = useState();
  const [activeIndex, setActiveIndex] = useState(0);

  console.log("loans and reservations ", active);

  useEffect(() => {
    if (!active) {
      setExpandedGroup();
    }
  }, [active]);

  return groups.map((group, index) => {
    const expanded = index === expandedGroup;

    return (
      <div
        key={`group-${group.name}-${index}`}
        className={className}
        data-cy="help-menu"
      >
        <div
          tabIndex={0}
          className={styles.helpgroup}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              setExpandedGroup(index === expandedGroup ? null : index);
              setActiveLink(links[1]);
            }
          }}
          onClick={() => {
            setExpandedGroup(index === expandedGroup ? null : index);
            setActiveLink(links[1]);
          }}
        >
          <div
            lines={30}
            key={`helpmenu-${index}`}
            className={styles.menuGroups}
          >
            <span className={styles.helpicongroup}>
              <Icon
                size={{ w: 1, h: 1 }}
                src="arrowrightblue.svg"
                className={classNames(
                  expanded || active ? styles.helpiconrotate : ""
                )}
              />
            </span>
            <Title type={active ? "title4" : "title5"}>
              {Translate({
                context: "profile",
                label: `${group.name}`,
              })}
            </Title>
          </div>
        </div>
        <div
          key={`dev-helpmenu-${index}`}
          className={classNames(expanded || active ? "" : styles.helphide)}
        >
          <MenuGroup
            menuItems={menus}
            group={group}
            key={`links-${index}`}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />
        </div>
      </div>
    );
  });
}

/**
 * ProfileMenu to use in /profil subpages
 * Renders a side menu on left side
 *
 * @returns {JSX.Element}
 */
export default function ProfileMenu() {
  const [activeLink, setActiveLink] = useState(links[0]);

  const menus = {
    loansAndReservations: [
      { title: "debt", id: 0 },
      { title: "loan", id: 1 },
      { title: "reservations", id: 2 },
    ],
  };
  const groups = [{ name: "loansAndReservations", id: 0 }];

  useEffect(() => {
    console.log("ACTIVELINK", activeLink);
  }, []);

  return (
    <>
      <MenuGroups
        menus={menus}
        groups={groups}
        setActiveLink={setActiveLink}
        active={activeLink === links[0]}
      />
      <MenuLink
        label={links[1]}
        href="/profil/mine-biblioteker"
        setActiveLink={setActiveLink}
        active={activeLink === links[1]}
      />
    </>
  );
}
