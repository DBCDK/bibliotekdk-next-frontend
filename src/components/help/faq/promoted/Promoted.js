import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { Row, Col } from "react-bootstrap";

import Section from "@/components/base/section";
import Accordion from "@/components/base/accordion";
import Translate from "@/components/base/translate";
import Button from "@/components/base/button";
import Link from "@/components/base/link";

import { sortData } from "../utils";

import { useData } from "@/lib/api/api";
import { promotedFaqs } from "@/lib/api/faq.fragments";
import Skeleton from "@/components/base/skeleton";

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
export function Promoted({ className, data }) {
  data = useMemo(() => sortData(data), [data]);

  return (
    <Section
      className={`${styles.promoted} ${className}`}
      title={Translate({ context: "help", label: "faq-title" })}
      dataCy="faq"
    >
      <Row>
        <Col lg="8">
          <Accordion data={data} className={styles.accordion} />
          <Link href="/hjaelp/faq" a={false}>
            <Button type="secondary" size="medium" className={styles.button}>
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

export default function Wrap(props) {
  // real data goes here ...
  const { isLoading, data, error } = useData(promotedFaqs());

  if (isLoading) {
    return <Skeleton lines={2} />;
  }

  if (!data || !data.faq || error) {
    // @TODO some error here .. message for user .. log ??
    return null;
  }

  const realdata = data.faq.entities;

  return <Promoted {...props} data={realdata} />;
}

Wrap.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array,
};
