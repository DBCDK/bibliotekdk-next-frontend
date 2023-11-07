import Header from "@/components/header/Header";
import { useRouter } from "next/router";
import { fetchAll } from "@/lib/api/apiServerOnly";
import AdvancedSearch from "@/components/search/advancedSearch/advancedSearch/AdvancedSearch";
import useDataCollect from "@/lib/useDataCollect";
import { useRef } from "react";
import AdvancedSearchResult from "@/components/search/advancedSearch/advancedSearchResult/AdvancedSearchResult";
import isEmpty from "lodash/isEmpty";
import AdvancedSearchProvider from "@/components/search/advancedSearch/advancedSearchContext";

import Container from "react-bootstrap/Container";
/**
 * Renders AdvancedSearch page
 */
export default function AdvancedSearchPage() {
  const router = useRouter();
  const dataCollect = useDataCollect();
  const scrollRef = useRef();
  const { page: pageNo = 1 } = router.query;
  const cql = router?.query?.cql || null;
  let fieldSearch = router?.query?.fieldSearch;
  if (fieldSearch) {
    fieldSearch = JSON.parse(fieldSearch);
  }

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
  const showResult = !isEmpty(cql) || !isEmpty(fieldSearch);
  return (
    <AdvancedSearchProvider>
      <main>
        <div ref={scrollRef} />
        <Header router={router} hideSimpleSearch />

        <AdvancedSearch initState={fieldSearch} />
        <Container fluid>
          {showResult && (
            <AdvancedSearchResult
              pageNo={parseInt(pageNo, 10)}
              onPageChange={async (page, scroll) => {
                scroll = typeof scroll !== "boolean" || scroll !== false;
                await updateQueryParams({ page });
                scroll && scrollToRef(scrollRef);
              }}
              // .. @TODO .. what to do with the datacollect ??
              onWorkClick={(index, work) => {
                dataCollect.collectSearchWorkClick({
                  search_request: { q, filters },
                  search_query_hit: index + 1,
                  search_query_work: work.workId,
                });
              }}
              cql={cql}
              fieldSearch={fieldSearch}
            />
          )}
        </Container>
      </main>
    </AdvancedSearchProvider>
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
