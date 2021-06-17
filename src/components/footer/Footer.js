/** @file
 * Footer
 * holds a section with logo and three columns with description and links
 * well section .. rather a copy paste from the Section component
 */

import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import Text from "@/components/base/text/Text";
import Translate from "@/components/base/translate";
import Language from "@/components/base/language";
import Link from "@/components/base/link";
import { POLICY_ARTICLE_PATH } from "@/components/cookiebox";

import styles from "./Footer.module.css";
import Logo from "@/components/base/logo/Logo";

/**
 * The logo @see icons/logowhite.svg
 * @returns {JSX.Element}
 * @constructor
 */
const FooterLogo = () => {
  return <Logo fill={"var(--white)"} text={"default_logo_text"} />;
};

/**
 * First column holds a description of bibliotek.dk and a link to administer
 * cookie settings
 * @returns {JSX.Element}
 * @constructor
 */
const FirstColumn = () => {
  let label = Translate({ context: "footer", label: "hvad_er_bibliotek_dk" });
  return (
    <div className={styles.about}>
      <Text type="text3" lines={1}>
        {label}
      </Text>
      <div className={styles.spacer}></div>
      <Link
        border={{ bottom: { keepVisible: true } }}
        href={POLICY_ARTICLE_PATH}
        className={styles.footerlink}
      >
        <Text tag="span" type="text3">
          {Translate({
            context: "general",
            label: "administer_cookies",
          })}
        </Text>
      </Link>
    </div>
  );
};

/**
 * Second column holds link to contact, help, press etc.
 * @returns {JSX.Element}
 * @constructor
 */
const SecondColumn = () => {
  let label = Translate({ context: "footer", label: "contact" });
  return (
    <React.Fragment>
      <Text type="text4">{label}</Text>
      <div className={styles.spacer}></div>
      <ContactLinks />
    </React.Fragment>
  );
};

/**
 * Generate links for contacts
 * @returns {unknown[]}
 * @constructor
 */
const ContactLinks = () => {
  // Object holding info to generate contact links * NOTICE Keys of objects are translated.
  const contact_links = {
    // find_library: { pathname: "/", query: {} },
    about: { pathname: "/artikel/bibliotek.dk/6", query: {} },
    help: { pathname: "/hjaelp", query: {} },
    // press: { pathname: "/", query: {} },
    contact: { pathname: "/hjaelp/kontakt-os/25", query: {} },
    privacy: {
      pathname: "/artikel/privatlivspolitik/11",
      query: {},
    },
    English: { pathname: "/", query: {} },
  };

  const FooterLink = function ({ href, children, onClick }) {
    return (
      <Link
        href={href}
        border={{ bottom: { keepVisible: true } }}
        className={styles.footerlink}
        dataCy="contactlink"
        onClick={onClick}
      >
        <Text tag="span" type="text3">
          {children}
        </Text>
      </Link>
    );
  };

  return Object.keys(contact_links).map((key) => {
    let item = (
      <FooterLink href={contact_links[key]}>
        {Translate({ context: "footer", label: `${key}` })}
      </FooterLink>
    );

    if (key === "English") {
      item = (
        <Language>
          <FooterLink href={contact_links[key]}>
            {Translate({ context: "language", label: "english-danish" })}
          </FooterLink>
        </Language>
      );
    }

    return <div key={key}>{item}</div>;
  });
};

/**
 * Third column holds links to different material types
 * (don't know why it is called branches - see design)
 * @returns {JSX.Element}
 * @constructor
 */
const ThirdColumn = () => {
  let label = Translate({ context: "footer", label: "branches" });
  return (
    <React.Fragment>
      <Text type="text4" lines={1}>
        {label}
      </Text>
      <div className={styles.spacer}></div>
      <BranchLinks className={styles.padder} />
    </React.Fragment>
  );
};

/**
 * Generate links for materialtypes
 * Object holding info to generate links to materialtypes
 * NOTICE Keys are translated
 * @returns {}
 * @constructor
 */
const BranchLinks = () => {
  // Object holding info to generate links to materialtypes * NOTICE Keys are translated.
  const branch_links = {
    books: { pathname: "/", query: {} },
    articles: { pathname: "/", query: {} },
    film: { pathname: "/", query: {} },
    ematerials: { pathname: "/", query: {} },
    games: { pathname: "/", query: {} },
    music: { pathname: "/", query: {} },
    nodes: { pathname: "/", query: {} },
  };
  // BETA-1 all these links are disabled .. should they be removed?
  const footerlinksdisabled = true;

  return Object.keys(branch_links).map((key, index) => (
    <div key={key}>
      <Link
        href={branch_links[key]}
        border={{ bottom: { keepVisible: true } }}
        className={`${
          footerlinksdisabled ? styles.disabled : styles.footerlink
        }`}
        dataCy="branchlink"
        disabled={footerlinksdisabled}
      >
        <Text tag="span" type="text3">
          {Translate({
            context: "general",
            label: `${key}`,
          })}
        </Text>
      </Link>
    </div>
  ));
};

/**
 * Defines the footer section - one row with four columns
 * @param className
 * @param bgColor
 * @returns {JSX.Element}
 * @constructor
 */
const FooterSection = () => {
  return (
    <div className={styles.containerback}>
      <Container fluid>
        <Row
          as="section"
          className={`${styles.background} `}
          data-cy="footer-section"
        >
          <Col
            md={{ span: 2 }}
            xs="12"
            className={styles.padder}
            data-cy="footer-column"
          >
            <FooterLogo />
          </Col>
          <Col
            md={{ span: 3, order: 1, offset: 1 }}
            xs={{ span: 12, order: 3 }}
            className={styles.padder}
            data-cy="footer-column"
          >
            <FirstColumn />
          </Col>
          <Col
            md={{ span: 2, order: 2, offset: 1 }}
            xs={{ span: 6, order: 1 }}
            className={styles.padder}
            data-cy="footer-column"
          >
            <SecondColumn />
          </Col>
          <Col
            md={{ span: 3, order: 3 }}
            xs={{ span: 6, order: 2 }}
            data-cy="footer-column"
          >
            <ThirdColumn />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default function Footer() {
  return <FooterSection />;
}
