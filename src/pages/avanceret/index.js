import Header from "@/components/header/Header";
import { useRouter } from "next/router";
import { fetchAll } from "@/lib/api/apiServerOnly";
import useDataCollect from "@/lib/useDataCollect";
import { useEffect, useRef } from "react";
import AdvancedSearchResult from "@/components/search/advancedSearch/advancedSearchResult/AdvancedSearchResult";
import { useSearchParams } from "next/navigation";
import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";

/**
 * Renders AdvancedSearch page
 */
export default function AdvancedSearchPage() {
  const router = useRouter();
  const dataCollect = useDataCollect();
  const scrollRef = useRef();
  const searchParams = useSearchParams();

  const { setShowPopover } = useAdvancedSearchContext();
  useEffect(() => {
    //on page load. If there are no parameters in the query, open the advanced search popover
    if (searchParams.size === 0) {
      setShowPopover(true);
    }
  }, []);

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
    <main>
      <div ref={scrollRef} />
      <Header router={router} hideShadow={true} />
      <AdvancedSearchResult
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
      />
    </main>
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
