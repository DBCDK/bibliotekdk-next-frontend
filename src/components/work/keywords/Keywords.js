import PropTypes from "prop-types";

import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";

import { cyKey } from "@/utils/trim";

import Section from "@/components/base/section";
import Title from "@/components/base/title";
import Text from "@/components/base/text";
import Link from "@/components/base/link";
import Translate from "@/components/base/translate";

import styles from "./Keywords.module.css";
import { uniqueSubjectEntries } from "@/lib/utils";
import { useMemo } from "react";

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

// How we want to group the subjects by type
const SUBJECT_GROUPS = [
  [
    "TOPIC",
    "FICTIONAL_CHARACTER",
    "MEDICAL_SUBJECT_HEADING",
    "MUSIC_COUNTRY_OF_ORIGIN",
    "MUSIC_TIME_PERIOD",
    "MUSICAL_INSTRUMENTATION",
    "NATIONAL_AGRICULTURAL_LIBRARY",
    "TITLE",
    "FILM_NATIONALITY",
    "LIBRARY_OF_CONGRESS_SUBJECT_HEADING",
    "PERSON",
    "CORPORATION",
  ],
  ["LOCATION", "TIME_PERIOD"],
];

/**
 * Group subjects according to types, and remove duplicates
 *
 * Ex. output
 * [
 *   {
 *     key: "historie-2. verdenskrig",
 *     subjects: [
 *       {type: "TOPIC", display: "historie"},
 *       {type: "TOPIC", display: "2. verdenskrig"}
 *     ]
 *   },
 *   {
 *     key: "Tyskland-1930-1939",
 *     subjects: [
 *       {type: "LOCATION", display: "Tyskland"},
 *       {type: "TIME_PERIOD", display: "1930-1939"}
 *     ]
 *   }
 * ]
 */
function groupSubjects(subjects) {
  const seen = {};
  const groups = [];

  SUBJECT_GROUPS.forEach((types) => {
    const group = subjects.filter(({ type, display }) => {
      if (seen[display]) {
        return false;
      }
      if (types.includes(type)) {
        seen[display] = true;
        return true;
      }
    });
    if (group.length > 0) {
      groups.push({
        key: group.map((s) => s.display).join("-"),
        subjects: group,
      });
    }
  });

  return groups;
}

/**
 * Used in manifestationParser to get a list of links to subjects.
 * @param subjects
 * @returns {unknown[] | undefined}
 * @constructor
 */
export function FlatSubjectsForFullManifestation(subjects) {
  // const grouped = groupSubjects(subjects?.dbcVerified);
  // @TODO .. should we use this group shit for anything in full manifestation ?

  return subjects?.dbcVerified?.map((sub, index) => {
    return (
      <>
        <Link
          a
          href={url(sub.display)}
          border={{ bottom: { keepVisible: true } }}
          className={styles.bibliographickeywordslink}
          key={`flat-subject-${index}`}
        >
          <Text type="text3" tag="span">
            {sub.display}
          </Text>
        </Link>
        {index < subjects?.dbcVerified?.length - 1 && <>,&nbsp;</>}
      </>
    );
  });
}

/**
 * The actual list of subjects
 * @param className
 * @param grouped
 * @param skeleton
 * @param sizeClass
 * @returns {JSX.Element}
 */
function KeyWordList({ className, grouped, skeleton, sizeClass }) {
  return (
    <div data-cy="keywords" className={`${styles.keywords} ${className}`}>
      {grouped?.map((group, idx) => {
        return (
          <div key={group.key} data-cy={`keyword-group-${idx}`}>
            {group.subjects.map(({ display }) => {
              const key = cyKey({ name: display, prefix: "keyword" });

              return (
                <span
                  data-cy={key}
                  className={`${styles.keyword} ${sizeClass}`}
                  key={`${key}-${JSON.stringify(display)}`}
                >
                  <Title type="title4" skeleton={skeleton}>
                    <Link
                      a
                      href={url(display)}
                      border={{ bottom: { keepVisible: true } }}
                    >
                      {display}
                    </Link>
                  </Title>
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {JSX.Element}
 */
export function Keywords({ className = "", data = [], skeleton = false }) {
  const uniqueSubjects = uniqueSubjectEntries(data);
  // Get fontsize - based on subjects in data
  const sizeClass = getFontSize(uniqueSubjects);

  const grouped = useMemo(() => {
    return groupSubjects(data);
  }, [data]);

  // Translate Context
  const context = { context: "keywords" };

  return (
    <Section
      title={Translate({ ...context, label: "title" })}
      space={{ top: "var(--pt8)" }}
      backgroundColor="var(--jagged-ice)"
    >
      <KeyWordList
        className={className}
        grouped={grouped}
        skeleton={skeleton}
        sizeClass={sizeClass}
      />
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
    { type: "TOPIC", display: "someKeyword" },
    { type: "TOPIC", display: "someKeyword" },
    { type: "TOPIC", display: "someOtherKeyword" },
    { type: "TOPIC", display: "someKeyword" },
    { type: "TOPIC", display: "keyword" },
    { type: "TOPIC", display: "someKeyword" },
    { type: "TOPIC", display: "someOtherKeyword" },
    { type: "TOPIC", display: "keyword" },
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
  const subjects = data?.work?.subjects?.selectedSubjects;

  if (!subjects || subjects.length === 0) {
    return null;
  }
  const subjectsFiltered = subjects.filter((sub) => {
    return !sub?.language || sub?.language?.isoCode === "dan";
  });

  if (!subjectsFiltered || subjectsFiltered.length === 0) {
    return null;
  }

  return (
    <Keywords
      className={props.className}
      skeleton={false}
      data={subjectsFiltered}
    />
  );
}

// PropTypes for component
Wrap.propTypes = {
  workId: PropTypes.string,
  type: PropTypes.string,
  skeleton: PropTypes.bool,
};
