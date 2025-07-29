import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import React from "react";
import cx from "classnames";

import { cyKey } from "@/utils/trim";

import Translate from "@/components/base/translate";
import Text from "@/components/base/text";
import Link from "@/components/base/link";

import { useModal } from "@/components/_modal";

import LoginIcon from "./icons/login";
import BurgerIcon from "./icons/burger";
import SearchIcon from "./icons/search";
import BookmarkIcon from "./icons/bookmark";

import Logo from "@/components/base/logo/Logo";

import styles from "./Header.module.css";
import { useRouter } from "next/router";
import { openLoginModal } from "../_modal/pages/login/utils";
import { signOut } from "@dbcdk/login-nextjs/client";
import useAuthentication from "../hooks/user/useAuthentication";
import Button from "../base/button";

// material Pages
export const MATERIAL_PAGES = [
  { path: "boeger", label: "literature" },
  { path: "artikler", label: "article" },
  { path: "film", label: "movie" },
  { path: "musik", label: "music" },
  { path: "spil", label: "game" },
  { path: "noder", label: "sheetmusic" },
];

const actions = [
  {
    label: "digitalOffers",
    href: "/artikel/digitale-bibliotekstilbud/5",
  },
  {
    label: "askLibrarian",
    href: "/hjaelp/kontakt-os/25",
  },
  { label: "becomeLoaner", href: "/artikel/bliv-laaner/43" },
];

/**
 * The Component function
 *
 * @param {Object} props
 * See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
 */
export function Header({
  className = "",
  router = null,
  user,
  modal,
  hideShadow,
}) {
  const context = { context: "header" };

  const getLoginLabel = () => {
    if (user.isAuthenticated && user.isLoading) {
      // we guess that user has a unique id if we are loading
      return "profile";
    }
    if (user.hasCulrUniqueId) {
      return "profile";
    }
    return user.isAuthenticated ? "logout" : "login";
  };

  const menu = [
    {
      label: "search",
      icon: SearchIcon,
      className: styles.mobileSearch,
      onClick: () => router.push("/find"),
    },
    {
      label: getLoginLabel(),
      icon: LoginIcon,
      isLoading: user.isLoading,
      onClick: () => {
        if (user.hasCulrUniqueId) {
          router.push("/profil/laan-og-reserveringer");
          return;
        }
        if (user.isAuthenticated) {
          const redirectUrl = window?.location?.origin;
          signOut(redirectUrl);
        } else {
          openLoginModal({ modal });
        }
      },
    },
    {
      label: "bookmark",
      icon: BookmarkIcon,
      onClick: () => router.push("/profil/huskeliste"),
    },
    {
      label: "menu",
      icon: BurgerIcon,
      onClick: () => modal.push("menu"),
    },
  ];

  return (
    <header
      className={cx({
        [styles.wrap]: true,
        [styles.noShadow]: hideShadow,
        [className]: !!className,
      })}
    >
      <div className={styles.headerWrap}>
        <Container className={styles.header} fluid>
          <Row className={styles.top}>
            <Col
              xs={{ span: 12 }}
              className={styles.actions}
              data-cy={cyKey({ name: "actions", prefix: "header-top" })}
            >
              {actions.map((m) => (
                <Link
                  key={m.label}
                  href={m.href}
                  target={m.target}
                  dataCy={cyKey({
                    name: m.label,
                    prefix: "header-link",
                  })}
                >
                  <Text type="text3" tag="span">
                    {Translate({ ...context, label: m.label })}
                  </Text>
                </Link>
              ))}
            </Col>
          </Row>

          <Row className={styles.bottom}>
            <Col xs={3} lg={2} className={styles.logoWrapper}>
              <Logo />
            </Col>
            <Col
              xs={{ span: 7, offset: 1 }}
              className={styles.materials}
              data-cy={cyKey({ name: "materials", prefix: "header" })}
            >
              <Link href="/">
                <Text type="text3" tag="span">
                  {Translate({
                    context: "general",
                    label: "frontpage",
                  })}
                </Text>
              </Link>

              {MATERIAL_PAGES.map(({ path, label }) => {
                const active =
                  (router && router.asPath.includes(`/inspiration/${path}`)) ||
                  false;

                return (
                  <Link
                    key={`link-${path}-${label}`}
                    href={`/inspiration/${path}?workTypes=${label}`}
                    border={{ bottom: { keepVisible: active } }}
                    dataCy={`header-link-${label}`}
                  >
                    <Text type="text3" tag="span">
                      {Translate({
                        context: "facets",
                        label: `label-${label}`,
                      })}
                    </Text>
                  </Link>
                );
              })}

              <Button
                asLink={true}
                target="_self"
                href="/find"
                type="secondary"
                size="small"
                className={styles.searchButton}
                onClick={() => {}}
              >
                <Text type="text3" tag="span">
                  {Translate({
                    context: "header",
                    label: `search`,
                  })}
                </Text>
              </Button>
            </Col>

            <Col
              className={styles.iconActions}
              data-cy={cyKey({
                name: "actions",
                prefix: "header-bottom",
              })}
            >
              {menu.map((m) => {
                const ActionIcon = m.icon;

                return (
                  <ActionIcon
                    {...m}
                    dataCy={cyKey({
                      name: m.label,
                      prefix: "header-link",
                    })}
                    key={m.label}
                    className={`${styles.action} ${m.className}`}
                    title={Translate({ ...context, label: m.label })}
                  />
                );
              })}
            </Col>
          </Row>
        </Container>
      </div>
    </header>
  );
}

/**
 *  Default export function of the Component
 *
 * @param {Object} props
 * See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
 */
export default function Wrap(props) {
  const router = useRouter();
  const { hasCulrUniqueId, isAuthenticated, isLoading } = useAuthentication();
  const modal = useModal();

  return (
    <Header
      {...props}
      user={{ hasCulrUniqueId, isAuthenticated, isLoading }}
      modal={modal}
      router={router}
    />
  );
}
