import PropTypes from "prop-types";
import React, { useMemo } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import Section from "@/components/base/section";
import Accordion from "@/components/base/accordion";
import Translate from "@/components/base/translate";
import Button from "@/components/base/button";
import Link from "@/components/base/link";

import { sortData } from "../utils";

import { useData } from "@/lib/api/api";
import { promotedFaqs } from "@/lib/api/faq.fragments";

import { getLanguage } from "@/components/base/translate/Translate";

import styles from "./Promoted.module.css";

/**
 * The Promoted FAQs React component
 *
 * @param {obj} props
 * @param {obj} props.className
 * @param {obj} props.data
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export function Promoted({ className = "", data = [], isLoading }) {
  data = useMemo(() => sortData(data), [data]);

  return (
    <Section
      className={`${styles.promoted} ${className}`}
      title={Translate({ context: "help", label: "faq-title" })}
      dataCy="faq"
      space={{ bottom: false }}
      isLoading={isLoading}
    >
      <Row>
        <Col lg={8}>
          <Accordion
            data={data}
            isLoading={isLoading}
            className={styles.accordion}
          />
          <Link href="/hjaelp/faq" a={false}>
            <Button
              type="secondary"
              size="medium"
              className={styles.button}
              skeleton={isLoading}
            >
              {Translate({ context: "help", label: "show-more-faq" })}
            </Button>
          </Link>
        </Col>
      </Row>
    </Section>
  );
}

Promoted.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array,
};

/**
 * The Default export with data fetch
 *
 * @param {obj} props
 * @param {obj} props.className
 * @param {obj} props.data
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function Wrap(props) {
  const langcode = getLanguage();
  // real data goes here ...
  const { isLoading, data, error } = useData(promotedFaqs(langcode));

  if ((!data || !data.faq || error) && !isLoading) {
    // @TODO some error here .. message for user .. log ??
    return null;
  }

  const realdata = data?.faq?.entities;

  return <Promoted {...props} isLoading={isLoading} data={realdata} />;
}

Wrap.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array,
};
