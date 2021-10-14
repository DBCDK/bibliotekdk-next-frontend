import PropTypes from "prop-types";
import { Container, Row, Col } from "react-bootstrap";
import React, { useState } from "react";

import { signIn, signOut } from "@dbcdk/login-nextjs/client";

import useHistory from "@/components/hooks/useHistory";

import { cyKey } from "@/utils/trim";

import Suggester, { focusInput, blurInput } from "./suggester/";

import Translate from "@/components/base/translate";
import Text from "@/components/base/text";
import Link from "@/components/base/link";
import Icon from "@/components/base/icon";

import styles from "./Header.module.css";

import LoginIcon from "./icons/login";
import BasketIcon from "./icons/basket";
import BurgerIcon from "./icons/burger";
import SearchIcon from "./icons/search";
import useUser from "../hooks/useUser";

import { externalUrls } from "@/lib/Navigation";
import Logo from "@/components/base/logo/Logo";
import { encodeTitleCreator } from "@/lib/utils";
import { SkipToMainAnchor } from "@/components/base/skiptomain/SkipToMain";

import MaterialSelect, { MobileList } from "@/components/base/select/Select";
import useMaterialFilters from "@/components/hooks/useMaterialFilters";

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export function Header({ className = "", router = null, story = null, user }) {
  const context = { context: "header" };

  // Seach Query in suggester callback
  const [query, setQuery] = useState("");

  // Search history in suggester
  const [history, setHistory, clearHistory] = useHistory();

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
        router &&
          router.push({
            pathname: router.pathname,
            query: { ...router.query, suggester: true },
          });
        story && story.setSuggesterVisibleMobile(true);
        setTimeout(() => {
          focusInput();
        }, 100);
      },
    },
    {
      label: user.isAuthenticated ? "logout" : "login",
      icon: LoginIcon,
      //onClick: user.isAuthenticated ? signOut : signIn,
      onClick: () => {
        if (router) {
          router.push({
            pathname: router.pathname,
            query: { ...router.query, modal: "login" },
          });
        }
      },
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
      onClick: () => {
        if (router) {
          router.push({
            pathname: router.pathname,
            query: { ...router.query, modal: "menu" },
          });
        }
      },
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

  // variables for the material filter @see <MaterialSelect>
  const { selectedMaterial, onOptionClicked, materialFilters } =
    useMaterialFilters();

  const doSearch = ({ query, suggestion }) => {
    // If we are on mobile we replace
    // since we don't want suggest modal to open if user goes back
    let routerFunc = suggesterVisibleMobile ? "replace" : "push";

    if (suggestion?.__typename === "Work") {
      router &&
        router[routerFunc]({
          pathname: "/materiale/[title_author]/[workId]",
          query: {
            title_author: encodeTitleCreator(
              suggestion.title,
              suggestion.creators?.[0]?.name
            ),
            workId: suggestion.id,
          },
        });
    } else {
      const params = selectedMaterial.value
        ? {
            worktype:
              selectedMaterial.value !== "all" ? selectedMaterial.value : "",
            q: query,
          }
        : { q: query };
      router &&
        router[routerFunc]({
          pathname: "/find",
          query: params,
        });

      // Delay history update in list
      setTimeout(() => {
        setHistory(query);
      }, 300);
    }
  };

  const frontpageTranslated = Translate({
    context: "general",
    label: "frontpage",
  });

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
                  {materialFilters
                    .filter((filter) => filter.value !== "all")
                    .map((m, idx) => (
                      <Link
                        key={m.value}
                        disabled={linksdisabled}
                        dataCy={cyKey({
                          name: m.label,
                          prefix: "header-link",
                        })}
                        onClick={(e) => {
                          onOptionClicked(idx + 1);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.keyCode === 13) {
                            onOptionClicked(idx + 1);
                          }
                        }}
                      >
                        <Text type="text3">
                          {Translate({
                            context: "general",
                            label: m.label,
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
                    if (query === "") {
                      return;
                    }

                    doSearch({ query: query });

                    // view query in storybook
                    story && alert(`/find?q=${query}`);

                    // Remove suggester in storybook
                    story && story.setSuggesterVisibleMobile(false);

                    // clear query if mobile
                    suggesterVisibleMobile && setQuery("");
                    // remove keyboard/unfocus
                    blurInput();
                  }}
                  className={`${styles.search}`}
                  data-cy={cyKey({ name: "search", prefix: "header" })}
                >
                  <MaterialSelect
                    options={materialFilters}
                    onOptionClicked={onOptionClicked}
                    selectedMaterial={selectedMaterial}
                  />

                  <div
                    className={`${styles.suggester__wrap} ${suggesterVisibleMobileClass}`}
                  >
                    <Suggester
                      className={`${styles.suggester}`}
                      history={history}
                      clearHistory={clearHistory}
                      isMobile={suggesterVisibleMobile}
                      onChange={setQuery}
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
  const user = useUser();

  if (props.skeleton) {
    return <HeaderSkeleton {...props} />;
  }

  return <Header {...props} user={user} />;
}

// PropTypes for component
Wrap.propTypes = {
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  story: PropTypes.object,
  skeleton: PropTypes.bool,
};
