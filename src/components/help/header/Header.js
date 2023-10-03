import PropTypes from "prop-types";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Translate from "@/components/base/translate";
import Link from "@/components/base/link";
import Icon from "@/components/base/icon";
import Text from "@/components/base/text";
import SearchInput from "@/components/help/search/input";

import { useModal } from "@/components/_modal";

import BurgerIcon from "@/components/header/icons/burger";

import styles from "./Header.module.css";
import Title from "@/components/base/title";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Logo from "@/components/base/logo/Logo";
import { SkipToMainAnchor } from "@/components/base/skiptomain/SkipToMain";
import { getArticleUrl } from "@/lib/utils";

/**
 * The custom Header for help page
 *
 * @returns {component}
 */
export function Header({
  expanded = true,
  query,
  onQueryChange,
  onQueryClear,
  onQuerySubmit,
  onMenuClick,
}) {
  return (
    <Container
      as="header"
      className={`${styles.header} ${expanded ? styles.expanded : ""}`}
      fluid
    >
      <Row className={styles.row}>
        <Col xs={3}>
          <Logo fill={"var(--blue)"} />
        </Col>

        <Col
          className={styles.inputOuterWrapper}
          xs={{ span: 12, order: 4 }}
          lg={{ span: 5, order: 2 }}
        >
          <div className={styles.inputwrapper}>
            <Title type="title3">
              {Translate({ context: "help", label: "help-title" })}
            </Title>
            <SearchInput
              className={styles.input}
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onSubmit={onQuerySubmit}
              onClear={onQueryClear}
            />
          </div>
        </Col>
        <Col className={styles.right} xs={{ order: 3 }}>
          <span>
            <Link
              href={getArticleUrl("spoerg-en-bibliotekar", 7)}
              className={styles.ask}
            >
              <Text type="text2" className={styles.full}>
                {Translate({
                  context: "help",
                  label: "header-button-ask-full",
                })}
              </Text>
              <Text type="text2" className={styles.short}>
                {Translate({
                  context: "help",
                  label: "header-button-ask-short",
                })}
              </Text>
              <Icon
                size={2}
                src="bubble.svg"
                alt={Translate({
                  context: "help",
                  label: "header-button-ask-full",
                })}
              />
            </Link>
            <BurgerIcon
              className={styles.menu}
              title={Translate({ context: "header", label: "menu" })}
              onClick={() => onMenuClick()}
              dataCy="header-menu"
            />
          </span>
        </Col>
      </Row>
      <SkipToMainAnchor />
    </Container>
  );
}

Header.propTypes = {
  expanded: PropTypes.bool,
  onQueryChange: PropTypes.func,
  onQueryClear: PropTypes.func,
  onQuerySubmit: PropTypes.func,
  query: PropTypes.string,
};

/**
 *  Default export function of the Component
 *
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function Wrap() {
  const router = useRouter();
  const modal = useModal();
  const [query, setQuery] = useState(router.query.q);
  const onHelp = router.pathname.startsWith("/hjaelp");
  const onHelpfrontPage = router.pathname === "/hjaelp";
  const onHelpFindpage = router.pathname === "/hjaelp/find";
  const updateUrl = () => {
    if (!onHelp) {
      return;
    }
    if (router.query.q && !onHelpfrontPage && !query) {
      // User cleared the input field
      // Redirect to help frontpage
      router.replace("/hjaelp");
    }
    if (onHelpFindpage || query) {
      router[onHelpFindpage ? "replace" : "push"](
        {
          pathname: "/hjaelp/find",
          query: { q: query },
        },
        undefined,
        { shallow: true }
      );
    }
  };

  useEffect(() => {
    updateUrl();
  }, [query]);

  if (!onHelp) {
    return null;
  }

  return (
    <Header
      expanded={onHelpfrontPage}
      query={query}
      onQueryChange={(q) => setQuery(q)}
      onQueryClear={() => setQuery("")}
      onQuerySubmit={updateUrl}
      onMenuClick={() => modal.push("menu", { label: "title-menu" })}
    />
  );
}
