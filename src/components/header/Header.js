import PropTypes from "prop-types";
import { Container, Row, Col } from "react-bootstrap";
import React, { useState } from "react";

import { signIn, signOut } from "@dbcdk/login-nextjs/client";

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
// import BasketIcon from "./icons/basket";
import BurgerIcon from "./icons/burger";
import SearchIcon from "./icons/search";
import ExpandedSearch from "./expandedsearch/ExpandedSearch";
import useUser from "../hooks/useUser";

import Logo from "@/components/base/logo/Logo";
import { encodeTitleCreator } from "@/lib/utils";
import { SkipToMainAnchor } from "@/components/base/skiptomain/SkipToMain";

import { DesktopMaterialSelect } from "@/components/search/select";
import { openMobileSuggester } from "@/components/header/suggester/Suggester";

import styles from "./Header.module.css";
import { useRouter } from "next/router";

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
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

  const { q, setQ } = useQ();

  const query = q.all;

  // Search history in suggester
  const [history, setHistory, clearHistory] = useHistory();

  // worktype filter param
  const { workType } = filters.getQuery();

  // specific material worktype selected
  const selectedMaterial = workType[0] || "all";

  // for beta1 - disable links above
  const linksdisabled = false;

  const actions = [
    {
      label: "digitalOffers",
      href: "/artikel/digitale-bibliotekstilbud/5",
    },
    { label: "askLibrarian", href: "/artikel/spoerg-en-bibliotekar/7" },
    { label: "becomeLoaner", href: "/artikel/bliv-laaner/43" },
  ];

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
        ? async (info) => {
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

  const doSearch = ({ query, suggestion }) => {
    // If we are on mobile we replace
    // since we don't want suggest modal to open if user goes back
    let routerFunc = suggesterVisibleMobile ? "replace" : "push";

    const params = {
      workType: selectedMaterial !== "all" ? selectedMaterial : null,
      ["q.all"]: query,
    };

    //  remove dead params
    Object.entries(params).forEach(([k, v]) => (!v ? delete params[k] : ""));
    router &&
      query &&
      router[routerFunc]({
        pathname: "/find",
        query: { ...router.query, ...params },
      });

    // Delay history update in list
    setTimeout(() => {
      setHistory(query);
    }, 300);
  };

  const frontpageTranslated = Translate({
    context: "general",
    label: "frontpage",
  });

  const [collapseOpen, setCollapseOpen] = useState(false);

  return (
    <header className={`${styles.wrap} ${className}`}>
      <div className={styles.headerWrap}>
        <Container className={styles.header} fluid>
          <Row>
            <Col xs={2}>
              <Logo fill={"var(--blue)"} text={"default_logo_text"} />
            </Col>
            <Col xs={{ span: 9, offset: 1 }}>
              <div className={styles.top}>
                <div
                  className={styles.materials}
                  data-cy={cyKey({ name: "materials", prefix: "header" })}
                >
                  <Link href="/">
                    <Text type="text3">{frontpageTranslated}</Text>
                  </Link>
                  {filters.workTypes.map((m) => (
                    <Link
                      key={m}
                      disabled={linksdisabled}
                      dataCy={cyKey({
                        name: m,
                        prefix: "header-link",
                      })}
                      onClick={() => {
                        filters.setQuery({ include: { workType: [m] } });
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.keyCode === 13) {
                          filters.setQuery({ include: { workType: [m] } });
                        }
                      }}
                    >
                      <Text type="text3">
                        {Translate({
                          context: "facets",
                          label: `label-${m}`,
                        })}
                      </Text>
                    </Link>
                  ))}
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
                      <Text type="text3">
                        {Translate({ ...context, label: m.label })}
                      </Text>
                    </Link>
                  ))}
                </div>
              </div>
              <SkipToMainAnchor />
              <div className={styles.bottom}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    // if (query === "") {
                    //   return;
                    // }

                    doSearch({ query });

                    // view query in storybook
                    story && alert(`/find?q.all=${query}`);

                    // Remove suggester in storybook
                    story && story.setSuggesterVisibleMobile(false);

                    // clear query if mobile
                    // suggesterVisibleMobile && setQuery("");
                    // remove keyboard/unfocus
                    blurInput();
                  }}
                  className={`${styles.search}`}
                  data-cy={cyKey({ name: "search", prefix: "header" })}
                >
                  <DesktopMaterialSelect />
                  <div
                    className={`${styles.suggester__wrap} ${suggesterVisibleMobileClass}`}
                  >
                    <Suggester
                      className={`${styles.suggester}`}
                      history={history}
                      clearHistory={clearHistory}
                      isMobile={suggesterVisibleMobile}
                      onChange={(val) => {
                        console.log("hest", { ...q, all: val });
                        setQ({ ...q, all: val });
                      }}
                      onClose={() => {
                        if (router) {
                          // remove suggester prop from query obj
                          router.back();
                        }
                        // Remove suggester in storybook
                        story && story.setSuggesterVisibleMobile(false);
                      }}
                      onSelect={doSearch}
                    />
                  </div>
                  {!collapseOpen && (
                    <button
                      className={styles.button}
                      type="submit"
                      data-cy={cyKey({
                        name: "searchbutton",
                        prefix: "header",
                      })}
                    >
                      <span>{Translate({ ...context, label: "search" })}</span>
                      <div className={styles.fill} />
                    </button>
                  )}
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
            <Col lg={{ span: 7, offset: 3 }}>
              <ExpandedSearch
                collapseOpen={collapseOpen}
                setCollapseOpen={setCollapseOpen}
              />
            </Col>
          </Row>
        </Container>
      </div>
    </header>
  );
}

/**
 * Function to return skeleton (Loading) version of the Component
 *
 * @param {obj} props
 *  See propTypes for specific props and types
 *
 * @returns {component}
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
 * @returns {component}
 */
export default function Wrap(props) {
  const router = useRouter();
  const user = useUser();
  const modal = useModal();
  const filters = useFilters();

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
