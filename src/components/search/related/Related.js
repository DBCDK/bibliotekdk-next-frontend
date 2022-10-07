import { useData } from "@/lib/api/api";
import { hitcount } from "@/lib/api/search.fragments";
import { subjects } from "@/lib/api/relatedSubjects.fragments";

import useFilters from "@/components/hooks/useFilters";
import useQ from "@/components/hooks/useQ";

import Link from "@/components/base/link";
import Skip from "@/components/base/skip";

import Title from "@/components/base/title";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import Section from "@/components/base/section";

import useBreakpoint from "@/components/hooks/useBreakpoint";

import styles from "./Related.module.css";

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

export function Words({ data, isLoading }) {
  return (
    <div className={styles.related}>
      <Text className={styles.label}>
        {Translate({ context: "search", label: "relatedSubjects" })}
      </Text>
      <div className={styles.words}>
        {data.map((w) => (
          <Word word={w} isLoading={isLoading} />
        ))}
      </div>
    </div>
  );
}

export function Related({ data, hitcount, isLoading }) {
  const breakpoint = useBreakpoint();
  const isMobile =
    breakpoint === "xs" || breakpoint === "sm" || breakpoint === "md" || false;

  return (
    <Section
      contentDivider={null}
      titleDivider={null}
      className={styles.section}
      title={
        !isMobile && (
          <div>
            <Text type="text3" skeleton={isLoading} lines={1}>
              {Translate({ context: "search", label: "title" })}
            </Text>
            <Title
              type="title5"
              tag="h3"
              className={styles.hitcount}
              skeleton={isLoading}
            >
              {hitcount}
            </Title>
          </div>
        )
      }
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

export default function Wrap() {
  const filters = useFilters().getQuery();
  const q = useQ().getQuery();

  const hitcountResponse = useData(hitcount({ q, filters }));
  const hits = hitcountResponse?.data?.search?.hitcount || 0;

  // prioritized q type to get related subjects for
  const query = q.subject || q.all || q.title || q.creator;

  const { data, isLoading } = useData(
    query && subjects({ q: [query], filters })
  );

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
      hitcount={hits}
      isLoading={hitcountResponse?.isLoading || isLoading}
    />
  );
}
