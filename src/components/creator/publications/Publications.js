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
import GenreAndForm from "./filters/GenreAndFormDropdown";
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
              genreAndForm: filters.genreAndForm || undefined,
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
  selectedGenreAndForm,
  setSelectedGenreAndForm,
  isLoading,
}) {
  const filters = useMemo(
    () => ({
      generalMaterialType: selectedGeneralMaterialType,
      creatorFunction: selectedCreatorFunction,
      subjects: selectedSubjects,
      language: selectedLanguage,
      genreAndForm: selectedGenreAndForm,
    }),
    [
      selectedGeneralMaterialType,
      selectedCreatorFunction,
      selectedSubjects,
      selectedLanguage,
      selectedGenreAndForm,
    ]
  );

  const titleText =
    hitcount === 1
      ? `1 ${Translate({ context: "creator", label: "work-singular" })}`
      : `${hitcount} ${Translate({
          context: "creator",
          label: "work-plural",
        })}`;

  const isSameYear = years?.[years?.length - 1]?.key === years?.[0]?.key;
  const hitcountText = isSameYear
    ? `${Translate({ context: "creator", label: "publishedIn" })} ${
        years?.[years?.length - 1]?.key
      }`
    : `${Translate({ context: "creator", label: "publishedFrom" })} ${
        years?.[years?.length - 1]?.key
      } ${Translate({ context: "creator", label: "to" })} ${years?.[0]?.key}`;

  return (
    <Section
      isLoading={isLoading}
      title={titleText}
      subtitle={
        <div>
          <Text
            type="text3"
            className={styles.publishedFromText}
            skeleton={isLoading}
            lines={3}
          >
            {hitcountText}.{" "}
            {Translate({
              context: "creator",
              label: "publications-explanation",
            })}
          </Text>
        </div>
      }
      divider={{ content: true }}
      className={styles.section}
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
          <GenreAndForm
            creatorId={creatorId}
            selected={selectedGenreAndForm}
            onSelect={setSelectedGenreAndForm}
            filters={filters}
          />
          <div className={styles.subjectFilter}>
            <Subject
              creatorId={creatorId}
              selected={selectedSubjects}
              onSelect={setSelectedSubjects}
              filters={filters}
            />
          </div>
          <div className={styles.languageFilter}>
            <Language
              creatorId={creatorId}
              selected={selectedLanguage}
              onSelect={setSelectedLanguage}
              filters={filters}
            />
          </div>
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
    initial: "",
  });
  const [selectedGenreAndForm, setSelectedGenreAndForm] = useGlobalState({
    key: "creator_selectedGenreAndForm_" + creatorId,
    initial: "",
  });

  const { years, hitcount, isLoading } = usePublicationYears(creatorId, {
    generalMaterialType: selectedGeneralMaterialType,
    creatorFunction: selectedCreatorFunction,
    subjects: selectedSubjects,
    language: selectedLanguage,
    genreAndForm: selectedGenreAndForm,
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
      selectedGenreAndForm={selectedGenreAndForm}
      setSelectedGenreAndForm={setSelectedGenreAndForm}
      isLoading={isLoading}
    />
  );
}
