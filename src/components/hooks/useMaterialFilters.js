/**
 * Hook for getting constants and function for use when filtering on materialtype
 */
import { useRouter } from "next/router";

function useMaterialFilters() {
  const router = useRouter();
  /**** Filter materials start **/
  const materialFilters = [
    { value: "all", label: "all_materials" },
    { value: "literature", label: "books" },
    { value: "article", label: "articles" },
    { value: "movie", label: "film" },
    { value: "game", label: "games" },
    { value: "music", label: "music" },
    { value: "sheetmusic", label: "nodes" },
  ];
  // check if materialtype is set in query parameters
  const matparam = router && router.query.materialtype;
  let index = 0;
  if (matparam) {
    index = materialFilters.findIndex(function (element, indx) {
      return element.value === matparam;
    });
  }
  index = index === -1 ? 0 : index;
  const selectedMaterial = materialFilters[index];
  // select function passsed to select list (@see components/base/select)
  // simply push to router - the useData hook in /find page will register the change
  // and update the result
  const onOptionClicked = (idx) => {
    router &&
      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          materialtype: idx !== 0 ? materialFilters[idx].value : "",
        },
      });
  };
  /**** Filter materials end**/

  return {
    selectedMaterial,
    onOptionClicked,
    materialFilters,
  };
}

export default useMaterialFilters;
