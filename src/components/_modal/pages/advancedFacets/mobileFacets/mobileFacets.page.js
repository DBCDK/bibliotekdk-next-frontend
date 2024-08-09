/**
 * @file - reuse the filter page from simple search to do facet filters with complex search.
 * this file is a wrapper for filter.page - @see _modal/pages/filter/Filter.page.js
 */

import { useFacets } from "@/components/search/advancedSearch/useFacets";
import {
  Filter,
  FilterSkeleton,
} from "@/components/_modal/pages/filter/Filter.page";
import {
  getCqlAndFacetsQuery,
  parseOutFacets,
} from "@/components/search/advancedSearch/utils";
import { useData } from "@/lib/api/api";
import { complexFacetsOnly } from "@/lib/api/complexSearch.fragments";
import { useEffect } from "react";
import { useQuickFilters } from "@/components/search/advancedSearch/useQuickFilters";

export default function Wrap(props) {
  const { context, modal } = props;
  const { cql } = context;

  const {
    facetsFromEnum,
    facetLimit,
    selectedFacets,
    resetFacets,
    replaceFacetValue,
    pushQuery,
  } = useFacets();

  const { selectedQuickFilters, resetQuickFilters } = useQuickFilters();

  const cqlAndFacetsQuery = getCqlAndFacetsQuery({
    cql,
    selectedFacets,
    quickFilters: selectedQuickFilters,
  });

  useEffect(() => {
    if (!modal.isVisible && modal.hasBeenVisible) {
      pushQuery(true, selectedFacets);
    }
  }, [modal.isVisible]);

  // use the useData hook to fetch data
  const { data: facetResponse, isLoading } = useData(
    complexFacetsOnly({
      cql: cqlAndFacetsQuery,
      facets: {
        facetLimit: facetLimit,
        facets: facetsFromEnum,
      },
    })
  );

  /**
   * A facet is selected - filter page passes ALL the SELECTED values in the onSelect event.
   * .. so we replace the whole value section of the selected facets :)
   *
   * @param selected
   */
  const onSelect = (selected) => {
    const searchIndexName = Object.keys(selected)[0];
    const values = Object.values(selected)[0];

    replaceFacetValue(values, searchIndexName, true);
  };

  const onSubmit = () => {
    modal.clear();
  };
  const onClear = () => {
    resetFacets();
    resetQuickFilters();
  };

  // @TODO parse out empty facets (score=0)
  // facetResponse?.complexFacets?.facets
  const facets = parseOutFacets(facetResponse?.complexFacets?.facets);

  // we need to enrich facet values with 'term' .. the filter page expects that
  const enrichedFacets = facets?.map((facet) => ({
    name: facet.name.split(".")[1],
    values: facet.values.map((val) => ({ ...val, ...{ term: val.key } })),
  }));

  // make an object of selected facets that the filter page understands
  const selectedTerms = {};
  let terms = [];
  facets?.map((facet) => {
    const namedfacet = facet?.name.split(".")[1];
    selectedFacets?.map((sel) => {
      terms = [];
      if (sel.searchIndex === namedfacet) {
        sel.values.map((val) => terms.push(val.name));

        selectedTerms[namedfacet] = terms;
      }
    });
  });

  if (isLoading) {
    return <FilterSkeleton {...props} />;
  }

  // make a data object for the filter page to handle
  const data = {
    search: {
      facets: enrichedFacets,
      hitcount: facetResponse?.complexFacets?.hitcount,
    },
  };

  return (
    <Filter
      data={data}
      isLoading={isLoading}
      selected={selectedTerms}
      onSelect={onSelect}
      onSubmit={onSubmit}
      onClear={onClear}
      origin="mobileFacets"
      cql={cql}
      {...props}
      translateContext="complex-search-facets"
    />
  );
}
