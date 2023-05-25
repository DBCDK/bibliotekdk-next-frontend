import Text from "@/components/base/text/Text";
import Title from "@/components/base/title";
import Link from "@/components/base/link";
import Icon from "@/components/base/icon/Icon";
import styles from "@/components/profile/profilemenu/desktop/ProfileMenu.module.css";
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

const CONTEXT = "profile";

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

  return (
    <li className={classNames(styles.link, isActive ? styles.active : "")}>
      <Link href={href} dataCy="menu-fixed-links">
        <Title type={type}>{Translate({ context: CONTEXT, label })}</Title>
      </Link>
      <Icon src="arrowrightblue.svg" size={1} />
    </li>
  );
}

function SubCategory({ item, index, router, activeIndex, setActiveIndex }) {
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
    if (router.asPath.includes(`#${urlEnding}`)) {
      setActiveIndex(index);
    }
  }, [router.asPath]);

  async function replaceHash(newEnding) {
    const baseUrl = router.pathname;
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
        className={classNames(
          styles.subLink,
          index === activeIndex ? styles.groupActive : ""
        )}
        dataCy={`menu-subcategory-${index}`}
        onClick={() => {
          replaceHash(urlEnding);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            replaceHash(urlEnding);
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
    </li>
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
    <li className={className}>
      <Link
        className={styles.group}
        href={href}
        dataCy={`group-menu-${name}`}
        active={isActive}
      >
        <div className={styles.groupTitleContainer}>
          <span className={styles.groupIcon}>
            <Icon
              size={{ w: 1, h: 1 }}
              src="arrowrightblue.svg"
              className={classNames(isActive ? styles.groupIconRotate : "")}
            />
          </span>
          <Title
            type={isActive ? "title4" : "title5"}
            id={`navigation-${name}`}
          >
            {Translate({
              context: CONTEXT,
              label: `${name}`,
            })}
          </Title>
        </div>
      </Link>
      <ul
        className={classNames(
          styles.linkGroup,
          isActive ? "" : styles.groupHide
        )}
      >
        {menus[name].map((item, index) => (
          <SubCategory
            key={`subcategory-${item.title}`}
            item={item}
            index={index}
            router={router}
            href={href}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />
        ))}
      </ul>
    </li>
  );
}

/**
 * Profile menu main items
 */
const menuItems = ["loansAndReservations", "myLibraries"];

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
 * @returns {JSX.Element}
 */
export default function ProfileMenu() {
  const user = useUser();

  const menus = {
    ...initialLoansAndReservations,
    loansAndReservations: initialLoansAndReservations.loansAndReservations
      .filter(
        (item) =>
          item.title !== "debt" || user?.loanerInfo[item.title]?.length > 0
      )
      .map((item) => ({
        ...item,
        itemLength: user?.loanerInfo[item.title]?.length || 0,
      })),
  };

  if (!menus || !menus.loansAndReservations) return <></>;

  return (
    <>
      <nav
        className={styles.menu}
        aria-label={`${Translate({
          context: CONTEXT,
          label: "profileNavigation",
        })}`}
      >
        <ul className={styles.menu}>
          <MenuGroup
            menus={menus}
            name={menuItems[0]}
            href={`/profil/${encodeString(
              Translate({
                context: CONTEXT,
                label: menuItems[0],
              })
            )}`}
          />
          {/* more MenuLinks are coming soon */}
          <MenuLink
            label={menuItems[1]}
            href={`/profil/${encodeString(
              Translate({
                context: CONTEXT,
                label: menuItems[1],
              })
            )}`}
          />
        </ul>
      </nav>
    </>
  );
}
