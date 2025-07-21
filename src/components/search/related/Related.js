import { useData } from "@/lib/api/api";
import { subjects } from "@/lib/api/relatedSubjects.fragments";

import useQ from "@/components/hooks/useQ";
import { cyKey } from "@/utils/trim";

import Link from "@/components/base/link";
import Skip from "@/components/base/skip";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import Section from "@/components/base/section";

import styles from "./Related.module.css";
import { getUrlByType } from "@/components/search/advancedSearch/utils";

/**
 *
 * Returns a item/word for the items/words component
 */
function Word({ word, isLoading }) {
  const subject = word?.subject;
  const traceId = word?.traceId;
  return (
    <span className={styles.word}>
      <Link
        href={getUrlByType({ type: "subject", value: subject, traceId })}
        dataCy={cyKey({ name: subject, prefix: "related-subject" })}
        disabled={isLoading}
        border={{ bottom: { keepVisible: true } }}
      >
        <Text skeleton={isLoading} lines={1} tag="span">
          {subject}
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
    <>
      {data.map((w) => (
        <Word key={w.subject} word={w} isLoading={isLoading} />
      ))}
    </>
  );
}

/**
 *
 * Related subjects used in a section component
 */
export function Related({ data = {}, isLoading }) {
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
      title={<span />}
    >
      {(data.length > 0 || isLoading) && (
        <div>
          <Skip
            id="search-result-section"
            className={styles.skip}
            label={Translate({
              context: "search",
              label: "skipRelatedSubjects",
            })}
          />

          <div className={styles.related}>
            <div className={styles.words} data-cy="words-container">
              <Text
                skeleton={isLoading}
                lines={1}
                tag={"span"}
                className={styles.oneline}
              >
                {Translate({ context: "search", label: "relatedSubjects" })}
              </Text>
              <Words data={data} isLoading={isLoading} />
            </div>
          </div>
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
    { subject: "heste" },
    { subject: "børnebøger" },
    { subject: "ridning" },
    { subject: "hestesygdomme" },
    { subject: "vokal" },
    { subject: "sygdomme" },
    { subject: "hestesport" },
    { subject: "træning" },
    { subject: "skolebøger" },
    { subject: "hesteavl" },
  ];

  return (
    <Related
      data={data?.recommendations?.subjects || (isLoading && dummy) || []}
      isLoading={isLoading}
    />
  );
}
