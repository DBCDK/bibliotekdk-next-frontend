import Section from "@/components/base/section";
import Translate from "@/components/base/translate";
import Title from "@/components/base/title";
import { useData } from "@/lib/api/api";
import { worksByCreator } from "@/lib/api/creator.fragments";
import GeneralMaterialType from "./dropdowns/GeneralMaterialType";
import CreatorFunction from "./dropdowns/CreatorFunction";
import Subject from "./dropdowns/Subject";
import { WorkRow } from "./WorkRow";
import { parseWorks } from "./utils";
import { useMemo, useState } from "react";
import styles from "./Publications.module.css";
import { useGlobalState } from "@/components/hooks/useGlobalState";

/**
 * Publications component - shows a list of publications by a creator
 */
export function Publications({
  works,
  creatorId,
  selectedSubjects,
  setSelectedSubjects,
  selectedGeneralMaterialType,
  setSelectedGeneralMaterialType,
  selectedCreatorFunction,
  setSelectedCreatorFunction,
}) {
  // Create filters object for cross-filtering
  const filters = {
    generalMaterialType: selectedGeneralMaterialType,
    creatorFunction: selectedCreatorFunction,
    subjects: selectedSubjects,
  };

  // Use provided works or fallback to dummy data
  const displayWorks = works;

  // Filter works based on selected subject filter
  const filteredWorks = displayWorks.filter((work) => {
    // Subject filter
    if (selectedSubjects?.length > 0) {
      const workSubjects = [
        ...(work.subjects?.dbcVerified?.map((s) => s.display) || []),
        ...(work.manifestations?.mostRelevant?.subjects?.dbcVerified?.map(
          (s) => s.display
        ) || []),
      ];
      if (!selectedSubjects.some((subject) => workSubjects.includes(subject))) {
        return false;
      }
    }

    return true;
  });

  // Group filtered works by year
  const worksByYear = filteredWorks.reduce((groups, work) => {
    const year = work?.workYear?.year || "Ukendt år";
    if (!groups[year]) {
      groups[year] = [];
    }
    groups[year].push(work);
    return groups;
  }, {});

  // Sort years (newest first, "Ukendt år" last)
  const sortedYears = Object.keys(worksByYear).sort((a, b) => {
    if (a === "Ukendt år") return 1;
    if (b === "Ukendt år") return -1;
    return parseInt(b, 10) - parseInt(a, 10);
  });

  return (
    <Section
      title={Translate({ context: "creator", label: "publications" })}
      divider={{ content: false }}
    >
      <div>
        {/* Filter dropdowns */}
        <div className={styles.filters}>
          <GeneralMaterialType
            creatorId={creatorId}
            selected={selectedGeneralMaterialType}
            onSelect={setSelectedGeneralMaterialType}
            filters={filters}
          />
          <CreatorFunction
            creatorId={creatorId}
            selected={selectedCreatorFunction}
            onSelect={setSelectedCreatorFunction}
            filters={filters}
          />
          <Subject
            creatorId={creatorId}
            selected={selectedSubjects}
            onSelect={setSelectedSubjects}
            filters={filters}
          />
        </div>

        {/* Publications list */}
        {sortedYears.length === 0 && filteredWorks.length === 0 && works && (
          <div className={styles.noResults}>
            <p>{Translate({ context: "creator", label: "no-results" })}</p>
          </div>
        )}

        {sortedYears.map((year) => (
          <div key={year} className={styles.workscontainer}>
            <Title type="title4" tag="h3" className={styles.yearTitle}>
              {year}
            </Title>
            <div>
              {worksByYear[year].map((work, index) => (
                <WorkRow
                  key={work.workId}
                  work={work}
                  creatorId={creatorId}
                  isFirst={index === 0}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/**
 * Wrap function - handles data fetching and loading states with filter management
 */
export default function Wrap({ creatorId }) {
  // Filter state management
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedGeneralMaterialType, setSelectedGeneralMaterialType] =
    useGlobalState({
      key: "creator_selectedGeneralMaterialType_" + creatorId,
      initial: "",
    });
  const [selectedCreatorFunction, setSelectedCreatorFunction] = useGlobalState({
    key: "creator_selectedCreatorFunction_" + creatorId,
    initial: "",
  });

  const { data, isLoading, error } = useData(
    creatorId &&
      worksByCreator({
        creatorId,
        generalMaterialType: selectedGeneralMaterialType || undefined,
        creatorFunction: selectedCreatorFunction || undefined,
        subjects: selectedSubjects?.length ? selectedSubjects : undefined,
      })
  );
  const works = data?.complexSearch?.works || [];

  // Parse works to ensure year data is available
  const parsedWorks = useMemo(() => parseWorks(works), [works]);

  if (error) {
    return null;
  }

  if (isLoading) {
    return (
      <Section
        title={Translate({ context: "creator", label: "publications" })}
        divider={{ content: false }}
      >
        <div>Loading publications...</div>
      </Section>
    );
  }

  return (
    <Publications
      works={parsedWorks}
      creatorId={creatorId}
      selectedSubjects={selectedSubjects}
      setSelectedSubjects={setSelectedSubjects}
      selectedGeneralMaterialType={selectedGeneralMaterialType}
      setSelectedGeneralMaterialType={setSelectedGeneralMaterialType}
      selectedCreatorFunction={selectedCreatorFunction}
      setSelectedCreatorFunction={setSelectedCreatorFunction}
    />
  );
}
