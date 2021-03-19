import PropTypes from "prop-types";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Translate from "@/components/base/translate";
import Link from "@/components/base/link";
import Icon from "@/components/base/icon";
import Text from "@/components/base/text";
import Language from "@/components/base/language";
import SearchInput from "@/components/help/search/input";

import LogoSvg from "@/public/icons/logo_help.svg";

import { cyKey } from "@/utils/trim";

import styles from "./Header.module.css";
import { Title } from "@/components/base/title/Title";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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
}) {
  return (
    <Container
      as="header"
      className={`${styles.header} ${expanded ? styles.expanded : ""}`}
      fluid
    >
      <Row className={styles.row}>
        <Col xs={3}>
          <Link
            className={styles.logoWrap}
            border={false}
            href="/hjaelp"
            dataCy={cyKey({
              name: "logo",
              prefix: "header-help",
            })}
          >
            <Icon className={styles.logo} size={{ w: "auto", h: 5 }}>
              <LogoSvg />
            </Icon>
          </Link>
        </Col>
        <Col xs={{ span: 12, order: 4 }} lg={{ span: 6, order: 2 }}>
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
            <Link href="/hjaelp" className={styles.ask}>
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
              <Icon size={2} src="bubble.svg" />
            </Link>
            <Language>
              <Link>
                <Text type="text2">
                  {Translate({ context: "language", label: "en-da" })}
                </Text>
              </Link>
            </Language>
          </span>
        </Col>
      </Row>
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

export default function Wrap() {
  const router = useRouter();
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
    />
  );
}
