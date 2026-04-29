import PropTypes from "prop-types";
import React, { useMemo } from "react";
import Accordion from "@/components/base/accordion";
import Text from "@/components/base/text";
import Title from "@/components/base/title";
import Translate from "@/components/base/translate";
import { groupSortData } from "../utils";
import styles from "./Published.module.css";
import { useData } from "@/lib/api/api";
import * as faqFragments from "@/lib/api/faq.fragments";
import Skeleton from "@/components/base/skeleton";

/**
 * The FAQ Published React component
 *
 * @param {Object} props
 * @param {Object} props.className
 * @param {Object} props.data
 * See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
 */
export function Published({ className, data }) {
  data = useMemo(() => groupSortData(data), [data]);

  return (
    <div className={`${styles.published} ${className}`}>
      <Title type="title5">
        {Translate({ context: "help", label: "faq-title" })}
      </Title>
      {Object.keys(data).map((key) => {
        return (
          <div className={styles.wrap} key={`faq-accordion-${key}`}>
            <Text className={styles.group} type="text1">
              {key}
            </Text>
            <Accordion data={data[key]} />
          </div>
        );
      })}
    </div>
  );
}

Published.propTypes = {
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
  // locale is not needed in the query (FAQ has no locale in Strapi)
  // but we keep getLocale available for future use
  const { isLoading, data, error } = useData(faqFragments.publishedFaqs());

  if (isLoading) {
    return <Skeleton lines={6} className={styles.helpskeleton} />;
  }

  if (!data || !data.bibliotekdkCms || error) {
    return null;
  }

  const realdata = data.bibliotekdkCms.faqs;

  return <Published {...props} data={realdata} />;
}

Wrap.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array,
};
