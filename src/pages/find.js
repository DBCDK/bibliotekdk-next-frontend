import Pagination from "@/components/search/pagination/Pagination";
import QuickFilters from "@/components/search/quickfilters";
import Result from "@/components/search/result/Result";
import { useRouter } from "next/router";

/**
 * @file
 * This is the search page
 *
 */
function Find() {
  const router = useRouter();
  const { q, page, view } = router.query;

  /**
   * Updates URL query params
   *
   * @param {object} params
   */
  function updateQueryParams(params) {
    const query = { ...router.query, ...params };
    router.push(
      { pathname: router.pathname, query },
      {
        pathname: router.asPath.replace(/\?.*/, ""),
        query,
      },
      { shallow: true }
    );
  }

  return (
    <div style={{ marginTop: 50 }}>
      <QuickFilters
        viewSelected={view}
        onViewSelect={(view) => updateQueryParams({ view })}
      />
      {q && (
        <Result
          q={q}
          viewSelected={view}
          onViewSelect={(view) => updateQueryParams({ view })}
        />
      )}
      {q && (
        <Pagination
          currentPage={parseInt(page || 1, 10)}
          onChange={(page) => updateQueryParams({ page })}
        />
      )}
    </div>
  );
}

export default Find;
