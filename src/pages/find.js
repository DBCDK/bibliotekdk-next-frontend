import Pagination from "@/components/search/pagination/Pagination";
import QuickFilters from "@/components/search/quickfilters";
import Result from "@/components/search/result/Result";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  collectSearch,
  collectSearchWorkClick,
} from "@/lib/api/datacollect.mutations";
import { getClient } from "@/lib/api/api";
import React, { useEffect } from "react";
import Header from "@/components/header/Header";

/**
 * @file
 * This is the search page
 *
 */
function Find() {
  const router = useRouter();
  const { q, page, view } = router.query;
  const pageTitle = "Søg, find og lån fra alle Danmarks biblioteker";
  const pageDescription =
    "bibliotek.dk er din indgang til bibliotekernes fysiske og digitale materialer.";

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

  // Sideeffects to be run when search query changes
  useEffect(() => {
    // Check that q is set and not the empty string
    if (q) {
      getClient().request(
        collectSearch({
          search_query: q,
        })
      );
    }
  }, [q]);

  return (
    <React.Fragment>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription}></meta>
        <meta property="og:url" content="https://beta.bibliotek.dk/find" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <link rel="preconnect" href="https://moreinfo.addi.dk"></link>
        <meta property="og:url" content="https://beta.bibliotek.dk/find" />
      </Head>
      <Header router={router} />
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
            onWorkClick={(index, work) => {
              getClient().request(
                collectSearchWorkClick({
                  search_query: q,
                  search_query_hit: index + 1,
                  search_query_work: work.id,
                })
              );
            }}
          />
        )}
        {q && (
          <Pagination
            currentPage={parseInt(page || 1, 10)}
            onChange={(page) => updateQueryParams({ page })}
          />
        )}
      </div>
    </React.Fragment>
  );
}

export default Find;
