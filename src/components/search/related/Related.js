import { useData } from "@/lib/api/api";
import { hitcount } from "@/lib/api/search.fragments";
import { subjects } from "@/lib/api/relatedSubjects.fragments";

import useFilters from "@/components/hooks/useFilters";
import useQ from "@/components/hooks/useQ";
import useBreakpoint from "@/components/hooks/useBreakpoint";

import { cyKey } from "@/utils/trim";

import Link from "@/components/base/link";
import Skip from "@/components/base/skip";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import Section from "@/components/base/section";

import styles from "./Related.module.css";
import { useModal } from "@/components/_modal";

import Button from "@/components/base/button/Button";
import Icon from "@/components/base/icon/Icon";
import { FilterTypeEnum } from "@/lib/enums";

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
export function Related({ data, filtersCount, isLoading, modal, q }) {
  const breakpoint = useBreakpoint();
  const isMobile =
    breakpoint === "xs" || breakpoint === "sm" || breakpoint === "md" || false;

  // remove entire section if no hits on mobile
  if (data.length === 0 && !isLoading && isMobile) {
    return null;
  }

  const filtersLabel = Translate({
    context: "search",
    label: filtersCount === "0" ? "showAllFilters" : "showAllFiltersCount",
    vars: filtersCount === "0" ? null : [filtersCount],
  });

  return (
    <Section
      divider={false}
      space={{ bottom: "var(--pt4)" }}
      className={styles.section}
      title={
        <div className={styles.wrap}>
          <Button
            id="view-all-filters"
            className={styles.filtersButton}
            type="secondary"
            size="medium"
            dataCy="view-all-filters"
            onClick={() => modal.push("filter", { q })}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.keyCode === 13) {
                modal.push("filter", { q });
              }
            }}
          >
            <Icon src="settings.svg" size={2} />
            {filtersLabel}
          </Button>
        </div>
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
  const { filters } = useFilters();
  const { getCount } = useFilters();
  const filtersCount = getCount([FilterTypeEnum.WORK_TYPES]).toString();

  const q = useQ().getQuery();

  const modal = useModal();

  const hitcountResponse = useData(hitcount({ q, filters }));
  const hits = hitcountResponse?.data?.search?.hitcount || 0;

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
      hitcount={hits}
      isLoading={hitcountResponse?.isLoading || isLoading}
      modal={modal}
      filtersCount={filtersCount}
      q={q}
    />
  );
}
