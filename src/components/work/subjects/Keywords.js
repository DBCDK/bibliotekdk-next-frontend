import PropTypes from "prop-types";
import { Row, Col } from "react-bootstrap";

import dummy_materialTypesApi from "../dummy.materialTypesApi";

import Section from "../../base/section";
import Title from "../../base/title";
import Link from "../../base/link";
import Translate from "../../base/translate";

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
  return `https://bibliotek.dk/da/search/work/?search_block_form=phrase.subject%3D%22${keyword}%22#content`;
}

/**
 * getFontSize
 *
 * @param {obj} data
 * Get fontsize according to amount of keywords
 *
 * @returns {string}
 */
function getFontSize(data) {
  if (!data || !data.keywords) {
    return "";
  }

  const numb = data.keywords.length;

  if (numb < 3) {
  }

  return "";
}

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export function Keywords({ className = "", data = {}, skeleton = false }) {
  // Translate Context
  const context = { context: "keywords" };

  const fontSize = getFontSize(data);

  return (
    <Section
      title={Translate({ ...context, label: "title" })}
      bgColor="var(--jagged-ice)"
    >
      <div className={`${styles.keywords} ${className}`}>
        {data.keywords &&
          data.keywords.map((k) => {
            return (
              <span className={`${styles.keyword}`}>
                <Link a href={url(k)} target="_blank">
                  <Title type="title4" skeleton={skeleton}>
                    {k}
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
  const data = {
    keywords: [
      "someKeyword",
      "someKeyword",
      "someKeyword",
      "keyword",
      "someKeyword",
      "someOtherKeyword",
    ],
  };

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
  const data = dummy_materialTypesApi({ workId, type });

  const isLoading = skeleton;
  const error = false;

  if (isLoading) {
    return <KeywordsSkeleton />;
  }

  if (error) {
    return null;
  }

  return <Keywords {...props} data={data[workId]} />;
}

// PropTypes for component
Wrap.propTypes = {
  workId: PropTypes.string,
  type: PropTypes.string,
  skeleton: PropTypes.bool,
};
