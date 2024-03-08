import AdvancedFacets from "@/components/search/advancedSearch/facets/advancedFacets";
import Top from "@/components/_modal/pages/base/top";
import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";
import { convertStateToCql } from "@/components/search/advancedSearch/utils";
import { useEffect } from "react";
import { useFacets } from "@/components/search/advancedSearch/useFacets";

function FacetsPage({ cql, replace }) {
  return (
    <div>
      <Top />
      <AdvancedFacets cql={cql} replace={replace} />
    </div>
  );
}

export default function Wrap({ context, modal }) {
  const { replace } = context;
  const { pushQuery } = useFacets();

  /** update cql query **/
  const {
    cqlFromUrl: cql,
    fieldSearchFromUrl: fieldSearch,
    facets,
  } = useAdvancedSearchContext();

  /**  update resultpage when modal is closed **/
  useEffect(() => {
    if (!modal.isVisible && modal.hasBeenVisible) {
      pushQuery(false, true);
    }
  }, [modal.isVisible]);

  const cqlQuery = cql || convertStateToCql({ ...fieldSearch, facets: facets });
  return (
    <>
      <FacetsPage cql={cqlQuery} replace={replace} />
    </>
  );
}
