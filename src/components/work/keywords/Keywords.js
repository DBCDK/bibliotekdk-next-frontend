import PropTypes from "prop-types";

import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";

import Translate from "@/components/base/translate";

import styles from "./Keywords.module.css";
import { uniqueSubjectEntries } from "@/lib/utils";
import { Related } from "@/components/work/related/Related";

export function mapFontStyles(len) {
  const styleIndex = [
    [0, 1, 2, 3].includes(len),
    [4, 5, 6].includes(len),
    true,
  ].findIndex((idx) => idx === true);

  const styleMap = [
    {
      "--text-element-font-size": "var(--pt5)",
      "--text-element-line-height": "var(--pt7)",
    },
    {
      "--text-element-font-size": "var(--pt4)",
      "--text-element-line-height": "var(--pt6)",
    },
    {
      "--text-element-font-size": "var(--pt3)",
      "--text-element-line-height": "var(--pt4)",
    },
  ];
  return styleMap[styleIndex];
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
    "someKeyword",
    "someKeyword",
    "someOtherKeyword",
    "someKeyword",
    "keyword",
    "someKeyword",
    "someOtherKeyword",
    "keyword",
  ];

  return (
    <Related
      data={data}
      className={`${props.className} ${styles.skeleton}`}
      isLoading={true}
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

  const keywords = uniqueSubjectEntries(subjectsDbcVerified);

  const style = {
    "--text-element-font-family": "var(--title-font)",
    ...mapFontStyles(keywords?.length),
  };

  return (
    <Related
      data={keywords}
      isLoading={false}
      titleText={Translate({ context: "keywords", label: "title" })}
      dataCy_prefix="keywords"
      textType={"ignore_text_type"}
      style={style}
      space={{ top: "var(--pt8)", bottom: "var(--pt0)" }}
    />
  );
}

// PropTypes for component
Wrap.propTypes = {
  workId: PropTypes.string,
  type: PropTypes.string,
  skeleton: PropTypes.bool,
};
