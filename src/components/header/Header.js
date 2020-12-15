import PropTypes from "prop-types";
import { Container, Row, Col } from "react-bootstrap";
import { useState } from "react";

import useHistory from "@/components/hooks/useHistory";

import { cyKey } from "@/utils/trim";

import Suggester from "./suggester/";

import Translate from "@/components/base/translate";
import Text from "@/components/base/text";
import Link from "@/components/base/link";
import Icon from "@/components/base/icon";

import styles from "./Header.module.css";

import LogoSvg from "@/public/icons/logo.svg";

import LoginIcon from "./icons/login";
import BasketIcon from "./icons/basket";
import BurgerIcon from "./icons/burger";
import SearchIcon from "./icons/search";

function Banner() {
  return (
    <div className={styles.bannerWrap}>
      <Container className={styles.banner}>
        <Text type="text3">
          {Translate({ context: "header", label: "banner-text" })}
        </Text>
      </Container>
    </div>
  );
}

/**
 * Function to focus suggester input field
 *
 */
function focusInput() {
  document.getElementById("suggester-input").focus();
}

/**
 * Function to blur suggester input field
 *
 */
function blurInput() {
  document.getElementById("suggester-input").blur();
}

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
function Header({ className = "", router = null, isStory = false }) {
  const context = { context: "header" };

  // Seach Query in suggester callback
  const [query, setQuery] = useState("");
  // Suggester visible on mobile device
  const [suggesterVisibleMobile, setSuggesterVisibleMobile] = useState(false);
  // Search history in suggester
  const [history, setHistory, clearHistory] = useHistory();

  const materials = [
    { label: "books", href: "/#!" },
    { label: "articles", href: "/#!" },
    { label: "movies", href: "/#!" },
    { label: "eMaterials", href: "/#!" },
    { label: "games", href: "/#!" },
    { label: "music", href: "/#!" },
    { label: "nodes", href: "/#!" },
  ];

  const actions = [
    { label: "digitalOffers", href: "/#!" },
    { label: "askLibrarian", href: "/#!" },
    { label: "becomeLoaner", href: "/#!" },
  ];

  const menu = [
    {
      label: "search",
      icon: SearchIcon,
      onClick: () => {
        setSuggesterVisibleMobile(true);
        focusInput();
      },
    },
    { label: "login", icon: LoginIcon, href: "/#!" },
    { label: "basket", icon: BasketIcon, href: "/#!", items: "4" },
    { label: "menu", icon: BurgerIcon, href: "/#!" },
  ];

  const suggesterVisibleMobileClass = suggesterVisibleMobile
    ? styles.suggester__visible
    : "";

  return (
    <header className={`${styles.wrap} ${className}`}>
      <Banner />
      <div className={styles.headerWrap}>
        <Container className={styles.header}>
          <Row>
            <Col xs={2}>
              <Link
                border={false}
                href="/"
                dataCy={cyKey({
                  name: "logo",
                  prefix: "header",
                })}
              >
                <Icon className={styles.logo} size={{ w: 15, h: "auto" }}>
                  <LogoSvg />
                </Icon>
              </Link>
            </Col>
            <Col xs={{ span: 9, offset: 1 }}>
              <div className={styles.top}>
                <div
                  className={styles.materials}
                  data-cy={cyKey({ name: "materials", prefix: "header" })}
                >
                  {materials.map((m) => (
                    <Link
                      key={m.label}
                      href={m.href}
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
                <div
                  className={styles.actions}
                  data-cy={cyKey({ name: "actions", prefix: "header-top" })}
                >
                  {actions.map((m) => (
                    <Link
                      key={m.label}
                      href={m.href}
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
              <div className={styles.bottom}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setHistory(query);
                    router &&
                      router.push({ pathname: "/find", query: { q: query } });
                    isStory && alert(`/find?q=${query}`);
                    // Cleanup on mobile
                    suggesterVisibleMobile && setQuery("");
                    // remove keyboard on mobile
                    suggesterVisibleMobile && blurInput();
                    suggesterVisibleMobile && setSuggesterVisibleMobile(false);
                  }}
                  className={`${styles.search}`}
                  data-cy={cyKey({ name: "search", prefix: "header" })}
                >
                  <div
                    className={`${styles.suggester__wrap} ${suggesterVisibleMobileClass}`}
                  >
                    <Suggester
                      className={`${styles.suggester}`}
                      history={history}
                      clearHistory={clearHistory}
                      isMobile={suggesterVisibleMobile}
                      onChange={setQuery}
                      onClose={() => setSuggesterVisibleMobile(false)}
                      onSelect={(suggestionValue) => {
                        setHistory(suggestionValue);
                        router &&
                          router.push({
                            pathname: "/find",
                            query: { q: suggestionValue },
                          });
                      }}
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
                    {Translate({ ...context, label: "search" })}
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
  if (props.skeleton) {
    return <HeaderSkeleton {...props} />;
  }

  return <Header {...props} />;
}

// PropTypes for component
Wrap.propTypes = {
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  isStory: PropTypes.bool,
  skeleton: PropTypes.bool,
};
