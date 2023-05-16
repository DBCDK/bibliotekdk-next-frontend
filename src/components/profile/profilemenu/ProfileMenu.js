import Text from "@/components/base/text/Text";
import Title from "@/components/base/title";
import Link from "@/components/base/link";
import Icon from "@/components/base/icon/Icon";
import styles from "@/components/profile/profilemenu/ProfileMenu.module.css";
import Translate from "@/components/base/translate/Translate";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import classNames from "classnames/bind";
import useUser from "@/components/hooks/useUser";

const links = ["loansAndReservations", "myLibraries"];
const menus = {
  loansAndReservations: [
    { title: "debt", id: 0, number: 0 },
    { title: "loans", id: 1, number: 0 },
    { title: "orders", id: 2, number: 0 },
  ],
};

/**
 * Simple menu link. Used in ProfileMenu.
 *
 * @returns {JSX.Element}
 */
function MenuLink({ label, href }) {
  const router = useRouter();
  const [isActive, setIsActive] = useState(router.asPath.includes(href));

  useEffect(() => {
    setIsActive(router.asPath.includes(href));
  }, [router.asPath]);

  const type = isActive ? "title4" : "title5";
  const activeClass = isActive ? styles.active : "";

  return (
    <div className={`${styles.link} ${activeClass}`}>
      <Link href={href} dataCy="menu-fixed-links">
        <Title type={type}>{Translate({ context: "profile", label })}</Title>
      </Link>
      <Icon src="arrowrightblue.svg" size={1} />
    </div>
  );
}

/**
 * One group of menu links
 * for example "Lån", "Reserveringer", "Mellemværende" under "Lån og reserveringer"
 * @param menuItems
 * @param href
 * @param groupName
 * @param activeIndex
 * @param setActiveIndex
 * @return {JSX.Element}
 */
function MenuLinks({
  menuItems,
  href,
  groupName,
  activeIndex,
  setActiveIndex,
}) {
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
      <div className={styles.grouplink} key={`div-menulink-${index}`}>
        <Link
          href={`${href}#${titleDanish.toLowerCase()}`}
          key={`menulink-${index}`}
          className={`${styles.subLink} ${classNames(
            index === activeIndex ? styles.groupactive : ""
          )}`}
          onClick={() => setActiveIndex(index)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              setActiveIndex(index);
            }
          }}
        >
          <Text type="text2">{title}</Text>
          <Text type="text2" className={styles.number}>
            ({item.number})
          </Text>
          {index === activeIndex && (
            <span className={styles.groupiconlink}>
              <Icon size={{ w: 1, h: 1 }} src="arrowrightblue.svg" />
            </span>
          )}
        </Link>
      </div>
    );
  });
}

/**
 * Menu link, that contains subcategories, which also are links
 * @param menus
 * @param href
 * @param className
 * @return {JSX.Element}
 */
function MenuGroup({ menus, href, name, className }) {
  const [activeIndex, setActiveIndex] = useState();
  const router = useRouter();
  const [isActive, setIsActive] = useState(router.asPath.includes(name));

  useEffect(() => {
    setIsActive(router.asPath.includes(href));
  }, [router.asPath]);

  return (
    <div
      key={`menu-component-${name}`}
      className={className}
      data-cy="group-menu"
    >
      <Link tabIndex={"0"} className={styles.group} href={href} passHref={true}>
        <div
          lines={30}
          key={`groupmenu-${name}`}
          className={styles.grouptitlecontainer}
        >
          <span className={styles.groupicon}>
            <Icon
              size={{ w: 1, h: 1 }}
              src="arrowrightblue.svg"
              className={classNames(isActive ? styles.groupiconrotate : "")}
            />
          </span>
          <Title type={isActive ? "title4" : "title5"}>
            {Translate({
              context: "profile",
              label: `${name}`,
            })}
          </Title>
        </div>
      </Link>
      <div
        key={`dev-groupmenu-${name}`}
        className={classNames(isActive ? "" : styles.grouphide)}
      >
        <MenuLinks
          menuItems={menus}
          href={href}
          passHref={true}
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
  const user = useUser();

  //add number of loans, reservations and debt to menu
  //remove item menu "debt" from menu if loaner doesnt have debt
  menus.loansAndReservations.forEach((item, index) => {
    const number = user.loanerInfo[item.title]?.length;
    if (number === 0 && item.title === "debt") {
      menus.loansAndReservations.splice(index, 1);
    }
    item.number = number || 0;
  });
  return (
    <>
      <MenuGroup
        menus={menus}
        name={links[0]}
        href="/profil/laan-og-reserveringer"
      />
      <MenuLink label={links[1]} href="/profil/mine-biblioteker" />
    </>
  );
}
