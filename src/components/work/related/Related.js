import { useData } from "@/lib/api/api";
import { basic } from "@/lib/api/work.fragments";
import { subjects } from "@/lib/api/relatedSubjects.fragments";

import uniqBy from "lodash/uniqBy";

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
      href={`/find?q.all=${word}`}
      className={styles.word}
      disabled={isLoading}
      border={{ bottom: { keepVisible: true } }}
    >
      <Text skeleton={isLoading} lines={1}>
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
  return (
    <div className={styles.words}>
      {data.map((w) => (
        <Word word={w} isLoading={isLoading} />
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
        <Text type="text1">
          {Translate({ context: "relatedKeywords", label: "title" })}
        </Text>
      }
      className={styles.section}
      bgColor="var(--jagged-ice)"
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
 */
export default function Wrap({ workId }) {
  // Call materialTypes mockdata API
  const { data: workData, isLoading: workIsLoading } = useData(
    basic({ workId })
  );

  let keywords = workData?.work?.subjects;

  /**
   * This section can be removed when work is migrated to fbi-api
   */
  // Include wanted subject types
  const include = ["DBCS", "DBCF", "DBCM", null];
  let filteredData = keywords?.filter((s) => include.includes(s.type));

  // Remove duplicates and flatten
  filteredData = uniqBy(filteredData, (s) =>
    s.value.toLowerCase().replace(/\./g, "")
  );
  // flatten data value as array
  keywords = filteredData.map((s) => s.value);
  /**
   *
   */

  const { data, isLoading } = useData(
    keywords?.length && subjects({ q: keywords })
  );

  // Remove section if work contains no keywords
  if (data?.relatedSubjects?.length === 0 && !isLoading) {
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
