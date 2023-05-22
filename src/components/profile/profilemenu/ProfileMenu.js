import Text from "@/components/base/text/Text";
import Title from "@/components/base/title";
import Link from "@/components/base/link";
import Icon from "@/components/base/icon/Icon";
import styles from "@/components/profile/profilemenu/ProfileMenu.module.css";
import Translate from "@/components/base/translate/Translate";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import classNames from "classnames/bind";
import { encodeString } from "@/lib/utils";
import { getElementById } from "@/lib/utils";
import useUser from "@/components/hooks/useUser";

/**
 * This component shows a profile menu on the left handside of the profile page.
 * It contains two types of links:
 * simple links such as "Mine bilioteker"
 * and links with subcategories such as "Lån og reserveringer" with subcateogries "Lån", "Reserveringer", "Mellemværende".
 * @returns {JSX.Element}
 */

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

  console.log("groupName ", menuItems);
  return menuItems[groupName].map((item, index) => {
    return (
      <SubCategory
        key={`subcategory-${item.title}`}
        item={item}
        index={index}
        router={router}
        href={href}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />
    );
  });
}

function SubCategory({ item, index, router, activeIndex, setActiveIndex }) {
  const title = Translate({
    context: "profile",
    label: `${item.title}`,
  });
  const titleDanish = Translate({
    context: "profile",
    label: `${item.title}`,
    requestedLang: "da",
  });
  const urlEnding = `${encodeString(titleDanish)}`;

  // Scroll to anchor
  useEffect(() => {
    const anchor = decodeURIComponent(
      location?.hash?.replace("#", "sublink-") || ""
    );
    const el = getElementById(anchor);
    if (el) {
      scrollTo({ top: el.offsetTop, behavior: "smooth" });
    }
    if (router.asPath.includes(`#${urlEnding}`)) {
      //console.log("setting active index");
      setActiveIndex(index);
    }
  }, [router]);

  async function replaceHash(newEnding) {
    console.log("NEW ENDING", newEnding);
    const baseUrl = router.pathname;
    const newUrl = baseUrl + "#" + newEnding;
    console.log("NEW URL", newUrl);

    try {
      router.replace(newUrl);
    } catch (e) {
      if (!e.cancelled) {
        throw e;
      }
    }
  }

  return (
    <div className={styles.groupLink} key={`div-menulink-${index}`}>
      <Link
        className={`${styles.subLink} ${classNames(
          index === activeIndex ? styles.groupActive : ""
        )}`}
        dataCy={`menu-subcategory-${index}`}
        onClick={async (e) => {
          //e.preventDefault();
          await replaceHash(urlEnding);
          setActiveIndex(index);
        }}

        // onKeyDown={(event) => { //TODO
        //   if (event.key === "Enter") {
        //     setActiveIndex(index);
        //   }
        // }}
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
    <div key={`menu-component-${name}`} className={className}>
      <Link
        tabIndex={"0"}
        className={styles.group}
        href={href}
        passHref={true}
        dataCy={`group-menu-${name}`}
      >
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
 * @param menus
 * @param menuItems
 * @returns {JSX.Element}
 */
export default function ProfileMenu({ menus, menuItems }) {
  const user = useUser();

  if (!menus || !menus.loansAndReservations) return null;

  console.log("MENU 1", menus);

  console.log("USER ", user);
  //remove menu item "debt" from menu if loaner doesnt have debt
  const list = menus.loansAndReservations.filter((item) => {
    item.title !== "debt" || user.loanerInfo[item.title]?.length > 0;
  });

  // menus.loansAndReservations = list;

  console.log("LIST ", list);
  console.log("MENU ", menus);

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
