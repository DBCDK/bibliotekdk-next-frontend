import Header from "@/components/header/Header";
import { useRouter } from "next/router";
import { fetchAll } from "@/lib/api/apiServerOnly";

import Page from "@/components/search/complexSearch/ComplexSearch";
import { Result } from "@/components/search/result/Result";
import useQ from "@/components/hooks/useQ";
import useDataCollect from "@/lib/useDataCollect";
import useFilters from "@/components/hooks/useFilters";

/**
 * Renders ComplexSearch page
 */
export default function ComplexSearchPage() {
  const router = useRouter();
  const q = useQ().getQuery();
  const filters = useFilters().getQuery();
  const dataCollect = useDataCollect();

  const { page = 1 } = router.query;

  return (
    <>
      <Header router={router} hideSearchBar />
      <Page />

      {q && (
        <Result
          page={parseInt(page, 10)}
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
ComplexSearchPage.getInitialProps = (ctx) => {
  return fetchAll([], ctx);
};
