import { useEffect, useMemo, useState } from "react";

import merge from "lodash/merge";

import Top from "../base/top";

import Title from "@/components/base/title";
import List from "@/components/base/forms/list";
import Text from "@/components/base/text";
import Link from "@/components/base/link";
import Button from "@/components/base/button";
import Checkbox from "@/components/base/forms/checkbox";

import Translate from "@/components/base/translate";

import useFilters, { includedTypes } from "@/components/hooks/useFilters";

import { useData } from "@/lib/api/api";
import { facets, hitcount } from "@/lib/api/search.fragments";

import animations from "@/components/base/animation/animations.module.css";
import styles from "./Filter.module.css";

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export function Search(props) {
  return (
    <div className={`${styles.search}`} data-cy="search-modal">
      <Top modal={modal} back={false} />

      <Button
        dataCy="vis-resultater"
        skeleton={isLoading}
        onClick={() => onSubmit && onSubmit()}
        className={styles.submit}
      >
        {Translate({
          context: "search",
          label: "showXResults",
          vars: [hitcount],
        })}
      </Button>
    </div>
  );
}

export function FilterSkeleton() {
  // dummy data
  const dummy = {};

  return <Search isLoading={true} data={dummy} modal={{}} context={{}} />;
}

export default function Wrap(props) {
  const { modal, context } = props;

  // update query params when modal closes
  useEffect(() => {
    if (!modal.isVisible && modal.hasBeenVisible) {
      setQuery({ exclude: ["modal"] });
    }
  }, [modal.isVisible]);

  // get search query from context
  const { q, facet } = context;

  // connected filters hook
  const { filters, setFilters, setQuery } = useFilters();

  // extract selected workType, if any
  const workType = filters.workType?.[0];

  // Exclude irrelevant worktype categories
  // undefined will result in a include-all fallback at the fragment api call function.
  const facetFilters = (workType && includedTypes[workType]) || undefined;

  // hitcount according to selected filters
  const { data: hitcountData } = useData(q && hitcount({ q, filters }));

  // On a specific filter category page we make sure to remove filters from within that category.
  // This will make sure facet hitcounts won't change, when you select/unselect filters.
  const filtersForCategory =
    facet && filters?.[facet?.name]
      ? { ...filters, [facet?.name]: [] }
      : filters;

  // facets according to query filters
  const { data, isLoading } = useData(
    q &&
      facets({
        q,
        filters: filtersForCategory,
        facets: facetFilters,
      })
  );

  // merge data
  const mergedData = merge({}, data, hitcountData);

  if (isLoading) {
    return <FilterSkeleton {...props} />;
  }

  // Dont clear the workType filter onClear
  const excludeOnClear = { workType: filters.workType };

  return (
    <Filter
      data={mergedData}
      selected={filters}
      onSelect={(selected) => {
        // Updates selected filter in useFilters
        setFilters({ ...filters, ...selected });
      }}
      onSubmit={() => {
        // exclude modal param -> will close the modal on submit
        setQuery({ exclude: ["modal"] });
      }}
      onClear={() => setFilters({ ...excludeOnClear })}
      {...props}
    />
  );
}
