import Section from "@/components/base/section";
import styles from "./issues.module.css";

import Text from "@/components/base/text/Text";
import {
  AllPeriodicaIssuesByworkId,
  publicationYearsForIssue,
  publicationMonthsForIssue,
  publicationSubjectsForIssue,
} from "@/lib/api/periodica.fragments";
import { useData } from "@/lib/api/api";
import { PeriodicaAccordion } from "@/components/work/periodicaArticles/PeriodicaArticles";
import translate from "@/components/base/translate/Translate";
import { useEffect, useState } from "react";
import { SimpleDropDown } from "@/components/search/advancedSearch/advancedSearchSort/AdvancedSearchSort";
import Pagination from "@/components/search/pagination/Pagination";
import Link from "@/components/base/link";
import Icon from "@/components/base/icon";

export function PaginationWrapper({ pagination, onPageChange, isLoading }) {
  const { page } = pagination;
  const [numPages, setNumPages] = useState(pagination?.numPages);

  useEffect(() => {
    if (pagination?.numPages) {
      setNumPages(pagination?.numPages);
    }
  }, [pagination?.numPages]);

  if ((isLoading && page === 1) || numPages === 1) {
    return null;
  }

  return (
    <div className={styles.paginationWrapper}>
      <Pagination
        numPages={numPages}
        currentPage={page}
        onChange={onPageChange}
      />
    </div>
  );
}

/**
 * A dropdown showing publication years for issues in a periodical
 */
function DropDownYear({ workId, filters, selected, onSelect }) {
  const filtersWithoutYear = { ...filters, publicationYears: null };

  const { data } = useData(
    publicationYearsForIssue({
      id: workId,
      filters: filtersWithoutYear,
    })
  );

  if (!data?.work?.extendedWork?.issues?.publicationYears?.entries?.length) {
    return null;
  }

  let options =
    data?.work?.extendedWork?.issues?.publicationYears?.entries?.map(
      (entry) => entry.term
    );

  return (
    <SimpleDropDown
      placeholder={translate({ context: "general", label: "year" })}
      selected={selected}
      onSelect={(entry) => onSelect(entry || "")}
      options={options}
      clearRow="Alle"
    />
  );
}

/**
 * A dropdown showing publication months for issues in a periodical
 */
function DropDownMonth({ workId, filters, selected, onSelect }) {
  const filtersWithoutYear = { ...filters, publicationMonths: null };

  const { data } = useData(
    publicationMonthsForIssue({
      id: workId,
      filters: filtersWithoutYear,
    })
  );

  if (!data?.work?.extendedWork?.issues?.publicationMonths?.entries?.length) {
    return null;
  }

  let options =
    data?.work?.extendedWork?.issues?.publicationMonths?.entries?.map(
      (entry) => entry.term
    );

  return (
    <SimpleDropDown
      placeholder={translate({ context: "general", label: "month" })}
      selected={selected}
      onSelect={(entry) => onSelect(entry || "")}
      options={options}
      clearRow="Alle"
    />
  );
}

/**
 * A dropdown showing subjects for issues in a periodical
 */
function DropDownSubject({ workId, filters, selected, onSelect }) {
  const filtersWithoutSubject = { ...filters, subjects: null };

  const { data } = useData(
    publicationSubjectsForIssue({
      id: workId,
      filters: filtersWithoutSubject,
    })
  );

  if (!data?.work?.extendedWork?.issues?.subjects?.entries?.length) {
    return null;
  }

  let options = data?.work?.extendedWork?.issues?.subjects?.entries?.map(
    (entry) => entry.term
  );

  return (
    <SimpleDropDown
      placeholder={translate({ context: "search", label: "label-subject" })}
      selected={selected?.[0] || ""}
      onSelect={(entry) => (entry ? onSelect([entry]) : onSelect([]))}
      options={options}
      clearRow="Alle"
    />
  );
}

/**
 * A section containing a list of all articles (grouped by issue) in a periodical
 */
