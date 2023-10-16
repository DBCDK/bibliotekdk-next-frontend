import React from "react";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Text from "@/components/base/text/Text";
import Translate from "@/components/base/translate";
import Language from "@/components/base/language";
import Link from "@/components/base/link";
import styles from "./Footer.module.css";
import Logo from "@/components/base/logo/Logo";
import { MATERIAL_PAGES } from "@/components/header";

/** @file
 * Footer
 * holds a section with logo and three columns with description and links
 * well section .. rather a copy paste from the Section component
 */

/**
 * The logo @see icons/logowhite.svg
 * @returns {React.JSX.Element}
 */
const FooterLogo = () => {
  return <Logo type="WHITE" />;
};

/**
 * First column holds a description of bibliotek.dk and a link to administer
 * cookie settings
 * @returns {React.JSX.Element}
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
        onClick={() => Cookiebot.show()}
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
 * @returns {React.JSX.Element}
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
      pathname: "/hjaelp/privatlivspolitik-saadan-haandterer-vi-dine-data-/26",
      query: {},
    },
    suppliers: {
      pathname: "/artikel/leverandører/59",
      query: {},
    },
    English: { pathname: "/", query: {} },
    accessibility: {
      pathname: "https://www.was.digst.dk/beta-bibliotek-dk",
      query: {},
      target: "_blank",
    },
  };

  const FooterLink = function ({ href, children, onClick, target = "_self" }) {
    return (
      <Link
        href={href}
        border={{ bottom: { keepVisible: true } }}
        className={styles.footerlink}
        dataCy="contactlink"
        onClick={onClick}
        target={target}
      >
        <Text tag="span" type="text3">
          {children}
        </Text>
      </Link>
    );
  };

  return Object.keys(contact_links).map((key) => {
    let href = {
      pathname: contact_links[key].pathname,
      query: contact_links[key].query,
    };
    let target = contact_links[key].target
      ? contact_links[key].target
      : "_self";
    let item = (
      <FooterLink href={href} target={target}>
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
 * @returns {React.JSX.Element}
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
 * @returns {React.JSX.Element}
 */
const BranchLinks = () => {
  return MATERIAL_PAGES.map(({ path, label }) => (
    <div key={`link-${path}-${label}`}>
      <Link
        href={`/inspiration/${path}?workTypes=${label}`}
        className={styles.footerlink}
        border={{ bottom: { keepVisible: true } }}
        dataCy="branchlink"
      >
        <Text type="text3" tag="span">
          {Translate({
            context: "facets",
            label: `label-${label}`,
          })}
        </Text>
      </Link>
    </div>
  ));
};

/**
 * Defines the footer section - one row with four columns
 * @returns {React.JSX.Element}
 */
const FooterSection = () => {
  return (
    <footer className={styles.containerback}>
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
    </footer>
  );
};

export default function Footer() {
  return <FooterSection />;
}
