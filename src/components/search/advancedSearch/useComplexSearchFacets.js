import { useData } from "@/lib/api/api";
import { hitcount } from "@/lib/api/complexSearch.fragments";

const facetByMaterialType = {
  LITERATURE: ["SPECIFICMATERIALTYPE", "GENREANDFORM", "LANGUAGE"],
};

/**
 * This hook is for use with dropdowns in advanced search.
 * We get facets for given worktype with a query like this:
 * `worktype=${workType}"` and ask for facets for the worktype
 * @param workType
 * @returns {{isLoading, facetResponse, error}}
 */
export function useComplexSearchFacets(workType) {
  // @TODO use workType:)
  const cqlQuery = `worktype="LITERATURE"`;

  // use the useData hook to fetch data
  const {
    data: facetResponse,
    isLoading,
    error,
  } = useData(
    hitcount({
      cql: cqlQuery,
      facets: {
        facetLimit: 50,
        facets: facetByMaterialType.LITERATURE,
      },
    })
  );

  return { facetResponse, isLoading, error };
}