export function Issues({
  isLoading,
  entries,
  pagination,
  onPageChange,
  selectedYear,
  selectedSubjects,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  setSelectedSubjects,
  filters,
  workId,
  issn,
}) {
  if (!isLoading && !selectedYear && !entries?.length) {
    return null;
  }

  const parseForManifestations = (entry) => {
    return entry?.works
      ?.map((work) => [
        ...work?.manifestations?.all?.map((m) => ({ ...m, work })),
      ])
      .flat();
  };

  return (
    <Section
      title={translate({ context: "periodica", label: "title" })}
      subtitle={
        <Text type="text2">
          {translate({
            context: "periodica",
            label: "subtitle",
          })}
        </Text>
      }
      divider={{ content: false }}
      dataCy="section-fisk"
      sectionTag="div" // Section sat in parent
    >
      <div className={styles.top}>
        <div className={styles.filters}>
          <DropDownYear
            workId={workId}
            selected={selectedYear}
            onSelect={setSelectedYear}
            filters={filters}
          />
          <DropDownMonth
            workId={workId}
            selected={selectedMonth}
            onSelect={setSelectedMonth}
            filters={filters}
          />
          <DropDownSubject
            workId={workId}
            selected={selectedSubjects}
            onSelect={setSelectedSubjects}
            filters={filters}
          />
        </div>
        {issn && (
          <div className={styles.searchlink}>
            <Link
              href={`/avanceret?cql=worktype="article" AND term.issn="${issn}"`}
              border={{ bottom: { keepVisible: true } }}
            >
              <Text type="text3" tag="span">
                {translate({ context: "periodica", label: "search" })}
              </Text>
            </Link>
            <Icon
              size={{ w: 1, h: 1 }}
              src="arrowrightblue.svg"
              className={styles.arrowright}
              alt=""
            />
          </div>
        )}
      </div>
      {isLoading &&
        [1, 2, 3, 4, 5].map((entry) => (
          <Text
            key={entry}
            type="text3"
            className={styles.skeletonrow}
            lines={1}
            skeleton={true}
          >
            ...
          </Text>
        ))}
      {entries?.map((entry, index) => {
        const manifestations = parseForManifestations(entry);

        return (
          <PeriodicaAccordion
            key={index}
            issue={entry.display}
            manifestations={manifestations}
            showCount={true}
          />
        );
      })}

      <PaginationWrapper
        pagination={pagination}
        onPageChange={onPageChange}
        isLoading={isLoading}
      />
    </Section>
  );
}

const initValues = {};
function setInitValue(workId, key, val) {
  if (!initValues[workId]) {
    initValues[workId] = {};
  }
  initValues[workId][key] = val;
}

export default function Wrap({ workId }) {
  // get peridoca data
  const [selectedYear, setSelectedYearState] = useState(
    initValues[workId]?.year || ""
  );
  const [selectedMonth, setSelectedMonthState] = useState(
    initValues[workId]?.month || ""
  );
  const [selectedSubjects, setSelectedSubjectsState] = useState(
    initValues[workId]?.subject || []
  );
  const [page, setPageState] = useState(initValues[workId]?.page || 1);

  function setSelectedYear(val) {
    setSelectedYearState(val);
    setInitValue(workId, "year", val);
  }
  function setSelectedMonth(val) {
    setSelectedMonthState(val);
    setInitValue(workId, "month", val);
  }
  function setSelectedSubjects(val) {
    setSelectedSubjectsState(val);
    setInitValue(workId, "subjects", val);
  }
  function setPage(val) {
    setPageState(val);
    setInitValue(workId, "page", val);
  }

  const itemsPerPage = 5;
  const worksLimit = 20;
  useEffect(() => {
    if (workId) {
      setPage(initValues[workId]?.page || 1);
      setSelectedYear(initValues[workId]?.year || "");
      setSelectedMonth(initValues[workId]?.month || "");
      setSelectedSubjects(initValues[workId]?.subjects || []);
    }
  }, [workId]);

  const filters = {
    publicationYears: selectedYear ? [selectedYear] : null,
    publicationMonths: selectedMonth ? [selectedMonth] : null,
    subjects: selectedSubjects,
  };

  const { data, isLoading } = useData(
    AllPeriodicaIssuesByworkId({
      id: workId,
      issuesOffset: (page - 1) * itemsPerPage,
      issuesLimit: itemsPerPage,
      worksLimit,
      filters,
    })
  );
  const issn =
    data?.work?.manifestations?.bestRepresentation?.identifiers?.find?.(
      (entry) => entry.type === "ISSN"
    )?.value;

  const issuesHitcount = data?.work?.extendedWork?.issues?.hitcount;
  const numPages = issuesHitcount
    ? Math.ceil(issuesHitcount / itemsPerPage)
    : 0;
  const entries = data?.work?.extendedWork?.issues?.entries;

  return (
    <Issues
      onPageChange={(page) => {
        setPage(page);
      }}
      pagination={{ page, itemsPerPage, numPages }}
      isLoading={isLoading}
      entries={entries}
      selectedYear={selectedYear}
      setSelectedYear={(year) => {
        setSelectedYear(year);
        setPage(1);
      }}
      selectedMonth={selectedMonth}
      setSelectedMonth={(month) => {
        setSelectedMonth(month);
        setPage(1);
      }}
      selectedSubjects={selectedSubjects}
      setSelectedSubjects={(subject) => {
        setSelectedSubjects(subject);
        setPage(1);
      }}
      filters={filters}
      workId={workId}
      issn={issn}
    />
  );
}
