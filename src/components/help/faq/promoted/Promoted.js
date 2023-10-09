import PropTypes from "prop-types";
import React, { useMemo } from "react";
import Col from "react-bootstrap/Col";

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
 * @param {Object} props
 * @param {string} props.className
 * @param {Array} props.data
 * @param {boolean} props.isLoading
 * See propTypes for specific props and types
 *
 * @returns {React.ReactElement | null}
 */
export function Promoted({ className = "", data = [], isLoading }) {
  const sortedData = useMemo(() => sortData(data), [data]);

  return (
    <Section
      className={`${styles.promoted} ${className}`}
      title={Translate({ context: "help", label: "faq-title" })}
      dataCy="faq"
      space={{ bottom: false }}
      isLoading={isLoading}
    >
      <Col lg={8}>
        <Accordion data={sortedData} isLoading={isLoading} />
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
 * @param {Object} props
 * @param {Object} props.className
 * @param {Object} props.data
 * See propTypes for specific props and types
 *
 * @returns {React.ReactElement | null}
 */
export default function Wrap(props) {
  const langcode = getLanguage();
  // real data goes here ...
  const { isLoading, data, error } = useData(promotedFaqs(langcode));

  if ((!data || !data.faq || error) && !isLoading) {
    // @TODO some error here .. message for user .. log ??
    return null;
  }

  const realData = data?.faq?.entities;

  return <Promoted {...props} isLoading={isLoading} data={realData} />;
}

Wrap.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array,
};
