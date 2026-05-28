import PropTypes from "prop-types";
import React, { useMemo } from "react";
import Accordion from "@/components/base/accordion";
import Text from "@/components/base/text";
import Title from "@/components/base/title";
import Translate from "@/components/base/translate";
import { getLanguage } from "@/components/base/translate/Translate";
import { groupSortData } from "../utils";
import styles from "./Published.module.css";
import { getPublishedFaqs } from "@/local-data/cms/resolvers";

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
  const realdata = getPublishedFaqs(getLanguage());
  return <Published {...props} data={realdata} />;
}

Wrap.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array,
};
