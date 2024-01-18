import Anchor from "@/components/base/anchor";
import Translate from "@/components/base/translate";
import Section from "@/components/base/section";
import styles from "./UniverseMembers.module.css";
import MaterialCard from "@/components/base/materialcard/MaterialCard";
import {
  templateForUniversePageSeries,
  templateForUniversePageWork,
} from "@/components/base/materialcard/templates/templates";
import { useData } from "@/lib/api/api";
import {
  universeContent,
  universeBasicInfo,
} from "@/lib/api/universe.fragments";
import { useState } from "react";
import { useInView } from "react-intersection-observer";
import Button from "@/components/base/button";
import { workTypesOrder } from "@/lib/enums_MaterialTypes";

const PAGE_SIZE = 16;

/**
 * Shows a page of universe content
 *
 */
function ContentPage({ universeId, workType, offset, limit, isScrolling }) {
  // We load data when page is near the viewport
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
    // If page is scrolling due to menu click
    // We do not register that page is in view
    skip: isScrolling,
    rootMargin: "1500px",
  });

  // fetch data
  const { data } = useData(
    universeId &&
      inView &&
      universeContent({
        key: universeId,
        workType,
        offset,
        limit,
      })
  );

  // Get entries, either real or skeleton
  const entries = data?.universe?.content?.entries || [
    ...new Array(limit).fill({ isLoading: true }),
  ];

  return (
    <div className={styles.section_flex} ref={ref}>
      {entries?.map((entry, index) => {
        return (
          <div
            key={entry?.seriesTitle || entry?.workId || index}
            style={{ height: 440 }}
          >
            <MaterialCard
              isLoading={entry.isLoading}
              propAndChildrenInput={{
                material: {
                  ...entry,
                  workTypes: entry.workTypes || entry.seriesWorkTypes,
                },
              }}
              propAndChildrenTemplate={
                entry.__typename === "Series"
                  ? templateForUniversePageSeries
                  : templateForUniversePageWork
              }
            />
          </div>
        );
      })}
    </div>
  );
}

// Map that stores if a section has been expanded
// (we can use browser back, and expanded state is remembered)
const globalExpandedSections = {};

/**
 * Shows a single universe worktype section
 */
function WorkTypesSection({
  universeId,
  workType,
  title,
  isScrolling,
  divider,
}) {
  const sectionKey = `${universeId}-${workType}`;
  const [expanded, setExpanded] = useState(
    !!globalExpandedSections[sectionKey]
  );

  // We need the hitcount
  const { data, isLoading } = useData(
    universeId &&
      universeContent({
        key: universeId,
        workType,
        offset: 0,
        limit: PAGE_SIZE,
      })
  );

  const hitcount = data?.universe?.content.hitcount || PAGE_SIZE;

  // Calculate all offset-limit pairs based on hitcount
  const pages = [];
  for (let i = 0; i < hitcount; i += PAGE_SIZE) {
    pages.push({ offset: i, limit: Math.min(hitcount - i, PAGE_SIZE) });
  }

  return (
    <Section title={title} isLoading={isLoading} divider={divider}>
      {pages.slice(0, expanded ? pages.length : 1).map(({ offset, limit }) => (
        <ContentPage
          key={`${offset}-${limit}`}
          universeId={universeId}
          workType={workType}
          offset={offset}
          limit={limit}
          isScrolling={isScrolling}
        />
      ))}
      {!expanded && pages.length > 1 && (
        <div className={styles.expand}>
          <Button
            type="secondary"
            size="medium"
            onClick={() => {
              globalExpandedSections[sectionKey] = true;
              setExpanded(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                globalExpandedSections[sectionKey] = true;
                setExpanded(true);
              }
            }}
          >
            {Translate({
              context: "general",
              label: "showAll",
            })}
          </Button>
        </div>
      )}
    </Section>
  );
}

/**
 * Show all universe members divided into sections of work types
 */
export default function UniverseMembers({ universeId }) {
  const { data, isLoading } = useData(
    universeId && universeBasicInfo({ key: universeId })
  );
  const [isScrolling, setIsScrolling] = useState(false);
  const worksInUniverse = workTypesOrder.filter((workType) =>
    data?.universe?.workTypes?.includes(workType)
  );

  return (
    <Anchor.Wrap>
      <Anchor.Menu isLoading={isLoading} isScrolling={setIsScrolling} />
      {worksInUniverse?.map((workType, index) => {
        const workTypeTranslation = Translate({
          context: "facets",
          label: `label-${workType.toLowerCase()}`,
        });
        return (
          <WorkTypesSection
            divider={index !== 0}
            key={universeId}
            universeId={universeId}
            workType={workType}
            title={workTypeTranslation}
            anchor-label={workTypeTranslation}
            isScrolling={isScrolling}
          />
        );
      })}
    </Anchor.Wrap>
  );
}
