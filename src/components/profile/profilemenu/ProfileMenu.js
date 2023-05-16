import Text from "@/components/base/text/Text";
import Title from "@/components/base/title";
import Link from "@/components/base/link";
import Icon from "@/components/base/icon/Icon";
import styles from "@/components/profile/profilemenu/ProfileMenu.module.css";
import Translate from "@/components/base/translate/Translate";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
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
 * @param groupName
 * @return {*}
 * @constructor
 */
function MenuLinks({ menuItems, groupName, activeIndex, setActiveIndex }) {
  return menuItems[groupName].map((item, index) => {
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
          href={`/profil/laan-og-reserveringer#${titleDanish.toLowerCase()}`} //TODO dont hardcode
          key={`menulink-${index}`}
          className={`${styles.subLink} ${classNames(
            index === activeIndex ? styles.helpactive : ""
          )}`}
          onClick={() => setActiveIndex(index)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              setActiveIndex(index);
            }
          }}
        >
          <Text type="text2">{title}</Text>
          {index === activeIndex && (
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
  const [expandedGroup, setExpandedGroup] = useState(); //number
  const [activeIndex, setActiveIndex] = useState();

  useEffect(() => {
    console.log("expandedGroup", expandedGroup);
    if (!active) {
      setExpandedGroup();
    }
  }, [active]);

  return groups.map((group, index) => {
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
              setActiveLink(links[0]);
            }
          }}
          onClick={() => {
            setExpandedGroup(index === expandedGroup ? null : index);
            setActiveLink(links[0]);
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
                  index === expandedGroup ? styles.helpiconrotate : ""
                )}
              />
            </span>
            <Title type={index === expandedGroup ? "title4" : "title5"}>
              {Translate({
                context: "profile",
                label: `${group.name}`,
              })}
            </Title>
          </div>
        </div>
        <div
          key={`dev-helpmenu-${index}`}
          className={classNames(index === expandedGroup ? "" : styles.helphide)}
        >
          <MenuLinks
            menuItems={menus}
            groupName={group.name}
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
 * Menu item, that contains subcategories as links
 * @param menus
 * @param groups
 * @param className
 * @param setActiveLink
 * @param active
 * @return {*}
 * @constructor
 */
function MenuGroup({ menus, name, className, setActiveLink, active }) {
  const [activeIndex, setActiveIndex] = useState();
  const router = useRouter();

  return (
    <div
      key={`menu-component-${name}`}
      className={className}
      data-cy="help-menu"
    >
      <div
        tabIndex={0}
        className={styles.helpgroup}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            setActiveLink(active ? "" : name);
            router.push(`/profil/laan-og-reserveringer`);
          }
        }}
        onClick={() => {
          setActiveLink(active ? "" : name);
          router.push(`/profil/laan-og-reserveringer`);
        }}
      >
        <div lines={30} key={`helpmenu-${name}`} className={styles.menuGroups}>
          <span className={styles.helpicongroup}>
            <Icon
              size={{ w: 1, h: 1 }}
              src="arrowrightblue.svg"
              className={classNames(active ? styles.helpiconrotate : "")}
            />
          </span>
          <Title type={active ? "title4" : "title5"}>
            {Translate({
              context: "profile",
              label: `${name}`,
            })}
          </Title>
        </div>
      </div>
      <div
        key={`dev-helpmenu-${name}`}
        className={classNames(active ? "" : styles.helphide)}
      >
        <MenuLinks
          menuItems={menus}
          groupName={name}
          key={`links-${name}`}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
        />
      </div>
    </div>
  );
}

/**
 * ProfileMenu to use in /profil subpages
 * Renders a side menu on left side
 *
 * @returns {JSX.Element}
 */
export default function ProfileMenu() {
  const [activeLink, setActiveLink] = useState();

  const menus = {
    loansAndReservations: [
      { title: "debt", id: 0 },
      { title: "loan", id: 1 },
      { title: "reservations", id: 2 },
    ],
    secondGroup: [
      { title: "debt", id: 0 },
      { title: "loan", id: 1 },
      { title: "reservations", id: 2 },
    ],
  };
  const groups = [
    { name: "loansAndReservations", id: 0 },
    { name: "secondGroup", id: 1 },
  ];

  return (
    <>
      {/* <MenuGroups
        menus={menus}
        groups={groups}
        setActiveLink={setActiveLink}
        active={activeLink === links[0]}
      /> */}
      <MenuGroup
        menus={menus}
        name={links[0]}
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
