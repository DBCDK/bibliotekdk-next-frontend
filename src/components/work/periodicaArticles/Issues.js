import Section from "@/components/base/section";
import styles from "./issues.module.css";

import Text from "@/components/base/text/Text";
import { AllPeriodicaIssuesByworkId } from "@/lib/api/periodica.fragments";
import { useData } from "@/lib/api/api";
import { PeriodicaAccordion } from "@/components/work/periodicaArticles/PeriodicaArticles";
import translate from "@/components/base/translate/Translate";
import { useEffect, useState } from "react";
import Link from "@/components/base/link";

export function PaginationSlider({ pagination, onPageChange }) {
  const { page } = pagination;
  const [numPages, setNumPages] = useState(pagination?.numPages);
  const [sliderValue, setSliderValue] = useState(page);

  useEffect(() => {
    if (pagination?.numPages) {
      setNumPages(pagination?.numPages);
    }
  }, [pagination?.numPages]);
  useEffect(() => {
    if (page !== sliderValue) {
      setSliderValue(page);
    }
  }, [page]);

  const handleSliderChange = (e) => {
    const newPage = Number(e.target.value);
    setSliderValue(newPage);
  };

  const handleSliderCommit = () => {
    onPageChange(sliderValue);
  };

  const goToPrevious = () => onPageChange(Math.max(1, page - 1));
  const goToNext = () => onPageChange(Math.min(numPages, page + 1));

  return (
    <div className={styles.paginationWrapper}>
      <Link
        onClick={goToPrevious}
        className={page === 1 ? styles.disabled : ""}
        disabled={page === 1}
        border={page === 1 ? {} : { bottom: { keepVisible: true } }}
      >
        <Text>Forrige</Text>
      </Link>
      <div className={styles.sliderContainer}>
        <div
          className={styles.sliderLabel}
          style={{ left: `${((sliderValue - 1) / (numPages - 1)) * 100}%` }}
        >
          Side {sliderValue}
        </div>
        <input
          type="range"
          min="1"
          max={numPages}
          value={sliderValue}
          onChange={handleSliderChange}
          onMouseUp={handleSliderCommit}
          onTouchEnd={handleSliderCommit}
          className={styles.rangeInput}
        />
      </div>

      <Link
        onClick={goToNext}
        className={page === numPages ? styles.disabled : ""}
        disabled={page === numPages}
        border={page === numPages ? {} : { bottom: { keepVisible: true } }}
      >
        <Text>Næste</Text>
      </Link>
    </div>
  );
}

export function Issues({
  isLoading,
  entries,
  periodicaTitle,
  pagination,
  onPageChange,
}) {
  const [periodicaTitleState, setPeriodicaTitle] = useState(periodicaTitle);

  useEffect(() => {
    if (periodicaTitle) {
      setPeriodicaTitle(periodicaTitle);
    }
  }, [periodicaTitle]);

  if (!isLoading && (!entries || entries?.length < 1)) {
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
            vars: [periodicaTitleState],
          })}
        </Text>
      }
      divider={{ content: false }}
      dataCy="section-fisk"
      sectionTag="div" // Section sat in parent
    >
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
          />
        );
      })}
      {/* <Pagination pagination={pagination} onPageChange={onPageChange} /> */}
      <PaginationSlider pagination={pagination} onPageChange={onPageChange} />
    </Section>
  );
}

export default function Wrap({ workId }) {
  // get peridoca data

  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const worksLimit = 20;
  useEffect(() => {
    if (workId) {
      setPage(1);
    }
  }, [workId]);

  const { data, isLoading } = useData(
    AllPeriodicaIssuesByworkId({
      id: workId,
      issuesOffset: (page - 1) * itemsPerPage,
      issuesLimit: itemsPerPage,
      worksLimit,
    })
  );

  const issuesHitcount = data?.work?.periodicaInfo?.periodica?.issues?.hitcount;
  const numPages = issuesHitcount
    ? Math.ceil(issuesHitcount / itemsPerPage)
    : 0;
  const entries = data?.work?.periodicaInfo?.periodica?.issues?.entries;

  return (
    <Issues
      onPageChange={(page) => setPage(page)}
      pagination={{ page, itemsPerPage, numPages }}
      periodicaTitle={data?.work?.titles?.main}
      isLoading={isLoading}
      entries={entries}
    />
  );
}
