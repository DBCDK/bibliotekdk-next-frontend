import PropTypes from "prop-types";
import { useMemo } from "react";
import { Container, Row, Col } from "react-bootstrap";

import Section from "@/components/base/section";
import Accordion from "@/components/base/accordion";
import Translate from "@/components/base/translate";
import Button from "@/components/base/button";
import Link from "@/components/base/link";

import { sortData } from "./utils";

import styles from "./Faq.module.css";

/**
 * The FAQ React component
 *
 * @param {obj} props
 * @param {obj} props.className
 * @param {obj} props.data
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export function Faq({ className, data }) {
  data = useMemo(() => sortData(data), [data]);

  return (
    <Section
      className={`${styles.faq} ${className}`}
      title={Translate({ context: "help", label: "faq-title" })}
    >
      <Row>
        <Col lg="8">
          <Accordion data={data} className={styles.accordion} />
          <Link href="/hjaelp" a={false}>
            <Button type="secondary" size="medium" className={styles.button}>
              {Translate({ context: "help", label: "show-more-faq" })}
            </Button>
          </Link>
        </Col>
      </Row>
    </Section>
  );
}

Faq.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array,
};

export default function Wrap(props) {
  // real data goes here ...

  // temp. dummy
  const data = [
    {
      title: "Har mit bibliotek bogen?",
      body: {
        value:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam placerat sodales risus ac suscipit. Integer aliquam lacus enim, sit amet pharetra diam tempor eu. Etiam vel augue eros. Donec ac malesuada tortor. Curabitur quis diam sapien. Sed vel massa metus. Suspendisse feugiat scelerisque commodo. Sed scelerisque pharetra nisi vel sagittis. Ut id pellentesque sem. Pellentesque placerat facilisis commodo. Aenean ligula metus, sodales et augue eget, porttitor gravida arcu.",
      },
    },
    {
      title:
        "Hvorfor ser jeg et mindre antal poster end det, der står i antal hits?",
      body: {
        value:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam placerat sodales risus ac suscipit. Integer aliquam lacus enim, sit amet pharetra diam tempor eu. Etiam vel augue eros. Donec ac malesuada tortor.",
      },
    },
    {
      title: "Hvordan søger jeg specifikt på fx. mp3-lydbøger?",
      body: {
        value:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam placerat sodales risus ac suscipit. Integer aliquam lacus enim, sit amet pharetra diam tempor eu. Etiam vel augue eros. Donec ac malesuada tortor. Curabitur quis diam sapien. Sed vel massa metus. Suspendisse feugiat scelerisque commodo. Sed scelerisque pharetra nisi vel sagittis. Ut id pellentesque sem.",
      },
    },
    {
      title: "Hvordan ser jeg de nyeste resultater først?",
      body: {
        value:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam placerat sodales risus ac suscipit. Integer aliquam lacus enim, sit amet pharetra diam tempor eu. Etiam vel augue eros. Donec ac malesuada tortor.",
      },
    },
    {
      title: "Hvordan fornyer jeg et lån?",
      body: {
        value:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam placerat sodales risus ac suscipit. Integer aliquam lacus enim, sit amet pharetra diam tempor eu. Etiam vel augue eros. Donec ac malesuada tortor. Curabitur quis diam sapien. Sed vel massa metus. Suspendisse feugiat scelerisque commodo. Sed scelerisque pharetra nisi vel sagittis. Ut id pellentesque sem.",
      },
    },
  ];

  return <Faq {...props} data={data} />;
}

Wrap.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array,
};
