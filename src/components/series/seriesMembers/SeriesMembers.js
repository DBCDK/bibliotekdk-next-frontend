import Section from "@/components/base/section";
import Translate from "@/components/base/translate";
import MaterialCard from "@/components/base/materialcard/MaterialCard";
import { templateForBigWorkCard } from "@/components/base/materialcard/templates/templates";
import * as workFragments from "@/lib/api/work.fragments";
import { useData } from "@/lib/api/api";
import Button from "@/components/base/button";

import styles from "./SeriesMembers.module.css";

import { getUniqueCreatorsDisplay } from "@/components/series/utils";
import { useState } from "react";
const ITEMS_PER_PAGE = 50;

// List for removing specific materialTypes if relevant
//  Empty for now
const listOfMaterialTypesToRemove = [];

export function getMemberWorkIds(firstSeriesMembers) {
  return firstSeriesMembers
    ?.filter(
      (member) =>
        !(
          member?.work?.materialTypes?.length === 1 &&
          listOfMaterialTypesToRemove.includes(
            member?.work?.materialTypes?.[0]?.materialTypeSpecific?.code
          )
        )
    )
    ?.map((member) => member?.work?.workId);
}

const MembersPage = ({ pageNumber, seriesId, allCreators }) => {
  const offset = pageNumber * ITEMS_PER_PAGE;
  const dummy = { series: { members: [...new Array(10).fill({})] } };

  const { data, isLoading } = useData(
    seriesId &&
      workFragments.membersBySeriesId({
        seriesId: seriesId,
        membersOffset: offset,
        membersLimit: ITEMS_PER_PAGE,
      })
  );

  const seriesData = isLoading ? dummy : data;

  return seriesData?.series?.members?.map((member) => {
    const work = member?.work;
    return (
      <MaterialCard
        key={work?.workId}
        propAndChildrenTemplate={templateForBigWorkCard}
        propAndChildrenInput={{
          member: member,
          includeCreators: allCreators.length > 1,
          isLoading: isLoading,
        }}
        isLoading={isLoading}
      />
    );
  });
};

export default function SeriesMembers({ series, seriesIsLoading }) {
  const [visiblePages, setVisiblePages] = useState(1);
  const hitcount = series?.hitcount || 0;
  const firstSeriesMembers = series?.members;
  const firstSeriesFirstWork = firstSeriesMembers?.[0]?.work;
  const firstWorkType = firstSeriesFirstWork?.workTypes?.[0]?.toLowerCase();
  const workTypeTranslation = Translate({
    context: "facets",
    label: `label-${firstWorkType}`,
  });

  // true if there are more pages to load
  const hasMore = visiblePages * ITEMS_PER_PAGE < hitcount;

  const { creators: allCreators } = getUniqueCreatorsDisplay(series);
  const loadMore = () => {
    setVisiblePages((prev) => prev + 1);
  };
console.log("seriesIsLoading", seriesIsLoading);
console.log("series", series);  
console.log("visiblePages", visiblePages);
  return (
    <Section
      title={`${Translate({
        context: "series_page",
        label: "series_members_heading",
        vars: [workTypeTranslation],
      })}`}
      space={{ bottom: "var(--pt0)", top: "var(--pt5)" }}
      divider={{ content: false }}
      isLoading={seriesIsLoading}
    >
      <article className={styles.series_members_results}>
        {[...Array(visiblePages)].map((_, index) => (
          <MembersPage
            key={index}
            pageNumber={index}
            seriesId={series?.seriesId}
            allCreators={allCreators}
          />
        ))}

        {hasMore && (
          <Button
            className={styles.loadMore}
            type="secondary"
            size="medium"
            tabIndex="0"
            skeleton={seriesIsLoading}
            onClick={loadMore}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                loadMore();
              }
            }}
          >
            {Translate({ context: "search", label: "more" })}
          </Button>
        )}
      </article>
    </Section>
  );
}
