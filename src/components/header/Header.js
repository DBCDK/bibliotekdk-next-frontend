import PropTypes from "prop-types";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import React, { useState, useEffect } from "react";

import { signOut } from "@dbcdk/login-nextjs/client";

import useHistory from "@/components/hooks/useHistory";
import useFilters from "@/components/hooks/useFilters";
import useQ from "@/components/hooks/useQ";

import { cyKey } from "@/utils/trim";

import Suggester, { focusInput, blurInput } from "./suggester/";

import Translate from "@/components/base/translate";
import Text from "@/components/base/text";
import Link from "@/components/base/link";

import { useModal } from "@/components/_modal";

import LoginIcon from "./icons/login";
import BurgerIcon from "./icons/burger";
import SearchIcon from "./icons/search";
import ExpandedSearch from "./expandedsearch/ExpandedSearch";
import useUser from "../hooks/useUser";

import Logo from "@/components/base/logo/Logo";

import { MoreOptionsLink } from "./utils";

import { SkipToMainAnchor } from "@/components/base/skiptomain/SkipToMain";

import { DesktopMaterialSelect } from "@/components/search/select";
import { openMobileSuggester } from "@/components/header/suggester/Suggester";

import styles from "./Header.module.css";
import { useRouter } from "next/router";
import { SuggestTypeEnum } from "@/lib/enums";
import useWindowSize from "@/components/hooks/useWindowSize";
import { isEmpty, isEqual } from "lodash";

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
  { label: "askLibrarian", href: "/artikel/spoerg-en-bibliotekar/7" },
  { label: "becomeLoaner", href: "/artikel/bliv-laaner/43" },
];

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {JSX.Element}
 */
export function Header({
  className = "",
  router = null,
  story = null,
  user,
  modal,
  filters,
}) {
  const context = { context: "header" };

  const { q, setQ, setQuery, getCount, getQuery } = useQ();
  const countQ = getCount({ exclude: ["all"] });

  const query = q[SuggestTypeEnum.ALL];

  // Search history in suggester
  const [history, setHistory, clearHistory] = useHistory();

  // workType filter param
  const { workTypes } = filters.getQuery();

  // expanded search state
  const [collapseOpen, setCollapseOpen] = useState(!!countQ);

  // specific material workType selected
  const selectedMaterial = workTypes[0] || SuggestTypeEnum.ALL;

  const menu = [
    {
      label: "search",
      icon: SearchIcon,
      onClick: () => {
        !story && openMobileSuggester();
        story && story.setSuggesterVisibleMobile(true);
        setTimeout(() => {
          focusInput();
        }, 100);
      },
    },
    {
      label: user.isAuthenticated || user.isGuestUser ? "logout" : "login",
      icon: LoginIcon,
      //onClick: user.isAuthenticated ? signOut : signIn,
      onClick: user.isAuthenticated
        ? // sign user out - either guest- or hejmdal-user
          signOut
        : user.isGuestUser
        ? async () => {
            await user.guestLogout();
          }
        : // open login modal
          () => modal.push("login"),
    },
    /*{
      label: "basket",
      icon: BasketIcon,
      onClick: () => {},
      items: "4",
    },
     */
    {
      label: "menu",
      icon: BurgerIcon,
      onClick: () => modal.push("menu"),
    },
  ];

  // Search modal suggester is visible
  const suggesterVisibleMobile =
    (story && story.suggesterVisibleMobile) ||
    (router && router.query.suggester);

  // suggester visible class
  const suggesterVisibleMobileClass = suggesterVisibleMobile
    ? styles.suggester__visible
    : "";

  const doSearch = (value) => {
    // If we are on mobile we replace
    // since we don't want to suggest modal to open if user goes back
    const method = suggesterVisibleMobile ? "replace" : "push";

    const type = {
      workTypes:
        selectedMaterial !== SuggestTypeEnum.ALL ? selectedMaterial : null,
    };

    const newQ = isEmpty(value) ? { ...q, all: "" } : { ...q, all: value };

    if (!isEqual(newQ, getQuery())) {
      setQuery({
        include: newQ,
        pathname: "/find",
        query: type,
        method,
      });
    }

    document.activeElement.blur();

    // Delay history update in list
    setTimeout(() => {
      setHistory(value);
    }, 300);
  };

  // function to force search onKeyDown
  const keyPressed = (e) => {
    if (e.key === "Enter") {
      doSearch(e.target.value);
    }
  };
  return (
    <header className={`${styles.wrap} ${className}`}>
      <div className={styles.headerWrap}>
        <Container className={styles.header} fluid>
          <Row>
            <StaticHeader router={router} context={context} />
            <Col xs={{ span: 9, offset: 3 }}>
              <SkipToMainAnchor />
              <div className={styles.bottom}>
                <form
                  onSubmit={(e) => {
                    e?.preventDefault();
                    doSearch(query);

                    // view query in storybook
                    story && alert(`/find?q.all=${query}`);

                    // Remove suggester in storybook
                    story && story.setSuggesterVisibleMobile(false);

                    // remove keyboard/unfocus
                    blurInput();
                  }}
                  className={`${styles.search}`}
                  data-cy={cyKey({ name: "search", prefix: "header" })}
                >
                  <DesktopMaterialSelect className={styles.select} />

                  <div
                    className={`${styles.suggester__wrap} ${
                      !collapseOpen ? styles.collapsed : ""
                    } ${suggesterVisibleMobileClass}`}
                  >
                    <Suggester
                      className={`${styles.suggester}`}
                      history={history}
                      clearHistory={clearHistory}
                      isMobile={suggesterVisibleMobile}
                      onSelect={(val) => doSearch(val)}
                      onChange={(val) => setQ({ ...q, all: val })}
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

                    <MoreOptionsLink
                      onSearchClick={() => setCollapseOpen(!collapseOpen)}
                      className={`${styles.linkshowmore} ${
                        collapseOpen ? styles.hidden : ""
                      }`}
                    >
                      {Translate({
                        context: "search",
                        label:
                          countQ === 0
                            ? "advancedSearchLink"
                            : "advancedSearchLinkCount",
                        vars: [countQ],
                      })}
                    </MoreOptionsLink>

                    <ExpandedSearch
                      className={styles.expandedSearch}
                      collapseOpen={collapseOpen}
                      setCollapseOpen={setCollapseOpen}
                    />
                  </div>

                  <button
                    className={`${styles.button} ${
                      collapseOpen ? styles.hidden : ""
                    }`}
                    type="submit"
                    data-cy={cyKey({
                      name: "searchbutton",
                      prefix: "header",
                    })}
                  >
                    <span>{Translate({ ...context, label: "search" })}</span>
                    <div className={styles.fill} />
                  </button>
                </form>

                <div
                  className={styles.actions}
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
                        className={styles.action}
                        href={m.href}
                        onClick={m.onClick}
                        items={m.items}
                        title={Translate({ ...context, label: m.label })}
                      />
                    );
                  })}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </header>
  );
}

