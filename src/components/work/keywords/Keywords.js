import PropTypes from "prop-types";

import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";

import { cyKey } from "@/utils/trim";

import Section from "@/components/base/section";
import Title from "@/components/base/title";
import Link from "@/components/base/link";
import Translate from "@/components/base/translate";

import styles from "./Keywords.module.css";
import { uniqueSubjectEntries } from "@/lib/utils";
import { lang } from "@/components/base/translate";

/**
 * bibliotek.dk url
 *
 * @param {string} keyword
 * Create search url including keyword in current bibliotek.dk version
 *
 * @returns {string}
 */
function url(keyword) {
  return `/find?q.subject=${keyword}`;

  //return `https://bibliotek.dk/da/search/work?search_block_form=phrase.subject%3D%22${keyword}%22#content`;
}

/**
 * getFontSize
 *
 * @param {Array} keywords Get fontsize according to amount of keywords
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
 * @returns {JSX.Element}
 */
export function Keywords({
  className = "",
  data: uniqueSubjects = [],
  skeleton = false,
}) {
  // Get fontsize - based on subjects in data
  const sizeClass = getFontSize(uniqueSubjects);

  // Translate Context
  const context = { context: "keywords" };

  return (
    <Section
      title={Translate({ ...context, label: "title" })}
      space={{ top: "var(--pt8)" }}
      backgroundColor="var(--jagged-ice)"
    >
      <div data-cy="keywords" className={`${styles.keywords} ${className}`}>
        {uniqueSubjects.map((val) => {
          const key = cyKey({ name: val, prefix: "keyword" });

          return (
            <span
              data-cy={key}
              className={`${styles.keyword} ${sizeClass}`}
              key={`${key}-${JSON.stringify(val)}`}
            >
              <Link
                a
                href={url(val)}
                border={{ bottom: { keepVisible: true } }}
              >
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
 * @returns {JSX.Element}
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
 * @returns {JSX.Element}
 */
export default function Wrap(props) {
  const { workId } = props;

  // Call materialTypes mockdata API
  const { data, isLoading, error } = useData(
    workId && workFragments.subjects({ workId })
  );

  if (isLoading) {
    return <KeywordsSkeleton />;
  }

  if (error) {
    return null;
  }

  // get subjects from response
  const subjectsDbcVerified = data?.work?.subjects?.dbcVerified;

  if (!subjectsDbcVerified || subjectsDbcVerified.length === 0) {
    return null;
  }
  const subjectsFiltered = subjectsDbcVerified.filter((sub) => {
    return sub?.language?.isoCode === "dan";
  });

  if (!subjectsFiltered || subjectsFiltered.length === 0) {
    return null;
  }

  return (
    <Keywords
      className={props.className}
      skeleton={false}
      data={uniqueSubjectEntries(subjectsFiltered)}
    />
  );
}

// PropTypes for component
Wrap.propTypes = {
  workId: PropTypes.string,
  type: PropTypes.string,
  skeleton: PropTypes.bool,
};
