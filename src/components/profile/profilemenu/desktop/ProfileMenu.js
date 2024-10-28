import Text from "@/components/base/text/Text";
import Title from "@/components/base/title";
import Link from "@/components/base/link";
import styles from "./ProfileMenu.module.css";
import Translate from "@/components/base/translate/Translate";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import cx from "classnames";
import { getElementById, encodeString, translateAndEncode } from "@/lib/utils";
import useLoanerInfo from "@/components/hooks/user/useLoanerInfo";

/**
 * This component shows a profile menu for logged in users.
 * It is used on the left handside of the profile page when window wider than 992px.
 * It contains two types of links:
 * simple links such as "Mine biblioteker"
 * and links with subcategories such as "Lån og reserveringer" with subcateogries "Lån", "Reserveringer", "Mellemværende".
 * @returns {React.JSX.Element}
 */

const CONTEXT = "profile";

export function getProfileUrl(wordToTranslate) {
  //savedSearches has different path than the rest of the profile urls
  if (wordToTranslate === "savedSearches") {
    return "/avanceret/gemte-soegninger";
  }
  return `/profil/${translateAndEncode(CONTEXT, wordToTranslate, "da")}`;
}

/**
 * Simple menu link without subcategories.
 * @param label
 * @param href
 * @returns {React.JSX.Element}
 */
function MenuLink({ label, href }) {
  const router = useRouter();
  const [isActive, setIsActive] = useState(router.asPath.includes(href));
  useEffect(() => {
    setIsActive(router.asPath.includes(href));
  }, [router.asPath]);

  const type = isActive ? "title4" : "title5";

  return (
    <li className={cx(styles.link, { [styles.simpleLink]: isActive })}>
      <Link href={href} dataCy={`menu-fixed-links-${label}`}>
        <Title type={type} tag="h5">
          {Translate({ context: CONTEXT, label })}
        </Title>
      </Link>
    </li>
  );
}

function SubCategory({ item, index, router, baseUrl }) {
  const title = Translate({
    context: CONTEXT,
    label: `${item.title}`,
  });
  const titleDanish = Translate({
    context: CONTEXT,
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
  }, [router.asPath]);

  async function replaceHash(newEnding) {
    const newUrl = baseUrl + "#" + newEnding;
    try {
      router.replace(newUrl);
    } catch (e) {
      if (!e.cancelled) {
        throw e;
      }
    }
  }

  return (
    <li className={styles.menuLink} key={`div-menulink-${index}`}>
      <Link
        className={styles.subLink}
        dataCy={`menu-subcategory-${index}`}
        onClick={() => {
          replaceHash(urlEnding);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            replaceHash(urlEnding);
          }
        }}
        border={{ top: false, bottom: false }}
      >
        <>
          <Text type="text2">{title}</Text>
          <Text type="text2" className={styles.itemLength}>
            ({item.itemLength})
          </Text>
        </>
      </Link>
    </li>
  );
}

/**
 * Menu link, that contains subcategories, which also are links
 * @param menus
 * @param categoryUrl
 * @param name
 * @param className
 * @returns {React.JSX.Element}
 */
function MenuGroup({ menus, categoryUrl, name, className }) {
  const router = useRouter();
  const [isActive, setIsActive] = useState(router.asPath.includes(name));

  useEffect(() => {
    setIsActive(router.asPath.includes(categoryUrl));
  }, [router.asPath]);

  return (
    <li className={className}>
      <Link
        className={styles.group}
        href={categoryUrl}
        dataCy={`group-menu-${name}`}
        active={isActive.toString()}
      >
        <Title
          className={styles.groupTitle}
          type={isActive ? "title4" : "title5"}
          id={`navigation-${name}`}
          tag={isActive ? "h4" : "h5"}
        >
          {Translate({
            context: CONTEXT,
            label: `${name}`,
          })}
        </Title>
      </Link>
      <ul className={styles.linkGroup}>
        {menus[name].map((item, index) => (
          <SubCategory
            key={`subcategory-${item.title}`}
            item={item}
            index={index}
            router={router}
            baseUrl={categoryUrl}
          />
        ))}
      </ul>
    </li>
  );
}

/**
 * Profile menu main items
 */
const menuItems = ["loansAndReservations", "bookmarks", "savedSearches"];

const initialLoansAndReservations = {
  loansAndReservations: [
    { title: "debt", id: 0, itemLength: 0 },
    { title: "loans", id: 1, itemLength: 0 },
    { title: "orders", id: 2, itemLength: 0 },
  ],
};

/**
 * ProfileMenu to use in /profil subpages
 * Renders a side menu on left side
 * @returns {React.JSX.Element}
 */
export default function ProfileMenu() {
  const { loanerInfo } = useLoanerInfo();

  const menus = {
    ...initialLoansAndReservations,
    loansAndReservations: initialLoansAndReservations.loansAndReservations
      .filter(
        (item) => item.title !== "debt" || loanerInfo[item.title]?.length > 0
      )
      .map((item) => ({
        ...item,
        itemLength: loanerInfo[item.title]?.length || 0,
      })),
  };

  if (!menus || !menus.loansAndReservations) return <></>;

  return (
    <>
      <nav
        className={styles.nav}
        aria-label={`${Translate({
          context: CONTEXT,
          label: "profileNavigation",
        })}`}
      >
        <ul className={styles.menu}>
          <MenuGroup
            menus={menus}
            name={menuItems[0]}
            categoryUrl={getProfileUrl(menuItems[0])}
          />
          {menuItems.slice(1).map((item) => (
            <MenuLink key={item} label={item} href={getProfileUrl(item)} />
          ))}
        </ul>
      </nav>
    </>
  );
}
