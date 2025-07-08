import PropTypes from "prop-types";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import React, { useRef } from "react";
import cx from "classnames";

import useHistory from "@/components/hooks/useHistory";
import useFilters from "@/components/hooks/useFilters";
import useQ from "@/components/hooks/useQ";
import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";

import { cyKey } from "@/utils/trim";

import Suggester, { focusInput, blurInput } from "./suggester/";

import Translate from "@/components/base/translate";
import Text from "@/components/base/text";
import Link from "@/components/base/link";

import { useModal } from "@/components/_modal";

import LoginIcon from "./icons/login";
import BurgerIcon from "./icons/burger";
import SearchIcon from "./icons/search";
import BookmarkIcon from "./icons/bookmark";

import Logo from "@/components/base/logo/Logo";

import { SkipToMainAnchor } from "@/components/base/skiptomain/SkipToMain";

import { DesktopMaterialSelect } from "@/components/search/select";
import { openMobileSuggester } from "@/components/header/suggester/Suggester";

import styles from "./Header.module.css";
import { useRouter } from "next/router";
import { SuggestTypeEnum } from "@/lib/enums";
import isEmpty from "lodash/isEmpty";
import useBreakpoint from "@/components/hooks/useBreakpoint";
import { openLoginModal } from "../_modal/pages/login/utils";
import { signOut } from "@dbcdk/login-nextjs/client";
import useAuthentication from "../hooks/user/useAuthentication";

import AdvancedSearchPopover from "@/components/search/advancedSearch/popover/Popover";

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
  story = null,
  user,
  modal,
  filters,
  hideShadow,
}) {
  const context = { context: "header" };
  const breakpoint = useBreakpoint();
  const isMobileSize =
    breakpoint === "xs" || breakpoint === "sm" || breakpoint === "md";

  const { q, setQ, setQuery } = useQ();

  const query = q[SuggestTypeEnum.ALL];

  // Search history in suggester
  const [history, setHistory, clearHistory] = useHistory();

  // workType filter param
  const { workTypes } = filters.getQuery();

  // specific material workType selected
  const selectedMaterial = workTypes[0] || SuggestTypeEnum.ALL;

  const simpleSearchRef = useRef(null);
  const { showInfoTooltip, showPopover } = useAdvancedSearchContext();
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

  // Search modal suggester is visible
  const suggesterVisibleMobile =
    (story && story.suggesterVisibleMobile) ||
    (isMobileSize && router && router.query.suggester);

  // suggester visible class
  const suggesterVisibleMobileClass = suggesterVisibleMobile
    ? styles.suggester__visible
    : "";

  const doSearch = (value, suggestion) => {
    let querykey = "all";

    // If we are on mobile we replace
    // since we don't want to suggest modal to open if user goes back
    const method = suggesterVisibleMobile ? "replace" : "push";

    const type = {
      tid: suggestion?.traceId,
      workTypes:
        selectedMaterial !== SuggestTypeEnum.ALL ? selectedMaterial : null,
    };

    const newQ = isEmpty(value) ? { ...q, all: "" } : { [querykey]: value };
    setQuery({
      include: newQ,
      exclude: ["page"],
      pathname: "/find",
      query: type,
      method,
    });

    document.activeElement.blur();

    // Delay history update in list
    setTimeout(() => {
      setHistory(value);
    }, 300);
  };

  const keyPressed = (e) => {
    // the e.preventBubbleHack comes from the autosuggester - see Suggester.js/AutoSuggest
    if (e.key === "Enter" && !e.preventBubbleHack) {
      doSearch(e.target.value);
      if (showInfoTooltip) {
        setShowInfoTooltip(false);
      }
    }
  };

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
            <StaticHeader router={router} context={context} />
            <Col xs={{ span: 7, offset: 3 }} className={styles.mobileHeader}>
              <SkipToMainAnchor />
              <div className={styles.bottom}>
                <div
                  ref={simpleSearchRef}
                  className={`${styles.search}`}
                  data-cy={cyKey({ name: "search", prefix: "header" })}
                >
                  <DesktopMaterialSelect className={styles.select} />

                  <div
                    className={`${styles.suggester__wrap} ${suggesterVisibleMobileClass}`}
                  >
                    <Suggester
                      className={`${styles.suggester}`}
                      history={history}
                      clearHistory={clearHistory}
                      isMobile={suggesterVisibleMobile}
                      onSelect={(suggestionValue, suggestion) => {
                        //on suggester select add quotes. If term is in history, don't add quotes
                        const formatedValue = history?.some(
                          (t) => t.term === suggestionValue
                        )
                          ? suggestionValue
                          : `"${suggestionValue}"`;

                        doSearch(formatedValue, suggestion);
                      }}
                      onChange={(val) => {
                        setQ({ ...q, all: val });
                      }}
                      dataCy={`simple-search-input`}
                      onClose={() => {
                        if (router) {
                          // remove suggester prop from query obj
                          router.back();
                        }
                        // Remove suggester in storybook
                        story && story.setSuggesterVisibleMobile(false);
                      }}
                      onKeyDown={keyPressed}
                    />
                  </div>

                  <button
                    className={`${styles.button}`}
                    onClick={(e) => {
                      if (showInfoTooltip || showPopover) {
                        return;
                      }
                      e?.preventDefault();
                      doSearch(query);

                      // view query in storybook
                      story && alert(`/find?q.all=${query}`);

                      // Remove suggester in storybook
                      story && story.setSuggesterVisibleMobile(false);

                      // remove keyboard/unfocus
                      blurInput();
                    }}
                    data-cy={cyKey({
                      name: "searchbutton",
                      prefix: "header",
                    })}
                  >
                    <span>{Translate({ ...context, label: "search" })}</span>
                    <div className={styles.fill} />
                  </button>
                </div>
                <div className={styles.popoverTriggerContainer}>
                  <AdvancedSearchPopover
                    className={styles.advancedSearchTrigger}
                    simpleSearchRef={simpleSearchRef}
                  />
                </div>
              </div>
            </Col>
            <Col xs={{ span: 2 }} className={styles.iconActionsContainer}>
              <div
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
                      dataCy={cyKey({
                        name: m.label,
                        prefix: "header-link",
                      })}
                      key={m.label}
                      className={`${styles.action} ${m.className}`}
                      title={Translate({ ...context, label: m.label })}
                      {...m}
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
  const { hasCulrUniqueId, isAuthenticated, isLoading } = useAuthentication();
  const modal = useModal();
  const filters = useFilters();

  console.log("### isLoading", isLoading, hasCulrUniqueId, isAuthenticated);

  if (props.skeleton) {
    return <HeaderSkeleton {...props} />;
  }

  return (
    <Header
      {...props}
      user={{ hasCulrUniqueId, isAuthenticated, isLoading }}
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
