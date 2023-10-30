import Header from "@/components/header/Header";
import { useRouter } from "next/router";
import { fetchAll } from "@/lib/api/apiServerOnly";

import AdvancedSearch from "@/components/search/advancedSearch/advancedSearchSettings/AdvancedSearchSettings";
import Result from "@/components/search/result/Result";
import useQ from "@/components/hooks/useQ";
import useDataCollect from "@/lib/useDataCollect";
import useFilters from "@/components/hooks/useFilters";
import { useRef } from "react";

/**
 * Renders AdvancedSearch page
 */
export default function AdvancedSearchPage() {
  const router = useRouter();
  const q = useQ().getQuery();
  const filters = useFilters().getQuery();
  const dataCollect = useDataCollect();
  const scrollRef = useRef();
  const { page = 1 } = router.query;

  /**
   * Updates URL query params
   *
   * @param {Object} params
   */
  async function updateQueryParams(params) {
    const query = { ...router.query, ...params };

    await router.push(
      { pathname: router.pathname, query },
      {
        pathname: router.asPath.replace(/\?.*/, ""),
        query,
      },
      { shallow: true, scroll: false }
    );
  }
  function scrollToRef(ref) {
    ref.current.scrollIntoView({ behavior: "smooth", block: "end" });
  }

  return (
    <>
      <div ref={scrollRef} />
      <Header router={router} hideSimpleSearch />
      <AdvancedSearch />

      {q && (
        <Result
          page={parseInt(page, 10)}
          onPageChange={async (page, scroll) => {
            scroll = typeof scroll !== "boolean" || scroll !== false;
            await updateQueryParams({ page });
            scroll && scrollToRef(scrollRef);
          }}
          onWorkClick={(index, work) => {
            dataCollect.collectSearchWorkClick({
              search_request: { q, filters },
              search_query_hit: index + 1,
              search_query_work: work.workId,
            });
          }}
        />
      )}
    </>
  );
}

/**
 * We use getInitialProps to let Next.js
 * fetch the data server side
 *
 * https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
 */
AdvancedSearchPage.getInitialProps = (ctx) => {
  return fetchAll([], ctx);
};
