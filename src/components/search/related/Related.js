import { useData } from "@/lib/api/api";
import { hitcount } from "@/lib/api/search.fragments";

import useFilters from "@/components/hooks/useFilters";
import useQ from "@/components/hooks/useQ";

import Link from "@/components/base/link";

import Title from "@/components/base/title";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import Section from "@/components/base/section";

import useBreakpoint from "@/components/hooks/useBreakpoint";

import styles from "./Related.module.css";

function Word({ word }) {
  return (
    <Link
      href={`/find?q.all=${word}`}
      className={styles.word}
      border={{ bottom: { keepVisible: true } }}
    >
      <Text>{word}</Text>
    </Link>
  );
}

export function Realted({ data, hitcount, isLoading }) {
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
        <div className={styles.related}>
          <Text className={styles.label}>Lignende søgninger:</Text>
          <div className={styles.words}>
            {data.map((w) => (
              <Word word={w} />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

export default function Wrap() {
  const filters = useFilters().getQuery();
  const q = useQ().getQuery();

  const hitcountResponse = useData(hitcount({ q, filters }));

  const data = [
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

  const hits = hitcountResponse?.data?.search?.hitcount || 0;

  return (
    <Realted
      data={data}
      hitcount={hits}
      isLoading={hitcountResponse?.isLoading}
    />
  );
}
