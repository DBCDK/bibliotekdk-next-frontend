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

const FooterLogo = () => {
  const size = 15;
  const src = "logowhite.svg";
  return <Icon src={src} size={size} />;
};

const FirstColumn = () => {
  let label = Translate({ context: "footer", label: "hvad_er_bibliotek_dk" });
  return (
    <Text type="text3" lines={1}>
      {label}
    </Text>
  );
};

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

const contact_links = {
  find_library: { pathname: "/", query: {} },
  about: { pathname: "/", query: {} },
  help: { pathname: "/", query: {} },
  press: { pathname: "/", query: {} },
  contact: { pathname: "/", query: {} },
  privacy: { pathname: "/", query: {} },
  English: { pathname: "/", query: {} },
};
const ContactLinks = () => {
  return Object.keys(contact_links).map((key, index) => (
    <React.Fragment>
      <Link
        href={contact_links[key]}
        className={styles.footerlink}
        border={false}
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

const BranchLinks = () => {
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
    <React.Fragment>
      <Link
        href={branch_links[key]}
        className={styles.footerlink}
        border={false}
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

const FooterSection = ({ className = "", bgColor = null }) => {
  const backgroundClass = bgColor ? styles.background : "";
  const backgroundColor = null;
  return (
    <div className={`${backgroundClass}`}>
      <Container>
        <Row as="section" className={`${styles.background} ${className}`}>
          <Col md={{ span: 2 }} xs="12" className={styles.padder}>
            <FooterLogo />
          </Col>
          <Col
            md={{ span: 3, order: 1, offset: 1 }}
            xs={{ span: 12, order: 3 }}
            className={styles.padder}
          >
            <FirstColumn />
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
          </Col>
          <Col
            md={{ span: 2, order: 2, offset: 1 }}
            xs={{ span: 6, order: 1 }}
            className={styles.padder}
          >
            <SecondColumn />
          </Col>
          <Col md={{ span: 3, order: 3 }} xs={{ span: 6, order: 2 }}>
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
