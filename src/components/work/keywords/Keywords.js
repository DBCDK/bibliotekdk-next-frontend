import PropTypes from "prop-types";
import { uniqBy } from "lodash";

import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";

import { cyKey } from "@/utils/trim";

import Section from "@/components/base/section";
import Title from "@/components/base/title";
import Link from "@/components/base/link";
import Translate from "@/components/base/translate";

import styles from "./Keywords.module.css";

/**
 * bibliotek.dk url
 *
 * @param {string} keyword
 * Create search url including keyword in current bibliotek.dk version
 *
 * @returns {string}
 */
function url(keyword) {
  return `https://bibliotek.dk/da/search/work?search_block_form=phrase.subject%3D%22${keyword}%22#content`;
}

/**
 * getFontSize
 *
 * @param {obj} data
 * Get fontsize according to amount of keywords
 *
 * @returns {obj} // styles.class
 */
function getFontSize(keywords) {
  if (!keywords) {
    return styles.small;
  }

  if (keywords.length <= 3) {
    return styles.large;
  }

  if (keywords.length <= 6) {
    return styles.medium;
  }

  return styles.small;
}

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export function Keywords({ className = "", data = [], skeleton = false }) {
  // Translate Context
  const context = { context: "keywords" };

  // Include wanted subject types
  const include = ["DBCS", null];
  const filteredData = data.filter((s) => include.includes(s.type));

  // Remove duplicates
  data = uniqBy(filteredData, (s) => s.value.toLowerCase().replace(/\./g, ""));

  // Get fontsize - based on subjects in data
  const sizeClass = getFontSize(data);

  return (
    <Section
      title={Translate({ ...context, label: "title" })}
      bgColor="var(--jagged-ice)"
    >
      <div data-cy="keywords" className={`${styles.keywords} ${className}`}>
        {data.map((k) => {
          const val = k.value.replace(/\./g, "");
          const key = cyKey({ name: val, prefix: "keyword" });

          return (
            <span
              data-cy={key}
              className={`${styles.keyword} ${sizeClass}`}
              key={`${k.type}-${key}`}
            >
              <Link a href={url(k.value)} target="_blank">
                <Title type="title4" skeleton={skeleton}>
                  {val}
                </Title>
              </Link>
            </span>
          );
        })}
      </div>
    </Section>
  );
}

/**
 * Function to return skeleton (Loading) version of the Component
 *
 * @param {obj} props
 *  See propTypes for specific props and types
 *
 * @returns {component}
 */
export function KeywordsSkeleton(props) {
  const data = [
    { type: "1", value: "someKeyword" },
    { type: "2", value: "someKeyword" },
    { type: "3", value: "someOtherKeyword" },
    { type: "4", value: "someKeyword" },
    { type: "5", value: "keyword" },
    { type: "6", value: "someKeyword" },
    { type: "7", value: "someOtherKeyword" },
    { type: "8", value: "keyword" },
  ];

  return (
    <Keywords
      {...props}
      data={data}
      className={`${props.className} ${styles.skeleton}`}
      skeleton={true}
    />
  );
}

/**
 *  Default export function of the Component
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function Wrap(props) {
  const { workId, type, skeleton } = props;

  // Call materialTypes mockdata API
  const { data, isLoading, error } = useData(workFragments.basic({ workId }));

  if (isLoading) {
    return <KeywordsSkeleton />;
  }

  if (error) {
    return null;
  }

  // get subjects from response
  const subjects = data.work.subjects;

  return <Keywords {...props} data={subjects} />;
}

// PropTypes for component
Wrap.propTypes = {
  workId: PropTypes.string,
  type: PropTypes.string,
  skeleton: PropTypes.bool,
};
