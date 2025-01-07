import { useData } from "@/lib/api/api";
import { complexFacetsOnly } from "@/lib/api/complexSearch.fragments";

// "all", "literature", "article", "movie", "music", "game", "sheetmusic"
const facetByMaterialType = {
  ALL: ["GENREANDFORM", "MAINLANGUAGE"],
  LITERATURE: ["SPECIFICMATERIALTYPE", "GENREANDFORM", "MAINLANGUAGE"],
  ARTICLE: ["SPECIFICMATERIALTYPE", "GENREANDFORM", "MAINLANGUAGE"],
  MOVIE: ["SPECIFICMATERIALTYPE", "GENREANDFORM", "FILMNATIONALITY"],
  MUSIC: ["SPECIFICMATERIALTYPE", "GENREANDFORM"],
  GAME: ["GAMEPLATFORM", "GENREANDFORM", "PEGI"],
  SHEETMUSIC: ["INSTRUMENT", "CHOIRTYPE", "CHAMBERMUSICTYPE"],
};

/**
 * This hook is for use with dropdowns in advanced search.
 * We get facets for given worktype with a query like this:
 * `worktype=${workType}"` and ask for facets for the worktype
 * @param workType
 * @returns {{isLoading, facetResponse, error}}
 */
export function useComplexSearchFacets(workType) {
  let cqlQuery;
  if (workType === "all") {
    cqlQuery = `workId=*`;
  } else {
    cqlQuery = `worktype="${workType.toUpperCase()}"`;
  }

  // use the useData hook to fetch data
  const {
    data: facetResponse,
    isLoading,
    error,
  } = useData(
    complexFacetsOnly({
      cql: cqlQuery,
      facets: {
        facetLimit: 200,
        facets: facetByMaterialType[workType.toUpperCase()],
      },
    })
  );

  return { facetResponse, isLoading, error };
}
