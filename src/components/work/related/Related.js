import { useData } from "@/lib/api/api";
import { subjects } from "@/lib/api/relatedSubjects.fragments";

import { cyKey } from "@/utils/trim";

import Link from "@/components/base/link";
import Skip from "@/components/base/skip";
import Text from "@/components/base/text";
import Title from "@/components/base/title";
import Translate from "@/components/base/translate";
import Section from "@/components/base/section";

import styles from "./Related.module.css";
import * as workFragments from "@/lib/api/work.fragments";
import { subjectUrl } from "@/components/work/keywords/Keywords";

/**
 *
 * Returns a item/word for the items/words component
 */
function Word({ word, isLoading }) {
  return (
    <span className={styles.word}>
      <Link
        href={subjectUrl(word)}
        dataCy={cyKey({ name: word, prefix: "related-subject" })}
        disabled={isLoading}
        border={{ bottom: { keepVisible: true } }}
      >
        <Text type="text2" skeleton={isLoading} lines={1} tag="span">
          {word}
        </Text>
      </Link>
    </span>
  );
}

/**
 *
 * Returns a list of related subject words/items
 */
export function Words({ data, isLoading }) {
  return (
    <div className={styles.words} data-cy="words-container">
      {data.map((w) => (
        <Word key={w} word={w} isLoading={isLoading} />
      ))}
    </div>
  );
}

/**
 *
 * Related subjects used in a section component
 */
export function Related({ data, isLoading }) {
  return (
    <Section
      title={
        <Title type="text1" tag="h3">
          {Translate({ context: "relatedKeywords", label: "title" })}
        </Title>
      }
      className={styles.section}
      divider={false}
      sectionTag="div" // Section sat in parent
    >
      <div>
        <Skip
          id="view-all-filters"
          className={styles.skip}
          label={Translate({
            context: "search",
            label: "skipRelatedSubjects",
          })}
        />
        <Words data={data} isLoading={isLoading} />
      </div>
    </Section>
  );
}

/**
 *
 * Wrap for fetching data for the subject Related component
 * update - 05/04/24 - only handle selected worktypes
 */
export default function Wrap({ workId }) {
  const worktypesToHandle = ["LITERATURE", "ARTICLE", "MOVIE", "PODCAST"];

  // fetch work subjects
  const { data: workData, isLoading: workIsLoading } = useData(
    workFragments.subjects({ workId })
  );

  // filter on danish keywords && flatten subjects to array of strings
  const keywords = workData?.work?.subjects?.selectedSubjects
    .filter((sub) => {
      return sub?.language?.isoCode === "dan";
    })
    ?.map((s) => s.display);
  // get related subjects
  const { data, isLoading } = useData(
    keywords?.length && subjects({ q: keywords })
  );

  const worktype = workData?.work?.workTypes[0];

  if (
    !keywords ||
    keywords.length === 0 ||
    !worktypesToHandle.includes(worktype)
  ) {
    return null;
  }

  // Remove section if work contains no keywords
  if ((!data || data?.relatedSubjects?.length === 0) && !isLoading) {
    return null;
  }

  // dummy data will be returned on isLoading - skeleton view
  const dummy = [
    "heste",
    "børnebøger",
    "ridning",
    "hestesygdomme",
    "vokal",
    "sygdomme",
    "hestesport",
    "træning",
    "skolebøger",
    "hesteavl",
  ];

  return (
    <Related
      data={data?.relatedSubjects || (isLoading && dummy) || []}
      isLoading={workIsLoading || isLoading}
    />
  );
}
