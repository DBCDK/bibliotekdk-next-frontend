import Anchor from "@/components/base/anchor";
import Translate from "@/components/base/translate";
import Section from "@/components/base/section";
import styles from "./UniverseMembers.module.css";
import MaterialCard from "@/components/base/materialcard/MaterialCard";
import {
  templateForUniversePageSeries,
  templateForUniversePageWork,
} from "@/components/base/materialcard/templates/templates";
import { workTypesOrder } from "@/lib/enums_MaterialTypes";
import uniq from "lodash/uniq";

function WorkTypesSection({ workTypeTranslation, works, series }) {
  return (
    <Section title={workTypeTranslation}>
      <div className={styles.section_flex}>
        {series?.map((singleSeries, index) => {
          return (
            <MaterialCard
              key={index}
              propAndChildrenInput={{ material: singleSeries }}
              propAndChildrenTemplate={templateForUniversePageSeries}
            />
          );
        })}
        {works?.map((work, index) => {
          return (
            <MaterialCard
              key={index}
              propAndChildrenInput={{ material: work }}
              propAndChildrenTemplate={templateForUniversePageWork}
            />
          );
        })}
      </div>
    </Section>
  );
}

export default function UniverseMembers({ worksInUniverse, seriesInUniverse }) {
  const workTypesInUniverseWorks = Object.keys(worksInUniverse);
  const workTypesInUniverseSeries = Object.keys(seriesInUniverse);

  const workTypesArray = workTypesOrder.filter((workType) =>
    uniq([...workTypesInUniverseWorks, ...workTypesInUniverseSeries]).includes(
      workType
    )
  );

  return (
    <Anchor.Wrap>
      <Anchor.Menu />
      {workTypesArray.map((workTypes) => {
        const workTypeTranslation = Translate({
          context: "facets",
          label: `label-${workTypes.toLowerCase()}`,
        });
        return (
          <WorkTypesSection
            key={workTypeTranslation}
            anchor-label={workTypeTranslation}
            workTypeTranslation={workTypeTranslation}
            works={worksInUniverse?.[workTypes]}
            series={seriesInUniverse?.[workTypes]}
          />
        );
      })}
    </Anchor.Wrap>
  );
}