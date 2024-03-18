import { useFacets } from "@/components/search/advancedSearch/useFacets";
import { Filter } from "@/components/_modal/pages/filter/Filter.page";
import { parseOutFacets } from "@/components/search/advancedSearch/utils";
import { useData } from "@/lib/api/api";
import { hitcount } from "@/lib/api/complexSearch.fragments";

export default function Wrap(props) {
  const { context } = props;
  const { cql } = context;

  const {
    facetsFromEnum,
    facetLimit,
    selectedFacets,
    pushQuery,
    setFacetsQuery,
    resetFacets,
  } = useFacets();
  // use the useData hook to fetch data
  const { data: facetResponse, isLoading } = useData(
    hitcount({
      cql: cql,
      facets: {
        facetLimit: facetLimit,
        facets: facetsFromEnum,
      },
    })
  );

  const onSelect = (selected) => {
    console.log(JSON.stringify(selected, null, 4), "SELECTED");
    console.log(JSON.stringify(selectedFacets, null, 4), "SELECTED FACETS");
    alert("SELECT");

    // is facet already selected ?
    const isSelected = selectedFacets.find((facet) => -1);

    // Updates selected filter in useFilters

    // setFacetsQuery(selected);
  };
  const onSubmit = () => {
    pushQuery(false, selectedFacets);
  };
  const onClear = () => {
    resetFacets();
  };

  // console.log(facetResponse, "RESPONSE");

  // @TODO parse out empty facets (score=0)
  const facets = parseOutFacets(facetResponse?.complexSearch?.facets);

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
  const data = { search: { facets: enrichedFacets } };
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
    />
  );
}