export function WrappedStaticHeader({
  context,
  className = "",
  replace = false,
}) {
  return (
    <header className={`${styles.wrap} ${className}`}>
      <div className={styles.headerWrap}>
        <Container className={styles.header} fluid>
          <Row>
            <StaticHeader context={context} replace={replace} />
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
 * @param replace
 * @returns {JSX.Element}
 * @constructor
 */
export function StaticHeader({ router = null, context, replace = false }) {
  return (
    <>
      <Col xs={2}>
        <Logo fill={"var(--blue)"} text={"default_logo_text"} />
      </Col>
      <Col xs={{ span: 9, offset: 1 }}>
        <div className={styles.top}>
          <div
            className={styles.materials}
            data-cy={cyKey({ name: "materials", prefix: "header" })}
          >
            <Link href="/" replace={replace}>
              <Text type="text3" tag="div">
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
                  replace={replace}
                >
                  <Text type="text3">
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
                replace={replace}
              >
                <Text type="text3">
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
 * @param {obj} props
 *  See propTypes for specific props and types
 *
 * @returns {JSX.Element}
 */
function HeaderSkeleton(props) {
  return (
    <Header
      {...props}
      className={`${props.className} ${styles.skeleton}`}
      skeleton={true}
    />
  );
}

/**
 *  Default export function of the Component
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {JSX.Element}
 */
export default function Wrap(props) {
  const router = useRouter();
  const user = useUser();
  const modal = useModal();
  const filters = useFilters();

  // if window changes size from small to larger (>992) we need to remove
  // the suggester url parameter (suggester=true) for the mobile
  // suggester to go away
  let wSize = useWindowSize();
  const changeMe = wSize.width > 992;
  useEffect(() => {
    if (changeMe) {
      let query = { ...router.query };
      delete query.suggester;
      router.replace({ pathname: router.pathname, query });
    }
  }, [changeMe]);

  if (props.skeleton) {
    return <HeaderSkeleton {...props} />;
  }

  return (
    <Header
      {...props}
      user={user}
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
