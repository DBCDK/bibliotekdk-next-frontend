import Section from "@/components/base/section";
import Translate from "@/components/base/translate";
import Title from "@/components/base/title";
import { useData, useFetcherWithCache } from "@/lib/api/api";
import {
  publicationYearFacets,
  worksByCreator,
} from "@/lib/api/creator.fragments";
import GeneralMaterialType from "./filters/GeneralMaterialTypeDropdown";
import CreatorFunction from "./filters/CreatorFunctionDropdown";
import Subject from "./filters/SubjectDropdown";
import Language from "./filters/LanguageDropdown";
import { WorkRow } from "./WorkRow";
import { parseWorks } from "./utils";
import { useMemo, useState, useEffect } from "react";
import styles from "./Publications.module.css";
import { useGlobalState } from "@/components/hooks/useGlobalState";
import useElementVisible from "@/components/hooks/useElementVisible";
import Text from "@/components/base/text";

/**
 * Displays works for a specific publication year with lazy loading
 */
function PublicationYearWorks({ year, creatorId, filters }) {
  const fetcher = useFetcherWithCache({ revalidate: false });
  // Generate unique key using useMemo
  const cacheKey = useMemo(() => {
    return JSON.stringify({ year: year.key, creatorId, filters });
  }, [year.key, creatorId, filters]);

  const [works, setWorks] = useGlobalState({
    key: "creator_publications_works_" + cacheKey,
    initial: null,
  });

  const { elementRef, hasBeenSeen } = useElementVisible({
    root: null,
    rootMargin: "150px",
    threshold: 1.0,
  });

  useEffect(() => {
    if (!works && hasBeenSeen) {
      async function fetchWorks() {
        const limit = 100;
        const count = year.score;
        const numQueries = Math.ceil(count / limit);
        const queries = [];
        for (let i = 0; i < numQueries; i++) {
          queries.push(
            worksByCreator({
              creatorId,
              generalMaterialType: filters.generalMaterialType || undefined,
              creatorFunction: filters.creatorFunction || undefined,
              subjects: filters.subjects?.length ? filters.subjects : undefined,
              language: filters.language || undefined,
              publicationYears: [year.key],
              offset: i * limit,
              limit,
            })
          );
        }

        const allResults = await Promise.all(
          queries.map((query) => fetcher(query))
        );
        const allWorks = [];
        allResults?.forEach((result) => {
          const works = result?.data?.complexSearch?.works;
          if (Array.isArray(works)) {
            allWorks.push(...works);
          }
        });

        const parsedWorks = parseWorks(allWorks, creatorId);
        const filteredWorks = parsedWorks.filter((work) => {
          return String(work?.originalWorkYear) === String(year.key);
        });

        setWorks(filteredWorks || []);
      }
      fetchWorks();
    }
  }, [works, hasBeenSeen]);

  const isLoading = !works;

  if (works?.length === 0) {
    return null;
  }

  return (
    <div key={year} className={styles.workscontainer} ref={elementRef}>
      <Title type="title4" tag="h3" className={styles.yearTitle}>
        {year.key}
      </Title>
      {isLoading && <WorkRow isLoading={true} year={year} />}
      {works?.map((work) => (
        <WorkRow
          key={work.workId}
          work={work}
          creatorId={creatorId}
          year={year}
        />
      ))}
    </div>
  );
}
/**
 * Main publications component that displays filtered works by publication year
 */
export function Publications({
  years,
  hitcount,
  creatorId,
  selectedSubjects,
  setSelectedSubjects,
  selectedGeneralMaterialType,
  setSelectedGeneralMaterialType,
  selectedCreatorFunction,
  setSelectedCreatorFunction,
  selectedLanguage,
  setSelectedLanguage,
}) {
  const filters = useMemo(
    () => ({
      generalMaterialType: selectedGeneralMaterialType,
      creatorFunction: selectedCreatorFunction,
      subjects: selectedSubjects,
      language: selectedLanguage,
    }),
    [
      selectedGeneralMaterialType,
      selectedCreatorFunction,
      selectedSubjects,
      selectedLanguage,
    ]
  );

  let hitcountText;

  if (hitcount) {
    hitcountText = (
      <Text type="text3">
        <Text type="text2" tag="span">
          {hitcount}
        </Text>{" "}
        {hitcount === 1
          ? Translate({ context: "creator", label: "work-singular" }) + " "
          : Translate({ context: "creator", label: "work-plural" }) + " "}
        {years?.length > 1 && (
          <>
            {Translate({ context: "creator", label: "from" })}{" "}
            <Text type="text2" tag="span">
              {years[years.length - 1].key}
            </Text>{" "}
            {Translate({ context: "creator", label: "to" })}{" "}
            <Text type="text2" tag="span">
              {years[0].key}
            </Text>
          </>
        )}
      </Text>
    );
  }

  return (
    <Section
      title={Translate({ context: "creator", label: "publications" })}
      subtitle={
        <div>
          <Text type="text3" className={styles.explanationText}>
            {Translate({
              context: "creator",
              label: "publications-explanation",
            })}
          </Text>
          {hitcountText && (
            <Text type="text3" className={styles.hitcountText}>
              {hitcountText}
            </Text>
          )}
        </div>
      }
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
          <Language
            creatorId={creatorId}
            selected={selectedLanguage}
            onSelect={setSelectedLanguage}
            filters={filters}
          />
        </div>

        {years?.map((year) => (
          <PublicationYearWorks
            key={year.key}
            year={year}
            filters={filters}
            creatorId={creatorId}
          />
        ))}
      </div>
    </Section>
  );
}

/**
 * Custom hook that fetches and sorts publication years for a creator
 */
function usePublicationYears(creatorId, filters) {
  // Fetch all publication years for every work by this creator
  const { data, isLoading, error } = useData(
    creatorId &&
      publicationYearFacets({
        creatorId,
        filters,
      })
  );

  // Sort years by newest first
  const years = useMemo(() => {
    const allYears = data?.complexFacets?.facets?.find(
      (facet) => facet.name === "facet.publicationyear"
    )?.values;

    return allYears?.sort((a, b) => b.key - a.key);
  }, [data]);

  return {
    hitcount: data?.complexFacets?.hitcount,
    years,
    isLoading,
    error,
  };
}

/**
 * Wrapper component that manages filter state and data fetching for publications
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
  const [selectedLanguage, setSelectedLanguage] = useGlobalState({
    key: "creator_selectedLanguage_" + creatorId,
    initial: "dansk",
  });

  const { years, hitcount } = usePublicationYears(creatorId, {
    generalMaterialType: selectedGeneralMaterialType,
    creatorFunction: selectedCreatorFunction,
    subjects: selectedSubjects,
    language: selectedLanguage,
  });

  return (
    <Publications
      hitcount={hitcount}
      years={years}
      creatorId={creatorId}
      selectedSubjects={selectedSubjects}
      setSelectedSubjects={setSelectedSubjects}
      selectedGeneralMaterialType={selectedGeneralMaterialType}
      setSelectedGeneralMaterialType={setSelectedGeneralMaterialType}
      selectedCreatorFunction={selectedCreatorFunction}
      setSelectedCreatorFunction={setSelectedCreatorFunction}
      selectedLanguage={selectedLanguage}
      setSelectedLanguage={setSelectedLanguage}
    />
  );
}
