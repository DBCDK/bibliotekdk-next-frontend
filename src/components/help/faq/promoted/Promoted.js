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
 * @returns {React.JSX.Element}
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
        <Link href="/hjaelp/faq">
          <Button
            type="secondary"
            size="medium"
            className={styles.button}
            skeleton={isLoading}
            asLink={true}
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
 * @returns {React.JSX.Element}
 */
export default function Wrap(props) {
  const { isLoading, data, error } = useData(promotedFaqs());

  if ((!data || !data.bibliotekdkCms || error) && !isLoading) {
    return null;
  }

  const realData = data?.bibliotekdkCms?.faqs?.filter((faq) => faq.promoted);

  return <Promoted {...props} isLoading={isLoading} data={realData} />;
}

Wrap.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array,
};
