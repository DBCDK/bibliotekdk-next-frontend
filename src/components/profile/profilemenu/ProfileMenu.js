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
import { encodeString, getElementById } from "@/lib/utils";

/**
 * It shows a profile menu on the left handside of the profile page.
 * It contains simple links ("Mine bilioteker")
 * and links with subcategories such as "Lån og reserveringer"
 * with subcateogries "Lån", "Reserveringer", "Mellemværende".
 * @returns {JSX.Element}
 */

/**
 * Profile menu main items
 */
const menuItems = ["loansAndReservations", "myLibraries"];

/**
 * Menu items with subcategories
 */
const menus = {
  loansAndReservations: [
    { title: "debt", id: 0, itemLength: 0 },
    { title: "loans", id: 1, itemLength: 0 },
    { title: "orders", id: 2, itemLength: 0 },
  ],
};

/**
 * Simple menu link without subcategories.
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
 * One group of subcategories in the menu.
 * f. ex. "Lån", "Reserveringer", "Mellemværende" under "Lån og reserveringer"
 * @param menuItems
 * @param href
 * @param groupName
 * @param activeIndex
 * @param setActiveIndex
 * @return {JSX.Element}
 */
function MenuLinkGroup({
  menuItems,
  href,
  groupName,
  activeIndex,
  setActiveIndex,
}) {
  const router = useRouter();

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

    const urlEnding = `#${encodeString(titleDanish)}`;

    //marks subcategory when opening the page from an url with the subcategory
    if (router.asPath.includes(urlEnding)) {
      setActiveIndex(index);
    }

    function handleScroll(e, index) {
      if (typeof window === "undefined") return;
      //e.preventDefault();
      //remove everything before the hash
      const targetId = new URL(e.currentTarget.href).hash.slice(1);
      const elem = getElementById(targetId);
      window.scrollTo({
        top: elem?.getBoundingClientRect().top,
        behavior: "smooth",
      });
      setActiveIndex(index);
    }

    return (
      <div className={styles.groupLink} key={`div-menulink-${index}`}>
        <Link
          href={`${href}${urlEnding}`}
          key={`menulink-${index}`}
          className={`${styles.subLink} ${classNames(
            index === activeIndex ? styles.groupActive : ""
          )}`}
          onClick={(e) => handleScroll(e, index)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleScroll(index);
            }
          }}
        >
          <>
            <Text type="text2">{title}</Text>
            <Text type="text2" className={styles.itemLength}>
              ({item.itemLength})
            </Text>
            {index === activeIndex && (
              <span className={styles.groupIconLink}>
                <Icon size={{ w: 1, h: 1 }} src="arrowrightblue.svg" />
              </span>
            )}
          </>
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
          key={`groupMenu-${name}`}
          className={styles.groupTitleContainer}
        >
          <span className={styles.groupIcon}>
            <Icon
              size={{ w: 1, h: 1 }}
              src="arrowrightblue.svg"
              className={classNames(isActive ? styles.groupIconRotate : "")}
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
        key={`dev-groupMenu-${name}`}
        className={classNames(isActive ? "" : styles.groupHide)}
      >
        <MenuLinkGroup
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

  //add itemLength of loans, reservations and debt to menu
  //remove menu item "debt" from menu if loaner doesnt have debt
  menus.loansAndReservations.forEach((item, index) => {
    const itemLength = user.loanerInfo[item.title]?.length;
    if (itemLength === 0 && item.title === "debt") {
      menus.loansAndReservations.splice(index, 1);
    }
    item.itemLength = itemLength || 0;
  });
  return (
    <>
      <MenuGroup
        menus={menus}
        name={menuItems[0]}
        href="/profil/laan-og-reserveringer"
      />
      <MenuLink label={menuItems[1]} href="/profil/mine-biblioteker" />
    </>
  );
}
