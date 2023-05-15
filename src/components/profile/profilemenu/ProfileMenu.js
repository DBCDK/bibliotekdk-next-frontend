import Text from "@/components/base/text/Text";
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
function MenuLink({ label, href = "#!", setActiveLink, active = false }) {
  const activeClass = active ? styles.active : "";
  const type = active ? "text1" : "text2";

  return (
    <div
      className={`${styles.link} ${activeClass}`}
      onClick={() => setActiveLink(links[0])}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          setActiveLink(links[0]);
        }
      }}
    >
      <Link href={href} dataCy="menu-fixed-links">
        <Text type={type}>{Translate({ context: "profile", label })}</Text>
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
function MenuGroup({ menuItems, group }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return menuItems[group.name].map((item, index) => (
    <div className={styles.helplink} key={`div-menulink-${index}`}>
      <Link
        href={`/profil/laan-og-reserveringer#${item.title}`}
        key={`menulink-${index}`}
        className={classNames(item.id === activeIndex ? styles.helpactive : "")}
        onClick={() => setActiveIndex(item.id)}
      >
        <Text type="text2" lines={2}>
          {Translate({
            context: "profile",
            label: `${item.title}`,
          })}
          {item.id === activeIndex && (
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
 * List of menu groups that contain links
 * @param menus
 * @param groups
 * @param className
 * @param setActiveLink
 * @param active
 * @return {*}
 * @constructor
 */
function MenuGroups({ menus, groups, className, active, setActiveLink }) {
  const [expandedGroup, setExpandedGroup] = useState();

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
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              setExpandedGroup(index === expandedGroup ? null : index);
              setActiveLink(links[1]);
            }
          }}
          className={styles.helpgroup}
          onClick={() => {
            setExpandedGroup(index === expandedGroup ? null : index);
            setActiveLink(links[1]);
          }}
        >
          <Text type="text2" lines={30} key={`helpmenu-${index}`}>
            <span className={styles.helpicongroup}>
              <Icon
                size={{ w: 1, h: 1 }}
                src="arrowrightblue.svg"
                className={classNames(
                  expanded || active ? styles.helpiconrotate : ""
                )}
              />
            </span>
            <span>
              {Translate({
                context: "profile",
                label: `${group.name}`,
              })}
            </span>
          </Text>
        </div>
        <div
          key={`dev-helpmenu-${index}`}
          className={classNames(expanded || active ? "" : styles.helphide)}
        >
          <MenuGroup menuItems={menus} group={group} key={`links-${index}`} />
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

  return (
    <>
      <MenuLink
        label={links[0]}
        href="/profil/mine-biblioteker"
        active={activeLink === links[0]}
        setActiveLink={setActiveLink}
      />
      <MenuGroups
        menus={menus}
        groups={groups}
        active={activeLink === links[1]}
        setActiveLink={setActiveLink}
      />
    </>
  );
}
