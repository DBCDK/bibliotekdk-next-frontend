/** @file
 * Footer
 * holds a section with logo and three columns with description and links
 * well section .. rather a copy paste from the Section component
 */

import { Container, Row, Col } from "react-bootstrap";
import Icon from "@/components/base/icon";
import styles from "@/components/work/footer/Footer.module.css";
import Text from "@/components/base/text/Text";
import React from "react";
import Translate from "@/components/base/translate";
import Link from "@/components/base/link";

/**
 * The logo @see icons/logowhite.svg
 * @returns {JSX.Element}
 * @constructor
 */
const FooterLogo = () => {
  const size = 15;
  const src = "logowhite.svg";
  return <Icon src={src} size={size} />;
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
    <React.Fragment>
      <Text type="text3" lines={1}>
        {label}
      </Text>
      <div className={styles.spacer}></div>
      <Link
        href={{ pathname: "/", query: {} }}
        className={styles.footerlink}
        border={false}
      >
        <Text tag="span" type="text3">
          {Translate({
            context: "general",
            label: "administer_cookies",
          })}
        </Text>
      </Link>
    </React.Fragment>
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
    find_library: { pathname: "/", query: {} },
    about: { pathname: "/", query: {} },
    help: { pathname: "/", query: {} },
    press: { pathname: "/", query: {} },
    contact: { pathname: "/", query: {} },
    privacy: { pathname: "/", query: {} },
    English: { pathname: "/", query: {} },
  };
  return Object.keys(contact_links).map((key, index) => (
    <React.Fragment key={key}>
      <Link
        href={contact_links[key]}
        className={styles.footerlink}
        border={false}
        dataCy="contactlink"
      >
        <Text tag="span" type="text3">
          {Translate({
            context: "footer",
            label: `${key}`,
          })}
        </Text>
      </Link>
    </React.Fragment>
  ));
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
  return Object.keys(branch_links).map((key, index) => (
    <React.Fragment key={key}>
      <Link
        href={branch_links[key]}
        className={styles.footerlink}
        border={false}
        dataCy="branchlink"
      >
        <Text tag="span" type="text3">
          {Translate({
            context: "general",
            label: `${key}`,
          })}
        </Text>
      </Link>
    </React.Fragment>
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
      <Container>
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
