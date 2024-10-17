import PropTypes from "prop-types";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import React, { useRef } from "react";
import cx from "classnames";

import useFilters from "@/components/hooks/useFilters";

import { cyKey } from "@/utils/trim";

import { focusInput } from "./suggester/";

import Translate from "@/components/base/translate";
import Text from "@/components/base/text";
import Link from "@/components/base/link";

import { useModal } from "@/components/_modal";

import LoginIcon from "./icons/login";
import GlobeIcon from "./icons/globe";
import SearchIcon from "./icons/search";
import BookmarkIcon from "./icons/bookmark";

import Logo from "@/components/base/logo/Logo";

import { openMobileSuggester } from "@/components/header/suggester/Suggester";

import styles from "./Header.module.css";
import Router, { useRouter } from "next/router";

import { openLoginModal } from "../_modal/pages/login/utils";
import { signOut } from "@dbcdk/login-nextjs/client";
import useAuthentication from "../hooks/user/useAuthentication";

import AdvancedSearchPopover from "@/components/search/advancedSearch/popover/Popover";

// material Pages
export const MATERIAL_PAGES = [
  { path: "boeger", label: "literature" },
  { path: "film", label: "movie" },
  { path: "musik", label: "music" },
  { path: "spil", label: "game" },
  { path: "noder", label: "sheetmusic" },
  { path: "artikler", label: "article" },
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
  story = null,
  user,
  modal,
  hideShadow,
}) {
  const context = { context: "header" };

  const simpleSearchRef = useRef(null);

  const getLoginLabel = () => {
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
      onClick: () => {
        !story && openMobileSuggester();
        story && story.setSuggesterVisibleMobile(true);
        setTimeout(() => {
          focusInput();
        }, 100);
      },
    },
    {
      label: getLoginLabel(),
      icon: LoginIcon,
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
      label: "english-danish",
      icon: GlobeIcon,
      onClick: () => {
        const locale = Router.locale === "da" ? "en" : "da";
        const pathname = Router.pathname;
        const query = { ...Router.query };

        // remove modal key from query
        // this will close the modal after language change
        delete query.modal;

        Router.push({ pathname, query }, null, { locale });

        //   modal.push("menu");
      },
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
          <Row>
            <Col xs={3}>
              <Logo />
            </Col>
            <Col xs={{ span: 7 }} className={styles.mobileHeader}></Col>
            <Col xs={{ span: 2 }} className={styles.iconActionsContainer}>
              <div
                className={styles.iconActions}
                data-cy={cyKey({
                  name: "actions",
                  prefix: "header-bottom",
                })}
              >
                <div className={styles.popoverTriggerContainer}>
                  <AdvancedSearchPopover
                    className={styles.advancedSearchTrigger}
                    simpleSearchRef={simpleSearchRef}
                  />
                </div>
                {menu.map((m) => {
                  const ActionIcon = m.icon;

                  return (
                    <ActionIcon
                      dataCy={cyKey({
                        name: m.label,
                        prefix: "header-link",
                      })}
                      key={m.label}
                      className={`${styles.action} ${m.className}`}
                      href={m.href}
                      onClick={m.onClick}
                      items={m.items}
                      title={Translate({ ...context, label: m.label })}
                    />
                  );
                })}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </header>
  );
}

/**
 * Static parts of header - logo, materialtypeslinks, header actions
 * @param router
 * @param context
 * @returns {React.JSX.Element}
 */
export function StaticHeader({ router = null, context }) {
  return (
    <>
      <Col xs={3} lg={2} className={styles.logoWrapper}>
        <Logo />
      </Col>
      <Col
        xs={{ span: 9, offset: 1 }}
        className={styles.mobileHeaderNoActionCol}
      >
        <div className={styles.top}>
          <div
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
          </div>
          <div
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
          </div>
        </div>
      </Col>
    </>
  );
}

/**
 * Function to return skeleton (Loading) version of the Component
 *
 * @param {Object} props
 *  See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
 */
function HeaderSkeleton(props) {
  return <Header {...props} className={`${props.className}`} skeleton={true} />;
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
  const { hasCulrUniqueId, isAuthenticated } = useAuthentication();
  const modal = useModal();
  const filters = useFilters();

  if (props.skeleton) {
    return <HeaderSkeleton {...props} />;
  }

  return (
    <Header
      {...props}
      user={{ hasCulrUniqueId, isAuthenticated }}
      modal={modal}
      filters={filters}
      router={router}
    />
  );
}

// PropTypes for component
Wrap.propTypes = {
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  story: PropTypes.object,
  skeleton: PropTypes.bool,
};
