import { useData } from "@/lib/api/api";
import { subjects } from "@/lib/api/relatedSubjects.fragments";

import useQ from "@/components/hooks/useQ";

import FilterButton from "../filterButton";

import { cyKey } from "@/utils/trim";

import Link from "@/components/base/link";
import Skip from "@/components/base/skip";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import Section from "@/components/base/section";

import styles from "./Related.module.css";

/**
 *
 * Returns a item/word for the items/words component
 */
function Word({ word, isLoading }) {
  return (
    <Link
      href={`/find?q.subject=${word}`}
      dataCy={cyKey({ name: word, prefix: "related-subject" })}
      className={styles.word}
      disabled={isLoading}
      border={{ bottom: { keepVisible: true } }}
    >
      <Text skeleton={isLoading} lines={1} tag="span">
        {word}
      </Text>
    </Link>
  );
}

/**
 *
 * Returns a list of related subject words/items
 */
export function Words({ data, isLoading }) {
  const skeletonClass = isLoading ? styles.skeleton : "";

  return (
    <div className={`${skeletonClass} ${styles.related}`}>
      <Text className={styles.label} skeleton={isLoading} lines={1}>
        {Translate({ context: "search", label: "relatedSubjects" })}
      </Text>
      <div className={styles.words} data-cy="words-container">
        {data.map((w) => (
          <Word key={w} word={w} isLoading={isLoading} />
        ))}
      </div>
    </div>
  );
}

/**
 *
 * Related subjects used in a section component
 */
export function Related({ data, isLoading }) {
  const noRelatedSubjects = data.length === 0 && !isLoading;

  const noRelatedSubjectsClass = noRelatedSubjects
    ? styles.noRelatedSubjects
    : "";

  return (
    <Section
      className={`${styles.section} ${noRelatedSubjectsClass}`}
      divider={false}
      space={{
        bottom: "var(--pt4)",
      }}
      title={
        noRelatedSubjects ? (
          <span />
        ) : (
          <FilterButton isLoading={isLoading} className={styles.filterButton} />
        )
      }
    >
      {(data.length > 0 || isLoading) && (
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
      )}
    </Section>
  );
}

/**
 *
 * Wrap for fetching data for the subject Related component
 */
export default function Wrap() {
  const q = useQ().getQuery();

  // prioritized q type to get related subjects for
  const query = q.subject || q.all || q.title || q.creator;

  const { data, isLoading } = useData(
    query && subjects({ q: [query], limit: 7 })
  );

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
      isLoading={isLoading}
    />
  );
}
